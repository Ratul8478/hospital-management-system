import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { validateRequiredString, validatePassword } from '@/lib/validation';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 'MALFORMED_JSON', 400);
    }

    const { email, identifier, username, phone, password, role } = body || {};
    const rawIdentifier = email || identifier || username || phone;

    const idVal = validateRequiredString(rawIdentifier, 'Email or mobile number', 1, 254);
    if (!idVal.isValid) {
      return apiError(idVal.error!, idVal.code, idVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    const passVal = validatePassword(password, 1);
    if (!passVal.isValid) {
      return apiError(passVal.error!, passVal.code, passVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    const loginIdentifier = idVal.value!.toLowerCase();

    // Authenticate against Unified User Repository
    const authResult = backendStore.authenticateUserAccount(loginIdentifier, password, role);

    if (!authResult.success) {
      if (authResult.requiresVerification) {
        return apiError(
          authResult.error || 'Your email address is unverified. Please verify your email before signing in.',
          'EMAIL_UNVERIFIED',
          403,
          {
            requiresVerification: true,
            email: authResult.email,
          }
        );
      }

      return apiError(
        authResult.error || 'Invalid credentials. Please check your username and password.',
        'AUTHENTICATION_FAILED',
        authResult.statusCode || 401
      );
    }

    const { user, session, permissions } = authResult;

    return apiSuccess({
      token: session!.token,
      refreshToken: session!.refreshToken,
      tokenType: 'Bearer',
      expiresAt: session!.expiresAt,
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        phone: user!.phone,
        role: user!.role,
        branchId: user!.branchId,
        branchCode: user!.branchCode,
        branchName: user!.branchName,
        isEmailVerified: user!.isEmailVerified,
        status: user!.status,
        details: user!.details,
      },
      permissions: permissions || [],
      message: `Welcome back, ${user!.name}! Authentication successful.`,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
