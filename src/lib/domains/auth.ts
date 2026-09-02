/**
 * Auth & User Management Domain
 *
 * Handles user registration, authentication, email verification,
 * session management, and account deletion.
 */

import type {
  RepositoryState,
  UserAccount,
  AuthSession,
  DoctorUser,
  UserRole,
  PatientRecord,
} from './types';
import { ROLE_PERMISSIONS } from './types';
import {
  SEED_USER_ACCOUNTS,
  DEFAULT_DOCTOR_PASSWORD_HASH,
  DEFAULT_DOCTOR_PERMISSIONS,
  TODAY_STR,
} from './seed-data';
import { generateSecureToken, hashPassword, verifyPassword } from '../security';
import { sendAccountVerificationEmail } from '../email-service';

// ==========================================
// PERMANENT DATABASE PERSISTENCE
// ==========================================

function getStorageFilePath(): string | null {
  if (typeof window !== 'undefined') return null;
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (_) {}
    }
    return path.join(dir, 'users-database.json');
  } catch {
    return null;
  }
}

export function saveUsersToDisk(users: UserAccount[]): void {
  if (typeof window !== 'undefined') return;
  try {
    const filePath = getStorageFilePath();
    if (!filePath) return;
    const fs = require('fs');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.warn('[authDomain] Failed to persist users to disk:', err);
  }
}

export function loadUsersFromDisk(): UserAccount[] {
  if (typeof window !== 'undefined') return [...SEED_USER_ACCOUNTS];
  try {
    const filePath = getStorageFilePath();
    if (!filePath) return [...SEED_USER_ACCOUNTS];
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const loaded: UserAccount[] = JSON.parse(raw);
      if (Array.isArray(loaded) && loaded.length > 0) {
        const merged = [...loaded];
        for (const seed of SEED_USER_ACCOUNTS) {
          if (!merged.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
            merged.push(seed);
          }
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn('[authDomain] Failed to load users from disk:', err);
  }
  return [...SEED_USER_ACCOUNTS];
}

export function getUserAccounts(state: RepositoryState): UserAccount[] {
  if (!state.users || state.users.length === 0) {
    state.users = loadUsersFromDisk();
  }
  // Ensure all seed accounts are always present
  for (const seed of SEED_USER_ACCOUNTS) {
    if (!state.users.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
      state.users.push(seed);
    }
  }
  return state.users;
}

export function getUserById(state: RepositoryState, id: number): UserAccount | undefined {
  if (!state.users || state.users.length === 0) {
    state.users = loadUsersFromDisk();
  }
  return state.users.find((u) => u.id === id);
}

export function getUserByEmail(state: RepositoryState, email: string): UserAccount | undefined {
  if (!state.users || state.users.length === 0) {
    state.users = loadUsersFromDisk();
  }
  const clean = email.trim().toLowerCase();
  return state.users.find((u) => u.email.toLowerCase() === clean);
}

export function getUserByToken(state: RepositoryState, token: string): UserAccount | undefined {
  const session = state.sessions.get(token);
  if (!session) return undefined;
  return getUserById(state, session.userId);
}

// ==========================================
// REGISTRATION
// ==========================================

export function registerUserAccount(
  state: RepositoryState,
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    branchId?: number;
    details?: Record<string, any>;
    appBaseUrl?: string;
  }
): {
  success: boolean;
  user?: UserAccount;
  verificationToken?: string;
  requiresVerification?: boolean;
  error?: string;
  statusCode?: number;
} {
  state.users = state.users || [...SEED_USER_ACCOUNTS];
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.trim();
  const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');

  // Duplicate Check: email
  const existingEmail = state.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return {
      success: false,
      error: `An account with email address '${cleanEmail}' is already registered.`,
      statusCode: 409,
    };
  }

  // Duplicate Check: phone
  if (phoneDigits.length >= 10) {
    const existingPhone = state.users.find(
      (u) => u.phone.replace(/[^0-9]/g, '').endsWith(phoneDigits.slice(-10))
    );
    if (existingPhone) {
      return {
        success: false,
        error: `An account with mobile number '${cleanPhone}' is already registered.`,
        statusCode: 409,
      };
    }
  }

  const assignedRole: UserRole = data.role || 'patient';
  const branch = state.branches.find((b) => b.id === (data.branchId || 1)) || state.branches[0];
  const nextId = Math.max(...state.users.map((u) => u.id), 0) + 1;
  const verificationToken = generateSecureToken(32);
  const verificationExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours

  const permissions = ROLE_PERMISSIONS[assignedRole] || ['general:read'];

  const newUser: UserAccount = {
    id: nextId,
    name: data.name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    passwordHash: hashPassword(data.password),
    role: assignedRole,
    branchId: branch?.id || 1,
    branchCode: branch?.code || 'ARIYAN-HQ',
    branchName: branch?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: false,
    verificationToken,
    verificationExpiresAt,
    status: assignedRole === 'marketing' ? 'pending' : 'active',
    createdAt: new Date().toISOString().split('T')[0],
    permissions,
    details: data.details || {},
  };

  state.users.push(newUser);

  // Synchronize to specific role entities
  if (assignedRole === 'doctor') {
    const docUser: DoctorUser = {
      id: nextId,
      branchId: branch?.id || 1,
      branchCode: branch?.code || 'ARIYAN-HQ',
      branchName: branch?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
      name: data.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: newUser.passwordHash,
      specialty: data.details?.specialty || 'General Medicine',
      department: data.details?.department || 'General Medicine',
      qualification: data.details?.qualification || 'MBBS, MD',
      registrationNumber: data.details?.registrationNumber || `WB-MED-${nextId}-2026`,
      fee: data.details?.fee || 800,
      status: 'available',
      role: 'doctor',
      permissions,
      avatarUrl: data.details?.avatarUrl || '',
      experienceYears: data.details?.experienceYears || 5,
      rating: 5.0,
      totalPatientsTreated: 0,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shiftTiming: '09:00 AM - 05:00 PM',
      chamberRoom: `OPD-${200 + nextId}`,
    };
    state.doctors.push(docUser);
  } else if (assignedRole === 'patient') {
    const uhid = data.details?.uhid || `UHID-B${branch?.id || 1}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${nextId}`;
    newUser.details = { ...newUser.details, uhid };
    state.patients.push({
      id: nextId,
      branchId: branch?.id || 1,
      uhid,
      name: data.name.trim(),
      age: data.details?.age || 30,
      gender: data.details?.gender || 'Unspecified',
      bloodGroup: data.details?.bloodGroup || 'O+',
      phone: cleanPhone,
      email: cleanEmail,
      condition: data.details?.condition || 'General OPD Consultation',
      status: 'opd',
      registeredDate: newUser.createdAt,
    });
  }

  // Dispatch verification email
  try {
    sendAccountVerificationEmail({
      to: cleanEmail,
      name: data.name.trim(),
      token: verificationToken,
      role: assignedRole,
      hospitalName: branch?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
      appBaseUrl: data.appBaseUrl || 'http://localhost:3000',
    }).catch((e) => console.warn('[Verification Email Notice]:', e?.message));
  } catch (_) {}

  // Permanently persist registered user to disk database
  saveUsersToDisk(state.users);

  return {
    success: true,
    user: newUser,
    verificationToken,
    requiresVerification: true,
  };
}

// ==========================================
// EMAIL VERIFICATION
// ==========================================

export function verifyEmailToken(
  state: RepositoryState,
  token: string,
  email?: string
): {
  success: boolean;
  error?: string;
  statusCode?: number;
  user?: UserAccount;
  alreadyVerified?: boolean;
} {
  state.users = state.users || [...SEED_USER_ACCOUNTS];
  const cleanToken = token.trim();

  const user = state.users.find((u) => u.verificationToken === cleanToken);

  if (!user) {
    if (email) {
      const checkUser = getUserByEmail(state, email);
      if (checkUser && checkUser.isEmailVerified) {
        return {
          success: true,
          user: checkUser,
          alreadyVerified: true,
        };
      }
    }
    return {
      success: false,
      error: 'Invalid or already used verification token.',
      statusCode: 400,
    };
  }

  if (email && user.email.toLowerCase() !== email.trim().toLowerCase()) {
    return {
      success: false,
      error: 'Verification token does not match the requested email address.',
      statusCode: 400,
    };
  }

  if (user.verificationExpiresAt && Date.now() > user.verificationExpiresAt) {
    return {
      success: false,
      error: 'Verification token has expired. Please request a new verification link.',
      statusCode: 410,
    };
  }

  // Mark verified and invalidate token
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationExpiresAt = undefined;

  // Persist updated email verification state
  saveUsersToDisk(state.users);

  return {
    success: true,
    user,
  };
}

export function resendVerificationToken(
  state: RepositoryState,
  email: string,
  appBaseUrl: string = 'http://localhost:3000'
): {
  success: boolean;
  error?: string;
  statusCode?: number;
  verificationToken?: string;
  message?: string;
} {
  state.users = state.users || [...SEED_USER_ACCOUNTS];
  const user = getUserByEmail(state, email);

  if (!user) {
    return {
      success: false,
      error: `No registered account found with email '${email}'.`,
      statusCode: 404,
    };
  }

  if (user.isEmailVerified) {
    return {
      success: false,
      error: 'Your email address is already verified. You can log in directly.',
      statusCode: 400,
    };
  }

  const freshToken = generateSecureToken(32);
  user.verificationToken = freshToken;
  user.verificationExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  try {
    sendAccountVerificationEmail({
      to: user.email,
      name: user.name,
      token: freshToken,
      role: user.role,
      hospitalName: user.branchName,
      appBaseUrl,
    }).catch((e) => console.warn('[Resend Verification Notice]:', e?.message));
  } catch (_) {}

  return {
    success: true,
    verificationToken: freshToken,
    message: `A fresh verification link has been sent to ${user.email}.`,
  };
}

// ==========================================
// AUTHENTICATION
// ==========================================

export function authenticateUserAccount(
  state: RepositoryState,
  identifier: string,
  password?: string,
  requestedRole?: string
): {
  success: boolean;
  user?: UserAccount;
  session?: AuthSession;
  permissions?: string[];
  error?: string;
  statusCode?: number;
  requiresVerification?: boolean;
  email?: string;
} {
  state.users = getUserAccounts(state);
  const cleanId = identifier.trim().toLowerCase();
  const digitsOnly = cleanId.replace(/[^0-9]/g, '');

  // 1. Look up in unified users
  let user = state.users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      (digitsOnly.length >= 10 && u.phone.replace(/[^0-9]/g, '').endsWith(digitsOnly.slice(-10)))
  );

  // 2. Doctor fallback lookup
  if (!user) {
    const doc = state.doctors.find(
      (d) =>
        d.email.toLowerCase() === cleanId ||
        (digitsOnly.length >= 10 && d.phone.replace(/[^0-9]/g, '').endsWith(digitsOnly.slice(-10)))
    );
    if (doc) {
      user = {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        passwordHash: doc.passwordHash || DEFAULT_DOCTOR_PASSWORD_HASH,
        role: 'doctor',
        branchId: doc.branchId,
        branchCode: doc.branchCode,
        branchName: doc.branchName,
        isEmailVerified: true,
        status: 'active',
        createdAt: TODAY_STR,
        permissions: doc.permissions || ROLE_PERMISSIONS.doctor,
      };
      state.users.push(user);
    }
  }

  if (!user) {
    return {
      success: false,
      error: 'Invalid email/phone or password. Account not found.',
      statusCode: 401,
    };
  }

  // 3. Verify Password
  if (!password) {
    return {
      success: false,
      error: 'Password is required to sign in.',
      statusCode: 422,
    };
  }

  const storedHash = user.passwordHash || DEFAULT_DOCTOR_PASSWORD_HASH;
  const isPasswordValid = verifyPassword(password, storedHash);

  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Invalid password. Please check your credentials.',
      statusCode: 401,
    };
  }

  // 4. Verify Email Status
  if (!user.isEmailVerified) {
    return {
      success: false,
      error: 'Your email address has not been verified yet. Please check your inbox and verify your email before logging in.',
      statusCode: 403,
      requiresVerification: true,
      email: user.email,
    };
  }

  // 5. Verify Account Status
  if (user.status === 'suspended' || user.status === 'fired') {
    return {
      success: false,
      error: `Your account is currently ${user.status}. Please contact hospital administration.`,
      statusCode: 403,
    };
  }

  // 6. Create Cryptographic Session & Refresh Token
  const token = `medix_jwt_${user.id}_${generateSecureToken(24)}`;
  const refreshToken = `medix_rf_${user.id}_${generateSecureToken(32)}`;
  const permissions = user.permissions || ROLE_PERMISSIONS[user.role] || ['general:read'];

  const session: AuthSession = {
    token,
    refreshToken,
    userId: user.id,
    doctorId: user.role === 'doctor' ? user.id : undefined,
    email: user.email,
    name: user.name,
    role: user.role,
    branchId: user.branchId || 1,
    branchCode: user.branchCode || 'ARIYAN-HQ',
    permissions,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  state.sessions.set(token, session);
  if (refreshToken) {
    state.sessions.set(refreshToken, session);
  }

  return {
    success: true,
    user,
    session,
    permissions,
  };
}

export function authenticateDoctor(
  state: RepositoryState,
  emailOrPhone: string,
  password?: string
): {
  doctor: DoctorUser;
  session: AuthSession;
} | null {
  const authResult = authenticateUserAccount(state, emailOrPhone, password, 'doctor');
  if (!authResult.success || !authResult.user || !authResult.session) {
    return null;
  }

  const doctor = state.doctors.find((d) => d.id === authResult.user!.id) || {
    id: authResult.user.id,
    branchId: authResult.user.branchId,
    branchCode: authResult.user.branchCode,
    branchName: authResult.user.branchName,
    name: authResult.user.name,
    email: authResult.user.email,
    phone: authResult.user.phone,
    passwordHash: authResult.user.passwordHash,
    specialty: 'General Medicine',
    department: 'General Medicine',
    qualification: 'MBBS, MD',
    registrationNumber: `WB-MED-${authResult.user.id}-2026`,
    fee: 800,
    status: 'available' as const,
    role: 'doctor' as const,
    permissions: authResult.permissions || ROLE_PERMISSIONS.doctor,
  };

  return { doctor, session: authResult.session };
}

// ==========================================
// SESSION MANAGEMENT
// ==========================================

export function refreshSession(state: RepositoryState, refreshTokenOrToken: string): AuthSession | null {
  const session = state.sessions.get(refreshTokenOrToken);
  if (!session) return null;

  const user = getUserById(state, session.userId) || state.doctors.find((d) => d.id === session.userId);
  if (!user) return null;

  const newToken = `medix_jwt_${user.id}_${generateSecureToken(24)}`;
  const newSession: AuthSession = {
    token: newToken,
    refreshToken: session.refreshToken || `medix_rf_${user.id}_${generateSecureToken(32)}`,
    userId: user.id,
    doctorId: session.role === 'doctor' ? user.id : undefined,
    email: user.email,
    name: user.name,
    role: session.role,
    branchId: user.branchId || 1,
    branchCode: (user as any).branchCode || 'ARIYAN-HQ',
    permissions: session.permissions || ROLE_PERMISSIONS[session.role as UserRole] || [],
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  state.sessions.set(newToken, newSession);
  return newSession;
}

export function revokeUserSession(state: RepositoryState, tokenOrRefreshToken: string): boolean {
  if (!tokenOrRefreshToken) return false;
  const session = state.sessions.get(tokenOrRefreshToken);
  if (session) {
    state.sessions.delete(session.token);
    if (session.refreshToken) {
      state.sessions.delete(session.refreshToken);
    }
    return true;
  }
  state.sessions.delete(tokenOrRefreshToken);
  return true;
}

export function invalidateSession(state: RepositoryState, token: string): boolean {
  return revokeUserSession(state, token);
}

export function getSession(state: RepositoryState, token: string): AuthSession | undefined {
  return state.sessions.get(token);
}

export function deleteUserAccount(state: RepositoryState, userIdOrEmail: number | string): boolean {
  state.users = state.users || [...SEED_USER_ACCOUNTS];
  const userIndex = state.users.findIndex(
    (u) =>
      (typeof userIdOrEmail === 'number' && u.id === userIdOrEmail) ||
      (typeof userIdOrEmail === 'string' && u.email.toLowerCase() === String(userIdOrEmail).toLowerCase())
  );

  if (userIndex === -1) return false;
  const user = state.users[userIndex];
  state.users.splice(userIndex, 1);

  // Revoke all active sessions for this account
  for (const [token, session] of state.sessions.entries()) {
    if (session.userId === user.id || session.email.toLowerCase() === user.email.toLowerCase()) {
      state.sessions.delete(token);
    }
  }

  // Persist updated users list to disk
  saveUsersToDisk(state.users);

  return true;
}
