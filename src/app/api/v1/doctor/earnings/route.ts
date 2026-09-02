import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const doctorIdParam = searchParams.get('doctorId');

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId =
      scopeCheck.doctorId !== undefined
        ? scopeCheck.doctorId
        : authResult.userId && backendStore.getDoctorById(authResult.userId)
        ? authResult.userId
        : 101;

    const earnings = backendStore.getDoctorEarnings(doctorId);
    if (!earnings) {
      return apiError(`Doctor with ID ${doctorId} not found.`, 404);
    }

    return apiSuccess(earnings, {
      status: 200,
      message: `Doctor earnings and consultation fee analytics for ${earnings.doctorName} retrieved successfully.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/earnings GET', err);
  }
}

