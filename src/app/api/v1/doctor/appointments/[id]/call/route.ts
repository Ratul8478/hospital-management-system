import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session required', authResult.statusCode || 401);
    }

    const params = await Promise.resolve(context.params);
    const idNum = parseInt(params.id, 10);

    if (isNaN(idNum)) {
      return apiError(`Invalid appointment id: ${params.id}`, 400);
    }

    const existingAppt = backendStore.getAppointmentById(idNum);
    if (!existingAppt) {
      return apiError(`Appointment with ID ${idNum} not found`, 404);
    }

    if (authResult.keyType === 'doctor_session' && authResult.userId && existingAppt.doctorId !== authResult.userId) {
      return apiError('Forbidden: You can only call patients for your own appointments.', 403);
    }

    const callResult = backendStore.callPatient(idNum);
    if (!callResult) {
      return apiError(`Failed to broadcast call for appointment #${idNum}`, 500);
    }

    return apiSuccess(callResult, {
      status: 200,
      message: `Token #${callResult.tokenNumber} (${callResult.patientName}) called into ${callResult.room}.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/appointments/[id]/call', err);
  }
}
