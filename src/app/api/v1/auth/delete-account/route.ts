import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { verifyApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { registrationRateLimiter } from '@/lib/rate-limiter';
import { verifyPassword } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * POST /api/v1/auth/delete-account
 * Allows authenticated users or users providing verified credentials to permanently delete their account.
 * Satisfies Google Play Store and GDPR Health Data Right to be Forgotten.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = registrationRateLimiter.check(ip);
    if (!rateCheck.success) {
      return apiError('Too many deletion requests. Please try again later.', 429);
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if authenticated via Bearer token
    }

    const { email, password, confirmation } = body || {};

    // 1. Try Bearer token authorization
    const auth = verifyApiRequest(request, 'any');

    let targetEmail: string | undefined;
    let targetUserId: number | undefined;

    if (auth.authenticated) {
      targetUserId = auth.userId;
      targetEmail = auth.userEmail;
      if (!targetEmail && targetUserId) {
        const user = backendStore.getUserById(targetUserId);
        if (user) targetEmail = user.email;
      }
    } else if (email && password) {
      // 2. Direct credential verification
      const user = backendStore.getUserByEmail(email);
      if (!user) {
        return apiError('No account found with the provided email address.', 404);
      }
      if (!verifyPassword(password, user.passwordHash)) {
        return apiError('Incorrect password. Account deletion aborted.', 401);
      }
      targetEmail = user.email;
      targetUserId = user.id;
    } else {
      return apiError(
        'Authentication required. Provide Authorization Bearer token or email and password.',
        401
      );
    }

    if (confirmation !== 'DELETE_MY_ACCOUNT' && confirmation !== true) {
      return apiError(
        "To confirm permanent deletion, set 'confirmation': 'DELETE_MY_ACCOUNT'.",
        422
      );
    }

    const deleted = backendStore.deleteUserAccount(targetUserId || targetEmail!);
    if (!deleted) {
      return apiError('Failed to delete account. Account could not be located.', 404);
    }

    return apiSuccess(
      {
        deleted: true,
        email: targetEmail,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        message: 'Your account and associated active sessions have been permanently deleted.',
      }
    );
  } catch (err) {
    return apiServerError('/api/v1/auth/delete-account', err);
  }
}
