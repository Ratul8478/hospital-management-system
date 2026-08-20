import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MARKETING_JOIN_REQUESTS, MarketingJoinRequest } from '@/lib/data';

// In-memory request cache for backend
let marketingRequests: MarketingJoinRequest[] = [...INITIAL_MARKETING_JOIN_REQUESTS];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchIdParam = searchParams.get('branch_id');
    const statusParam = searchParams.get('status');
    const pipelineParam = searchParams.get('pipeline');

    let filtered = marketingRequests;

    if (pipelineParam === 'hq_direct') {
      filtered = filtered.filter(r => r.targetBranchId === 1 && r.status === 'pending_super_admin_approval');
    } else if (pipelineParam === 'branch_forwarded') {
      filtered = filtered.filter(r => r.targetBranchId !== 1 && r.status === 'pending_super_admin_approval');
    } else {
      if (branchIdParam) {
        const bId = parseInt(branchIdParam, 10);
        filtered = filtered.filter(r => r.targetBranchId === bId);
      }

      if (statusParam) {
        filtered = filtered.filter(r => r.status === statusParam);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: filtered.length,
        requests: filtered,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      password
    } = body;

    // Security & Data Validation
    if (!name || !email || !targetBranchId) {
      return NextResponse.json(
        { success: false, error: 'Full legal name, verified email, and target hospital branch are required fields.' },
        { status: 422 }
      );
    }

    const branchIdNum = Number(targetBranchId);
    const initialStatus = branchIdNum === 1 ? 'pending_super_admin_approval' : 'pending_branch_review';

    const newRequest: MarketingJoinRequest = {
      id: marketingRequests.length + 1,
      name: String(name).trim(),
      gender: gender || 'Male',
      fatherOrMotherName: fatherOrMotherName || '',
      dob: dob || '1995-01-01',
      bloodGroup: bloodGroup || 'O+',
      aadharNumber: aadharNumber || 'XXXX-XXXX-XXXX',
      aadharDocUrl: aadharDocUrl || 'aadhar_card.pdf',
      panNumber: panNumber ? String(panNumber).toUpperCase() : 'XXXXX0000X',
      panDocUrl: panDocUrl || 'pan_card.jpg',
      drivingLicenceNumber: drivingLicenceNumber || 'DL-XXXXX',
      drivingLicenceDocUrl: drivingLicenceDocUrl || 'driving_licence.pdf',
      address: address || '',
      pinCode: pinCode || '',
      district: district || '',
      state: state || '',
      country: country || 'India',
      email: String(email).trim().toLowerCase(),
      emailVerified: Boolean(emailVerified ?? true),
      phone: phone || '',
      targetBranchId: branchIdNum,
      targetBranchCode: targetBranchCode || (branchIdNum === 1 ? 'MEDIX-CENTRAL' : `BRANCH-${branchIdNum}`),
      targetBranchName: targetBranchName || (branchIdNum === 1 ? 'Medix Central Hospital (Headquarters)' : 'Hospital Facility'),
      territory: territory || 'Hospital Catchment Area',
      experienceYears: Number(experienceYears) || 3,
      expectedMonthlyReferrals: Number(expectedMonthlyReferrals) || 20,
      qualificationsOrNotes: qualificationsOrNotes || 'Application submitted with full KYC verification documents.',
      appliedDate: new Date().toISOString().split('T')[0],
      status: initialStatus,
      password: password ? '***SECURED***' : undefined,
    };

    marketingRequests = [newRequest, ...marketingRequests];

    return NextResponse.json(
      {
        success: true,
        message: branchIdNum === 1
          ? 'Marketing Partner application submitted to Headquarters. Awaiting direct Super Admin approval & Reference ID dispatch.'
          : 'Marketing Partner application submitted to Hospital Admin. Awaiting Hospital Admin pre-approval and Super Admin final Reference ID issuance.',
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
