import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { DEFAULT_SUPER_ADMIN_PROFILE } from '@/lib/data';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    // Defend against outsider hackers: Enforce API Key / Authorization Token Check
    const authResult = verifyApiRequest(request, 'super_admin');
    if (!authResult.authenticated) {
      return apiError(
        authResult.error || 'Access Denied: Super Admin API Key or Valid Token required to access database export.',
        authResult.statusCode || 401
      );
    }

    const branches = backendStore.getBranches();
    const doctors = backendStore.getAllDoctors();

    const hospitalDatabase = {
      primaryHospital: {
        name: DEFAULT_SUPER_ADMIN_PROFILE.hospitalName,
        govtRegistrationNumber: DEFAULT_SUPER_ADMIN_PROFILE.govtRegNumber,
        medixReferenceNumber: DEFAULT_SUPER_ADMIN_PROFILE.medixRefNumber,
        address: DEFAULT_SUPER_ADMIN_PROFILE.address,
        location: 'Kolkata, West Bengal, India',
        country: 'India',
        currency: 'INR (₹)',
        timezone: 'Asia/Kolkata',
        contactDetails: {
          emergencyCall: DEFAULT_SUPER_ADMIN_PROFILE.receptionCall,
          receptionWhatsapp: DEFAULT_SUPER_ADMIN_PROFILE.receptionWhatsapp,
          officialEmail: DEFAULT_SUPER_ADMIN_PROFILE.email,
          ownerPhone: DEFAULT_SUPER_ADMIN_PROFILE.ownerContact,
          managerPhone: DEFAULT_SUPER_ADMIN_PROFILE.managerContact,
        },
        leadership: {
          medicalDirectorAndOwner: DEFAULT_SUPER_ADMIN_PROFILE.ownerName,
          superAdminAndGeneralManager: DEFAULT_SUPER_ADMIN_PROFILE.managerName,
        },
      },
      branches: branches.map(b => ({
        id: b.id,
        code: b.code,
        name: b.name,
        location: b.location,
        address: b.address,
        adminName: b.adminName,
        adminEmail: b.adminEmail,
        adminPhone: b.adminPhone,
        status: b.status,
        facilityType: b.facilityType,
        govRegNumber: b.govRegNumber,
      })),
      totalBranchesCount: branches.length,
    };

    const doctorDatabase = {
      totalDoctorsCount: doctors.length,
      doctors: doctors.map(d => ({
        id: d.id,
        hospitalId: d.branchId,
        hospitalCode: d.branchCode,
        hospitalName: d.branchName,
        name: d.name,
        specialty: d.specialty,
        department: d.department,
        qualification: d.qualification,
        registrationNumber: d.registrationNumber,
        consultationFee: {
          amount: d.fee,
          currency: 'INR',
          symbol: '₹',
        },
        contact: {
          phone: d.phone,
          email: d.email,
        },
        status: d.status,
        role: d.role,
        permissions: d.permissions,
        endpoints: {
          profile: `/api/v1/doctors/${d.id}`,
          todayAppointments: `/api/v1/doctor/appointments/today`,
          submitPrescription: `/api/v1/doctor/prescriptions`,
          diagnosticReports: `/api/v1/doctor/reports`,
          ipdAdmissions: `/api/v1/doctor/admissions`,
          earnings: `/api/v1/doctor/earnings`,
        }
      })),
    };

    return apiSuccess(
      {
        hospitalDatabase,
        doctorDatabase,
        integrationGuide: {
          baseUrl: 'https://medix-hospital-system.vercel.app',
          localBaseUrl: 'http://localhost:3000',
          authHeader: 'Authorization: Bearer <API_TOKEN_OR_SESSION>',
          endpoints: {
            getAllHospitals: 'GET /api/v1/hospitals',
            getHospitalById: 'GET /api/v1/hospitals/:id',
            getAllDoctors: 'GET /api/v1/doctors',
            getDoctorById: 'GET /api/v1/doctors/:id',
            doctorLogin: 'POST /api/v1/auth/login',
            completeDatabase: 'GET /api/v1/database',
          }
        }
      },
      {
        message: 'Complete ARIYAN Hospital and Doctor Database exported successfully.',
      }
    );
  } catch (err: any) {
    return apiError(err?.message || 'Failed to export databases.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key required to sync live database.', authResult.statusCode || 401);
    }

    const body = await request.json().catch(() => ({}));
    if (body.branches && Array.isArray(body.branches)) {
      backendStore.syncBranchesFromWeb(body.branches);
    }
    if (body.doctors && Array.isArray(body.doctors)) {
      backendStore.syncDoctorsFromWeb(body.doctors);
    }

    return apiSuccess(
      {
        totalBranches: backendStore.getBranches().length,
        totalDoctors: backendStore.getAllDoctors().length,
        branches: backendStore.getBranches(),
        doctors: backendStore.getAllDoctors(),
      },
      {
        message: 'Server database synchronized with web and mobile clients successfully.',
      }
    );
  } catch (err: any) {
    console.error('Database POST sync error:', err);
    return apiError(err?.message || 'Failed to sync database to server.', 500);
  }
}
