import { NextRequest } from 'next/server';
import { backendStore, PrescriptionItem } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';
import { verifyApiRequest, resolveDoctorScope } from '@/lib/api-auth';
import { validateRequiredString } from '@/lib/validation';

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
    const patientIdParam = searchParams.get('patientId');
    const uhid = searchParams.get('uhid') || undefined;
    const search = searchParams.get('search') || undefined;

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || undefined);
    const patientId = patientIdParam ? parseInt(patientIdParam, 10) : undefined;

    const prescriptions = backendStore.getPrescriptions({
      doctorId,
      patientId,
      uhid,
      search,
    });

    return apiSuccess(prescriptions, {
      status: 200,
      message: 'Prescriptions retrieved successfully.',
      meta: { count: prescriptions.length },
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/prescriptions GET', err);
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
      appointmentId,
      patientId,
      uhid,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      phone,
      doctorId: reqDoctorId,
      branchId: reqBranchId,
      diagnosis,
      symptoms,
      medicines,
      medication,
      medications,
      items,
      advice,
      followUpDate,
    } = sanitizedBody || {};

    let finalPatientName = patientName;
    let finalUhid = uhid;
    let finalAge = patientAge;
    let finalGender = patientGender;

    if (!finalPatientName && (patientId || uhid)) {
      const p = backendStore.getPatientByIdOrUhid(patientId || uhid);
      if (p) {
        finalPatientName = p.name;
        finalUhid = finalUhid || p.uhid;
        finalAge = finalAge || p.age;
        finalGender = finalGender || p.gender;
      }
    }

    const nameCheck = validateRequiredString(finalPatientName, 'patientName', 2, 100);
    if (!nameCheck.isValid) {
      return apiError('Missing required field: patientName or valid patientId/uhid', 422, { field: 'patientName' });
    }

    const diagCheck = validateRequiredString(diagnosis, 'diagnosis', 2, 500);
    if (!diagCheck.isValid) {
      return apiError('Field "diagnosis" is required and must be at least 2 characters long.', 422, { field: 'diagnosis' });
    }

    const effectiveDoctorId = authResult.userId || (reqDoctorId ? parseInt(reqDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Medical Specialist');
    const branchId = doctor ? doctor.branchId : (reqBranchId ? parseInt(reqBranchId, 10) : 1);

    // Parse medicines: accept items, medications, array of PrescriptionItem, or freeform text
    const candidateMedList = (Array.isArray(items) && items.length > 0)
      ? items
      : (Array.isArray(medications) && medications.length > 0)
      ? medications
      : medicines;
    let parsedMedicines: PrescriptionItem[] = [];

    if (Array.isArray(candidateMedList) && candidateMedList.length > 0) {
      parsedMedicines = candidateMedList.map((m: any) => ({
        name: String(m.name || m.medicineName || 'Prescribed Medication').trim(),
        medicineName: String(m.medicineName || m.name || 'Prescribed Medication').trim(),
        category: m.category ? String(m.category).trim() : undefined,
        dosage: m.dosage ? String(m.dosage).trim() : 'Standard Dosage',
        frequency: m.frequency ? String(m.frequency).trim() : 'Once Daily',
        duration: m.duration ? String(m.duration).trim() : '7 Days',
        durationDays: m.durationDays ? parseInt(String(m.durationDays), 10) : (typeof m.duration === 'number' ? m.duration : 7),
        instructions: m.instructions ? String(m.instructions).trim() : 'As advised',
      })).filter((m) => m.name.length > 0);
    } else if (typeof medication === 'string' && medication.trim()) {
      parsedMedicines = medication.split(/[\n,]+/).map((item: string) => ({
        name: item.trim(),
        medicineName: item.trim(),
        dosage: 'As prescribed',
        frequency: 'Daily',
        duration: '14 Days',
        durationDays: 14,
      })).filter((m) => m.name.length > 0);
    } else if (typeof medicines === 'string' && medicines.trim()) {
      parsedMedicines = medicines.split(/[\n,]+/).map((item: string) => ({
        name: item.trim(),
        medicineName: item.trim(),
        dosage: 'As prescribed',
        frequency: 'Daily',
        duration: '14 Days',
        durationDays: 14,
      })).filter((m) => m.name.length > 0);
    } else {
      return apiError('Missing required field: medicines list or medication description', 422, {
        field: 'medicines',
      });
    }

    if (parsedMedicines.length === 0) {
      return apiError('At least one valid medicine item is required in the prescription.', 422, {
        field: 'medicines',
      });
    }

    let parsedAge = 45;
    if (finalAge !== undefined && finalAge !== null) {
      const a = typeof finalAge === 'number' ? finalAge : parseInt(String(finalAge), 10);
      if (!isNaN(a) && a >= 0 && a <= 125) {
        parsedAge = a;
      }
    }

    // Deterministically get or create the registered patient entity
    const patientEntity = backendStore.getOrCreatePatient({
      name: finalPatientName.trim(),
      uhid: finalUhid ? String(finalUhid).trim() : undefined,
      phone: patientPhone ? String(patientPhone).trim() : undefined,
      age: parsedAge,
      gender: finalGender ? String(finalGender).trim() : 'Unspecified',
      branchId,
      condition: diagnosis.trim(),
    });

    const newPrescription = backendStore.createPrescription({
      appointmentId: appointmentId ? parseInt(String(appointmentId), 10) : undefined,
      patientId: patientEntity.id,
      uhid: patientEntity.uhid,
      patientName: patientEntity.name,
      patientAge: patientEntity.age,
      patientGender: patientEntity.gender,
      doctorId: effectiveDoctorId,
      doctorName,
      branchId,
      diagnosis: diagnosis.trim(),
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : undefined,
      medicines: parsedMedicines,
      advice: advice ? String(advice).trim() : 'Follow prescribed course and maintain hydration.',
      followUpDate: followUpDate ? String(followUpDate).trim() : undefined,
    });

    // If linked to an appointment, mark appointment completed
    if (appointmentId) {
      backendStore.updateAppointmentStatus(parseInt(String(appointmentId), 10), 'Completed');
    }

    return apiSuccess(newPrescription, {
      status: 201,
      message: `Prescription #${newPrescription.prescriptionNumber} successfully generated for ${patientEntity.name}`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/prescriptions POST', err);
  }
}

