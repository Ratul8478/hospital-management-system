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

    const earnings = backendStore.getDoctorEarnings(doctorId);

    return apiSuccess(earnings, {
      status: 200,
      message: `Doctor earnings and consultation fee analytics for ${earnings.doctorName} retrieved successfully.`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/earnings GET:', err);
    return apiError(err?.message || 'Failed to fetch doctor earnings', 500);
  }
}
