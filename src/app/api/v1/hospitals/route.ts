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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const facilityType = searchParams.get('facilityType');
    const search = searchParams.get('search')?.toLowerCase();

    let hospitals = backendStore.getBranches();

    if (status && status !== 'ALL') {
      hospitals = hospitals.filter(h => h.status.toLowerCase() === status.toLowerCase());
    }

    if (facilityType && facilityType !== 'ALL') {
      hospitals = hospitals.filter(h => h.facilityType?.toLowerCase() === facilityType.toLowerCase());
    }

    if (search) {
      hospitals = hospitals.filter(h => 
        h.name.toLowerCase().includes(search) ||
        h.code.toLowerCase().includes(search) ||
        h.location.toLowerCase().includes(search) ||
        (h.address && h.address.toLowerCase().includes(search))
      );
    }

    // Attach doctor count and available specialists list to each hospital
    const enrichedHospitals = hospitals.map(h => {
      const doctors = backendStore.getDoctorsByBranch(h.id);
      return {
        id: h.id,
        code: h.code,
        name: h.name,
        location: h.location,
        address: h.address || '',
        branchHead: h.branchHead || '',
        adminName: h.adminName,
        adminEmail: h.adminEmail,
        adminPhone: h.adminPhone || '',
        phone: h.adminPhone || (h.name && h.name.toLowerCase().includes('ariyan') ? '+91 91443 76971' : '+91 98042 22142'),
        status: h.status,
        badgeStatus: h.badgeStatus || 'ACTIVE',
        facilityType: h.facilityType || 'Hospital',
        govRegNumber: h.govRegNumber || '',
        totalDoctorsCount: doctors.length,
        doctors: doctors.map(d => ({
          id: d.id,
          branchId: d.branchId,
          name: d.name,
          specialty: d.specialty,
          department: d.department || d.specialty,
          qualification: d.qualification || 'MBBS, MD',
          status: d.status || 'available',
          fee: d.fee || 700,
          phone: d.phone || h.adminPhone || '+91 91443 76971',
          rating: (d as any).rating || '5.0',
          experience: (d as any).experience || '7 years experience',
          image: (d as any).image || d.avatarUrl || '',
          avatarUrl: d.avatarUrl || (d as any).image || '',
        })),
        availableSpecialists: doctors.map(d => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          department: d.department || d.specialty,
          qualification: d.qualification || 'MBBS, MD',
          status: d.status || 'available',
          fee: d.fee || 700,
          phone: d.phone || h.adminPhone || '+91 91443 76971',
          rating: (d as any).rating || '5.0',
          experience: (d as any).experience || '7 years experience',
          image: (d as any).image || d.avatarUrl || '',
          avatarUrl: d.avatarUrl || (d as any).image || '',
        })),
      };
    });

    return apiSuccess(
      {
        total: enrichedHospitals.length,
        hospitals: enrichedHospitals,
      },
      {
        message: 'Web-registered hospitals and clinical branches fetched successfully.',
      }
    );
  } catch (err: any) {
    return apiError(err?.message || 'Failed to fetch registered hospitals.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'super_admin');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Super Admin Master Key required to register new hospital branch.', authResult.statusCode || 401);
    }

    const rawBody = await request.json().catch(() => ({}));
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious branch registration payload blocked by API Gateway.', 400);
    }

    const body = sanitizeObject(rawBody);
    if (!body.name || !body.code || !body.location) {
      return apiError('Hospital Name, Branch Code, and Location are mandatory fields.', 422);
    }

    const newBranch = backendStore.addBranch(body);
    return apiSuccess(newBranch, {
      status: 201,
      message: `Hospital branch ${newBranch.name} registered and activated successfully.`,
    });
  } catch (err: any) {
    return apiError(err?.message || 'Failed to register hospital branch.', 500);
  }
}
