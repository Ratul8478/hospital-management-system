import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

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
        token = body?.token || '';
      } catch {
        // Body is optional on logout
      }
    }

    if (token) {
      backendStore.invalidateSession(token);
    }

    return apiSuccess(
      {
        loggedOut: true,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        message: 'Doctor session invalidated successfully. Logged out.',
      }
    );
  } catch (err: any) {
    console.error('Error in /api/v1/auth/logout:', err);
    return apiError(err?.message || 'Failed to process logout request', 500);
  }
}
