import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

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
    const uhid = searchParams.get('uhid') || undefined;
    const reports = backendStore.getReports({
      doctorId: authResult.userId || undefined,
      uhid,
    });
    return apiSuccess(reports, {
      status: 200,
      message: 'Lab orders retrieved successfully.',
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/lab-orders GET', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious lab order payload blocked.', 400);
    }

    const body = sanitizeObject(rawBody);
    const {
      patientId,
      uhid,
      appointmentId,
      doctorId: reqDoctorId,
      branchId: reqBranchId,
      testNames,
      tests,
      priority,
      clinicalIndication,
    } = body || {};

    if (!uhid || typeof uhid !== 'string' || uhid.trim().length < 3) {
      return apiError('Field "uhid" is required and must be a valid patient UHID.', 422, { field: 'uhid' });
    }

    const candidateTests = (Array.isArray(testNames)
      ? testNames
      : Array.isArray(tests)
      ? tests
      : typeof testNames === 'string'
      ? testNames.split(/[\n,]+/).map((s) => s.trim())
      : []
    ).map(String).map((s) => s.trim()).filter((s) => s.length > 0);

    if (candidateTests.length === 0) {
      return apiError('Field "testNames" is required and must contain at least one valid diagnostic test name.', 422, {
        field: 'testNames',
      });
    }

    const validPriorities = ['routine', 'urgent', 'stat', 'emergency'];
    const normPriority = priority ? String(priority).trim().toLowerCase() : 'routine';
    if (priority && !validPriorities.includes(normPriority)) {
      return apiError('Field "priority" must be one of: ROUTINE, URGENT, STAT, EMERGENCY.', 422, { field: 'priority' });
    }
    const formattedPriority = normPriority.toUpperCase();

    const effectiveDoctorId = authResult.userId || (reqDoctorId ? parseInt(reqDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Dr. Medical Practitioner');
    const branchId = doctor ? doctor.branchId : (reqBranchId ? parseInt(reqBranchId, 10) : 1);

    // Resolve or retrieve real patient record
    const patientRecord = backendStore.getPatientByIdOrUhid(uhid.trim());
    const effectivePatientId = patientRecord
      ? patientRecord.id
      : (patientId ? parseInt(String(patientId), 10) : (doctor?.id ? doctor.id * 10 : 401));

    const labOrder = backendStore.createLabOrder({
      patientId: effectivePatientId,
      uhid: patientRecord ? patientRecord.uhid : uhid.trim(),
      appointmentId: appointmentId ? parseInt(String(appointmentId), 10) : undefined,
      doctorId: effectiveDoctorId,
      doctorName,
      branchId,
      testNames: candidateTests,
      priority: (formattedPriority === 'URGENT' ? 'URGENT' : formattedPriority === 'STAT' || formattedPriority === 'EMERGENCY' ? 'STAT' : 'ROUTINE') as 'ROUTINE' | 'URGENT' | 'STAT',
      clinicalIndication: clinicalIndication ? String(clinicalIndication).trim() : undefined,
    });

    return apiSuccess(labOrder, {
      status: 201,
      message: `Diagnostic investigation order #${labOrder.orderNumber} successfully registered.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/lab-orders POST', err);
  }
}
