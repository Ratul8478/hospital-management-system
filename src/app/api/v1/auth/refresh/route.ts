import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { detectSuspiciousPayload } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if token is in header
    }

    const authHeader = request.headers.get('authorization') || '';
    const headerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    const refreshToken = body?.refreshToken || body?.token || headerToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      return apiError('Missing required field: refreshToken', 'MISSING_REFRESH_TOKEN', 400);
    }

    const threatCheck = detectSuspiciousPayload(refreshToken);
    if (threatCheck.isSuspicious) {
      return apiError('Security Firewall Block: Suspicious token format.', 'FIREWALL_SECURITY_ALERT', 400);
    }

    const cleanToken = refreshToken.trim();
    const newSession = backendStore.refreshSession(cleanToken);

    if (!newSession) {
      return apiError('Invalid or expired refresh token. Please log in again.', 'INVALID_REFRESH_TOKEN', 401);
    }

    const user = backendStore.getUserById(newSession.userId) || backendStore.getDoctorById(newSession.userId);

    return apiSuccess({
      token: newSession.token,
      refreshToken: newSession.refreshToken,
      tokenType: 'Bearer',
      expiresAt: newSession.expiresAt,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role || newSession.role,
            branchId: (user as any).branchId || newSession.branchId,
          }
        : undefined,
      message: 'Session token refreshed successfully.',
    });
  } catch (err) {
    return apiServerError(err);
  }
}
