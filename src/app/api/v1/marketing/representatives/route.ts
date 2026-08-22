import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { INITIAL_MARKETING_REPRESENTATIVES, MarketingRepresentative } from '@/lib/data';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

let marketingReps = [...INITIAL_MARKETING_REPRESENTATIVES];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status');

    let reps = [...marketingReps];

    if (branchId) {
      const bId = parseInt(branchId, 10);
      reps = reps.filter(r => r.branchId === bId);
    }

    if (status) {
      reps = reps.filter(r => r.status === status);
    }

    return NextResponse.json({
      success: true,
      data: reps,
      total: reps.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error fetching marketing reps.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Security warning: Malicious payload blocked.' },
        { status: 400 }
      );
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
      commissionRate
    } = body;

    if (!name || !phone || !branchId) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and branch ID are required.' },
        { status: 422 }
      );
    }

    // Auto-generate reference ID using CSPRNG
    const randomSuffix = crypto.randomInt(1000, 10000);
    const generatedRefId = `REF-MKT-B${branchId}-${randomSuffix}`;
    const approvalDate = new Date().toISOString().split('T')[0];

    const newRep: MarketingRepresentative = {
      id: marketingReps.length + 1,
      referenceId: generatedRefId,
      branchId: Number(branchId),
      branchCode: branchCode || `BRANCH-${branchId}`,
      branchName: branchName || 'Hospital Branch',
      name,
      gender: gender || 'Male',
      fatherOrMotherName: fatherOrMotherName || 'Guardian',
      dob: dob || '1995-01-01',
      bloodGroup: bloodGroup || 'O+',
      aadharNumber: aadharNumber || 'XXXX-XXXX-XXXX',
      panNumber: panNumber || 'XXXXX0000X',
      drivingLicenceNumber: drivingLicenceNumber || 'DL-XXXXX',
      address: address || 'Hospital Catchment Area',
      pinCode: pinCode || '400001',
      district: district || 'City Center',
      state: state || 'State',
      country: country || 'India',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@partner.local`,
      emailVerified: true,
      phone,
      territory: territory || 'City Wide Healthcare Coverage',
      experienceYears: Number(experienceYears) || 3,
      status: 'active',
      approvedDate: approvalDate,
      superAdminApprovedDate: approvalDate,
      superAdminName: 'Anichul Haque (Super Admin HQ)',
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: commissionRate || '10% on Diagnostics & OPD',
    };

    marketingReps = [newRep, ...marketingReps];

    return NextResponse.json(
      {
        success: true,
        message: `Marketing Representative onboarded successfully with Reference ID: ${generatedRefId}`,
        data: newRep,
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
