import { NextRequest } from 'next/server';
import { backendStore, UserRole } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequiredString,
  validateEnum,
} from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError(
        'Malformed JSON: Request body must be a valid JSON object.',
        'MALFORMED_JSON',
        400
      );
    }

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role = 'patient',
      branchId = 1,
      details,
    } = body || {};

    // 1. Validate Required String (Full Name)
    const nameVal = validateRequiredString(name, 'Full name', 2, 100);
    if (!nameVal.isValid) {
      return apiError(nameVal.error!, nameVal.code, nameVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    // 2. Validate Email
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      return apiError(emailVal.error!, emailVal.code, emailVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    // 3. Validate Phone
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      return apiError(phoneVal.error!, phoneVal.code, phoneVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    // 4. Validate Password & Confirmation
    const passVal = validatePassword(password, 8);
    if (!passVal.isValid) {
      return apiError(passVal.error!, passVal.code, passVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    if (confirmPassword && password !== confirmPassword) {
      return apiError('Validation Error: Passwords do not match.', 'PASSWORD_MISMATCH', 422);
    }

    // 5. Valid Role Selection
    const validRoles: readonly UserRole[] = [
      'patient',
      'doctor',
      'branch_admin',
      'marketing',
      'receptionist',
      'pharmacist',
      'lab_technician',
      'accountant',
      'staff',
    ];

    const roleVal = validateEnum(role, validRoles, 'role');
    if (!roleVal.isValid) {
      return apiError(roleVal.error!, roleVal.code, 422);
    }

    const targetRole = roleVal.value!;

    // Disallow self-registration only for master super admin
    if (targetRole === ('super_admin' as any)) {
      return apiError(
        'Forbidden: Super Administrator master accounts cannot be self-registered from the public portal.',
        'SUPER_ADMIN_SELF_REGISTRATION_FORBIDDEN',
        403
      );
    }

    // 6. Attempt Registration in Backend Singleton
    const regResult = backendStore.registerUserAccount({
      name: nameVal.value!,
      email: emailVal.value!,
      phone: phoneVal.value!,
      password: passVal.value!,
      role: targetRole,
      branchId: Number(branchId) || 1,
      details: details || {},
      appBaseUrl: request.nextUrl.origin,
    });

    if (!regResult.success || !regResult.user) {
      return apiError(
        regResult.error || 'Account registration failed.',
        'REGISTRATION_FAILED',
        regResult.statusCode || 400
      );
    }

    const { user, verificationToken } = regResult;

    return apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          branchId: user.branchId,
          branchCode: user.branchCode,
          branchName: user.branchName,
          isEmailVerified: user.isEmailVerified,
          status: user.status,
          createdAt: user.createdAt,
        },
        requiresVerification: true,
        message: `Account created successfully. A verification link has been sent to ${user.email}. Please verify your email address before signing in.`,
        devVerificationToken: process.env.NODE_ENV !== 'production' ? verificationToken : undefined,
      },
      201
    );
  } catch (error) {
    return apiServerError(error);
  }
}
