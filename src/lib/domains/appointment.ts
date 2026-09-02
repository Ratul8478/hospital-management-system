/**
 * Appointment & Queue Management Domain
 *
 * Handles appointment scheduling, today's queue, status updates.
 */

import type { RepositoryState, DoctorAppointment } from './types';
import { TODAY_STR } from './seed-data';

export function getAppointments(
  state: RepositoryState,
  filter?: {
    doctorId?: number;
    branchId?: number;
    date?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }
): {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  appointments: DoctorAppointment[];
} {
  let list = [...state.appointments];

  if (filter?.doctorId !== undefined) {
    list = list.filter((a) => a.doctorId === filter.doctorId);
  }
  if (filter?.branchId !== undefined) {
    list = list.filter((a) => a.branchId === filter.branchId);
  }
  if (filter?.date) {
    list = list.filter((a) => a.appointmentDate === filter.date);
  }
  if (filter?.status && filter.status !== 'ALL') {
    const normStatus = filter.status.toLowerCase();
    list = list.filter((a) => a.status.toLowerCase() === normStatus);
  }
  if (filter?.type && filter.type !== 'ALL') {
    const normType = filter.type.toLowerCase();
    list = list.filter((a) => a.type.toLowerCase() === normType);
  }

  const total = list.length;
  const page = filter?.page || 1;
  const limit = filter?.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    appointments: paginated,
  };
}

export function getTodayAppointments(
  state: RepositoryState,
  doctorId?: number,
  branchId?: number,
  status?: string
): DoctorAppointment[] {
  let list = state.appointments.filter((a) => a.appointmentDate === TODAY_STR);

  if (doctorId !== undefined) {
    list = list.filter((a) => a.doctorId === doctorId);
  }
  if (branchId !== undefined) {
    list = list.filter((a) => a.branchId === branchId);
  }
  if (status && status !== 'ALL') {
    list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }

  return list;
}

export function getAppointmentById(state: RepositoryState, id: number): DoctorAppointment | undefined {
  return state.appointments.find((a) => a.id === id);
}

export function addAppointment(
  state: RepositoryState,
  data: Omit<DoctorAppointment, 'id' | 'tokenNumber'> & { tokenNumber?: number }
): DoctorAppointment {
  const nextId = Math.max(...state.appointments.map((a) => a.id), 0) + 1;
  const todayCount = state.appointments.filter(
    (a) => a.appointmentDate === (data.appointmentDate || TODAY_STR)
  ).length;
  const token = data.tokenNumber || todayCount + 10;

  const newAppt: DoctorAppointment = {
    ...data,
    id: nextId,
    tokenNumber: token,
    appointmentDate: data.appointmentDate || TODAY_STR,
    status: data.status || 'Waiting',
  };

  state.appointments.push(newAppt);
  return newAppt;
}

export function updateAppointmentStatus(
  state: RepositoryState,
  id: number,
  status: DoctorAppointment['status'],
  notes?: string
): DoctorAppointment | null {
  const target = state.appointments.find((a) => a.id === id);
  if (!target) return null;

  target.status = status;
  if (notes) {
    target.notes = notes;
  }
  return target;
}

export function callPatient(
  state: RepositoryState,
  appointmentId: number
): {
  appointmentId: number;
  tokenNumber: number;
  patientName: string;
  room: string;
  broadcastTimestamp: string;
} | null {
  const appt = state.appointments.find((a) => a.id === appointmentId);
  if (!appt) return null;

  appt.status = 'In Consultation';
  return {
    appointmentId: appt.id,
    tokenNumber: appt.tokenNumber,
    patientName: appt.patientName,
    room: appt.consultationRoom || 'OPD-302',
    broadcastTimestamp: new Date().toISOString(),
  };
}
