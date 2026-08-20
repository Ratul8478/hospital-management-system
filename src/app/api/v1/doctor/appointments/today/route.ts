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
    const branchIdParam = searchParams.get('branchId');
    const statusParam = searchParams.get('status');

    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : 99;
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
    console.error('Error in /api/v1/doctor/appointments/today GET:', err);
    return apiError(err?.message || "Failed to fetch today's appointments", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const {
      patientName,
      uhid,
      patientAge,
      patientGender,
      patientPhone,
      doctorId,
      doctorName,
      department,
      appointmentTime,
      type,
      notes,
    } = body;

    if (!patientName) {
      return apiError('Missing required field: patientName', 422, { field: 'patientName' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const generatedUhid = uhid || `UHID-${todayStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = backendStore.addAppointment({
      branchId: body.branchId || 1,
      patientId: body.patientId || Math.floor(100 + Math.random() * 900),
      patientName,
      uhid: generatedUhid,
      patientAge: patientAge || 40,
      patientGender: patientGender || 'Unspecified',
      patientPhone: patientPhone || '9804222142',
      doctorId: doctorId || 1,
      doctorName: doctorName || 'Dr . Jiarul Haque',
      department: department || 'General Medicine',
      appointmentDate: todayStr,
      appointmentTime: appointmentTime || '11:30 AM',
      type: type || 'OPD',
      status: 'Waiting',
      notes,
    });

    return apiSuccess(newAppt, {
      status: 201,
      message: `Appointment scheduled for ${patientName} with Token #${newAppt.tokenNumber}`,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/doctor/appointments/today POST:', err);
    return apiError(err?.message || 'Failed to create new appointment', 500);
  }
}
