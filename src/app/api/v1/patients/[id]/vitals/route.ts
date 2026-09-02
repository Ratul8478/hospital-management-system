import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

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
      return apiError('Missing patient ID or UHID parameter.', 400);
    }

    const patient = backendStore.getPatientByIdOrUhid(identifier);
    if (!patient) {
      return apiError(`Patient with identifier '${identifier}' not found.`, 404);
    }

    const vitals = backendStore.getPatientVitals(patient.uhid);
    return apiSuccess(vitals, {
      status: 200,
      message: `Vitals telemetry history for patient ${patient.uhid} retrieved successfully.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/patients/[id]/vitals GET', err);
  }
}

export async function POST(
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
      return apiError('Missing patient ID or UHID parameter.', 400);
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious telemetry payload rejected.', 400);
    }

    const body = sanitizeObject(rawBody);
    const {
      bpSystolic,
      bpDiastolic,
      heartRateBpm,
      temperatureCelsius,
      spO2Percentage,
      respiratoryRateBpm,
      weightKg,
      heightCm,
      bloodSugarMgDl,
      notes,
    } = body || {};

    if (bpSystolic === undefined || bpDiastolic === undefined || heartRateBpm === undefined) {
      return apiError('Missing required vital signs: bpSystolic, bpDiastolic, and heartRateBpm are required', 422, {
        fields: ['bpSystolic', 'bpDiastolic', 'heartRateBpm'],
      });
    }

    const numSystolic = Number(bpSystolic);
    const numDiastolic = Number(bpDiastolic);
    const numHeartRate = Number(heartRateBpm);

    if (isNaN(numSystolic) || numSystolic < 40 || numSystolic > 300) {
      return apiError('Field "bpSystolic" must be a valid blood pressure between 40 and 300 mmHg.', 422, { field: 'bpSystolic' });
    }
    if (isNaN(numDiastolic) || numDiastolic < 20 || numDiastolic > 200) {
      return apiError('Field "bpDiastolic" must be a valid blood pressure between 20 and 200 mmHg.', 422, { field: 'bpDiastolic' });
    }
    if (isNaN(numHeartRate) || numHeartRate < 20 || numHeartRate > 250) {
      return apiError('Field "heartRateBpm" must be a valid pulse rate between 20 and 250 BPM.', 422, { field: 'heartRateBpm' });
    }

    const numTemp = temperatureCelsius !== undefined ? Number(temperatureCelsius) : 37.0;
    if (isNaN(numTemp) || numTemp < 25 || numTemp > 45) {
      return apiError('Field "temperatureCelsius" must be a valid body temperature between 25°C and 45°C.', 422, { field: 'temperatureCelsius' });
    }

    const numSpO2 = spO2Percentage !== undefined ? Number(spO2Percentage) : 98;
    if (isNaN(numSpO2) || numSpO2 < 40 || numSpO2 > 100) {
      return apiError('Field "spO2Percentage" must be a valid oxygen saturation between 40% and 100%.', 422, { field: 'spO2Percentage' });
    }

    const recorded = backendStore.recordPatientVitals(
      identifier,
      {
        bpSystolic: numSystolic,
        bpDiastolic: numDiastolic,
        heartRateBpm: numHeartRate,
        temperatureCelsius: numTemp,
        spO2Percentage: numSpO2,
        respiratoryRateBpm: respiratoryRateBpm !== undefined ? Number(respiratoryRateBpm) : 16,
        weightKg: weightKg !== undefined ? Number(weightKg) : undefined,
        heightCm: heightCm !== undefined ? Number(heightCm) : undefined,
        bloodSugarMgDl: bloodSugarMgDl !== undefined ? Number(bloodSugarMgDl) : undefined,
        notes: notes ? String(notes).trim() : undefined,
      },
      authResult.userName || 'Hospital Clinical Team'
    );

    if (!recorded) {
      return apiError(`Patient with identifier '${identifier}' not found.`, 404);
    }

    return apiSuccess(recorded, {
      status: 201,
      message: `Vitals telemetry recorded successfully for patient ${identifier}.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/patients/[id]/vitals POST', err);
  }
}
