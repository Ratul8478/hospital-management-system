/**
 * Clinical Domain
 *
 * Handles prescriptions, diagnostic reports, lab orders,
 * IPD admissions, and follow-up scheduling.
 */

import type {
  RepositoryState,
  Prescription,
  DiagnosticReport,
  LabOrderRequest,
  IPDAdmission,
  FollowUpSchedule,
} from './types';
import { TODAY_STR } from './seed-data';

// ==========================================
// PRESCRIPTIONS
// ==========================================

export function getPrescriptions(
  state: RepositoryState,
  filter?: {
    doctorId?: number;
    patientId?: number;
    uhid?: string;
    search?: string;
  }
): Prescription[] {
  let list = [...state.prescriptions];

  if (filter?.doctorId !== undefined) {
    list = list.filter((p) => p.doctorId === filter.doctorId);
  }
  if (filter?.patientId !== undefined) {
    list = list.filter((p) => p.patientId === filter.patientId);
  }
  if (filter?.uhid) {
    const cleanUhid = filter.uhid.toLowerCase();
    list = list.filter((p) => p.uhid.toLowerCase() === cleanUhid);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        p.prescriptionNumber.toLowerCase().includes(q)
    );
  }

  return list;
}

export function createPrescription(
  state: RepositoryState,
  data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt' | 'status'> & {
    status?: Prescription['status'];
  }
): Prescription {
  const nextId = Math.max(...state.prescriptions.map((p) => p.id), 0) + 1;
  const rxNumber = `RX-${new Date().getFullYear()}-${1000 + nextId}`;

  const newRx: Prescription = {
    ...data,
    id: nextId,
    prescriptionNumber: rxNumber,
    createdAt: TODAY_STR,
    issuedAt: new Date().toISOString(),
    status: data.status || 'active',
    pharmacySyncStatus: 'QUEUED_FOR_DISPENSING',
  };

  state.prescriptions.unshift(newRx);
  return newRx;
}

// ==========================================
// DIAGNOSTIC & LAB REPORTS
// ==========================================

export function getReports(
  state: RepositoryState,
  filter?: {
    doctorId?: number;
    patientId?: number;
    uhid?: string;
    category?: string;
    status?: string;
  }
): DiagnosticReport[] {
  let list = [...state.reports];

  if (filter?.doctorId !== undefined) {
    list = list.filter((r) => r.doctorId === filter.doctorId);
  }
  if (filter?.patientId !== undefined) {
    list = list.filter((r) => r.patientId === filter.patientId);
  }
  if (filter?.uhid) {
    const cleanUhid = filter.uhid.toLowerCase();
    list = list.filter((r) => r.uhid.toLowerCase() === cleanUhid);
  }
  if (filter?.category && filter.category !== 'all') {
    list = list.filter((r) => r.category.toLowerCase() === filter.category!.toLowerCase());
  }
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((r) => r.status.toLowerCase() === filter.status!.toLowerCase());
  }

  return list;
}

export function createLabOrder(
  state: RepositoryState,
  data: {
    patientId?: number;
    uhid: string;
    appointmentId?: number;
    doctorId: number;
    doctorName: string;
    branchId: number;
    testNames: string[];
    priority?: 'ROUTINE' | 'URGENT' | 'STAT';
    clinicalIndication?: string;
  }
): LabOrderRequest {
  const nextId = Math.max(...state.reports.map((o) => o.id), 0) + 1;
  const orderNumber = `LAB-REQ-${new Date().getFullYear()}-${1000 + nextId}`;

  const newOrder: LabOrderRequest = {
    id: nextId,
    orderNumber,
    patientId: data.patientId || 401,
    uhid: data.uhid,
    appointmentId: data.appointmentId,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    branchId: data.branchId,
    testNames: data.testNames,
    priority: data.priority || 'ROUTINE',
    clinicalIndication: data.clinicalIndication,
    status: 'PENDING_SAMPLE_COLLECTION',
    createdAt: new Date().toISOString(),
  };

  return newOrder;
}

// ==========================================
// IPD ADMISSIONS
// ==========================================

export function getAdmissions(
  state: RepositoryState,
  filter?: {
    doctorId?: number;
    branchId?: number;
    wardType?: string;
    status?: string;
  }
): IPDAdmission[] {
  let list = [...state.admissions];

  if (filter?.doctorId !== undefined) {
    list = list.filter((a) => a.doctorId === filter.doctorId);
  }
  if (filter?.branchId !== undefined) {
    list = list.filter((a) => a.branchId === filter.branchId);
  }
  if (filter?.wardType && filter.wardType !== 'all') {
    list = list.filter((a) => a.wardType.toLowerCase() === filter.wardType!.toLowerCase());
  }
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((a) => a.status.toLowerCase() === filter.status!.toLowerCase());
  }

  return list;
}

// ==========================================
// FOLLOW-UPS
// ==========================================

export function getFollowUps(
  state: RepositoryState,
  filter?: {
    doctorId?: number;
    date?: string;
    status?: string;
  }
): FollowUpSchedule[] {
  let list = [...state.followups];

  if (filter?.doctorId !== undefined) {
    list = list.filter((f) => f.doctorId === filter.doctorId);
  }
  if (filter?.date) {
    list = list.filter((f) => f.scheduledDate === filter.date);
  }
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((f) => f.status.toLowerCase() === filter.status!.toLowerCase());
  }

  return list;
}

export function createFollowUp(
  state: RepositoryState,
  data: Omit<FollowUpSchedule, 'id' | 'createdAt' | 'status'> & {
    status?: FollowUpSchedule['status'];
  }
): FollowUpSchedule {
  const nextId = Math.max(...state.followups.map((f) => f.id), 0) + 1;
  const newFollowup: FollowUpSchedule = {
    ...data,
    id: nextId,
    status: data.status || 'scheduled',
    createdAt: TODAY_STR,
  };

  state.followups.unshift(newFollowup);
  return newFollowup;
}
