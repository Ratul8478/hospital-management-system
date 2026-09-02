/**
 * Seed Data for BackendRepository
 *
 * Initial data that populates the in-memory repository on startup.
 * Extracted from backend-store.ts for modularity.
 */

import {
  Branch,
  INITIAL_BRANCHES,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MARKETING_JOIN_REQUESTS,
  INITIAL_MARKETING_REPRESENTATIVES,
  INITIAL_MARKETING_EMAIL_LOGS,
} from '../data';
import { hashPassword } from '../security';
import type {
  UserAccount,
  DoctorUser,
  PatientRecord,
  DoctorAppointment,
  Prescription,
  DiagnosticReport,
  IPDAdmission,
  FollowUpSchedule,
  LeaveRequest,
  AuthSession,
  FCMRegistration,
  UserRole,
  ROLE_PERMISSIONS as RolePermissionsType,
} from './types';
import { ROLE_PERMISSIONS } from './types';

export const DEFAULT_DOCTOR_PERMISSIONS = ROLE_PERMISSIONS.doctor;

// Standard default password hash for seed doctors: "Doctor@123"
export const DEFAULT_DOCTOR_PASSWORD_HASH = hashPassword('Doctor@123');

export const TODAY_STR = new Date().toISOString().split('T')[0];

// ==========================================
// SEED USER ACCOUNTS
// ==========================================

export const SEED_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 1,
    name: 'Anichul Haque',
    email: 'ariyanhospital9@gmail.com',
    phone: '+91 91443 76971',
    passwordHash: hashPassword('admin@2019'),
    role: 'super_admin',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.super_admin,
  },
  {
    id: 2,
    name: 'Hospital Branch Administrator',
    email: 'admin@ariyan.hospital',
    phone: '+91 98042 22142',
    passwordHash: hashPassword('Admin@123'),
    role: 'branch_admin',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.branch_admin,
  },
  {
    id: 101,
    name: 'Dr. Sabyachi Mondal',
    email: 'sabyachi.mondal@ariyan.hospital',
    phone: '+91 91443 76971',
    passwordHash: hashPassword('Doctor@123'),
    role: 'doctor',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.doctor,
  },
  {
    id: 102,
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@medix.hospital',
    phone: '+91 98042 22142',
    passwordHash: hashPassword('Doctor@123'),
    role: 'doctor',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.doctor,
    details: {
      specialty: 'Cardiology & Vascular Interventions',
      consultFee: 800,
      chamberAddress: 'OPD Suite 302, 3rd Floor, Wing A',
      district: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
  },
  {
    id: 103,
    name: 'Dr. Jiarul Haque',
    email: 'jiarul.haque@ariyan.hospital',
    phone: '+91 91443 76971',
    passwordHash: hashPassword('Doctor@123'),
    role: 'doctor',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.doctor,
    details: {
      specialty: 'General Medicine & Critical Care',
      consultFee: 700,
      chamberAddress: 'OPD Suite 105, 1st Floor',
      district: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
  },
  {
    id: 104,
    name: 'Dr. R. Jenkins',
    email: 'r.jenkins@medix.hospital',
    phone: '+91 98042 22143',
    passwordHash: hashPassword('Doctor@123'),
    role: 'doctor',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.doctor,
    details: {
      specialty: 'Orthopaedics & Joint Replacement',
      consultFee: 900,
      chamberAddress: 'OPD Suite 201, 2nd Floor',
      district: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
  },
  {
    id: 301,
    name: 'Hospital Central Receptionist',
    email: 'reception@ariyan.hospital',
    phone: '+91 98042 22142',
    passwordHash: hashPassword('Staff@123'),
    role: 'receptionist',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.receptionist,
  },
  {
    id: 401,
    name: 'Aarav Sharma',
    email: 'patient@medix.local',
    phone: '+91 98042 22142',
    passwordHash: hashPassword('Patient@123'),
    role: 'patient',
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    isEmailVerified: true,
    status: 'active',
    createdAt: TODAY_STR,
    permissions: ROLE_PERMISSIONS.patient,
    details: { uhid: 'UHID-2026-0042' },
  },
];

// ==========================================
// SEED DOCTORS
// ==========================================

export const SEED_DOCTOR_USERS: DoctorUser[] = SEED_USER_ACCOUNTS.filter(u => u.role === 'doctor').map(u => {
  const branch = INITIAL_BRANCHES.find(b => b.id === u.branchId) || INITIAL_BRANCHES[0];
  const details = u.details || {};
  return {
    id: u.id,
    branchId: u.branchId,
    branchCode: u.branchCode,
    branchName: u.branchName,
    name: u.name,
    email: u.email,
    phone: u.phone,
    passwordHash: u.passwordHash,
    specialty: details.specialty || 'General Medicine',
    department: details.department || details.specialty || 'Clinical OPD',
    qualification: details.qualification || 'MBBS, MD',
    registrationNumber: details.registrationNumber || `WB-MED-${u.id}-2026`,
    fee: details.consultFee || details.fee || 800,
    status: 'available',
    role: 'doctor',
    permissions: [...(u.permissions || DEFAULT_DOCTOR_PERMISSIONS)],
    avatarUrl: details.avatarUrl || '',
    experienceYears: details.experienceYears || 8,
    rating: 5.0,
    totalPatientsTreated: 1200 + u.id * 10,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    shiftTiming: '09:00 AM - 05:00 PM',
    chamberRoom: details.chamberAddress || `OPD-${200 + u.id}`,
  };
});

// ==========================================
// SEED PATIENTS
// ==========================================

export const DEFAULT_SEED_PATIENTS: PatientRecord[] = [
  {
    id: 401,
    branchId: 1,
    uhid: 'UHID-2026-0042',
    name: 'Aarav Sharma',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98042 22142',
    email: 'aarav.sharma@example.com',
    condition: 'Post Angioplasty Observation (Stable)',
    status: 'admitted',
    address: 'Newtown, Kolkata, West Bengal 700157',
    emergencyContact: '+91 98042 22142',
    emergencyContactName: 'Priya Sharma (Spouse)',
    emergencyContactPhone: '+91 98042 22142',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    registeredDate: '2026-01-15',
    lastVisitedDate: TODAY_STR,
    assignedDoctorName: 'Dr. Sabyachi Mondal',
    assignedDoctorId: 101,
    bedNumber: 'ICU-03',
    wardType: 'icu',
  },
  {
    id: 402,
    branchId: 1,
    uhid: 'UHID-2026-0043',
    name: 'Sunita Das',
    age: 38,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 98310 55421',
    email: 'sunita.das@example.com',
    condition: 'Routine Cardiac Follow-up & ECG',
    status: 'opd',
    address: 'Salt Lake Sector 2, Kolkata 700091',
    emergencyContact: '+91 98310 55421',
    allergies: ['None documented'],
    chronicConditions: ['None'],
    registeredDate: '2026-02-10',
    lastVisitedDate: TODAY_STR,
    assignedDoctorName: 'Dr. Sabyachi Mondal',
    assignedDoctorId: 101,
    bedNumber: null,
    wardType: null,
  },
  {
    id: 403,
    branchId: 1,
    uhid: 'UHID-2026-0044',
    name: 'Rahul Banerjee',
    age: 52,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 97480 33219',
    email: 'rahul.banerjee@example.com',
    condition: 'Acute Bronchitis & Nebulization',
    status: 'opd',
    address: 'Rajarhat Main Road, Kolkata 700135',
    emergencyContact: '+91 97480 33219',
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Asthma'],
    registeredDate: '2026-03-01',
    lastVisitedDate: TODAY_STR,
    assignedDoctorName: 'Dr . Jiarul Haque',
    assignedDoctorId: 102,
    bedNumber: null,
    wardType: null,
  },
];

export const SEED_PATIENTS: PatientRecord[] = INITIAL_PATIENTS.length > 0
  ? INITIAL_PATIENTS.map((p) => ({
      ...p,
      email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: 'Kolkata Catchment Area, West Bengal',
      emergencyContact: p.phone,
      emergencyContactName: 'Family Contact',
      emergencyContactPhone: p.phone,
      allergies: ['None documented'],
      chronicConditions: ['Hypertension'],
      registeredDate: '2024-03-12',
      lastVisitedDate: TODAY_STR,
      assignedDoctorName: 'Dr. Sabyachi Mondal',
      assignedDoctorId: 101,
      bedNumber: null,
      wardType: null,
    }))
  : DEFAULT_SEED_PATIENTS;

// ==========================================
// SEED APPOINTMENTS
// ==========================================

export const SEED_APPOINTMENTS: DoctorAppointment[] = INITIAL_APPOINTMENTS.map((a, idx) => ({
  ...a,
  patientId: (a as any).patientId || 401 + idx,
  patientAge: 42 + idx,
  patientGender: idx % 2 === 0 ? 'Male' : 'Female',
  patientPhone: '+91 98042 22142',
  doctorId: (a as any).doctorId || 1,
  consultationRoom: 'OPD-302',
  queuePosition: idx + 1,
  estimatedWaitMinutes: (idx + 1) * 10,
  vitals: {
    bp: '120/80 mmHg',
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 74,
    heartRateBpm: 74,
    temp: '98.6 °F',
    temperatureCelsius: 37.0,
    spO2: '99%',
    spO2Percentage: 99,
    weight: '68 kg',
    recordedAt: `${a.appointmentDate}T10:00:00Z`,
  },
}));

// ==========================================
// SEED PRESCRIPTIONS
// ==========================================

export const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 101,
    prescriptionNumber: 'RX-2026-8910',
    appointmentId: 1,
    patientId: 401,
    uhid: 'UHID-2026-0042',
    patientName: 'Aarav Sharma',
    patientAge: 45,
    patientGender: 'Male',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    branchId: 1,
    diagnosis: 'Essential Primary Hypertension',
    clinicalNotes: 'Advised low sodium diet & daily exercise.',
    symptoms: ['Chest tightness on exertion'],
    medicines: [
      {
        name: 'Telmisartan 40mg',
        medicineName: 'Telmisartan 40mg',
        dosage: '1 Tablet',
        frequency: 'Once daily (Morning, after breakfast)',
        duration: '30 Days',
        durationDays: 30,
        instructions: 'Take with water',
      },
    ],
    items: [
      {
        name: 'Telmisartan 40mg',
        medicineName: 'Telmisartan 40mg',
        dosage: '1 Tablet',
        frequency: 'Once daily (Morning, after breakfast)',
        duration: '30 Days',
        durationDays: 30,
        instructions: 'Take with water',
      },
    ],
    advice: 'Review after 30 days with BP log.',
    followUpDate: '2026-09-30',
    createdAt: TODAY_STR,
    issuedAt: `${TODAY_STR}T10:30:00Z`,
    status: 'active',
    pharmacySyncStatus: 'QUEUED_FOR_DISPENSING',
  },
];

// ==========================================
// SEED DIAGNOSTIC REPORTS
// ==========================================

export const SEED_REPORTS: DiagnosticReport[] = [
  {
    id: 501,
    reportNumber: 'LAB-2026-501',
    patientId: 401,
    uhid: 'UHID-2026-0042',
    patientName: 'Aarav Sharma',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    branchId: 1,
    testName: 'Lipid Profile Extended & HbA1c',
    category: 'Biochemistry',
    testDate: TODAY_STR,
    status: 'ready',
    criticalAlert: false,
    findings: 'Total Cholesterol: 195 mg/dL (Desirable), HbA1c: 6.2%',
    resultSummary: 'Lipid levels within normal control bounds.',
  },
];

// ==========================================
// SEED IPD ADMISSIONS
// ==========================================

export const SEED_ADMISSIONS: IPDAdmission[] = [
  {
    id: 201,
    admissionNumber: 'ADM-2026-0082',
    patientId: 401,
    uhid: 'UHID-2026-0042',
    patientName: 'Aarav Sharma',
    age: 45,
    gender: 'Male',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    branchId: 1,
    branchName: 'Medix Central Multispecialty Hospital',
    bedId: 12,
    bedNumber: 'ICU-03',
    roomNumber: 'ICU-Wing A',
    wardType: 'icu',
    admissionDate: TODAY_STR,
    condition: 'Post Angioplasty Observation (Stable)',
    diagnosis: 'Coronary Artery Disease',
    status: 'admitted',
    dailyCharge: 4500,
    emergencyContact: '+91 98042 22142',
    treatmentPlan: 'Telemetry monitoring and dual antiplatelet therapy.',
  },
];

// ==========================================
// SEED FOLLOW-UPS
// ==========================================

export const SEED_FOLLOWUPS: FollowUpSchedule[] = [
  {
    id: 301,
    patientId: 401,
    uhid: 'UHID-2026-0042',
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98042 22142',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    branchId: 1,
    scheduledDate: TODAY_STR,
    scheduledTime: '11:00 AM',
    reason: 'Routine Cardiology Follow-up & BP Monitoring',
    status: 'scheduled',
    tokenNumber: 14,
    notes: 'Bring previous ECG records',
    createdAt: TODAY_STR,
  },
];

// ==========================================
// SEED EMPTY COLLECTIONS
// ==========================================

export const SEED_LEAVE_REQUESTS: LeaveRequest[] = [];
export const SEED_SESSIONS: AuthSession[] = [];
export const SEED_FCM_TOKENS: FCMRegistration[] = [];
