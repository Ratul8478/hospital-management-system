import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyApiRequest(request, 'doctor');
    if (!auth.authenticated) {
      return apiError(auth.error || 'Unauthorized: Doctor authentication required.', auth.statusCode);
    }

    const { searchParams } = new URL(request.url);
    const requestedIdStr = searchParams.get('doctorId');
    const parsedDoctorId = requestedIdStr ? parseInt(requestedIdStr, 10) : undefined;

    const scopeCheck = resolveDoctorScope(auth, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId =
      scopeCheck.doctorId !== undefined
        ? scopeCheck.doctorId
        : auth.userId && backendStore.getDoctorById(auth.userId)
        ? auth.userId
        : 101;

    const profile = backendStore.getDoctorProfile(doctorId);
    if (!profile) {
      return apiError(`Doctor profile with ID ${doctorId} not found.`, 404);
    }

    return apiSuccess(
      {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        specialty: profile.specialty,
        department: profile.department,
        qualification: profile.qualification,
        registrationNumber: profile.registrationNumber,
        branchId: profile.branchId,
        branchCode: profile.branchCode,
        branchName: profile.branchName,
        fee: profile.fee,
        status: profile.status,
        avatarUrl: profile.avatarUrl,
        rating: profile.rating || 4.9,
        experienceYears: profile.experienceYears || 8,
        totalPatientsTreated: profile.totalPatientsTreated || 1200,
        availableDays: profile.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        shiftTiming: profile.shiftTiming || '09:00 AM - 05:00 PM',
        chamberRoom: profile.chamberRoom || `OPD-${200 + profile.id}`,
        permissions: profile.permissions,
      },
      {
        status: 200,
        message: 'Doctor profile loaded successfully.',
      }
    );
  } catch (err) {
    return apiServerError('/api/v1/doctor/profile', err);
  }
}
