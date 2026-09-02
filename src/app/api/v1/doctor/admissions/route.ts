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
    const branchIdParam = searchParams.get('branchId');
    const wardType = searchParams.get('wardType') || undefined;

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || undefined);
    const branchId = branchIdParam ? parseInt(branchIdParam, 10) : undefined;

    const admissions = backendStore.getAdmissions({
      doctorId,
      branchId,
      wardType,
    });

    const icuCount = admissions.filter((a) => a.wardType === 'icu').length;
    const privateCount = admissions.filter((a) => a.wardType === 'private').length;
    const generalCount = admissions.filter((a) => a.wardType === 'general').length;

    return apiSuccess(
      {
        activeInpatientsCount: admissions.length,
        breakdown: {
          icu: icuCount,
          private: privateCount,
          general: generalCount,
        },
        admissions,
      },
      {
        status: 200,
        message: 'Inpatient IPD admissions and bed allocations retrieved successfully.',
        meta: { total: admissions.length },
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/admissions GET', err);
  }
}

