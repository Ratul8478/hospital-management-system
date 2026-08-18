import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MARKETING_REPRESENTATIVES } from '@/lib/data';

let marketingReps = [...INITIAL_MARKETING_REPRESENTATIVES];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchIdParam = searchParams.get('branch_id');
    const refIdParam = searchParams.get('ref_id');

    let filtered = marketingReps;

    if (branchIdParam) {
      const bId = parseInt(branchIdParam, 10);
      filtered = filtered.filter(r => r.branchId === bId);
    }

    if (refIdParam) {
      filtered = filtered.filter(r => r.referenceId.toLowerCase() === refIdParam.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: {
        total: filtered.length,
        representatives: filtered,
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
    const { name, email, phone, branchId, branchCode, branchName, territory, experienceYears, commissionRate } = body;

    if (!name || !phone || !branchId) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and branch ID are required.' },
        { status: 422 }
      );
    }

    // Auto-generate reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `REF-MKT-B${branchId}-${randomSuffix}`;

    const newRep = {
      id: marketingReps.length + 1,
      referenceId: generatedRefId,
      branchId: Number(branchId),
      branchCode: branchCode || `BRANCH-${branchId}`,
      branchName: branchName || 'Hospital Branch',
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@partner.local`,
      phone,
      territory: territory || 'City Wide Healthcare Coverage',
      experienceYears: Number(experienceYears) || 3,
      status: 'active' as const,
      approvedDate: new Date().toISOString().split('T')[0],
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
