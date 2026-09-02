import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    const params = await Promise.resolve(context.params);
    const identifier = params.id;

    if (!identifier) {
      return apiError('Missing patient ID or UHID in path parameter.', 400);
    }

    const patient = backendStore.getPatientByIdOrUhid(identifier);
    if (!patient) {
      return apiError(`Patient with identifier '${identifier}' not found.`, 404);
    }

    const timeline = backendStore.getPatientTimeline(patient.uhid);

    return apiSuccess(
      {
        patient: {
          id: patient.id,
          name: patient.name,
          uhid: patient.uhid,
          condition: patient.condition,
        },
        totalEvents: timeline.length,
        timeline,
      },
      {
        status: 200,
        message: `Clinical timeline for ${patient.name} (${patient.uhid}) retrieved successfully.`,
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/patients/[id]/timeline GET', err);
  }
}
