import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
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
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

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
