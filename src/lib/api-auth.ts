import { NextRequest } from 'next/server';
import { backendStore } from './backend-store';
import { timingSafeEqual, detectSuspiciousPayload } from './security';

/**
 * ============================================================================
 * MEDIX ENTERPRISE API KEY & ACCESS CONTROL FIREWALL (DEFENSIVE SHIELD)
 * Defends against Unauthorized API Probing, Scraping, Credential Stuffing & Hijacking
 * ============================================================================
 */

// Production & Standard API Keys
export const MASTER_SUPER_ADMIN_API_KEY = process.env.MEDIX_MASTER_API_KEY || 'medix_master_sa_key_2026_ariyan_hq_wb9144376971';
export const BRANCH_ADMIN_API_KEY = process.env.MEDIX_BRANCH_API_KEY || 'medix_branch_sec_key_2026_wb_kolkata';
export const CLIENT_PUBLIC_APP_KEY = process.env.MEDIX_PUBLIC_APP_KEY || 'medix_live_sec_app_key_2026_wb33735581_ariyan';

export type ApiAuthScope = 'public_client' | 'patient' | 'doctor' | 'branch_admin' | 'super_admin' | 'staff' | 'marketing' | 'any';

// ==========================================
// SUPER ADMIN SESSION STORE (server-side)
// Tokens issued by /api/auth/super-admin/verify-otp are registered here and
// must match exactly — a token is NEVER trusted based on its prefix alone.
// ==========================================
const SUPER_ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface SuperAdminSessionRecord {
  email: string;
  createdAt: number;
  expiresAt: number;
}

const globalSaSessions = ((globalThis as any).__medix_sa_sessions ||
  new Map<string, SuperAdminSessionRecord>()) as Map<string, SuperAdminSessionRecord>;
(globalThis as any).__medix_sa_sessions = globalSaSessions;

export function registerSuperAdminSession(token: string, email: string): void {
  const now = Date.now();
  globalSaSessions.set(token, {
    email,
    createdAt: now,
    expiresAt: now + SUPER_ADMIN_SESSION_TTL_MS,
  });
}

export function revokeSuperAdminSession(token: string): void {
  globalSaSessions.delete(token);
}

function lookupSuperAdminSession(token: string): SuperAdminSessionRecord | null {
  const record = globalSaSessions.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    globalSaSessions.delete(token);
    return null;
  }
  return record;
}

export interface ApiAuthVerificationResult {
  authenticated: boolean;
  scope?: ApiAuthScope;
  role?: string;
  error?: string;
  statusCode: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  branchId?: number;
  branchCode?: string;
  permissions?: string[];
  keyType?: 'master_key' | 'branch_key' | 'client_app_key' | 'doctor_session' | 'super_admin_session' | 'user_session';
}

/**
 * Extracts and safely validates API Key or Bearer Token from incoming requests
 */
export function extractAuthCredentials(request: Request | NextRequest): {
  rawApiKey?: string;
  rawBearerToken?: string;
} {
  try {
    const headers = request.headers;

    // 1. Check Header: x-api-key / X-API-Key
    let apiKeyHeader: string | null = null;
    try {
      apiKeyHeader = headers.get('x-api-key') || headers.get('X-API-Key');
    } catch (_) {}

    // 2. Check Header: Authorization: Bearer <token>
    let authHeader: string | null = null;
    try {
      authHeader = headers.get('authorization') || headers.get('Authorization');
    } catch (_) {}

    let bearerToken: string | undefined;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.substring(7).trim();
    }

    // 3. Fallback Check: URL Query Parameters (?apiKey=... or ?api_key=... or ?token=...)
    let queryApiKey: string | undefined;
    let queryToken: string | undefined;

    try {
      const url = new URL(request.url);
      queryApiKey = url.searchParams.get('apiKey') || url.searchParams.get('api_key') || undefined;
      queryToken = url.searchParams.get('token') || url.searchParams.get('auth_token') || undefined;
    } catch {
      // URL parsing fallback
    }

    return {
      rawApiKey: apiKeyHeader || queryApiKey || undefined,
      rawBearerToken: bearerToken || queryToken || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Central API Authorization Verifier with Scope Enforcer
 */
export function verifyApiRequest(
  request: Request | NextRequest,
  requiredScope: ApiAuthScope = 'public_client'
): ApiAuthVerificationResult {
  const { rawApiKey, rawBearerToken } = extractAuthCredentials(request);
  const activeCredential = rawBearerToken || rawApiKey;

  // 0. Threat Detection on Token/Key Input
  if (activeCredential) {
    const threat = detectSuspiciousPayload(activeCredential);
    if (threat.isSuspicious) {
      return {
        authenticated: false,
        statusCode: 400,
        error: `Security Firewall Block: Suspicious character sequence detected (${threat.reason || 'Malicious Payload'}).`,
      };
    }
  }

  if (!activeCredential) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Unauthorized: Missing API Key or Bearer Token. Please provide valid credentials in Authorization or x-api-key header.',
    };
  }

  const cleanCred = activeCredential.trim();

  // 1. SUPER ADMIN MASTER KEY (Root Authority)
  if (timingSafeEqual(cleanCred, MASTER_SUPER_ADMIN_API_KEY)) {
    return {
      authenticated: true,
      scope: 'super_admin',
      role: 'super_admin',
      keyType: 'master_key',
      statusCode: 200,
      userName: 'Hospital Super Admin',
      userId: 1,
    };
  }

  // 2. BRANCH ADMIN PRODUCTION KEY (Branch Scope)
  if (timingSafeEqual(cleanCred, BRANCH_ADMIN_API_KEY)) {
    if (requiredScope === 'super_admin') {
      return {
        authenticated: false,
        statusCode: 403,
        error: 'Forbidden: Super Admin elevated privileges required for this endpoint.',
      };
    }
    return {
      authenticated: true,
      scope: 'branch_admin',
      role: 'branch_admin',
      keyType: 'branch_key',
      statusCode: 200,
      userName: 'Hospital Branch Admin',
      userId: 2,
    };
  }

  // 3. CLIENT APP PUBLIC KEY (Strictly limited to public_client scope)
  if (timingSafeEqual(cleanCred, CLIENT_PUBLIC_APP_KEY)) {
    if (requiredScope !== 'public_client') {
      return {
        authenticated: false,
        statusCode: 403,
        error: `Forbidden: Endpoint requires authenticated ${requiredScope} role or session token. Public client key is insufficient.`,
      };
    }
    return {
      authenticated: true,
      scope: 'public_client',
      keyType: 'client_app_key',
      statusCode: 200,
    };
  }

  // 4. SUPER ADMIN ACTIVE LIVE SESSION TOKEN (must match a session issued by verify-otp)
  if (cleanCred.startsWith('sa_live_token_')) {
    const saSession = lookupSuperAdminSession(cleanCred);
    if (!saSession) {
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Unauthorized: Super Admin session has expired or token is invalid. Please log in again.',
      };
    }
    return {
      authenticated: true,
      scope: 'super_admin',
      role: 'super_admin',
      keyType: 'super_admin_session',
      statusCode: 200,
      userName: 'Anichul Haque (Super Admin)',
      userEmail: saSession.email,
      userId: 1,
    };
  }

  // 5. ACTIVE SESSION TOKEN (medix_jwt_*)
  if (cleanCred.startsWith('medix_jwt_')) {
    const session = backendStore.getSession(cleanCred);
    if (!session) {
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Unauthorized: User session has expired or token is invalid. Please log in again.',
      };
    }

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      backendStore.invalidateSession(cleanCred);
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Unauthorized: User session token has expired.',
      };
    }

    // Scope / Role Validation
    if (requiredScope !== 'any' && requiredScope !== 'public_client') {
      const userRole = session.role;
      const isSuperAdmin = userRole === 'super_admin';

      if (requiredScope === 'super_admin' && !isSuperAdmin) {
        return {
          authenticated: false,
          statusCode: 403,
          error: `Forbidden: Super Admin elevated privileges required for this endpoint.`,
        };
      }

      if (requiredScope === 'branch_admin' && !isSuperAdmin && userRole !== 'branch_admin') {
        return {
          authenticated: false,
          statusCode: 403,
          error: `Forbidden: Branch Admin privileges required for this endpoint.`,
        };
      }

      if (requiredScope === 'doctor' && !isSuperAdmin && userRole !== 'doctor') {
        return {
          authenticated: false,
          statusCode: 403,
          error: `Forbidden: Doctor privileges required for this endpoint.`,
        };
      }

      if (requiredScope === 'patient' && !isSuperAdmin && userRole !== 'patient' && userRole !== 'doctor') {
        return {
          authenticated: false,
          statusCode: 403,
          error: `Forbidden: Patient privileges required for this endpoint.`,
        };
      }
    }

    return {
      authenticated: true,
      scope: (session.role as ApiAuthScope) || 'doctor',
      role: session.role,
      keyType: session.role === 'doctor' ? 'doctor_session' : 'user_session',
      statusCode: 200,
      userId: session.userId || session.doctorId,
      userName: session.name,
      userEmail: session.email,
      branchId: session.branchId,
      branchCode: session.branchCode,
      permissions: session.permissions,
    };
  }

  // 6. INVALID OR UNRECOGNIZED API KEY / TOKEN (Outsider blocked)
  return {
    authenticated: false,
    statusCode: 401,
    error: 'Access Denied: Invalid API Key or Authorization Token. Request rejected by Medix API Gateway.',
  };
}

/**
 * Resolves the effective doctor id for a request, enforcing per-doctor data
 * isolation: a doctor session may only read/write its own records.
 */
export function resolveDoctorScope(
  auth: ApiAuthVerificationResult,
  requestedDoctorId: number | undefined
): { doctorId?: number; error?: { message: string; statusCode: number } } {
  if (auth.keyType === 'doctor_session' || auth.role === 'doctor') {
    const sessionDoctorId = auth.userId;
    if (requestedDoctorId !== undefined && requestedDoctorId !== sessionDoctorId) {
      return {
        error: {
          message: 'Forbidden: Doctors may only access their own records.',
          statusCode: 403,
        },
      };
    }
    return { doctorId: sessionDoctorId };
  }
  return { doctorId: requestedDoctorId };
}

/**
 * Enforces cross-user data isolation: authenticated users cannot read or modify
 * another user's private data simply by passing a different user ID in params.
 */
export function resolveUserScope(
  auth: ApiAuthVerificationResult,
  requestedUserId: number | undefined
): { userId?: number; error?: { message: string; statusCode: number } } {
  if (auth.scope === 'super_admin' || auth.role === 'super_admin' || auth.keyType === 'master_key') {
    return { userId: requestedUserId || auth.userId };
  }

  if (auth.userId !== undefined) {
    if (requestedUserId !== undefined && requestedUserId !== auth.userId) {
      return {
        error: {
          message: 'Forbidden: You do not have permission to access another user\'s private data.',
          statusCode: 403,
        },
      };
    }
    return { userId: auth.userId };
  }

  return { userId: requestedUserId };
}
