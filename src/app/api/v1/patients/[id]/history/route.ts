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
      return apiError(authResult.error || 'Unauthorized: API Key or Session Token required', authResult.statusCode || 401);
    }

    const params = await Promise.resolve(context.params);
    const { id } = params;

    if (!id || !id.trim()) {
      return apiError('Missing required parameter: patient id or UHID', 400);
    }

    const history = backendStore.getPatientLongitudinalHistory(id.trim());

    if (!history) {
      return apiError(
        `Patient with identifier '${id}' was not found in the hospital records`,
        404,
        {
          hint: 'Verify the patient numeric ID or UHID (e.g. UHID-2026-0042 or UHID-B1-20260810-0001)',
        }
      );
    }

    return apiSuccess(history, {
      status: 200,
      message: `Longitudinal clinical health record retrieved for ${history.patient.name} (${history.patient.uhid})`,
      meta: {
        uhid: history.patient.uhid,
        patientName: history.patient.name,
        summary: history.summary,
      },
    });
  } catch (err: any) {
    return apiServerError('/api/v1/patients/[id]/history GET', err);
  }
}

