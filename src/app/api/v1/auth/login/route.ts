import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const { email, identifier, username, password } = body || {};
    const loginIdentifier = email || identifier || username;

    if (!loginIdentifier || typeof loginIdentifier !== 'string') {
      return apiError('Missing required field: email or identifier', 422, {
        field: 'email',
        message: 'A valid email or username is required for login',
      });
    }

    // Authenticate doctor
    const result = backendStore.authenticateDoctor(loginIdentifier, password);

    if (!result) {
      return apiError('Invalid email/credentials. Please check your doctor login details.', 401, {
        hint: 'Use a registered doctor email such as sarah.williams@medix.com or doctor@medix.local',
      });
    }

    const { doctor, session } = result;

    return apiSuccess(
      {
        token: session.token,
        tokenType: 'Bearer',
        expiresAt: session.expiresAt,
        user: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialty: doctor.specialty,
          department: doctor.department,
          qualification: doctor.qualification,
          registrationNumber: doctor.registrationNumber,
          branchId: doctor.branchId,
          branchCode: doctor.branchCode,
          branchName: doctor.branchName,
          fee: doctor.fee,
          status: doctor.status,
          role: doctor.role,
          avatarUrl: doctor.avatarUrl,
        },
        permissions: doctor.permissions,
      },
      {
        status: 200,
        message: `Welcome back, ${doctor.name}! Authentication successful.`,
      }
    );
  } catch (err: any) {
    console.error('Error in /api/v1/auth/login:', err);
    return apiError(err?.message || 'Internal server error during authentication', 500);
  }
}
