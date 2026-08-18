import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('search') || searchParams.get('q') || undefined;
    const branchIdParam = searchParams.get('branchId');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

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
    console.error('Error in /api/v1/patients GET:', err);
    return apiError(err?.message || 'Failed to search patients directory', 500);
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
    } = body || {};

    if (!name || typeof name !== 'string') {
      return apiError('Missing required field: name', 422, { field: 'name' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const generatedUhid = `UHID-B${branchId || 1}-${todayStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient = {
      id: Math.floor(1000 + Math.random() * 9000),
      branchId: branchId || 1,
      uhid: generatedUhid,
      name,
      age: age || 35,
      gender: gender || 'Unspecified',
      bloodGroup: bloodGroup || 'O+',
      phone: phone || '+1 (555) 000-0000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      condition: condition || 'General OPD Consultation',
      status: 'opd' as const,
      address: address || 'Healthcare Enclave',
      allergies: Array.isArray(allergies) ? allergies : allergies ? [allergies] : ['None documented'],
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : chronicConditions ? [chronicConditions] : ['None'],
      registeredDate: todayStr,
    };

    return apiSuccess(newPatient, {
      status: 201,
      message: `Patient ${name} registered successfully with UHID ${generatedUhid}`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/patients POST:', err);
    return apiError(err?.message || 'Failed to register patient', 500);
  }
}
