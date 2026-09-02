/**
 * Doctor Management Domain
 *
 * Handles doctor CRUD, profile queries, earnings calculations,
 * and leave management.
 */

import type { RepositoryState, DoctorUser, LeaveRequest } from './types';
import { ROLE_PERMISSIONS } from './types';
import {
  DEFAULT_DOCTOR_PERMISSIONS,
  DEFAULT_DOCTOR_PASSWORD_HASH,
  TODAY_STR,
} from './seed-data';
import { hashPassword } from '../security';

// ==========================================
// DOCTOR CRUD
// ==========================================

export function getDoctorById(state: RepositoryState, id: number): DoctorUser | undefined {
  let doc = state.doctors.find((d) => d.id === id);
  if (!doc) {
    const user = state.users.find((u) => u.id === id && u.role === 'doctor');
    if (user) {
      const branch = state.branches.find((b) => b.id === user.branchId) || state.branches[0];
      const details = user.details || {};
      doc = {
        id: user.id,
        branchId: user.branchId,
        branchCode: user.branchCode,
        branchName: user.branchName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
        specialty: details.specialty || 'General Medicine',
        department: details.department || details.specialty || 'General Medicine',
        qualification: details.qualification || 'MBBS, MD',
        registrationNumber: details.registrationNumber || `WB-MED-${user.id}-2026`,
        fee: details.consultFee || details.fee || 800,
        status: 'available',
        role: 'doctor',
        permissions: [...(user.permissions || DEFAULT_DOCTOR_PERMISSIONS)],
        avatarUrl: details.avatarUrl || '',
        experienceYears: details.experienceYears || 8,
        rating: 5.0,
        totalPatientsTreated: 1200,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        shiftTiming: '09:00 AM - 05:00 PM',
        chamberRoom: details.chamberAddress || `OPD-${200 + user.id}`,
      };
      state.doctors.push(doc);
    }
  }
  return doc;
}

export function getAllDoctors(state: RepositoryState, branchId?: number): DoctorUser[] {
  if (branchId) {
    return state.doctors.filter((d) => d.branchId === branchId);
  }
  return state.doctors;
}

export function getDoctorsByBranch(state: RepositoryState, branchId: number): DoctorUser[] {
  return state.doctors.filter((d) => d.branchId === branchId);
}

export function getDoctorProfile(state: RepositoryState, doctorId: number): DoctorUser | null {
  const doc = getDoctorById(state, doctorId);
  if (!doc) return null;

  const docAppts = state.appointments.filter((a) => a.doctorId === doctorId);
  const activeConsultations = docAppts.filter((a) => a.status === 'In Consultation').length;

  return {
    ...doc,
    activeConsultations: activeConsultations || 0,
    totalPatientsTreated: (doc.totalPatientsTreated || 1000) + docAppts.filter((a) => a.status === 'Completed').length,
  } as any;
}

export function updateDoctorStatus(
  state: RepositoryState,
  doctorId: number,
  status: 'available' | 'busy' | 'off-duty' | string,
  reason?: string
): { doctorId: number; status: string; updatedAt: string } | null {
  const doc = getDoctorById(state, doctorId);
  if (!doc) return null;

  const normStatus =
    status.toLowerCase() === 'busy'
      ? 'busy'
      : status.toLowerCase() === 'off_duty' || status.toLowerCase() === 'off-duty'
      ? 'off-duty'
      : 'available';
  doc.status = normStatus;

  return {
    doctorId: doc.id,
    status: normStatus.toUpperCase(),
    updatedAt: new Date().toISOString(),
  };
}

export function registerDoctor(
  state: RepositoryState,
  data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    specialty?: string;
    department?: string;
    qualification?: string;
    chamberAddress?: string;
    pincode?: string;
    district?: string;
    state?: string;
    referenceId?: string;
    branchId?: number;
    fee?: number;
  }
): DoctorUser {
  const nextId = Math.max(...state.doctors.map((d) => d.id), 0) + 1;
  const branch = state.branches.find((b) => b.id === data.branchId) || state.branches[0];

  const newDoctor: DoctorUser = {
    id: nextId,
    branchId: branch.id,
    branchCode: branch.code,
    branchName: branch.name,
    name: data.name,
    email: data.email,
    phone: data.phone || '+91 98042 22142',
    passwordHash: data.password ? hashPassword(data.password) : DEFAULT_DOCTOR_PASSWORD_HASH,
    specialty: data.specialty || 'General Practitioner',
    department: data.department || 'General Medicine',
    qualification: data.qualification || 'MBBS, MD',
    registrationNumber: `WB-MED-${nextId}-2026`,
    fee: data.fee || 700,
    status: 'available',
    role: 'doctor',
    permissions: [...DEFAULT_DOCTOR_PERMISSIONS],
    avatarUrl: '',
    chamberRoom: data.chamberAddress || `OPD-${200 + nextId}`,
    experienceYears: 5,
    rating: 5.0,
    totalPatientsTreated: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    shiftTiming: '09:00 AM - 05:00 PM',
  };

  state.doctors.push(newDoctor);
  return newDoctor;
}

// ==========================================
// EARNINGS CALCULATION
// ==========================================

export function getDoctorEarnings(state: RepositoryState, doctorId: number) {
  const doctor = getDoctorById(state, doctorId);
  if (!doctor) {
    return null;
  }
  const fee = doctor.fee || 700;

  const docAppts = state.appointments.filter((a) => a.doctorId === doctorId);
  const todayAppts = docAppts.filter((a) => a.appointmentDate === TODAY_STR);

  const completedToday = todayAppts.filter((a) => a.status === 'Completed').length;
  const inConsultationToday = todayAppts.filter((a) => a.status === 'In Consultation').length;
  const waitingToday = todayAppts.filter((a) => a.status === 'Waiting').length;

  const todayConsultations = todayAppts.length;
  const todayEarnings = (completedToday + inConsultationToday) * fee;

  // Month calculation
  const currentYearMonth = TODAY_STR.substring(0, 7);
  const monthAppts = docAppts.filter((a) => a.appointmentDate && a.appointmentDate.startsWith(currentYearMonth));
  const completedMonth = monthAppts.filter((a) => a.status === 'Completed').length;
  const monthEarnings = completedMonth * fee;

  // Total lifetime calculation
  const totalCompleted = docAppts.filter((a) => a.status === 'Completed').length;
  const totalConsultations = docAppts.length;
  const totalEarnings = (doctor.totalPatientsTreated || totalCompleted) * fee;
  const pendingPayout = (waitingToday + inConsultationToday) * fee;

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    fee: fee,
    ratePerConsultation: fee,
    todayConsultations,
    todayEarnings,
    monthConsultations: monthAppts.length,
    monthEarnings,
    totalConsultations,
    totalEarnings,
    pendingPayout,
    currency: 'INR',
    currencySymbol: '₹',
    metrics: {
      today: {
        amount: todayEarnings,
        consultationsCount: todayConsultations,
        completedCount: completedToday,
        pendingCount: waitingToday + inConsultationToday,
      },
      thisWeek: {
        amount: todayEarnings * 5,
        consultationsCount: todayConsultations * 5,
      },
      thisMonth: {
        amount: monthEarnings || todayEarnings * 20,
        consultationsCount: monthAppts.length || todayConsultations * 20,
      },
      totalYear: {
        amount: totalEarnings,
        consultationsCount: totalConsultations,
      },
    },
    breakdownByService: [
      {
        service: 'OPD Clinical Consultations',
        count: totalCompleted || 1,
        rate: fee,
        total: (totalCompleted || 1) * fee,
      },
    ],
    recentTransactions: docAppts.slice(0, 10).map((a, i) => ({
      id: `TXN-${100 + i}`,
      patient: a.patientName,
      uhid: a.uhid,
      service: 'OPD Consultation',
      amount: fee,
      date: `${a.appointmentDate} ${a.appointmentTime}`,
      status: a.status === 'Completed' ? 'settled' : 'pending',
    })),
  };
}

// ==========================================
// LEAVE MANAGEMENT
// ==========================================

export function getDoctorLeave(state: RepositoryState, doctorId: number = 1) {
  const requests = state.leaveRequests.filter((l) => l.doctorId === doctorId);
  const usedDays = requests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.totalDays, 0);
  const totalAnnualAllowance = 24;
  const availableDays = Math.max(totalAnnualAllowance - usedDays, 0);

  return {
    doctorId,
    dutyStatus: 'On Active Shift',
    annualLeaveAllowance: totalAnnualAllowance,
    usedLeaves: usedDays,
    availableLeaves: availableDays,
    pendingRequestsCount: requests.filter((r) => r.status === 'pending').length,
    leaveHistory: requests,
  };
}

export function createLeaveRequest(
  state: RepositoryState,
  data: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'> & { status?: LeaveRequest['status'] }
): LeaveRequest {
  const nextId = Math.max(...state.leaveRequests.map((l) => l.id), 0) + 1;
  const newReq: LeaveRequest = {
    ...data,
    id: nextId,
    status: data.status || 'pending',
    appliedAt: TODAY_STR,
  };

  state.leaveRequests.unshift(newReq);
  return newReq;
}
