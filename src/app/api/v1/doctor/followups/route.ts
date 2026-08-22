import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const doctorIdParam = searchParams.get('doctorId');
    const date = searchParams.get('date') || undefined;
    const status = searchParams.get('status') || undefined;

    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : 99;

    const followups = backendStore.getFollowUps({
      doctorId,
      date,
      status,
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const dueTodayCount = followups.filter((f) => f.scheduledDate === todayStr).length;

    return apiSuccess(
      {
        totalCount: followups.length,
        dueTodayCount,
        followups,
      },
      {
        status: 200,
        message: 'Doctor follow-up schedule retrieved successfully.',
        meta: { count: followups.length },
      }
    );
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/followups GET:', err);
    return apiError(err?.message || 'Failed to fetch follow-ups', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(body);
    if (threatCheck.isSuspicious) {
      return apiError('Malicious input pattern rejected by security firewall', 400);
    }

    const sanitizedBody = sanitizeObject(body);
    const {
      patientId,
      uhid,
      patientName,
      patientPhone,
      doctorId,
      doctorName,
      branchId,
      scheduledDate,
      scheduledTime,
      reason,
      notes,
    } = sanitizedBody || {};

    if (!patientName || typeof patientName !== 'string') {
      return apiError('Missing required field: patientName', 422, { field: 'patientName' });
    }

    if (!reason || typeof reason !== 'string') {
      return apiError('Missing required field: reason', 422, { field: 'reason' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const generatedUhid = uhid || `UHID-${todayStr.replace(/-/g, '')}-${crypto.randomInt(1000, 10000)}`;

    const newFollowup = backendStore.createFollowUp({
      patientId: patientId ? parseInt(patientId, 10) : crypto.randomInt(100, 1000),
      uhid: generatedUhid,
      patientName,
      patientPhone: patientPhone || '9804222142',
      doctorId: doctorId ? parseInt(doctorId, 10) : 1,
      doctorName: doctorName || 'Dr . Jiarul Haque',
      branchId: branchId ? parseInt(branchId, 10) : 1,
      scheduledDate: scheduledDate || todayStr,
      scheduledTime: scheduledTime || '10:00 AM',
      reason,
      notes,
    });

    return apiSuccess(newFollowup, {
      status: 201,
      message: `Follow-up consultation successfully scheduled for ${patientName} on ${newFollowup.scheduledDate}`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/followups POST:', err);
    return apiError(err?.message || 'Failed to schedule follow-up', 500);
  }
}
