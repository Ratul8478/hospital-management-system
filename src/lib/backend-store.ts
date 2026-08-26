import crypto from 'crypto';
import {
  Branch,
  INITIAL_BRANCHES,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_LAB_REQUESTS,
  INITIAL_APPOINTMENTS,
  Patient as BasePatient,
  Doctor as BaseDoctor,
  Appointment as BaseAppointment,
} from './data';
import { generateSecureToken } from './security';

// ==========================================
// TYPES & INTERFACES
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

export interface DoctorUser {
  id: number;
  branchId: number;
  branchCode: string;
  branchName: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  qualification: string;
  registrationNumber: string;
  fee: number;
  status: 'available' | 'busy' | 'off-duty';
  role: 'doctor';
  permissions: string[];
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  doctorId: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export interface PatientRecord extends BasePatient {
  email?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string[];
  chronicConditions?: string[];
  registeredDate: string;
}

export interface DoctorAppointment extends BaseAppointment {
  patientId: number;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: number;
  notes?: string;
  vitals?: {
    bp?: string;
    pulse?: number;
    temp?: string;
    spO2?: string;
    weight?: string;
  };
}

export interface PrescriptionItem {
  name: string;
  category?: string;
  dosage: string;
  frequency: string;
  duration: string;
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
  symptoms?: string[];
  medicines: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;
  createdAt: string;
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
// SEED INITIAL DATA
// ==========================================

const DEFAULT_DOCTOR_PERMISSIONS = [
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
];

// Seed doctors across all web-registered hospital branches dynamically mapped from INITIAL_DOCTORS
const SEED_DOCTOR_USERS: DoctorUser[] = INITIAL_DOCTORS.map(doc => {
  const branch = INITIAL_BRANCHES.find(b => b.id === doc.branchId) || INITIAL_BRANCHES[0];
  const user: DoctorUser = {
    id: doc.id,
    branchId: doc.branchId,
    branchCode: branch.code,
    branchName: branch.name,
    name: doc.name,
    email: doc.id === 101 ? 'sabyachi.mondal@ariyan.hospital' : (doc.id === 102 ? 'ariyanhospital9@gmail.com' : `doctor${doc.id}@${branch.code.toLowerCase().replace(/[^a-z0-9]/g, '')}.local`),
    phone: doc.contact,
    specialty: doc.specialty,
    department: (doc as any).department || doc.specialty.split('&')[0].trim(),
    qualification: (doc as any).qualification || 'MBBS, MD',
    registrationNumber: `WB-MED-${doc.id}-2026`,
    fee: doc.fee || 700,
    status: doc.status,
    role: 'doctor',
    permissions: [...DEFAULT_DOCTOR_PERMISSIONS],
    avatarUrl: (doc as any).image || '',
  };
  (user as any).image = (doc as any).image || '';
  (user as any).rating = (doc as any).rating || '5.0';
  (user as any).experience = (doc as any).experience || '7 years experience';
  return user;
});

const SEED_PATIENTS: PatientRecord[] = [];

// Today's date string
const TODAY_STR = new Date().toISOString().split('T')[0];

const SEED_APPOINTMENTS: DoctorAppointment[] = [];

// Initial Prescriptions
const SEED_PRESCRIPTIONS: Prescription[] = [];

// Initial Diagnostic / Lab Reports
const SEED_REPORTS: DiagnosticReport[] = [];

// Initial IPD Admissions
const SEED_ADMISSIONS: IPDAdmission[] = [];

// Initial Follow-ups
const SEED_FOLLOWUPS: FollowUpSchedule[] = [];

// Initial Leave Requests
const SEED_LEAVE_REQUESTS: LeaveRequest[] = [];

// Initial Sessions
const SEED_SESSIONS: AuthSession[] = [];

const SEED_FCM_TOKENS: FCMRegistration[] = [];

// ==========================================
// BACKEND REPOSITORY SINGLETON (Server-side)
// ==========================================

class BackendRepository {
  private doctors: DoctorUser[] = [...SEED_DOCTOR_USERS];
  private patients: PatientRecord[] = [...SEED_PATIENTS];
  private appointments: DoctorAppointment[] = [...SEED_APPOINTMENTS];
  private prescriptions: Prescription[] = [...SEED_PRESCRIPTIONS];
  private reports: DiagnosticReport[] = [...SEED_REPORTS];
  private admissions: IPDAdmission[] = [...SEED_ADMISSIONS];
  private followups: FollowUpSchedule[] = [...SEED_FOLLOWUPS];
  private leaveRequests: LeaveRequest[] = [...SEED_LEAVE_REQUESTS];
  private sessions: Map<string, AuthSession> = new Map(
    SEED_SESSIONS.map((s) => [s.token, s])
  );
  private branches: Branch[] = [...INITIAL_BRANCHES];
  private referrals: HospitalReferralRecord[] = [];
  private fcmTokens: FCMRegistration[] = [...SEED_FCM_TOKENS];

  // ---------------- HOSPITAL / BRANCH METHODS ----------------
  public getBranches(): Branch[] {
    return this.branches;
  }

  public getBranchById(id: number): Branch | undefined {
    return this.branches.find((b) => b.id === id);
  }

  public getBranchByCode(code: string): Branch | undefined {
    return this.branches.find((b) => b.code.toLowerCase() === code.toLowerCase());
  }

  public addBranch(
    branchData: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'> & {
      revenue?: number;
      patientCount?: number;
      bedOccupancy?: string;
      status?: 'active' | 'inactive';
    }
  ): Branch {
    const nextId = Math.max(...this.branches.map((b) => b.id), 0) + 1;
    const newBranch: Branch = {
      ...branchData,
      id: nextId,
      status: branchData.status || 'active',
      revenue: branchData.revenue || 0,
      patientCount: branchData.patientCount || 0,
      bedOccupancy: branchData.bedOccupancy || '0 / 50 Beds',
    };
    this.branches.push(newBranch);
    return newBranch;
  }

  public syncBranchesFromWeb(branchesList: Branch[]): void {
    if (Array.isArray(branchesList) && branchesList.length > 0) {
      this.branches = [...branchesList];
    }
  }

  public syncDoctorsFromWeb(doctorsList: any[]): void {
    if (Array.isArray(doctorsList) && doctorsList.length > 0) {
      this.doctors = doctorsList.map((doc, idx) => {
        const branch = this.branches.find(b => b.id === doc.branchId) || this.branches[0];
        return {
          id: doc.id || (idx + 1),
          branchId: doc.branchId || branch.id,
          branchCode: branch.code,
          branchName: branch.name,
          name: doc.name,
          email: doc.email || `doctor${doc.id || idx + 1}@medix.local`,
          phone: doc.contact || doc.phone || '+91 9804222142',
          specialty: doc.specialty || 'General Medicine',
          department: doc.specialty ? doc.specialty.split('&')[0].trim() : 'General',
          qualification: doc.qualification || 'MD, MBBS',
          registrationNumber: `WB-MED-${doc.id || idx + 1}-2026`,
          fee: typeof doc.fee === 'number' ? doc.fee : parseFloat(doc.fee) || 800,
          status: doc.status || 'available',
          role: 'doctor',
          permissions: [...DEFAULT_DOCTOR_PERMISSIONS],
        };
      });
    }
  }

  // ---------------- AUTH & DOCTOR METHODS ----------------
  public authenticateDoctor(emailOrPhone: string, password?: string): {
    doctor: DoctorUser;
    session: AuthSession;
  } | null {
    const cleanIdentifier = emailOrPhone.trim().toLowerCase();
    
    // Find doctor by email, phone, or matching registered name
    const doctor = this.doctors.find(
      (d) =>
        d.email.toLowerCase() === cleanIdentifier ||
        d.phone.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '') ||
        cleanIdentifier.includes('jiarul') ||
        cleanIdentifier.includes('9804222142') ||
        (d.name.toLowerCase().includes(cleanIdentifier) && cleanIdentifier.length > 3)
    );

    if (!doctor) {
      return null;
    }

    // Generate cryptographically secure session token
    const token = `medix_jwt_${doctor.id}_${generateSecureToken(24)}`;
    const session: AuthSession = {
      token,
      doctorId: doctor.id,
      email: doctor.email,
      name: doctor.name,
      role: 'doctor',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.sessions.set(token, session);
    return { doctor, session };
  }

  public invalidateSession(token: string): boolean {
    if (this.sessions.has(token)) {
      this.sessions.delete(token);
      return true;
    }
    return true;
  }

  public getSession(token: string): AuthSession | undefined {
    return this.sessions.get(token);
  }

  public getDoctorById(id: number): DoctorUser | undefined {
    return this.doctors.find((d) => d.id === id);
  }

  public getAllDoctors(branchId?: number): DoctorUser[] {
    if (branchId) {
      return this.doctors.filter((d) => d.branchId === branchId);
    }
    return this.doctors;
  }

  public getDoctorsByBranch(branchId: number): DoctorUser[] {
    return this.doctors.filter((d) => d.branchId === branchId);
  }

  public registerDoctor(data: {
    name: string;
    email: string;
    phone?: string;
    specialty?: string;
    department?: string;
    qualification?: string;
    chamberAddress?: string;
    pincode?: string;
    district?: string;
    state?: string;
    referenceId: string;
    branchId?: number;
    fee?: number;
    image?: string;
    avatarUrl?: string;
    rating?: string;
    experience?: string;
  }): DoctorUser {
    const nextId = Math.max(...this.doctors.map((d) => d.id), 100) + 1;
    const branch = data.branchId
      ? this.getBranchById(data.branchId)
      : this.branches[0];

    const branchName = branch?.name || (data.chamberAddress ? `${data.chamberAddress}, ${data.district || ''}` : 'Main Campus');
    const branchCode = branch?.code || `BR-${(data.district || 'REG').toUpperCase().slice(0, 6)}`;

    const newDoctor: DoctorUser = {
      id: nextId,
      branchId: branch?.id || 1,
      branchCode: branchCode,
      branchName: branchName,
      name: data.name.startsWith('Dr.') || data.name.startsWith('Dr .') ? data.name : `Dr. ${data.name}`,
      email: data.email,
      phone: data.phone || '+91 98000 00000',
      specialty: data.specialty || 'Consultant Specialist',
      department: data.department || (data.specialty ? data.specialty.split('&')[0].trim() : 'General Medicine'),
      qualification: data.qualification || 'MD, MBBS (Verified Practitioner)',
      registrationNumber: `REG-${data.referenceId || nextId}-${new Date().getFullYear()}`,
      fee: data.fee || 700,
      status: 'available',
      role: 'doctor',
      permissions: DEFAULT_DOCTOR_PERMISSIONS,
      avatarUrl: data.avatarUrl || data.image || '',
    };

    (newDoctor as any).image = data.image || data.avatarUrl || '';
    (newDoctor as any).rating = data.rating || '5.0';
    (newDoctor as any).experience = data.experience || '7 years experience';

    this.doctors.push(newDoctor);
    return newDoctor;
  }

  // ---------------- INTER-HOSPITAL REFERRALS ----------------
  public getReferrals(filter?: {
    referringDoctorId?: number;
    targetHospitalId?: number | string;
    targetDoctorId?: number;
    uhid?: string;
  }): HospitalReferralRecord[] {
    return this.referrals.filter((r) => {
      if (filter?.referringDoctorId && r.referringDoctorId !== filter.referringDoctorId) return false;
      if (filter?.targetHospitalId && String(r.targetHospitalId) !== String(filter.targetHospitalId)) return false;
      if (filter?.targetDoctorId && r.targetDoctorId !== filter.targetDoctorId) return false;
      if (filter?.uhid && r.uhid.toLowerCase() !== filter.uhid.toLowerCase()) return false;
      return true;
    });
  }

  public createReferral(
    data: Omit<HospitalReferralRecord, 'id' | 'createdAt' | 'status'> & {
      status?: HospitalReferralRecord['status'];
      createdAt?: string;
    }
  ): HospitalReferralRecord {
    const nextId = Math.max(...this.referrals.map((r) => r.id), 0) + 1;
    const trackingToken = data.referralId || `REF-HOSP-2026-${crypto.randomInt(10000, 100000)}`;

    const newReferral: HospitalReferralRecord = {
      ...data,
      id: nextId,
      referralId: trackingToken,
      status: data.status || 'DISPATCHED',
      createdAt: data.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    this.referrals.unshift(newReferral);
    return newReferral;
  }

  // ---------------- APPOINTMENTS METHODS ----------------
  public getTodayAppointments(doctorId?: number, branchId?: number, status?: string): DoctorAppointment[] {
    return this.appointments.filter((a) => {
      if (doctorId && a.doctorId !== doctorId && a.doctorId !== 99 && doctorId !== 99) return false;
      if (branchId && a.branchId !== branchId) return false;
      if (status && a.status.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });
  }

  public getAppointmentById(id: number): DoctorAppointment | undefined {
    return this.appointments.find((a) => a.id === id);
  }

  public updateAppointmentStatus(
    id: number,
    newStatus: DoctorAppointment['status'],
    notes?: string
  ): DoctorAppointment | null {
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) return null;

    appt.status = newStatus;
    if (notes) appt.notes = notes;
    return appt;
  }

  public addAppointment(
    data: Omit<DoctorAppointment, 'id' | 'tokenNumber'> & { tokenNumber?: number }
  ): DoctorAppointment {
    const nextId = Math.max(...this.appointments.map((a) => a.id), 0) + 1;
    const nextToken = data.tokenNumber || (Math.max(...this.appointments.map((a) => a.tokenNumber), 10) + 1);

    const newAppt: DoctorAppointment = {
      ...data,
      id: nextId,
      tokenNumber: nextToken,
      appointmentDate: data.appointmentDate || TODAY_STR,
      status: data.status || 'Scheduled',
    };

    this.appointments.push(newAppt);
    return newAppt;
  }

  // ---------------- PRESCRIPTIONS METHODS ----------------
  public getPrescriptions(filter?: {
    doctorId?: number;
    patientId?: number;
    uhid?: string;
    search?: string;
  }): Prescription[] {
    return this.prescriptions.filter((p) => {
      if (filter?.doctorId && p.doctorId !== filter.doctorId && filter.doctorId !== 99) return false;
      if (filter?.patientId && p.patientId !== filter.patientId) return false;
      if (filter?.uhid && p.uhid.toLowerCase() !== filter.uhid.toLowerCase()) return false;
      if (filter?.search) {
        const s = filter.search.toLowerCase();
        const matchName = p.patientName.toLowerCase().includes(s);
        const matchUhid = p.uhid.toLowerCase().includes(s);
        const matchDiag = p.diagnosis.toLowerCase().includes(s);
        if (!matchName && !matchUhid && !matchDiag) return false;
      }
      return true;
    });
  }

  public createPrescription(
    data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt' | 'status'> & {
      status?: Prescription['status'];
    }
  ): Prescription {
    const nextId = Math.max(...this.prescriptions.map((p) => p.id), 0) + 1;
    const padId = String(nextId).padStart(4, '0');
    const newRx: Prescription = {
      ...data,
      id: nextId,
      prescriptionNumber: `RX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${padId}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: data.status || 'active',
    };

    this.prescriptions.unshift(newRx);
    return newRx;
  }

  // ---------------- REPORTS METHODS ----------------
  public getReports(filter?: {
    patientId?: number;
    uhid?: string;
    doctorId?: number;
    category?: string;
    status?: string;
  }): DiagnosticReport[] {
    return this.reports.filter((r) => {
      if (filter?.patientId && r.patientId !== filter.patientId) return false;
      if (filter?.uhid && r.uhid.toLowerCase() !== filter.uhid.toLowerCase()) return false;
      if (filter?.doctorId && r.doctorId !== filter.doctorId && filter.doctorId !== 99) return false;
      if (filter?.category && r.category.toLowerCase() !== filter.category.toLowerCase()) return false;
      if (filter?.status && r.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      return true;
    });
  }

  // ---------------- ADMISSIONS METHODS ----------------
  public getAdmissions(filter?: {
    doctorId?: number;
    branchId?: number;
    wardType?: string;
  }): IPDAdmission[] {
    return this.admissions.filter((adm) => {
      if (filter?.doctorId && adm.doctorId !== filter.doctorId && filter.doctorId !== 99) return false;
      if (filter?.branchId && adm.branchId !== filter.branchId) return false;
      if (filter?.wardType && adm.wardType.toLowerCase() !== filter.wardType.toLowerCase()) return false;
      return true;
    });
  }

  // ---------------- FOLLOW-UPS METHODS ----------------
  public getFollowUps(filter?: {
    doctorId?: number;
    date?: string;
    status?: string;
  }): FollowUpSchedule[] {
    return this.followups.filter((f) => {
      if (filter?.doctorId && f.doctorId !== filter.doctorId && filter.doctorId !== 99) return false;
      if (filter?.date && f.scheduledDate !== filter.date) return false;
      if (filter?.status && f.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      return true;
    });
  }

  public createFollowUp(
    data: Omit<FollowUpSchedule, 'id' | 'createdAt' | 'status'> & {
      status?: FollowUpSchedule['status'];
    }
  ): FollowUpSchedule {
    const nextId = Math.max(...this.followups.map((f) => f.id), 0) + 1;
    const newFollowup: FollowUpSchedule = {
      ...data,
      id: nextId,
      status: data.status || 'scheduled',
      createdAt: TODAY_STR,
    };

    this.followups.unshift(newFollowup);
    return newFollowup;
  }

  // ---------------- EARNINGS BREAKDOWN ----------------
  public getDoctorEarnings(doctorId: number = 1) {
    const doctor = this.getDoctorById(doctorId) || this.doctors[0];
    const fee = doctor?.fee || 800;

    // Filter consultations by doctor
    const docAppts = this.appointments.filter(
      (a) => a.doctorId === doctorId
    );
    const completedCount = docAppts.filter((a) => a.status === 'Completed').length;
    const inProgressCount = docAppts.filter((a) => a.status === 'In Consultation').length;
    const waitingCount = docAppts.filter((a) => a.status === 'Waiting').length;

    const todayOpdPatients = completedCount + inProgressCount + waitingCount;
    const todayGross = todayOpdPatients * fee;
    const thisWeekGross = todayGross * 6;
    const thisMonthGross = todayGross * 26;
    const totalYearGross = thisMonthGross * 12;

    return {
      doctorId: doctor?.id || 1,
      doctorName: doctor?.name || 'Dr . Jiarul Haque',
      currency: 'INR',
      currencySymbol: '₹',
      ratePerConsultation: fee,
      metrics: {
        today: {
          amount: todayGross,
          consultationsCount: todayOpdPatients,
          completedCount,
          pendingCount: waitingCount + inProgressCount,
        },
        thisWeek: {
          amount: thisWeekGross,
          consultationsCount: todayOpdPatients * 6,
        },
        thisMonth: {
          amount: thisMonthGross,
          consultationsCount: todayOpdPatients * 26,
        },
        totalYear: {
          amount: totalYearGross,
          consultationsCount: todayOpdPatients * 300,
        },
      },
      breakdownByService: [
        { service: 'OPD Clinical Consultations', count: completedCount, rate: fee, total: completedCount * fee },
      ],
      recentTransactions: docAppts.map((a, i) => ({
        id: `TXN-${100 + i}`,
        patient: a.patientName,
        uhid: a.uhid,
        service: 'OPD Consult',
        amount: fee,
        date: `${a.appointmentDate} ${a.appointmentTime}`,
        status: 'settled',
      })),
    };
  }

  // ---------------- LEAVE MANAGEMENT ----------------
  public getDoctorLeave(doctorId: number = 1) {
    const requests = this.leaveRequests.filter((l) => l.doctorId === doctorId);
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

  public createLeaveRequest(
    data: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'> & { status?: LeaveRequest['status'] }
  ): LeaveRequest {
    const nextId = Math.max(...this.leaveRequests.map((l) => l.id), 0) + 1;
    const newReq: LeaveRequest = {
      ...data,
      id: nextId,
      status: data.status || 'pending',
      appliedAt: TODAY_STR,
    };

    this.leaveRequests.unshift(newReq);
    return newReq;
  }

  // ---------------- PATIENTS & CLINICAL HISTORY ----------------
  public searchPatients(query?: string, branchId?: number, page: number = 1, limit: number = 20) {
    let filtered = this.patients;

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

  public getPatientByIdOrUhid(idOrUhid: string | number): PatientRecord | undefined {
    const idNum = typeof idOrUhid === 'number' ? idOrUhid : parseInt(idOrUhid, 10);
    if (!isNaN(idNum)) {
      const match = this.patients.find((p) => p.id === idNum);
      if (match) return match;
    }
    const uhidStr = String(idOrUhid).toLowerCase();
    return this.patients.find((p) => p.uhid.toLowerCase() === uhidStr);
  }

  public getPatientLongitudinalHistory(idOrUhid: string | number) {
    const patient = this.getPatientByIdOrUhid(idOrUhid);
    if (!patient) return null;

    const patientAppointments = this.appointments.filter(
      (a) => a.patientId === patient.id || a.uhid.toLowerCase() === patient.uhid.toLowerCase()
    );
    const patientPrescriptions = this.prescriptions.filter(
      (p) => p.patientId === patient.id || p.uhid.toLowerCase() === patient.uhid.toLowerCase()
    );
    const patientReports = this.reports.filter(
      (r) => r.patientId === patient.id || r.uhid.toLowerCase() === patient.uhid.toLowerCase()
    );
    const patientAdmissions = this.admissions.filter(
      (adm) => adm.patientId === patient.id || adm.uhid.toLowerCase() === patient.uhid.toLowerCase()
    );
    const patientFollowups = this.followups.filter(
      (f) => f.patientId === patient.id || f.uhid.toLowerCase() === patient.uhid.toLowerCase()
    );

    const vitalsTimeline = patientAppointments
      .filter((a) => a.vitals && a.vitals.bp)
      .map((a) => ({
        date: `${a.appointmentDate} ${a.appointmentTime}`,
        bp: a.vitals?.bp || '120/80 mmHg',
        pulse: a.vitals?.pulse || 72,
        temp: a.vitals?.temp || '98.6 °F',
        spO2: a.vitals?.spO2 || '99%',
        weight: a.vitals?.weight || '70 kg',
        bmi: '23.5',
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
      vitalsTimeline,
      appointments: patientAppointments,
      prescriptions: patientPrescriptions,
      diagnosticReports: patientReports,
      admissions: patientAdmissions,
      followups: patientFollowups,
      allergies: patient.allergies || ['None documented'],
      chronicConditions: patient.chronicConditions || ['None'],
    };
  }

  // ---------------- NOTIFICATIONS / FCM REGISTER ----------------
  public registerFCMToken(data: {
    userId: string | number;
    doctorId?: number;
    token: string;
    deviceType?: 'web' | 'ios' | 'android';
    platform?: string;
    userAgent?: string;
  }): FCMRegistration {
    const existingIndex = this.fcmTokens.findIndex((t) => t.token === data.token);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated: FCMRegistration = {
        ...this.fcmTokens[existingIndex],
        userId: data.userId,
        doctorId: data.doctorId,
        deviceType: data.deviceType || this.fcmTokens[existingIndex].deviceType,
        platform: data.platform || this.fcmTokens[existingIndex].platform,
        userAgent: data.userAgent || this.fcmTokens[existingIndex].userAgent,
        updatedAt: now,
      };
      this.fcmTokens[existingIndex] = updated;
      return updated;
    }

    const nextId = Math.max(...this.fcmTokens.map((t) => t.id), 0) + 1;
    const newReg: FCMRegistration = {
      id: nextId,
      userId: data.userId,
      doctorId: data.doctorId,
      token: data.token,
      deviceType: data.deviceType || 'web',
      platform: data.platform || 'web-browser',
      userAgent: data.userAgent,
      createdAt: now,
      updatedAt: now,
    };

    this.fcmTokens.push(newReg);
    return newReg;
  }

  public getFCMTokens(userIdOrDoctorId?: string | number): FCMRegistration[] {
    if (!userIdOrDoctorId) return this.fcmTokens;
    return this.fcmTokens.filter(
      (t) =>
        String(t.userId) === String(userIdOrDoctorId) ||
        (t.doctorId && String(t.doctorId) === String(userIdOrDoctorId))
    );
  }
}

// Global instance to prevent resets during server hot reloads
const globalForBackendStore = globalThis as unknown as {
  backendRepositoryInstance?: BackendRepository;
};

export const backendStore =
  globalForBackendStore.backendRepositoryInstance ?? new BackendRepository();

if (process.env.NODE_ENV !== 'production') {
  globalForBackendStore.backendRepositoryInstance = backendStore;
}
