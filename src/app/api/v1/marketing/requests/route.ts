import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { MarketingJoinRequest } from '@/lib/data';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'branch_admin');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Admin Token or Key required to view marketing applications', authResult.statusCode || 403);
    }

    const { searchParams } = new URL(request.url);
    const branchIdParam = searchParams.get('branch_id') || searchParams.get('branchId');
    const statusParam = searchParams.get('status');
    const pipelineParam = searchParams.get('pipeline');

    const filtered = backendStore.getMarketingRequests({
      branchId: branchIdParam ? parseInt(branchIdParam, 10) : undefined,
      status: statusParam ? statusParam.trim() : undefined,
      pipeline: pipelineParam ? pipelineParam.trim() : undefined,
    });

    return apiSuccess(
      {
        total: filtered.length,
        requests: filtered,
      },
      {
        status: 200,
        message: 'Marketing join requests retrieved successfully.',
      }
    );
  } catch (error: any) {
    return apiServerError('/api/v1/marketing/requests GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security alert: Malicious payload blocked by API Gateway.', 400);
    }

    const body = sanitizeObject(rawBody);
    const {
      name,
      gender,
      fatherOrMotherName,
      dob,
      bloodGroup,
      aadharNumber,
      aadharDocUrl,
      panNumber,
      panDocUrl,
      drivingLicenceNumber,
      drivingLicenceDocUrl,
      address,
      pinCode,
      district,
      state,
      country,
      email,
      emailVerified,
      phone,
      targetBranchId,
      targetBranchCode,
      targetBranchName,
      territory,
      experienceYears,
      expectedMonthlyReferrals,
      qualificationsOrNotes,
      password,
    } = body;

    // Security & Data Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return apiError('Field "name" is required and must be at least 2 characters long.', 422, { field: 'name' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return apiError('Field "email" is required and must be a valid email address.', 422, { field: 'email' });
    }
    if (!targetBranchId) {
      return apiError('Field "targetBranchId" is required.', 422, { field: 'targetBranchId' });
    }

    const branchIdNum = Number(targetBranchId);
    if (isNaN(branchIdNum) || branchIdNum <= 0) {
      return apiError('Field "targetBranchId" must be a valid positive branch ID.', 422, { field: 'targetBranchId' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existingReq = backendStore.findMarketingRequestByEmail(cleanEmail);
    if (existingReq) {
      return apiError(`An application with email "${cleanEmail}" is already under review.`, 409);
    }

    const initialStatus = branchIdNum === 1 ? 'pending_super_admin_approval' : 'pending_branch_review';

    const newRequestData: MarketingJoinRequest = {
      id: 0, // Assigned by store
      name: String(name).trim(),
      gender: (gender === 'Female' ? 'Female' : gender === 'Other' ? 'Other' : 'Male') as 'Male' | 'Female' | 'Other',
      fatherOrMotherName: fatherOrMotherName ? String(fatherOrMotherName).trim() : '',
      dob: dob ? String(dob).trim() : '1995-01-01',
      bloodGroup: bloodGroup ? String(bloodGroup).trim() : 'O+',
      aadharNumber: aadharNumber ? String(aadharNumber).trim() : 'XXXX-XXXX-XXXX',
      aadharDocUrl: aadharDocUrl ? String(aadharDocUrl).trim() : 'aadhar_card.pdf',
      panNumber: panNumber ? String(panNumber).toUpperCase().trim() : 'XXXXX0000X',
      panDocUrl: panDocUrl ? String(panDocUrl).trim() : 'pan_card.jpg',
      drivingLicenceNumber: drivingLicenceNumber ? String(drivingLicenceNumber).trim() : 'DL-XXXXX',
      drivingLicenceDocUrl: drivingLicenceDocUrl ? String(drivingLicenceDocUrl).trim() : 'driving_licence.pdf',
      address: address ? String(address).trim() : '',
      pinCode: pinCode ? String(pinCode).trim() : '',
      district: district ? String(district).trim() : '',
      state: state ? String(state).trim() : '',
      country: country ? String(country).trim() : 'India',
      email: cleanEmail,
      emailVerified: Boolean(emailVerified ?? true),
      phone: phone ? String(phone).trim() : '',
      targetBranchId: branchIdNum,
      targetBranchCode: targetBranchCode ? String(targetBranchCode).trim() : (branchIdNum === 1 ? 'MEDIX-CENTRAL' : `BRANCH-${branchIdNum}`),
      targetBranchName: targetBranchName ? String(targetBranchName).trim() : (branchIdNum === 1 ? 'Medix Central Hospital (Headquarters)' : 'Hospital Facility'),
      territory: territory ? String(territory).trim() : 'Hospital Catchment Area',
      experienceYears: Number(experienceYears) || 3,
      expectedMonthlyReferrals: Number(expectedMonthlyReferrals) || 20,
      qualificationsOrNotes: qualificationsOrNotes ? String(qualificationsOrNotes).trim() : 'Application submitted with KYC documents.',
      appliedDate: new Date().toISOString().split('T')[0],
      status: initialStatus,
      password: password ? '***SECURED***' : undefined,
    };

    const savedRequest = backendStore.addMarketingRequest(newRequestData);

    return apiSuccess(
      {
        requestId: savedRequest.id,
        status: savedRequest.status,
        name: savedRequest.name,
        targetBranch: savedRequest.targetBranchName,
      },
      {
        status: 201,
        message: 'Marketing Partner application submitted successfully.',
      }
    );
  } catch (error: any) {
    return apiServerError('/api/v1/marketing/requests POST', error);
  }
}
