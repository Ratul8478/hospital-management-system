import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';
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
    const doctorIdParam = searchParams.get('doctorId');

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || 1);

    const leaveData = backendStore.getDoctorLeave(doctorId);

    return apiSuccess(leaveData, {
      status: 200,
      message: 'Doctor leave and duty roster balance retrieved successfully.',
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/leave GET', err);
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
      return apiError('Security Alert: Malicious payload blocked by API Gateway', 400);
    }

    const body = sanitizeObject(rawBody);

    const {
      doctorId: reqDoctorId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    } = body || {};

    if (!startDate || !endDate) {
      return apiError('Missing required dates: startDate and endDate are required', 422, {
        fields: ['startDate', 'endDate'],
      });
    }

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return apiError('Invalid date format for startDate or endDate. Must be valid ISO dates (e.g. YYYY-MM-DD).', 422);
    }
    if (endTimestamp < startTimestamp) {
      return apiError('Field "endDate" cannot be earlier than "startDate".', 422, { field: 'endDate' });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      return apiError('Field "reason" is required and must be at least 3 characters long.', 422, { field: 'reason' });
    }

    const validLeaveTypes = ['casual', 'sick', 'emergency', 'annual', 'medical conference', 'maternity', 'paternity', 'other'];
    const normLeaveType = leaveType ? String(leaveType).trim().toLowerCase() : 'annual';
    if (leaveType && !validLeaveTypes.includes(normLeaveType)) {
      return apiError('Field "leaveType" must be one of: Casual, Sick, Emergency, Annual, Medical Conference, Maternity, Paternity, Other.', 422, { field: 'leaveType' });
    }
    const formattedLeaveType = normLeaveType.charAt(0).toUpperCase() + normLeaveType.slice(1);

    const effectiveDoctorId = authResult.userId || (reqDoctorId ? parseInt(reqDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Medical Specialist');

    const calculatedDays =
      totalDays && typeof totalDays === 'number' && totalDays > 0
        ? totalDays
        : Math.max(
            Math.round((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24)) + 1,
            1
          );

    const newLeave = backendStore.createLeaveRequest({
      doctorId: effectiveDoctorId,
      doctorName,
      leaveType: (normLeaveType.includes('sick') || normLeaveType.includes('med') ? 'sick' : normLeaveType.includes('cas') ? 'casual' : normLeaveType.includes('emerg') ? 'emergency' : normLeaveType.includes('mat') ? 'maternity' : normLeaveType.includes('conf') ? 'conference' : 'annual') as 'annual' | 'sick' | 'casual' | 'emergency' | 'maternity' | 'conference',
      startDate: String(startDate).trim(),
      endDate: String(endDate).trim(),
      totalDays: calculatedDays,
      reason: reason.trim(),
      status: 'pending',
    });

    return apiSuccess(newLeave, {
      status: 201,
      message: `Leave request for ${calculatedDays} day(s) submitted successfully. Status: PENDING review.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/leave POST', err);
  }
}

