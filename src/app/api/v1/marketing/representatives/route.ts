import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { MarketingRepresentative } from '@/lib/data';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status');

    const reps = backendStore.getMarketingRepresentatives({
      branchId: branchId ? parseInt(branchId, 10) : undefined,
      status: status ? status.trim() : undefined,
    });

    return apiSuccess(reps, {
      status: 200,
      message: 'Marketing representatives list retrieved successfully.',
      meta: { count: reps.length },
    });
  } catch (error: any) {
    return apiServerError('/api/v1/marketing/representatives GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key required to register marketing representative', authResult.statusCode || 401);
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security warning: Malicious payload blocked by API gateway.', 400);
    }

    const body = sanitizeObject(rawBody);
    const {
      name,
      gender,
      fatherOrMotherName,
      dob,
      bloodGroup,
      aadharNumber,
      panNumber,
      drivingLicenceNumber,
      address,
      pinCode,
      district,
      state,
      country,
      email,
      phone,
      branchId,
      branchCode,
      branchName,
      territory,
      experienceYears,
      commissionRate,
    } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return apiError('Field "name" is required and must be at least 2 characters long.', 422, { field: 'name' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
      return apiError('Field "phone" is required and must be a valid phone number.', 422, { field: 'phone' });
    }
    if (!branchId) {
      return apiError('Field "branchId" is required.', 422, { field: 'branchId' });
    }

    const effectiveBranchId = parseInt(String(branchId), 10);
    if (isNaN(effectiveBranchId) || effectiveBranchId <= 0) {
      return apiError('Field "branchId" must be a valid positive integer.', 422, { field: 'branchId' });
    }

    // Check duplicate representative by phone or email
    const existingReps = backendStore.getMarketingRepresentatives();
    const isDuplicate = existingReps.some(
      (r) => r.phone === phone.trim() || (email && r.email && r.email.toLowerCase() === email.trim().toLowerCase())
    );
    if (isDuplicate) {
      return apiError(`Marketing representative with phone "${phone}" or email "${email}" is already registered.`, 409);
    }

    const nextRepId = existingReps.length + 1;
    const generatedRefId = `REF-MKT-B${effectiveBranchId}-${String(nextRepId).padStart(4, '0')}`;
    const approvalDate = new Date().toISOString().split('T')[0];

    const newRep: Omit<MarketingRepresentative, 'id'> = {
      referenceId: generatedRefId,
      branchId: effectiveBranchId,
      branchCode: branchCode ? String(branchCode).trim() : `BRANCH-${effectiveBranchId}`,
      branchName: branchName ? String(branchName).trim() : 'Hospital Branch',
      name: name.trim(),
      gender: (gender === 'Female' ? 'Female' : gender === 'Other' ? 'Other' : 'Male') as 'Male' | 'Female' | 'Other',
      fatherOrMotherName: fatherOrMotherName ? String(fatherOrMotherName).trim() : 'Guardian',
      dob: dob ? String(dob).trim() : '1995-01-01',
      bloodGroup: bloodGroup ? String(bloodGroup).trim() : 'O+',
      aadharNumber: aadharNumber ? String(aadharNumber).trim() : 'XXXX-XXXX-XXXX',
      panNumber: panNumber ? String(panNumber).trim() : 'XXXXX0000X',
      drivingLicenceNumber: drivingLicenceNumber ? String(drivingLicenceNumber).trim() : 'DL-XXXXX',
      address: address ? String(address).trim() : 'Hospital Catchment Area',
      pinCode: pinCode ? String(pinCode).trim() : '400001',
      district: district ? String(district).trim() : 'City Center',
      state: state ? String(state).trim() : 'State',
      country: country ? String(country).trim() : 'India',
      email: email ? String(email).trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@partner.local`,
      emailVerified: true,
      phone: phone.trim(),
      territory: territory ? String(territory).trim() : 'City Wide Healthcare Coverage',
      experienceYears: Number(experienceYears) || 3,
      status: 'active',
      approvedDate: approvalDate,
      superAdminApprovedDate: approvalDate,
      superAdminName: authResult.userName || 'Anichul Haque (Super Admin HQ)',
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: commissionRate ? String(commissionRate).trim() : '10% on Diagnostics & OPD',
    };

    const savedRep = backendStore.addMarketingRepresentative(newRep);

    return apiSuccess(savedRep, {
      status: 201,
      message: `Marketing Representative onboarded successfully with Reference ID: ${generatedRefId}`,
    });
  } catch (error: any) {
    return apiServerError('/api/v1/marketing/representatives POST', error);
  }
}

