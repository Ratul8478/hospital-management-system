import { NextRequest } from 'next/server';
import { verifyApiRequest } from '@/lib/api-auth';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyApiRequest(request, 'any');
    if (!auth.authenticated) {
      return apiError(auth.error || 'Unauthorized: Active session required.', 'UNAUTHORIZED', auth.statusCode || 401);
    }

    const user = auth.userId ? backendStore.getUserById(auth.userId) : undefined;

    return apiSuccess({
      authenticated: true,
      user: {
        id: auth.userId,
        name: auth.userName || user?.name,
        email: auth.userEmail || user?.email,
        role: auth.role || user?.role || auth.scope,
        branchId: auth.branchId || user?.branchId || 1,
        branchCode: auth.branchCode || user?.branchCode || 'ARIYAN-HQ',
        branchName: user?.branchName || 'ARIYAN HOSPITAL MULTISPECIALITY',
        isEmailVerified: user ? user.isEmailVerified : true,
      },
      permissions: auth.permissions || user?.permissions || [],
    });
  } catch (error) {
    return apiServerError(error);
  }
}
