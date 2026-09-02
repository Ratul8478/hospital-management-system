import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { revokeSuperAdminSession } from '@/lib/api-auth';
import { apiSuccess, apiServerError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    let token = '';

    // Check Authorization header first
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    // Check body if header not present
    if (!token) {
      try {
        const body = await request.json();
        token = body?.token || body?.refreshToken || '';
      } catch {
        // Body is optional on logout
      }
    }

    if (token) {
      if (token.startsWith('sa_live_token_')) {
        revokeSuperAdminSession(token);
      } else {
        backendStore.revokeUserSession(token);
      }
    }

    return apiSuccess({
      loggedOut: true,
      timestamp: new Date().toISOString(),
      message: 'Session successfully revoked. You have been safely logged out.',
    });
  } catch (err) {
    return apiServerError(err);
  }
}
