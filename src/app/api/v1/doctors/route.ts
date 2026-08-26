import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { hydrateBackendStore } from '@/lib/roster-store';

// Polled alongside /api/v1/hospitals by the Medix Doctor Android app, so the
// same freshness requirement applies here.
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    // Pull the live web-registered roster into this invocation before reading
    // it. A no-op when no roster store is configured, in which case the seeded
    // doctors from data.ts are served exactly as before.
    await hydrateBackendStore();

    const { searchParams } = new URL(request.url);
    const branchIdStr = searchParams.get('branchId') || searchParams.get('hospitalId');
    const status = searchParams.get('status')?.toLowerCase();
    const specialty = searchParams.get('specialty')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();

    const branchId = branchIdStr ? parseInt(branchIdStr, 10) : undefined;
    let doctors = backendStore.getAllDoctors(branchId);

    if (status && status !== 'all') {
      doctors = doctors.filter(d => d.status.toLowerCase() === status);
    }

    if (specialty && specialty !== 'all') {
      doctors = doctors.filter(d => 
        d.specialty.toLowerCase().includes(specialty) ||
        d.department.toLowerCase().includes(specialty)
      );
    }

    if (search) {
      doctors = doctors.filter(d =>
        d.name.toLowerCase().includes(search) ||
        d.specialty.toLowerCase().includes(search) ||
        d.department.toLowerCase().includes(search) ||
        d.branchName.toLowerCase().includes(search)
      );
    }

    return apiSuccess(
      {
        total: doctors.length,
        doctors: doctors.map(d => ({
          id: d.id,
          branchId: d.branchId,
          branchCode: d.branchCode,
          branchName: d.branchName,
          name: d.name,
          email: d.email,
          phone: d.phone,
          specialty: d.specialty,
          department: d.department,
          qualification: d.qualification,
          registrationNumber: d.registrationNumber,
          fee: d.fee || 700,
          status: d.status || 'available',
          role: d.role || 'doctor',
          rating: (d as any).rating || '5.0',
          experience: (d as any).experience || '7 years experience',
          image: (d as any).image || d.avatarUrl || '',
          avatarUrl: d.avatarUrl || (d as any).image || '',
        })),
      },
      {
        message: 'Web-registered doctors and hospital roster fetched successfully.',
      }
    );
  } catch (err: any) {
    return apiError(err?.message || 'Failed to fetch registered doctors.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key required to register new medical doctor.', authResult.statusCode || 401);
    }

    const rawBody = await request.json().catch(() => ({}));
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious registration payload blocked by API Gateway.', 400);
    }

    const body = sanitizeObject(rawBody);
    if (!body.name || !body.email || !body.referenceId) {
      return apiError('Doctor Full Name, Practitioner Email, and Reference ID are mandatory.', 422);
    }

    const doctor = backendStore.registerDoctor({
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialty: body.specialty,
      department: body.department,
      qualification: body.qualification,
      chamberAddress: body.chamberAddress,
      pincode: body.pincode,
      district: body.district,
      state: body.state,
      referenceId: body.referenceId,
      branchId: body.branchId ? parseInt(body.branchId, 10) : undefined,
      fee: body.fee ? parseFloat(body.fee) : undefined,
    });

    return apiSuccess(doctor, {
      status: 201,
      message: `Doctor ${doctor.name} registered and linked with Reference ID [${body.referenceId}] successfully.`,
    });
  } catch (err: any) {
    return apiError(err?.message || 'Failed to register doctor.', 500);
  }
}
