import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { backendStore, PrescriptionItem } from '@/lib/backend-store';
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
    const patientIdParam = searchParams.get('patientId');
    const uhid = searchParams.get('uhid') || undefined;
    const search = searchParams.get('search') || undefined;

    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
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
    console.error('Error in /api/v1/doctor/prescriptions GET:', err);
    return apiError(err?.message || 'Failed to fetch prescriptions', 500);
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
      appointmentId,
      patientId,
      uhid,
      patientName,
      patientAge,
      patientGender,
      doctorId,
      doctorName,
      branchId,
      diagnosis,
      symptoms,
      medicines,
      medication, // Support freeform string field from quick modals
      advice,
      followUpDate,
    } = sanitizedBody || {};

    if (!patientName || typeof patientName !== 'string') {
      return apiError('Missing required field: patientName', 422, { field: 'patientName' });
    }

    if (!diagnosis || typeof diagnosis !== 'string') {
      return apiError('Missing required field: diagnosis', 422, { field: 'diagnosis' });
    }

    // Parse medicines: accept either array of PrescriptionItem or freeform text
    let parsedMedicines: PrescriptionItem[] = [];

    if (Array.isArray(medicines) && medicines.length > 0) {
      parsedMedicines = medicines.map((m: any) => ({
        name: m.name || 'Prescribed Medication',
        category: m.category,
        dosage: m.dosage || 'Standard Dosage',
        frequency: m.frequency || 'Once Daily',
        duration: m.duration || '7 Days',
        instructions: m.instructions || 'As advised',
      }));
    } else if (typeof medication === 'string' && medication.trim()) {
      // Split comma separated or multiline medications
      parsedMedicines = medication.split(/[\n,]+/).map((item: string) => ({
        name: item.trim(),
        dosage: 'As prescribed',
        frequency: 'Daily',
        duration: '14 Days',
      })).filter((m: { name: string }) => m.name.length > 0);
    } else if (typeof medicines === 'string' && medicines.trim()) {
      parsedMedicines = medicines.split(/[\n,]+/).map((item: string) => ({
        name: item.trim(),
        dosage: 'As prescribed',
        frequency: 'Daily',
        duration: '14 Days',
      })).filter((m: { name: string }) => m.name.length > 0);
    } else {
      return apiError('Missing required field: medicines list or medication description', 422, {
        field: 'medicines',
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const generatedUhid = uhid || `UHID-${todayStr.replace(/-/g, '')}-${crypto.randomInt(1000, 10000)}`;

    const newPrescription = backendStore.createPrescription({
      appointmentId: appointmentId ? parseInt(appointmentId, 10) : undefined,
      patientId: patientId ? parseInt(patientId, 10) : crypto.randomInt(100, 1000),
      uhid: generatedUhid,
      patientName,
      patientAge: patientAge || 45,
      patientGender: patientGender || 'Unspecified',
      doctorId: doctorId ? parseInt(doctorId, 10) : 1,
      doctorName: doctorName || 'Dr . Jiarul Haque',
      branchId: branchId ? parseInt(branchId, 10) : 1,
      diagnosis,
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : undefined,
      medicines: parsedMedicines,
      advice: advice || 'Follow prescribed course and maintain hydration.',
      followUpDate: followUpDate || undefined,
    });

    // If linked to an appointment, mark appointment completed
    if (appointmentId) {
      backendStore.updateAppointmentStatus(parseInt(appointmentId, 10), 'Completed');
    }

    return apiSuccess(newPrescription, {
      status: 201,
      message: `Prescription #${newPrescription.prescriptionNumber} successfully generated for ${patientName}`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/prescriptions POST:', err);
    return apiError(err?.message || 'Failed to generate prescription', 500);
  }
}
