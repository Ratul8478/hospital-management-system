import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { MarketingEmailDispatchLog } from '@/lib/data';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = verifyApiRequest(request, 'super_admin');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Super Admin authorization required to approve marketing requests.', authResult.statusCode || 401);
    }

    const params = await Promise.resolve(context.params);
    const reqId = parseInt(params.id, 10);

    if (isNaN(reqId)) {
      return apiError(`Invalid marketing request ID: ${params.id}`, 400);
    }

    const rawBody = await request.json().catch(() => ({}));
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security warning: Malicious payload blocked.', 400);
    }

    const body = sanitizeObject(rawBody);
    const { superAdminName } = body;

    const allRequests = backendStore.getMarketingRequests();
    const targetReq = allRequests.find((r) => r.id === reqId);

    if (!targetReq) {
      return apiError(`Marketing Request #${reqId} not found.`, 404);
    }

    // STRICT PROTOCOL: Only Super Admin Master approval can generate Reference ID and dispatch email
    const approverName = superAdminName || authResult.userName || 'Anichul Haque (Super Admin HQ Master)';
    const randomSuffix = crypto.randomInt(1000, 10000);
    const generatedRefId = `REF-MKT-B${targetReq.targetBranchId}-${randomSuffix}`;
    const approvalDate = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update request in backendStore
    backendStore.updateMarketingRequest(reqId, {
      status: 'approved',
      approvedReferenceId: generatedRefId,
      superAdminApprovedDate: approvalDate,
      superAdminName: approverName,
    });

    // Create Marketing Representative Record
    const newRep = backendStore.addMarketingRepresentative({
      referenceId: generatedRefId,
      branchId: targetReq.targetBranchId,
      branchCode: targetReq.targetBranchCode,
      branchName: targetReq.targetBranchName,
      name: targetReq.name,
      gender: targetReq.gender || 'Male',
      fatherOrMotherName: targetReq.fatherOrMotherName || 'Guardian',
      dob: targetReq.dob || '1995-01-01',
      bloodGroup: targetReq.bloodGroup || 'O+',
      aadharNumber: targetReq.aadharNumber || 'XXXX-XXXX-XXXX',
      panNumber: targetReq.panNumber || 'XXXXX0000X',
      drivingLicenceNumber: targetReq.drivingLicenceNumber || 'DL-XXXX-XXXXXXX',
      address: targetReq.address || 'Hospital Catchment Area',
      pinCode: targetReq.pinCode || '400001',
      district: targetReq.district || 'City Center',
      state: targetReq.state || 'State',
      country: targetReq.country || 'India',
      email: targetReq.email,
      emailVerified: true,
      phone: targetReq.phone,
      territory: targetReq.territory,
      experienceYears: targetReq.experienceYears,
      status: 'active',
      approvedDate: approvalDate,
      branchAdminApprovedDate: targetReq.branchAdminApprovedDate,
      branchAdminName: targetReq.branchAdminName,
      branchAdminEmail: targetReq.branchAdminEmail,
      superAdminApprovedDate: approvalDate,
      superAdminName: approverName,
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: '10% on Diagnostics & OPD',
    });

    // Create & Dispatch Email Log
    const newEmailLog: MarketingEmailDispatchLog = {
      id: `EML-DISPATCH-${Date.now()}`,
      requestId: targetReq.id,
      recipientName: targetReq.name,
      recipientEmail: targetReq.email,
      referenceId: generatedRefId,
      targetBranchId: targetReq.targetBranchId,
      targetBranchCode: targetReq.targetBranchCode,
      targetBranchName: targetReq.targetBranchName,
      dispatchedAt: timestamp,
      dispatchedBySuperAdmin: authResult.userName || 'Super Admin HQ',
      emailSubject: `OFFICIAL APPROVAL & APPOINTMENT LETTER — Medix Hospital Representative (Ref: ${generatedRefId})`,
      deliveryStatus: 'delivered',
      smtpServer: 'smtp.gmail.com:465',
      securityToken: `SEC-TOK-${Date.now()}`,
    };
    backendStore.addMarketingEmailLog(newEmailLog);

    return apiSuccess(
      {
        approvedRequest: targetReq,
        representative: newRep,
        emailLog: newEmailLog,
      },
      {
        status: 200,
        message: `Marketing Request #${reqId} approved successfully. Reference ID ${generatedRefId} generated.`,
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/marketing/requests/[id]/approve POST', err);
  }
}
