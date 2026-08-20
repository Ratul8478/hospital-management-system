import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MARKETING_EMAIL_LOGS, MarketingEmailDispatchLog } from '@/lib/data';

let emailLogs: MarketingEmailDispatchLog[] = [...INITIAL_MARKETING_EMAIL_LOGS];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const refId = searchParams.get('ref_id');
    const branchId = searchParams.get('branch_id');

    let filtered = emailLogs;
    if (refId) {
      filtered = filtered.filter(l => l.referenceId.toLowerCase() === refId.toLowerCase());
    }
    if (branchId) {
      filtered = filtered.filter(l => l.targetBranchId === parseInt(branchId, 10));
    }

    return NextResponse.json({
      success: true,
      data: {
        total: filtered.length,
        logs: filtered,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
