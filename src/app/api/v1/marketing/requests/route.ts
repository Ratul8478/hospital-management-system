import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MARKETING_JOIN_REQUESTS } from '@/lib/data';

// In-memory request cache for backend
let marketingRequests = [...INITIAL_MARKETING_JOIN_REQUESTS];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchIdParam = searchParams.get('branch_id');
    const statusParam = searchParams.get('status');

    let filtered = marketingRequests;

    if (branchIdParam) {
      const bId = parseInt(branchIdParam, 10);
      filtered = filtered.filter(r => r.targetBranchId === bId);
    }

    if (statusParam) {
      filtered = filtered.filter(r => r.status === statusParam);
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
    const { name, email, phone, targetBranchId, targetBranchCode, targetBranchName, territory, experienceYears, expectedMonthlyReferrals, qualificationsOrNotes } = body;

    if (!name || !phone || !targetBranchId) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and target branch are required fields.' },
        { status: 422 }
      );
    }

    const newRequest = {
      id: marketingRequests.length + 1,
      name,
      email: email || '',
      phone,
      targetBranchId: Number(targetBranchId),
      targetBranchCode: targetBranchCode || `BRANCH-${targetBranchId}`,
      targetBranchName: targetBranchName || 'Hospital Branch',
      territory: territory || 'General City Healthcare Network',
      experienceYears: Number(experienceYears) || 2,
      expectedMonthlyReferrals: Number(expectedMonthlyReferrals) || 15,
      qualificationsOrNotes: qualificationsOrNotes || 'Application received via API',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
    };

    marketingRequests = [newRequest, ...marketingRequests];

    return NextResponse.json(
      {
        success: true,
        message: 'Marketing Partner application submitted successfully and queued for Hospital Admin review.',
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
