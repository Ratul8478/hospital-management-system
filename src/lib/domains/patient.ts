/**
 * Patient Management & EHR Domain
 *
 * Handles patient registration, search, vitals recording,
 * clinical timeline, and longitudinal health records.
 */

import type {
  RepositoryState,
  PatientRecord,
  PatientVitalsRecord,
} from './types';
import { DEFAULT_SEED_PATIENTS, TODAY_STR } from './seed-data';

// ==========================================
// PATIENT CRUD
// ==========================================

export function ensureDefaultPatients(state: RepositoryState): void {
  state.patients = state.patients || [];
  for (const dp of DEFAULT_SEED_PATIENTS) {
    if (!state.patients.some((p) => p.uhid.toLowerCase() === dp.uhid.toLowerCase())) {
      state.patients.push(dp);
    }
  }
}

export function getPatients(state: RepositoryState): PatientRecord[] {
  ensureDefaultPatients(state);
  return [...state.patients];
}

export function searchPatients(
  state: RepositoryState,
  query?: string,
  branchId?: number,
  page: number = 1,
  limit: number = 20
) {
  ensureDefaultPatients(state);
  let filtered = state.patients;

  if (branchId) {
    filtered = filtered.filter((p) => p.branchId === branchId);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
        p.condition.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    patients: paginated,
  };
}

export function addPatient(
  state: RepositoryState,
  data: {
    branchId: number;
    uhid: string;
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    phone: string;
    email?: string;
    condition: string;
    address?: string;
    allergies?: string[];
    chronicConditions?: string[];
  }
): PatientRecord {
  const nextId = Math.max(...state.patients.map((p) => p.id), 0) + 1;
  const newPatient: PatientRecord = {
    id: nextId,
    branchId: data.branchId || 1,
    uhid: data.uhid,
    name: data.name,
    age: data.age,
    gender: data.gender,
    bloodGroup: data.bloodGroup,
    phone: data.phone,
    email: data.email,
    condition: data.condition,
    status: 'opd',
    address: data.address,
    allergies: data.allergies || ['None documented'],
    chronicConditions: data.chronicConditions || ['None'],
    registeredDate: TODAY_STR,
  };
  state.patients.unshift(newPatient);
  return newPatient;
}

export function getPatientByIdOrUhid(
  state: RepositoryState,
  idOrUhid: string | number
): PatientRecord | undefined {
  ensureDefaultPatients(state);
  const idNum = typeof idOrUhid === 'number' ? idOrUhid : parseInt(idOrUhid, 10);
  if (!isNaN(idNum)) {
    const match = state.patients.find((p) => p.id === idNum);
    if (match) return match;
  }
  const uhidStr = String(idOrUhid).toLowerCase();
  return state.patients.find((p) => p.uhid.toLowerCase() === uhidStr);
}

export function getOrCreatePatient(
  state: RepositoryState,
  data: {
    name: string;
    uhid?: string;
    phone?: string;
    age?: number;
    gender?: string;
    branchId?: number;
    condition?: string;
  }
): PatientRecord {
  ensureDefaultPatients(state);
  if (data.uhid) {
    const existing = getPatientByIdOrUhid(state, data.uhid);
    if (existing) return existing;
  }
  if (data.name && data.phone) {
    const cleanPhone = String(data.phone).trim();
    const match = state.patients.find(
      (p) => p.name.toLowerCase() === data.name.trim().toLowerCase() && p.phone === cleanPhone
    );
    if (match) return match;
  }
  const nextId = Math.max(...state.patients.map((p) => p.id), 0) + 1;
  const branchId = data.branchId || 1;
  const dateFormatted = TODAY_STR.replace(/-/g, '');
  const uhid = data.uhid || `UHID-B${branchId}-${dateFormatted}-${String(nextId).padStart(4, '0')}`;
  const newPatient: PatientRecord = {
    id: nextId,
    branchId,
    uhid,
    name: data.name.trim(),
    age: data.age || 35,
    gender: data.gender || 'Unspecified',
    bloodGroup: 'Unknown',
    phone: data.phone ? data.phone.trim() : '+91 98042 22142',
    condition: data.condition || 'OPD Consultation',
    status: 'opd',
    allergies: ['None documented'],
    chronicConditions: ['None'],
    registeredDate: TODAY_STR,
  };
  state.patients.unshift(newPatient);
  return newPatient;
}

// ==========================================
// VITALS
// ==========================================

export function recordPatientVitals(
  state: RepositoryState,
  uhid: string,
  vitals: {
    bpSystolic: number;
    bpDiastolic: number;
    heartRateBpm: number;
    temperatureCelsius: number;
    spO2Percentage: number;
    respiratoryRateBpm?: number;
    weightKg?: number;
    heightCm?: number;
    bloodSugarMgDl?: number;
    notes?: string;
  },
  recordedBy?: string
): PatientVitalsRecord | null {
  const patient = getPatientByIdOrUhid(state, uhid);
  if (!patient) return null;

  let bmi: number | undefined;
  if (vitals.weightKg && vitals.heightCm && vitals.heightCm > 0) {
    const heightM = vitals.heightCm / 100;
    bmi = parseFloat((vitals.weightKg / (heightM * heightM)).toFixed(2));
  }
  const isAbnormal =
    vitals.bpSystolic > 140 ||
    vitals.bpDiastolic > 90 ||
    vitals.heartRateBpm > 100 ||
    vitals.spO2Percentage < 95;

  const currentVitals = Array.isArray(state.patientVitals) ? state.patientVitals : (state.patientVitals = []);
  const nextId = currentVitals.length > 0 ? Math.max(...currentVitals.map((v) => v.id)) + 1 : 1;
  const record: PatientVitalsRecord = {
    id: nextId,
    patientId: patient.id,
    uhid: patient.uhid,
    bpSystolic: vitals.bpSystolic,
    bpDiastolic: vitals.bpDiastolic,
    heartRateBpm: vitals.heartRateBpm,
    temperatureCelsius: vitals.temperatureCelsius,
    spO2Percentage: vitals.spO2Percentage,
    respiratoryRateBpm: vitals.respiratoryRateBpm,
    weightKg: vitals.weightKg,
    heightCm: vitals.heightCm,
    bloodSugarMgDl: vitals.bloodSugarMgDl,
    bmi,
    isAbnormal,
    notes: vitals.notes,
    recordedAt: new Date().toISOString(),
    recordedBy: recordedBy || 'Hospital Medical Staff',
  };

  currentVitals.unshift(record);
  return record;
}

export function getPatientVitals(state: RepositoryState, uhid: string): PatientVitalsRecord[] {
  const cleanUhid = uhid.toLowerCase();
  const currentVitals = Array.isArray(state.patientVitals) ? state.patientVitals : (state.patientVitals = []);
  const list = currentVitals.filter((v) => v.uhid.toLowerCase() === cleanUhid);
  if (list.length === 0) {
    const patient = getPatientByIdOrUhid(state, uhid);
    if (patient) {
      return [
        {
          id: 1,
          patientId: patient.id,
          uhid: patient.uhid,
          bpSystolic: 120,
          bpDiastolic: 80,
          heartRateBpm: 72,
          temperatureCelsius: 36.8,
          spO2Percentage: 99,
          respiratoryRateBpm: 16,
          weightKg: 68,
          heightCm: 172,
          bloodSugarMgDl: 95,
          bmi: 23.0,
          isAbnormal: false,
          recordedAt: new Date().toISOString(),
          recordedBy: 'OPD Nursing Triage Station',
        },
      ];
    }
  }
  return list;
}

// ==========================================
// EHR TIMELINE & LONGITUDINAL HISTORY
// ==========================================

export function getPatientTimeline(state: RepositoryState, uhid: string): any[] {
  const patient = getPatientByIdOrUhid(state, uhid);
  if (!patient) return [];

  const timeline: any[] = [];

  // Add consultations
  state.appointments
    .filter((a) => a.patientId === patient.id || a.uhid.toLowerCase() === patient.uhid.toLowerCase())
    .forEach((a) => {
      timeline.push({
        id: a.id,
        eventType: 'CONSULTATION',
        title: `${a.department} Consultation (${a.type})`,
        description: a.notes || `Token #${a.tokenNumber} with ${a.doctorName}`,
        timestamp: `${a.appointmentDate}T${a.appointmentTime}`,
        doctorName: a.doctorName,
        department: a.department,
      });
    });

  // Add prescriptions
  state.prescriptions
    .filter((p) => p.patientId === patient.id || p.uhid.toLowerCase() === patient.uhid.toLowerCase())
    .forEach((p) => {
      timeline.push({
        id: p.id,
        eventType: 'PRESCRIPTION',
        title: `Electronic Prescription (${p.prescriptionNumber})`,
        description: `Diagnosis: ${p.diagnosis}. Prescribed ${p.medicines.length} medication(s).`,
        timestamp: p.issuedAt || p.createdAt,
        doctorName: p.doctorName,
      });
    });

  // Add lab reports
  state.reports
    .filter((r) => r.patientId === patient.id || r.uhid.toLowerCase() === patient.uhid.toLowerCase())
    .forEach((r) => {
      timeline.push({
        id: r.id,
        eventType: 'LAB_REPORT',
        title: `${r.testName} (${r.category})`,
        description: r.findings || r.resultSummary || 'Investigation completed.',
        timestamp: r.testDate,
        doctorName: r.doctorName,
        documentUrl: r.fileUrl,
      });
    });

  // Add IPD admissions
  state.admissions
    .filter((adm) => adm.patientId === patient.id || adm.uhid.toLowerCase() === patient.uhid.toLowerCase())
    .forEach((adm) => {
      timeline.push({
        id: adm.id,
        eventType: 'ADMISSION',
        title: `IPD Hospital Admission (${adm.admissionNumber})`,
        description: `${adm.wardType.toUpperCase()} Ward (Bed: ${adm.bedNumber}) - Condition: ${adm.condition}`,
        timestamp: adm.admissionDate,
        doctorName: adm.doctorName,
      });
    });

  // Sort by timestamp descending
  return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getPatientLongitudinalHistory(state: RepositoryState, idOrUhid: string | number) {
  const patient = getPatientByIdOrUhid(state, idOrUhid);
  if (!patient) return null;

  const patientAppointments = state.appointments.filter(
    (a) => a.patientId === patient.id || a.uhid.toLowerCase() === patient.uhid.toLowerCase()
  );
  const patientPrescriptions = state.prescriptions.filter(
    (p) => p.patientId === patient.id || p.uhid.toLowerCase() === patient.uhid.toLowerCase()
  );
  const patientReports = state.reports.filter(
    (r) => r.patientId === patient.id || r.uhid.toLowerCase() === patient.uhid.toLowerCase()
  );
  const patientAdmissions = state.admissions.filter(
    (adm) => adm.patientId === patient.id || adm.uhid.toLowerCase() === patient.uhid.toLowerCase()
  );
  const patientFollowups = state.followups.filter(
    (f) => f.patientId === patient.id || f.uhid.toLowerCase() === patient.uhid.toLowerCase()
  );

  const vitalsTimeline = state.patientVitals
    .filter((v) => v.patientId === patient.id || v.uhid.toLowerCase() === patient.uhid.toLowerCase())
    .map((v) => ({
      date: v.recordedAt,
      bp: `${v.bpSystolic}/${v.bpDiastolic} mmHg`,
      pulse: v.heartRateBpm,
      temp: `${v.temperatureCelsius} °C`,
      spO2: `${v.spO2Percentage}%`,
      weight: v.weightKg ? `${v.weightKg} kg` : undefined,
      bmi: v.bmi ? String(v.bmi) : undefined,
    }));

  return {
    patient,
    summary: {
      totalConsultations: patientAppointments.length,
      totalPrescriptions: patientPrescriptions.length,
      totalDiagnosticReports: patientReports.length,
      totalAdmissions: patientAdmissions.length,
      pendingFollowups: patientFollowups.filter((f) => f.status === 'scheduled').length,
    },
    vitalsTimeline: vitalsTimeline.length > 0 ? vitalsTimeline : patientAppointments
      .filter((a) => a.vitals && a.vitals.bp)
      .map((a) => ({
        date: `${a.appointmentDate} ${a.appointmentTime}`,
        bp: a.vitals?.bp || '120/80 mmHg',
        pulse: a.vitals?.pulse || 72,
        temp: a.vitals?.temp || '98.6 °F',
        spO2: a.vitals?.spO2 || '99%',
        weight: a.vitals?.weight || '70 kg',
        bmi: '23.5',
      })),
    appointments: patientAppointments,
    prescriptions: patientPrescriptions,
    diagnosticReports: patientReports,
    admissions: patientAdmissions,
    followups: patientFollowups,
    allergies: patient.allergies || ['None documented'],
    chronicConditions: patient.chronicConditions || ['None'],
  };
}
