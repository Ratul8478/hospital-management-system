import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { verifyApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { validateEnum } from '@/lib/validation';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyApiRequest(request, 'doctor');
    if (!auth.authenticated) {
      return apiError(auth.error || 'Unauthorized: Doctor authentication required.', auth.statusCode);
    }

    const doctorId = auth.userId || 101;
    const doctor = backendStore.getDoctorById(doctorId);
    if (!doctor) {
      return apiError(`Doctor with ID ${doctorId} not found.`, 404);
    }

    return apiSuccess(
      {
        doctorId: doctor.id,
        name: doctor.name,
        status: doctor.status,
        branchId: doctor.branchId,
        branchName: doctor.branchName,
      },
      {
        status: 200,
        message: `Doctor status is ${doctor.status}.`,
      }
    );
  } catch (err) {
    return apiServerError('/api/v1/doctor/status GET', err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = verifyApiRequest(request, 'doctor');
    if (!auth.authenticated) {
      return apiError(auth.error || 'Unauthorized: Doctor authentication required.', auth.statusCode);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const { status, reason, doctorId: reqDocId } = body || {};

    const validStatuses = ['available', 'busy', 'offline', 'on_leave', 'on-duty', 'on_duty'] as const;
    const statusVal = validateEnum(status, validStatuses, 'Status');
    if (!statusVal.isValid) {
      return apiError(
        statusVal.error || 'Validation Error: Status must be one of available, busy, offline, on_leave, on_duty.',
        422
      );
    }
    const cleanStatus = statusVal.value!;

    const doctorId = auth.role === 'doctor' && auth.userId
      ? auth.userId
      : reqDocId
      ? parseInt(reqDocId, 10)
      : (auth.userId && backendStore.getDoctorById(auth.userId) ? auth.userId : 101);

    const updated = backendStore.updateDoctorStatus(doctorId, status, reason);
    if (!updated) {
      return apiError(`Doctor with ID ${doctorId} not found.`, 404);
    }

    return apiSuccess(
      {
        doctorId: updated.doctorId,
        status: updated.status,
        updatedAt: updated.updatedAt,
        reason: reason || undefined,
      },
      {
        status: 200,
        message: `Doctor status updated to ${updated.status}.`,
      }
    );
  } catch (err) {
    return apiServerError('/api/v1/doctor/status', err);
  }
}
