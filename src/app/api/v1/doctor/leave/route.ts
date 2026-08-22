import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const doctorIdParam = searchParams.get('doctorId');
    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : 99;

    const leaveData = backendStore.getDoctorLeave(doctorId);

    return apiSuccess(leaveData, {
      status: 200,
      message: 'Doctor leave and duty roster balance retrieved successfully.',
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/leave GET:', err);
    return apiError(err?.message || 'Failed to fetch doctor leave data', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
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
      doctorId,
      doctorName,
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

    if (!reason || typeof reason !== 'string') {
      return apiError('Missing required field: reason', 422, { field: 'reason' });
    }

    const calculatedDays =
      totalDays ||
      Math.max(
        Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1,
        1
      );

    const newLeave = backendStore.createLeaveRequest({
      doctorId: doctorId ? parseInt(doctorId, 10) : 1,
      doctorName: doctorName || 'Dr . Jiarul Haque',
      leaveType: leaveType || 'annual',
      startDate,
      endDate,
      totalDays: calculatedDays,
      reason,
      status: 'pending',
    });

    return apiSuccess(newLeave, {
      status: 201,
      message: `Leave request for ${calculatedDays} day(s) submitted successfully. Status: PENDING review.`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/leave POST:', err);
    return apiError(err?.message || 'Failed to submit leave request', 500);
  }
}
