import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
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
          hint: 'Verify the patient numeric ID or UHID (e.g. UHID-20260812-0040 or UHID-B1-20260810-0001)',
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
    console.error('Error in /api/v1/patients/[id]/history GET:', err);
    return apiError(err?.message || 'Failed to retrieve patient clinical history', 500);
  }
}
