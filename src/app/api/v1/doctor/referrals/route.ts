import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorIdStr = searchParams.get('doctorId');
    const hospitalId = searchParams.get('hospitalId') || searchParams.get('targetHospitalId');
    const uhid = searchParams.get('uhid');

    const referringDoctorId = doctorIdStr ? parseInt(doctorIdStr, 10) : undefined;
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
        message: 'Dispatched patient referrals retrieved successfully.',
      }
    );
  } catch (err: any) {
    return apiError(err?.message || 'Failed to retrieve referrals.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.patientName || !body.uhid || !body.targetHospitalName || !body.clinicalSummary) {
      return apiError(
        'Patient Name, UHID, Target Hospital, and Clinical Summary are required to dispatch a referral.',
        422
      );
    }

    const referral = backendStore.createReferral({
      referralId: body.referralId,
      patientId: body.patientId || 1,
      uhid: body.uhid,
      patientName: body.patientName,
      patientAge: body.patientAge || 45,
      patientGender: body.patientGender || 'Male',
      targetHospitalId: body.targetHospitalId || 'ARIYAN-HQ',
      targetHospitalCode: body.targetHospitalCode,
      targetHospitalName: body.targetHospitalName,
      targetHospitalLocation: body.targetHospitalLocation,
      targetDoctorId: body.targetDoctorId,
      targetDoctorName: body.targetDoctorName,
      targetDoctorSpecialty: body.targetDoctorSpecialty,
      targetDepartment: body.targetDepartment || 'Cardiology & Intensive Care',
      urgencyLevel: body.urgencyLevel || 'URGENT',
      clinicalSummary: body.clinicalSummary,
      diagnosis: body.diagnosis || 'Cardiovascular Evaluation',
      vitalsSummary: body.vitalsSummary,
      referringDoctorId: body.referringDoctorId || 1,
      referringDoctorName: body.referringDoctorName || 'Dr. Registered Practitioner',
      referringDoctorChamber: body.referringDoctorChamber,
      referringDoctorPhone: body.referringDoctorPhone,
      referringDoctorEmail: body.referringDoctorEmail,
      status: 'DISPATCHED',
    });

    return apiSuccess(referral, {
      status: 201,
      message: `Patient ${referral.patientName} successfully referred to ${referral.targetHospitalName} (Tracking Token: ${referral.referralId}).`,
    });
  } catch (err: any) {
    return apiError(err?.message || 'Failed to dispatch hospital referral.', 500);
  }
}
