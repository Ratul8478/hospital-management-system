import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const doctorIdStr = searchParams.get('doctorId');
    const hospitalId = searchParams.get('hospitalId') || searchParams.get('targetHospitalId');
    const uhid = searchParams.get('uhid');

    const parsedDoctorId = doctorIdStr ? parseInt(doctorIdStr, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const referringDoctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || undefined);
    const referrals = backendStore.getReferrals({
      referringDoctorId,
      targetHospitalId: hospitalId || undefined,
      uhid: uhid || undefined,
    });

    return apiSuccess(
      {
        total: referrals.length,
        referrals,
      },
      {
        status: 200,
        message: 'Dispatched patient referrals retrieved successfully.',
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/referrals GET', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    const rawBody = await request.json().catch(() => ({}));
    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious referral payload blocked.', 400);
    }

    const body = sanitizeObject(rawBody);

    let patientName = body.patientName;
    let targetHospitalName = body.targetHospitalName || body.targetHospital;
    let clinicalSummary = body.clinicalSummary || body.clinicalNotes || body.reason || body.notes || body.diagnosis;

    if (!patientName && (body.patientId || body.uhid)) {
      const p = backendStore.getPatientByIdOrUhid(body.patientId || body.uhid);
      if (p) {
        patientName = p.name;
      }
    }

    if (!targetHospitalName && body.targetHospitalId) {
      const b = backendStore.getBranchById(parseInt(body.targetHospitalId, 10));
      if (b) {
        targetHospitalName = b.name;
      }
    }

    if (!patientName || !body.uhid || !targetHospitalName || !clinicalSummary) {
      return apiError(
        'Patient Name (or patientId/uhid), UHID, Target Hospital, and Clinical Summary (or clinicalNotes) are required to dispatch a referral.',
        422
      );
    }

    const validUrgencies = ['routine', 'urgent', 'emergency', 'stat'];
    const rawUrgency = body.urgencyLevel || body.urgency || 'URGENT';
    const normUrgency = String(rawUrgency).trim().toLowerCase();
    const formattedUrgency = validUrgencies.includes(normUrgency) ? normUrgency.toUpperCase() : 'URGENT';

    const effectiveDoctorId = authResult.userId || (body.referringDoctorId ? parseInt(body.referringDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Dr. Registered Practitioner');

    const patientRec = backendStore.getPatientByIdOrUhid(body.uhid);

    const referral = backendStore.createReferral({
      referralId: body.referralId,
      patientId: patientRec ? patientRec.id : (body.patientId ? parseInt(String(body.patientId), 10) : 1),
      uhid: patientRec ? patientRec.uhid : String(body.uhid).trim(),
      patientName: patientName.trim(),
      patientAge: patientRec ? patientRec.age : (body.patientAge ? parseInt(String(body.patientAge), 10) : 45),
      patientGender: patientRec ? patientRec.gender : (body.patientGender || 'Male'),
      targetHospitalId: body.targetHospitalId || 'ARIYAN-HQ',
      targetHospitalCode: body.targetHospitalCode,
      targetHospitalName: targetHospitalName.trim(),
      targetHospitalLocation: body.targetHospitalLocation,
      targetDoctorId: body.targetDoctorId,
      targetDoctorName: body.targetDoctorName,
      targetDoctorSpecialty: body.targetDoctorSpecialty,
      targetDepartment: body.targetDepartment || 'Cardiology & Intensive Care',
      urgencyLevel: (formattedUrgency === 'URGENT' ? 'URGENT' : formattedUrgency === 'EMERGENCY' ? 'EMERGENCY' : 'ROUTINE') as 'ROUTINE' | 'URGENT' | 'EMERGENCY',
      clinicalSummary: clinicalSummary.trim(),
      diagnosis: body.diagnosis || 'Cardiovascular Evaluation',
      vitalsSummary: body.vitalsSummary,
      referringDoctorId: effectiveDoctorId,
      referringDoctorName: doctorName,
      referringDoctorSpecialty: doctor?.specialty || body.referringDoctorSpecialty,
      referringDoctorQualification: doctor?.qualification || body.referringDoctorQualification,
      referringDoctorRegNo: doctor?.registrationNumber || body.referringDoctorRegNo,
      referringDoctorHospital: doctor?.branchName || body.referringDoctorHospital,
      referringDoctorChamber: doctor?.chamberRoom || body.referringDoctorChamber,
      referringDoctorPhone: doctor?.phone || body.referringDoctorPhone,
      referringDoctorEmail: doctor?.email || body.referringDoctorEmail,
      marketingRepId: body.marketingRepId,
      marketingRepName: body.marketingRepName,
      marketingRepCode: body.marketingRepCode,
      marketingRepPhone: body.marketingRepPhone,
      marketingRepEmail: body.marketingRepEmail,
      marketingRepTerritory: body.marketingRepTerritory,
      marketingRepCommissionRate: body.marketingRepCommissionRate,
      marketingRepRole: body.marketingRepRole,
      status: body.status || 'DISPATCHED',
    });

    return apiSuccess(referral, {
      status: 201,
      message: `Patient referral ${referral.referralId} dispatched to ${referral.targetHospitalName}.`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/referrals POST', err);
  }
}
