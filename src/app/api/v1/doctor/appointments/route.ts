import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyApiRequest(request, 'doctor');
    if (!auth.authenticated) {
      return apiError(auth.error || 'Unauthorized: Doctor authentication required.', auth.statusCode);
    }

    const { searchParams } = new URL(request.url);
    const rawDoctorId = searchParams.get('doctorId');
    const branchIdStr = searchParams.get('branchId');
    const date = searchParams.get('date') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const parsedDoctorId = rawDoctorId ? parseInt(rawDoctorId, 10) : undefined;
    const scopeCheck = resolveDoctorScope(auth, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const targetDoctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (auth.userId || undefined);
    const branchId = branchIdStr ? parseInt(branchIdStr, 10) : undefined;

    const result = backendStore.getAppointments({
      doctorId: targetDoctorId,
      branchId,
      date,
      status,
      type,
      page,
      limit,
    });

    return apiSuccess(
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        appointments: result.appointments,
      },
      {
        status: 200,
        message: `Retrieved ${result.appointments.length} appointment(s).`,
      }
    );
  } catch (err) {
    return apiServerError('/api/v1/doctor/appointments', err);
  }
}
