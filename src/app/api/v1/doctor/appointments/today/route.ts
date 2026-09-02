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
    const branchIdParam = searchParams.get('branchId');
    const statusParam = searchParams.get('status');

    const parsedDoctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : undefined;
    const scopeCheck = resolveDoctorScope(authResult, parsedDoctorId);
    if (scopeCheck.error) {
      return apiError(scopeCheck.error.message, scopeCheck.error.statusCode);
    }

    const doctorId = scopeCheck.doctorId !== undefined ? scopeCheck.doctorId : (authResult.userId || undefined);
    const branchId = branchIdParam ? parseInt(branchIdParam, 10) : undefined;
    const status = statusParam || undefined;

    const appointments = backendStore.getTodayAppointments(doctorId, branchId, status);
    
    // Sort by token number ascending
    const sortedQueue = [...appointments].sort((a, b) => a.tokenNumber - b.tokenNumber);

    const stats = {
      total: sortedQueue.length,
      waiting: sortedQueue.filter((a) => a.status === 'Waiting').length,
      inConsultation: sortedQueue.filter((a) => a.status === 'In Consultation').length,
      completed: sortedQueue.filter((a) => a.status === 'Completed').length,
      scheduled: sortedQueue.filter((a) => a.status === 'Scheduled').length,
    };

    const activeToken = sortedQueue.find((a) => a.status === 'In Consultation')?.tokenNumber 
      || sortedQueue.find((a) => a.status === 'Waiting')?.tokenNumber 
      || sortedQueue[0]?.tokenNumber 
      || 10;

    return apiSuccess(
      {
        date: new Date().toISOString().split('T')[0],
        activeToken,
        stats,
        queue: sortedQueue,
      },
      {
        status: 200,
        message: "Today's doctor appointment queue retrieved successfully.",
        meta: { total: sortedQueue.length },
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/appointments/today', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session required', authResult.statusCode || 401);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(body);
    if (threatCheck.isSuspicious) {
      return apiError('Malicious input sequence detected and blocked by security firewall', 400);
    }

    const sanitizedBody = sanitizeObject(body);
    const {
      patientName,
      uhid,
      patientAge,
      patientGender,
      patientPhone,
      doctorId: reqDoctorId,
      department,
      appointmentTime,
      type,
      notes,
    } = sanitizedBody;

    if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
      return apiError('Field "patientName" is required and must be at least 2 characters long.', 422, { field: 'patientName' });
    }
    if (patientName.trim().length > 100) {
      return apiError('Field "patientName" must not exceed 100 characters.', 422, { field: 'patientName' });
    }

    let parsedAge = 40;
    if (patientAge !== undefined && patientAge !== null) {
      parsedAge = typeof patientAge === 'number' ? patientAge : parseInt(String(patientAge), 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 125) {
        return apiError('Field "patientAge" must be a valid age between 0 and 125.', 422, { field: 'patientAge' });
      }
    }

    const validGenders = ['male', 'female', 'other', 'unspecified'];
    const normGender = patientGender ? String(patientGender).trim().toLowerCase() : 'unspecified';
    if (patientGender && !validGenders.includes(normGender)) {
      return apiError('Field "patientGender" must be one of: Male, Female, Other, Unspecified.', 422, { field: 'patientGender' });
    }
    const formattedGender = normGender.charAt(0).toUpperCase() + normGender.slice(1);

    const validTypes = ['opd', 'emergency', 'follow-up', 'followup', 'routine checkup', 'specialist consultation'];
    const normType = type ? String(type).trim().toLowerCase() : 'opd';
    if (type && !validTypes.includes(normType)) {
      return apiError('Field "type" must be a valid appointment type.', 422, { field: 'type' });
    }
    const mappedType: 'OPD' | 'Follow-up' | 'Emergency' | 'Consultation' = 
      normType.includes('follow') ? 'Follow-up' :
      normType.includes('emerg') ? 'Emergency' :
      normType.includes('consult') ? 'Consultation' : 'OPD';

    const effectiveDoctorId = authResult.userId || (reqDoctorId ? parseInt(reqDoctorId, 10) : 1);
    const doctor = backendStore.getDoctorById(effectiveDoctorId);
    const doctorName = doctor ? doctor.name : (authResult.userName || 'Medical Specialist');
    const doctorDepartment = doctor ? doctor.department : (department || 'General Medicine');
    const branchId = doctor ? doctor.branchId : (sanitizedBody.branchId ? parseInt(sanitizedBody.branchId, 10) : 1);

    // Deterministically get or create the registered patient entity
    const patientEntity = backendStore.getOrCreatePatient({
      name: patientName.trim(),
      uhid: uhid ? String(uhid).trim() : undefined,
      phone: patientPhone ? String(patientPhone).trim() : undefined,
      age: parsedAge,
      gender: formattedGender,
      branchId,
      condition: `${mappedType} Consultation`,
    });

    const todayStr = new Date().toISOString().split('T')[0];

    const newAppt = backendStore.addAppointment({
      branchId,
      patientId: patientEntity.id,
      patientName: patientEntity.name,
      uhid: patientEntity.uhid,
      patientAge: patientEntity.age,
      patientGender: patientEntity.gender,
      patientPhone: patientEntity.phone,
      doctorId: effectiveDoctorId,
      doctorName,
      department: doctorDepartment,
      appointmentDate: todayStr,
      appointmentTime: appointmentTime ? String(appointmentTime).trim() : '11:30 AM',
      type: mappedType,
      status: 'Waiting',
      notes: notes ? String(notes).trim() : undefined,
    });

    return apiSuccess(newAppt, {
      status: 201,
      message: `New OPD appointment scheduled successfully for ${patientEntity.name} (Token #${newAppt.tokenNumber}).`,
    });
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/appointments/today POST', err);
  }
}
