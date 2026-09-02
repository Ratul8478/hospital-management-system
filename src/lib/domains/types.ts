/**
 * Core Domain Types & Interfaces for Medix Healthcare Architecture
 *
 * Single source of truth — all types are defined here and re-exported
 * from backend-store.ts for backward compatibility.
 */

import type { Patient as BasePatient, Appointment as BaseAppointment, Branch } from '../data';

// ==========================================
// USER & AUTH TYPES
// ==========================================

export type UserRole =
  | 'super_admin'
  | 'branch_admin'
  | 'doctor'
  | 'patient'
  | 'marketing'
  | 'receptionist'
  | 'pharmacist'
  | 'lab_technician'
  | 'accountant'
  | 'staff';

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  branchId: number;
  branchCode: string;
  branchName: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationExpiresAt?: number;
  status: 'active' | 'pending' | 'suspended' | 'fired';
  createdAt: string;
  details?: Record<string, any>;
  permissions: string[];
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  userId: number;
  doctorId?: number;
  email: string;
  name: string;
  role: UserRole | string;
  branchId: number;
  branchCode?: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string;
}

// ==========================================
// DOCTOR TYPES
// ==========================================

export interface DoctorUser {
  id: number;
  branchId: number;
  branchCode: string;
  branchName: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  specialty: string;
  department: string;
  qualification: string;
  registrationNumber: string;
  fee: number;
  status: 'available' | 'busy' | 'off-duty';
  role: 'doctor';
  permissions: string[];
  avatarUrl?: string;
  scheduleTime?: string;
  chamberRoom?: string;
  experienceYears?: number;
  rating?: number;
  totalPatientsTreated?: number;
  availableDays?: string[];
  shiftTiming?: string;
}

export interface LeaveRequest {
  id: number;
  doctorId: number;
  doctorName: string;
  leaveType: 'annual' | 'sick' | 'casual' | 'emergency' | 'maternity' | 'conference';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
  comments?: string;
}

// ==========================================
// PATIENT TYPES
// ==========================================

export interface PatientRecord extends BasePatient {
  email?: string;
  address?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  chronicConditions?: string[];
  registeredDate: string;
  lastVisitedDate?: string;
  assignedDoctorName?: string;
  assignedDoctorId?: number;
  bedNumber?: string | null;
  wardType?: string | null;
}

export interface PatientVitalsRecord {
  id: number;
  patientId: number;
  uhid: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRateBpm: number;
  temperatureCelsius: number;
  spO2Percentage: number;
  respiratoryRateBpm?: number;
  weightKg?: number;
  heightCm?: number;
  bloodSugarMgDl?: number;
  bmi?: number;
  isAbnormal?: boolean;
  notes?: string;
  recordedAt: string;
  recordedBy?: string;
}

// ==========================================
// APPOINTMENT TYPES
// ==========================================

export interface DoctorAppointment extends BaseAppointment {
  patientId: number;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: number;
  consultationRoom?: string;
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  notes?: string;
  vitals?: {
    bp?: string;
    bpSystolic?: number;
    bpDiastolic?: number;
    pulse?: number;
    heartRateBpm?: number;
    temp?: string;
    temperatureCelsius?: number;
    spO2?: string;
    spO2Percentage?: number;
    weight?: string;
    recordedAt?: string;
  };
}

// ==========================================
// CLINICAL TYPES
// ==========================================

export interface PrescriptionItem {
  name: string;
  medicineName?: string;
  category?: string;
  dosage: string;
  frequency: string;
  duration: string;
  durationDays?: number;
  instructions?: string;
}

export interface Prescription {
  id: number;
  prescriptionNumber: string;
  appointmentId?: number;
  patientId: number;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: number;
  doctorName: string;
  branchId: number;
  diagnosis: string;
  clinicalNotes?: string;
  symptoms?: string[];
  medicines: PrescriptionItem[];
  items?: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;
  createdAt: string;
  issuedAt?: string;
  pharmacySyncStatus?: string;
  status: 'active' | 'dispensed' | 'cancelled';
}

export interface DiagnosticParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
}

export interface DiagnosticReport {
  id: number;
  reportNumber: string;
  patientId: number;
  uhid: string;
  patientName: string;
  doctorId: number;
  doctorName: string;
  branchId: number;
  testName: string;
  category: 'Cardiology' | 'Hematology' | 'Radiology' | 'Pulmonology' | 'Gastroenterology' | 'Cardiothoracic' | 'Nephrology' | 'Pediatrics' | 'Biochemistry';
  testDate: string;
  status: 'pending' | 'processing' | 'ready';
  criticalAlert?: boolean;
  findings?: string;
  parameters?: DiagnosticParameter[];
  resultSummary?: string;
  fileUrl?: string;
}

export interface LabOrderRequest {
  id: number;
  orderNumber: string;
  patientId: number;
  uhid: string;
  appointmentId?: number;
  doctorId: number;
  doctorName: string;
  branchId: number;
  testNames: string[];
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  clinicalIndication?: string;
  status: 'PENDING_SAMPLE_COLLECTION' | 'IN_PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface IPDAdmission {
  id: number;
  admissionNumber: string;
  patientId: number;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  doctorId: number;
  doctorName: string;
  branchId: number;
  branchName: string;
  bedId: number;
  bedNumber: string;
  roomNumber?: string;
  diagnosis?: string;
  wardType: 'icu' | 'general' | 'private' | 'deluxe';
  admissionDate: string;
  dischargeDate?: string;
  condition: string;
  status: 'admitted' | 'discharged' | 'transferred';
  dailyCharge: number;
  emergencyContact: string;
  treatmentPlan?: string;
}

export interface FollowUpSchedule {
  id: number;
  patientId: number;
  uhid: string;
  patientName: string;
  patientPhone: string;
  doctorId: number;
  doctorName: string;
  branchId: number;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  tokenNumber?: number;
  notes?: string;
  createdAt: string;
}

// ==========================================
// REFERRAL TYPES
// ==========================================

export interface HospitalReferralRecord {
  id: number;
  referralId: string;
  patientId: number;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  targetHospitalId: number | string;
  targetHospitalCode?: string;
  targetHospitalName: string;
  targetHospitalLocation?: string;
  targetDoctorId?: number;
  targetDoctorName?: string;
  targetDoctorSpecialty?: string;
  targetDepartment: string;
  urgencyLevel: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  clinicalSummary: string;
  diagnosis: string;
  vitalsSummary?: string;
  referringDoctorId: number;
  referringDoctorName: string;
  referringDoctorSpecialty?: string;
  referringDoctorQualification?: string;
  referringDoctorRegNo?: string;
  referringDoctorHospital?: string;
  referringDoctorChamber?: string;
  referringDoctorPhone?: string;
  referringDoctorEmail?: string;
  // Connected Marketing Representative (PRO) Profile
  marketingRepId?: string | number;
  marketingRepName?: string;
  marketingRepCode?: string;
  marketingRepPhone?: string;
  marketingRepEmail?: string;
  marketingRepTerritory?: string;
  marketingRepCommissionRate?: string | number;
  marketingRepRole?: string;
  status: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'ADMITTED';
  createdAt: string;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface FCMRegistration {
  id: number;
  userId: string | number;
  doctorId?: number;
  token: string;
  deviceType: 'web' | 'ios' | 'android';
  platform?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// PERMISSIONS
// ==========================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'all',
    'hospital:manage',
    'branch:manage',
    'doctor:manage',
    'patient:manage',
    'marketing:approve',
    'database:export',
    'financials:manage',
  ],
  branch_admin: [
    'branch:view',
    'branch:update',
    'doctor:manage',
    'patient:manage',
    'marketing:review',
    'roster:manage',
  ],
  doctor: [
    'consultation:read',
    'consultation:write',
    'prescription:create',
    'prescription:read',
    'reports:read',
    'admissions:read',
    'followups:manage',
    'earnings:read',
    'leave:manage',
    'patients:read',
  ],
  patient: [
    'patient:self:read',
    'patient:self:write',
    'appointment:book',
    'prescription:self:read',
    'reports:self:read',
  ],
  marketing: [
    'referral:create',
    'referral:read',
    'earnings:self:read',
  ],
  receptionist: [
    'appointment:manage',
    'patient:register',
    'patient:read',
    'token:issue',
    'bed:view',
  ],
  pharmacist: [
    'pharmacy:dispense',
    'medicine:manage',
    'prescription:read',
  ],
  lab_technician: [
    'lab:order:process',
    'lab:report:upload',
    'reports:write',
  ],
  accountant: [
    'billing:manage',
    'invoice:create',
    'payment:collect',
  ],
  staff: [
    'roster:read',
    'patient:read',
  ],
};

// ==========================================
// REPOSITORY STATE INTERFACE
// ==========================================

import type {
  MarketingJoinRequest,
  MarketingRepresentative,
  MarketingEmailDispatchLog,
} from '../data';

/**
 * Shared repository state — the data arrays that domain modules operate on.
 * BackendRepository implements this interface so domain functions can access
 * state without circular dependency on the class itself.
 */
export interface RepositoryState {
  users: UserAccount[];
  doctors: DoctorUser[];
  patients: PatientRecord[];
  appointments: DoctorAppointment[];
  prescriptions: Prescription[];
  reports: DiagnosticReport[];
  admissions: IPDAdmission[];
  followups: FollowUpSchedule[];
  leaveRequests: LeaveRequest[];
  sessions: Map<string, AuthSession>;
  branches: Branch[];
  referrals: HospitalReferralRecord[];
  fcmTokens: FCMRegistration[];
  marketingRequests: MarketingJoinRequest[];
  marketingReps: MarketingRepresentative[];
  marketingEmailLogs: MarketingEmailDispatchLog[];
  patientVitals: PatientVitalsRecord[];
  labOrders: LabOrderRequest[];
}
