import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { detectSuspiciousPayload } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Malformed JSON: Request body must be a valid JSON object.', 'MALFORMED_JSON', 400);
    }

    const { email } = body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return apiError('Validation Error: Registered email address is required.', 'MISSING_EMAIL', 422);
    }

    const cleanEmail = email.trim().toLowerCase();
    const threat = detectSuspiciousPayload(cleanEmail);
    if (threat.isSuspicious) {
      return apiError('Security Firewall Block: Suspicious character sequence detected.', 'FIREWALL_SECURITY_ALERT', 400);
    }

    const result = backendStore.resendVerificationToken(cleanEmail, request.nextUrl.origin);

    if (!result.success) {
      return apiError(
        result.error || 'Failed to resend verification email.',
        'RESEND_FAILED',
        result.statusCode || 400
      );
    }

    return apiSuccess({
      sent: true,
      message: result.message || `A fresh email verification link has been dispatched to ${cleanEmail}.`,
      devVerificationToken: process.env.NODE_ENV !== 'production' ? result.verificationToken : undefined,
    });
  } catch (error) {
    return apiServerError(error);
  }
}
