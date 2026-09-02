import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Token required to access patient records.', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    let query = searchParams.get('query') || searchParams.get('search') || searchParams.get('q') || undefined;
    const branchIdParam = searchParams.get('branchId');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // If caller is a patient, restrict query strictly to their own UHID or name
    if (authResult.role === 'patient') {
      const userUhid = (authResult as any).uhid || (authResult as any).details?.uhid;
      if (userUhid) {
        query = userUhid;
      } else if (authResult.userName) {
        query = authResult.userName;
      }
    }

    const branchId = branchIdParam ? parseInt(branchIdParam, 10) : undefined;
    const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 20;

    const result = backendStore.searchPatients(query, branchId, page, limit);

    return apiSuccess(result, {
      status: 200,
      message: query
        ? `Found ${result.total} patient(s) matching query '${query}'`
        : 'Patient directory retrieved successfully.',
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    return apiServerError('/api/v1/patients GET', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Session required to register patient.', authResult.statusCode || 401);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(body);
    if (threatCheck.isSuspicious) {
      return apiError('Malicious input pattern rejected by security firewall', 400);
    }

    const sanitizedBody = sanitizeObject(body);
    const {
      name,
      age,
      gender,
      bloodGroup,
      phone,
      email,
      condition,
      branchId,
      address,
      allergies,
      chronicConditions,
    } = sanitizedBody || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return apiError('Field "name" is required and must be at least 2 characters long.', 422, { field: 'name' });
    }
    if (name.trim().length > 100) {
      return apiError('Field "name" must not exceed 100 characters.', 422, { field: 'name' });
    }

    let parsedAge = 35;
    if (age !== undefined && age !== null) {
      parsedAge = typeof age === 'number' ? age : parseInt(String(age), 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 125) {
        return apiError('Field "age" must be a valid number between 0 and 125.', 422, { field: 'age' });
      }
    }

    const validGenders = ['male', 'female', 'other', 'unspecified'];
    const normGender = gender ? String(gender).trim().toLowerCase() : 'unspecified';
    if (gender && !validGenders.includes(normGender)) {
      return apiError('Field "gender" must be one of: Male, Female, Other, Unspecified.', 422, { field: 'gender' });
    }
    const formattedGender = normGender.charAt(0).toUpperCase() + normGender.slice(1);

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
    const formattedBloodGroup = bloodGroup ? String(bloodGroup).trim().toUpperCase() : 'Unknown';

    const effectiveBranchId = branchId ? parseInt(String(branchId), 10) : 1;

    // Check duplicate patient
    const existingPatients = backendStore.getPatients();
    const isDuplicate = existingPatients.some(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase() && p.phone === (phone ? String(phone).trim() : '') && p.branchId === effectiveBranchId
    );
    if (isDuplicate) {
      return apiError(`Patient "${name.trim()}" with phone "${phone}" is already registered.`, 409);
    }

    const registered = backendStore.getOrCreatePatient({
      name: name.trim(),
      phone: phone ? String(phone).trim() : undefined,
      age: parsedAge,
      gender: formattedGender,
      branchId: effectiveBranchId,
      condition: condition ? String(condition).trim() : 'General OPD Consultation',
    });

    return apiSuccess(registered, {
      status: 201,
      message: `Patient ${registered.name} registered successfully with UHID ${registered.uhid}`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/patients POST', err);
  }
}

