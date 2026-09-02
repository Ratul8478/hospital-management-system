import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const doctorIdParam = searchParams.get('doctorId');
    const date = searchParams.get('date') || undefined;
    const status = searchParams.get('status') || undefined;

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || undefined);

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
    return apiServerError('/api/v1/doctor/followups GET', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
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
      doctorId: reqDoctorId,
      branchId: reqBranchId,
      scheduledDate,
      scheduledTime,
      reason,
      notes,
    } = sanitizedBody || {};

    if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
      return apiError('Field "patientName" is required and must be at least 2 characters long.', 422, { field: 'patientName' });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 2) {
      return apiError('Field "reason" is required and must be at least 2 characters long.', 422, { field: 'reason' });
    }

    const effectiveDoctorId = authResult.userId || (reqDoctorId ? parseInt(reqDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Medical Specialist');
    const branchId = doctor ? doctor.branchId : (reqBranchId ? parseInt(reqBranchId, 10) : 1);

    const todayStr = new Date().toISOString().split('T')[0];

    // Deterministically get or create the registered patient entity
    const patientEntity = backendStore.getOrCreatePatient({
      name: patientName.trim(),
      uhid: uhid ? String(uhid).trim() : undefined,
      phone: patientPhone ? String(patientPhone).trim() : undefined,
      branchId,
      condition: reason.trim(),
    });

    const newFollowup = backendStore.createFollowUp({
      patientId: patientEntity.id,
      uhid: patientEntity.uhid,
      patientName: patientEntity.name,
      patientPhone: patientEntity.phone,
      doctorId: effectiveDoctorId,
      doctorName,
      branchId,
      scheduledDate: scheduledDate ? String(scheduledDate).trim() : todayStr,
      scheduledTime: scheduledTime ? String(scheduledTime).trim() : '10:00 AM',
      reason: reason.trim(),
      notes: notes ? String(notes).trim() : undefined,
    });

    return apiSuccess(newFollowup, {
      status: 201,
      message: `Follow-up consultation successfully scheduled for ${patientEntity.name} on ${newFollowup.scheduledDate}`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/followups POST', err);
  }
}

