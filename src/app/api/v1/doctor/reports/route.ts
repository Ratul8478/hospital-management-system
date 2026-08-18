import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorIdParam = searchParams.get('doctorId');
    const patientIdParam = searchParams.get('patientId');
    const uhid = searchParams.get('uhid') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const patientId = patientIdParam ? parseInt(patientIdParam, 10) : undefined;

    const reports = backendStore.getReports({
      doctorId,
      patientId,
      uhid,
      category,
      status,
    });

    const readyCount = reports.filter((r) => r.status === 'ready').length;
    const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'processing').length;
    const criticalCount = reports.filter((r) => r.criticalAlert).length;

    return apiSuccess(
      {
        summary: {
          total: reports.length,
          ready: readyCount,
          pending: pendingCount,
          criticalAlerts: criticalCount,
        },
        reports,
      },
      {
        status: 200,
        message: 'Diagnostic and medical laboratory reports retrieved successfully.',
        meta: { total: reports.length },
      }
    );
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/reports GET:', err);
    return apiError(err?.message || 'Failed to fetch diagnostic reports', 500);
  }
}
