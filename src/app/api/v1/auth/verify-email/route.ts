import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { detectSuspiciousPayload } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    let token: string | undefined;
    let email: string | undefined;

    try {
      const body = await request.json();
      token = body?.token;
      email = body?.email;
    } catch {
      // Body may be empty if provided via search params
    }

    if (!token) {
      token = request.nextUrl.searchParams.get('token') || undefined;
    }
    if (!email) {
      email = request.nextUrl.searchParams.get('email') || undefined;
    }

    if (!token || typeof token !== 'string' || !token.trim()) {
      return apiError(
        'Validation Error: Email verification token is required.',
        'MISSING_VERIFICATION_TOKEN',
        400
      );
    }

    const threat = detectSuspiciousPayload(token);
    if (threat.isSuspicious) {
      return apiError(
        'Security Firewall Block: Suspicious token pattern detected.',
        'FIREWALL_SECURITY_ALERT',
        400
      );
    }

    const verifyResult = backendStore.verifyEmailToken(token.trim(), email);

    if (!verifyResult.success || !verifyResult.user) {
      return apiError(
        verifyResult.error || 'Invalid or expired verification token.',
        'VERIFICATION_FAILED',
        verifyResult.statusCode || 400
      );
    }

    const { user } = verifyResult;

    return apiSuccess({
      verified: true,
      alreadyVerified: verifyResult.alreadyVerified || false,
      message: `Email address ${user.email} has been successfully verified! You may now sign in.`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const email = request.nextUrl.searchParams.get('email') || undefined;

    if (!token || !token.trim()) {
      return apiError('Missing verification token in query parameters.', 'MISSING_TOKEN', 400);
    }

    const threat = detectSuspiciousPayload(token);
    if (threat.isSuspicious) {
      return apiError('Security Firewall Block: Suspicious token pattern.', 'FIREWALL_SECURITY_ALERT', 400);
    }

    const verifyResult = backendStore.verifyEmailToken(token.trim(), email);

    if (!verifyResult.success || !verifyResult.user) {
      return apiError(
        verifyResult.error || 'Invalid or expired verification token.',
        'VERIFICATION_FAILED',
        verifyResult.statusCode || 400
      );
    }

    const { user } = verifyResult;

    return apiSuccess({
      verified: true,
      message: `Email address ${user.email} has been successfully verified! You may now log in to the hospital portal.`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    return apiServerError(error);
  }
}
