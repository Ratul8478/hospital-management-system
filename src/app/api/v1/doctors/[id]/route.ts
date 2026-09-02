import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctorId = parseInt(id, 10);
    if (isNaN(doctorId) || doctorId <= 0) {
      return apiError(`Invalid doctor ID '${id}'. Must be a valid positive integer.`, 422, { field: 'id' });
    }
    const doctor = backendStore.getDoctorById(doctorId);

    if (!doctor) {
      return apiError(`Doctor with ID #${id} not found.`, 404);
    }

    const todayAppointments = backendStore.getTodayAppointments(doctor.id);

    return apiSuccess({
      doctor: {
        id: doctor.id,
        branchId: doctor.branchId,
        branchCode: doctor.branchCode,
        branchName: doctor.branchName,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialty: doctor.specialty,
        department: doctor.department,
        qualification: doctor.qualification,
        registrationNumber: doctor.registrationNumber,
        fee: doctor.fee,
        status: doctor.status,
        role: doctor.role,
        permissions: doctor.permissions,
        todayAppointmentsCount: todayAppointments.length,
      }
    }, {
      message: `Doctor ${doctor.name} profile retrieved successfully.`
    });
  } catch (err: any) {
    return apiError(err?.message || 'Failed to fetch doctor profile.', 500);
  }
}
