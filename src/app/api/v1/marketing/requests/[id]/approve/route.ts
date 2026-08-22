import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { INITIAL_MARKETING_JOIN_REQUESTS, INITIAL_MARKETING_REPRESENTATIVES, INITIAL_MARKETING_EMAIL_LOGS, MarketingEmailDispatchLog } from '@/lib/data';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

let marketingRequests = [...INITIAL_MARKETING_JOIN_REQUESTS];
let marketingReps = [...INITIAL_MARKETING_REPRESENTATIVES];
let emailLogs: MarketingEmailDispatchLog[] = [...INITIAL_MARKETING_EMAIL_LOGS];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reqId = parseInt(id, 10);
    const rawBody = await request.json().catch(() => ({}));
    
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Security warning: Malicious payload blocked.' },
        { status: 400 }
      );
    }

    const body = sanitizeObject(rawBody);
    const { superAdminName, securityToken } = body;

    const targetReq = marketingRequests.find(r => r.id === reqId);
    if (!targetReq) {
      return NextResponse.json(
        { success: false, error: `Marketing Request #${id} not found.` },
        { status: 404 }
      );
    }

    // STRICT PROTOCOL: Only Super Admin Master approval can generate Reference ID and dispatch email
    const approverName = superAdminName || 'Anichul Haque (Super Admin HQ Master)';
    const randomSuffix = crypto.randomInt(1000, 10000);
    const generatedRefId = `REF-MKT-B${targetReq.targetBranchId}-${randomSuffix}`;
    const approvalDate = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update request
    targetReq.status = 'approved';
    targetReq.approvedReferenceId = generatedRefId;
    targetReq.superAdminApprovedDate = approvalDate;
    targetReq.superAdminName = approverName;

    // Create Marketing Representative Record
    const newRep = {
      id: marketingReps.length + 1,
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
      status: 'active' as const,
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
    };
    marketingReps = [newRep, ...marketingReps];

    // Create & Dispatch Email
    const newEmailLog: MarketingEmailDispatchLog = {
      id: `EML-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      requestId: targetReq.id,
      recipientName: targetReq.name,
      recipientEmail: targetReq.email,
      referenceId: generatedRefId,
      targetBranchId: targetReq.targetBranchId,
      targetBranchCode: targetReq.targetBranchCode,
      targetBranchName: targetReq.targetBranchName,
      dispatchedAt: timestamp,
      dispatchedBySuperAdmin: approverName,
      deliveryStatus: 'delivered',
      smtpServer: 'smtp-relay.medix-network.internal:587',
      emailSubject: `Official Approval: Your Medix Marketing Reference ID ${generatedRefId}`,
      securityToken: securityToken || `AUTH-SA-HQ-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
    };
    emailLogs = [newEmailLog, ...emailLogs];

    return NextResponse.json({
      success: true,
      message: `Request approved by Super Admin. Reference ID ${generatedRefId} generated and dispatched to ${targetReq.email}.`,
      data: {
        request: targetReq,
        representative: newRep,
        emailDispatch: newEmailLog,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
