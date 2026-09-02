import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Session Token required', authResult.statusCode || 401);
    }

    const branches = backendStore.getBranches();

    return apiSuccess(
      {
        total: branches.length,
        branches,
      },
      {
        status: 200,
        message: 'Hospital branches retrieved successfully.',
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/branches GET', err);
  }
}
