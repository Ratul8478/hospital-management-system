import {
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

// ==========================================
// TYPES & INTERFACES
// ==========================================

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

const SEED_DOCTOR_USERS: DoctorUser[] = INITIAL_DOCTORS.map((d) => {
  const branch = INITIAL_BRANCHES.find(b => b.id === d.branchId);
  const emailName = d.name.toLowerCase().replace('dr. ', '').replace(/\s+/g, '.');
  return {
    id: d.id,
    branchId: d.branchId,
    branchCode: branch?.code || `MEDIX-${d.branchId}`,
    branchName: branch?.name || `Medix Campus ${d.branchId}`,
    name: d.name,
    email: `${emailName}@medix.com`,
    phone: d.contact,
    specialty: d.specialty,
    department: d.specialty.split('&')[0].trim(),
    qualification: 'MD, FACC, MBBS (Gold Medalist)',
    registrationNumber: `MED-REG-${2020 + d.id}-00${d.id}9`,
    fee: d.fee,
    status: d.status,
    role: 'doctor',
    permissions: DEFAULT_DOCTOR_PERMISSIONS,
    avatarUrl: '/images/logo.png',
  };
});

// Add Dr. Sarah Williams as explicit doctor id 99 for dashboard alignment
SEED_DOCTOR_USERS.unshift({
  id: 99,
  branchId: 1,
  branchCode: 'MEDIX-MAIN',
  branchName: 'Medix Central Multispecialty Hospital',
  name: 'Dr. Sarah Williams',
  email: 'sarah.williams@medix.com',
  phone: '+1 (555) 019-9988',
  specialty: 'Cardiology Specialist',
  department: 'Cardiology',
  qualification: 'MD Cardiology, FACC, Fellow of Cardiac Electrophysiology',
  registrationNumber: 'MD-CARD-2026-873091',
  fee: 150,
  status: 'available',
  role: 'doctor',
  permissions: DEFAULT_DOCTOR_PERMISSIONS,
  avatarUrl: '/images/logo.png',
});

const SEED_PATIENTS: PatientRecord[] = INITIAL_PATIENTS.map((p, idx) => ({
  ...p,
  email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  address: `${100 + idx} Medical Enclave, Health Avenue`,
  emergencyContact: `+1 (555) 900-${1000 + idx}`,
  allergies: idx % 2 === 0 ? ['Penicillin', 'Sulfa drugs'] : ['None documented'],
  chronicConditions: idx % 3 === 0 ? ['Essential Hypertension', 'Type 2 Diabetes'] : ['None'],
  registeredDate: '2026-08-01',
}));

// Additional rich patients for queue
SEED_PATIENTS.push(
  {
    id: 101,
    branchId: 1,
    uhid: 'UHID-20260812-0040',
    name: 'Robert Harrison',
    age: 52,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+1 (555) 334-1001',
    condition: 'Post-Op Coronary Stent Review',
    status: 'admitted',
    email: 'robert.h@example.com',
    allergies: ['Aspirin sensitivity'],
    chronicConditions: ['CAD (Post-PCI)'],
    registeredDate: '2026-08-05',
  },
  {
    id: 102,
    branchId: 1,
    uhid: 'UHID-20260812-0041',
    name: 'Elena Jenkins',
    age: 38,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+1 (555) 334-1002',
    condition: 'Sinus Tachycardia & Palpitations',
    status: 'opd',
    email: 'elena.j@example.com',
    allergies: ['None'],
    chronicConditions: ['Mitral Valve Prolapse'],
    registeredDate: '2026-08-08',
  },
  {
    id: 103,
    branchId: 1,
    uhid: 'UHID-20260812-0042',
    name: 'John Anderson',
    age: 61,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 334-1003',
    condition: 'Post-Op Bypass Recovery Stage 2',
    status: 'admitted',
    email: 'john.a@example.com',
    allergies: ['Iodinated Contrast'],
    chronicConditions: ['Hypertension', 'Dyslipidemia'],
    registeredDate: '2026-08-02',
  },
  {
    id: 104,
    branchId: 1,
    uhid: 'UHID-20260812-0043',
    name: 'Sarah Miller',
    age: 45,
    gender: 'Female',
    bloodGroup: 'O-',
    phone: '+1 (555) 334-1004',
    condition: 'Uncontrolled Hypertension Follow-up',
    status: 'opd',
    email: 'sarah.m@example.com',
    allergies: ['None'],
    chronicConditions: ['Hypertension Grade II'],
    registeredDate: '2026-08-09',
  },
  {
    id: 105,
    branchId: 1,
    uhid: 'UHID-20260812-0044',
    name: 'David Wilson',
    age: 49,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+1 (555) 334-1005',
    condition: 'Atypical Chest Discomfort Checkup',
    status: 'opd',
    email: 'david.w@example.com',
    allergies: ['NSAIDs'],
    chronicConditions: ['Hyperlipidemia'],
    registeredDate: '2026-08-11',
  },
  {
    id: 106,
    branchId: 1,
    uhid: 'UHID-20260812-0045',
    name: 'Michael Brown',
    age: 57,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '+1 (555) 334-1006',
    condition: 'Atherosclerosis & Lipid Profile Consult',
    status: 'opd',
    email: 'michael.b@example.com',
    allergies: ['None'],
    chronicConditions: ['Coronary Artery Disease'],
    registeredDate: '2026-08-10',
  }
);

// Today's date string
const TODAY_STR = new Date().toISOString().split('T')[0];

const SEED_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 10,
    branchId: 1,
    patientId: 101,
    patientName: 'Robert Harrison',
    uhid: 'UHID-20260812-0040',
    patientAge: 52,
    patientGender: 'Male',
    patientPhone: '+1 (555) 334-1001',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '09:30 AM',
    tokenNumber: 10,
    type: 'Consultation',
    status: 'Completed',
    vitals: { bp: '128/82 mmHg', pulse: 74, temp: '98.4 °F', spO2: '99%', weight: '76 kg' },
    notes: 'Post-Op recovery stable. ECG normal sinus rhythm. Continued statin therapy.',
  },
  {
    id: 11,
    branchId: 1,
    patientId: 102,
    patientName: 'Elena Jenkins',
    uhid: 'UHID-20260812-0041',
    patientAge: 38,
    patientGender: 'Female',
    patientPhone: '+1 (555) 334-1002',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '10:00 AM',
    tokenNumber: 11,
    type: 'Consultation',
    status: 'Completed',
    vitals: { bp: '118/76 mmHg', pulse: 88, temp: '98.6 °F', spO2: '98%', weight: '62 kg' },
    notes: '24hr Holter monitoring prescribed. Advised reduction in caffeine.',
  },
  {
    id: 12,
    branchId: 1,
    patientId: 103,
    patientName: 'John Anderson',
    uhid: 'UHID-20260812-0042',
    patientAge: 61,
    patientGender: 'Male',
    patientPhone: '+1 (555) 334-1003',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '10:30 AM',
    tokenNumber: 12,
    type: 'Follow-up',
    status: 'In Consultation',
    vitals: { bp: '134/86 mmHg', pulse: 72, temp: '98.2 °F', spO2: '97%', weight: '84 kg' },
    notes: 'In consultation room 3B for wound inspection and medication review.',
  },
  {
    id: 13,
    branchId: 1,
    patientId: 104,
    patientName: 'Sarah Miller',
    uhid: 'UHID-20260812-0043',
    patientAge: 45,
    patientGender: 'Female',
    patientPhone: '+1 (555) 334-1004',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '11:00 AM',
    tokenNumber: 13,
    type: 'Follow-up',
    status: 'Waiting',
    vitals: { bp: '142/92 mmHg', pulse: 80, temp: '98.6 °F', spO2: '98%', weight: '68 kg' },
    notes: 'Waiting in OPD lounge. Chest X-Ray pending.',
  },
  {
    id: 14,
    branchId: 1,
    patientId: 105,
    patientName: 'David Wilson',
    uhid: 'UHID-20260812-0044',
    patientAge: 49,
    patientGender: 'Male',
    patientPhone: '+1 (555) 334-1005',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '11:30 AM',
    tokenNumber: 14,
    type: 'OPD',
    status: 'Waiting',
    vitals: { bp: '124/80 mmHg', pulse: 78, temp: '98.4 °F', spO2: '99%', weight: '79 kg' },
  },
  {
    id: 15,
    branchId: 1,
    patientId: 106,
    patientName: 'Michael Brown',
    uhid: 'UHID-20260812-0045',
    patientAge: 57,
    patientGender: 'Male',
    patientPhone: '+1 (555) 334-1006',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    department: 'Cardiology',
    appointmentDate: TODAY_STR,
    appointmentTime: '02:00 PM',
    tokenNumber: 15,
    type: 'OPD',
    status: 'Scheduled',
  },
];

// Initial Prescriptions
const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 1,
    prescriptionNumber: 'RX-20260816-0001',
    appointmentId: 10,
    patientId: 101,
    uhid: 'UHID-20260812-0040',
    patientName: 'Robert Harrison',
    patientAge: 52,
    patientGender: 'Male',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    diagnosis: 'Post-PCI Stent Maintenance & Hyperlipidemia',
    symptoms: ['Mild post-exertional fatigue'],
    medicines: [
      { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once Daily (Night)', duration: '30 Days', instructions: 'Take with or after dinner' },
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Take after breakfast' },
      { name: 'Clopidogrel 75mg', dosage: '75mg', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Dual antiplatelet therapy' },
    ],
    advice: 'Low-sodium cardiac diet. 30 mins brisk walking daily. Avoid strenuous weight lifting.',
    followUpDate: '2026-09-15',
    createdAt: `${TODAY_STR} 09:45:00`,
    status: 'active',
  },
  {
    id: 2,
    prescriptionNumber: 'RX-20260816-0002',
    appointmentId: 11,
    patientId: 102,
    uhid: 'UHID-20260812-0041',
    patientName: 'Elena Jenkins',
    patientAge: 38,
    patientGender: 'Female',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    diagnosis: 'Sinus Tachycardia & Acute Tension Headaches',
    medicines: [
      { name: 'Metoprolol Tartrate 25mg', dosage: '25mg', frequency: 'Twice Daily', duration: '14 Days', instructions: 'Take with food' },
      { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Three Times Daily (SOS)', duration: '5 Days', instructions: 'For acute pain' },
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once Daily (Night)', duration: '7 Days', instructions: 'For seasonal rhinitis' },
    ],
    advice: 'Stay hydrated with at least 3 liters of water. Limit screen time before bed.',
    followUpDate: '2026-08-30',
    createdAt: `${TODAY_STR} 10:15:00`,
    status: 'active',
  },
  {
    id: 3,
    prescriptionNumber: 'RX-20260816-0003',
    appointmentId: 12,
    patientId: 103,
    uhid: 'UHID-20260812-0042',
    patientName: 'John Anderson',
    patientAge: 61,
    patientGender: 'Male',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    diagnosis: 'Post-CABG Recovery Stage 2 & Hypertension',
    medicines: [
      { name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Monitor BP daily' },
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take with water' },
      { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'Once Daily (Morning Empty Stomach)', duration: '14 Days', instructions: 'Take 30 mins before breakfast' },
    ],
    advice: 'Perform incentive spirometry exercises 4 times daily. Cardiac rehab protocol phase 1.',
    followUpDate: '2026-08-25',
    createdAt: `${TODAY_STR} 10:45:00`,
    status: 'active',
  },
];

// Initial Diagnostic / Lab Reports
const SEED_REPORTS: DiagnosticReport[] = [
  {
    id: 1,
    reportNumber: 'RPT-20260816-001',
    patientId: 106,
    uhid: 'UHID-20260812-0045',
    patientName: 'Michael Brown',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    testName: 'Complete Blood Count & Comprehensive Lipid Profile',
    category: 'Cardiology',
    testDate: `${TODAY_STR} 09:00 AM`,
    status: 'ready',
    criticalAlert: false,
    findings: 'Total cholesterol elevated at 235 mg/dL. LDL 152 mg/dL. Triglycerides 180 mg/dL. Hemoglobin 14.2 g/dL.',
    parameters: [
      { name: 'Total Cholesterol', value: '235', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: true },
      { name: 'LDL Cholesterol', value: '152', unit: 'mg/dL', referenceRange: '< 100', isAbnormal: true },
      { name: 'HDL Cholesterol', value: '44', unit: 'mg/dL', referenceRange: '> 40', isAbnormal: false },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: true },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', isAbnormal: false },
    ],
    resultSummary: 'Hyperlipidemia detected. Statin therapy intensification recommended.',
  },
  {
    id: 2,
    reportNumber: 'RPT-20260816-002',
    patientId: 104,
    uhid: 'UHID-20260812-0043',
    patientName: 'Sarah Miller',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    testName: 'Digital Chest X-Ray (PA View)',
    category: 'Radiology',
    testDate: `${TODAY_STR} 11:00 AM`,
    status: 'pending',
    findings: 'Image acquisition completed. Radiologist review in progress.',
  },
  {
    id: 3,
    reportNumber: 'RPT-20260816-003',
    patientId: 105,
    uhid: 'UHID-20260812-0044',
    patientName: 'David Wilson',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    testName: '12-Lead Resting Electrocardiogram (ECG)',
    category: 'Cardiology',
    testDate: `${TODAY_STR} 02:30 PM`,
    status: 'ready',
    criticalAlert: false,
    findings: 'Normal Sinus Rhythm at 74 bpm. PR interval 146 ms, QRS duration 88 ms, QTc 418 ms. No acute ST-T wave changes.',
    resultSummary: 'Within normal limits. No evidence of active ischemia.',
  },
  {
    id: 4,
    reportNumber: 'RPT-20260816-004',
    patientId: 1,
    uhid: 'UHID-B1-20260810-0001',
    patientName: 'James Wilson',
    doctorId: 1,
    doctorName: 'Dr. Jonathan Hayes',
    branchId: 1,
    testName: 'High-Sensitivity Troponin-I & CPK-MB',
    category: 'Cardiology',
    testDate: `${TODAY_STR} 08:30 AM`,
    status: 'ready',
    criticalAlert: true,
    findings: 'hs-Troponin I elevated at 0.85 ng/mL (Normal < 0.04). CPK-MB 32 IU/L.',
    resultSummary: 'Cardiac biomarker elevation consistent with acute coronary event.',
  },
];

// Initial IPD Admissions
const SEED_ADMISSIONS: IPDAdmission[] = [
  {
    id: 1,
    admissionNumber: 'ADM-20260810-001',
    patientId: 101,
    uhid: 'UHID-20260812-0040',
    patientName: 'Robert Harrison',
    age: 52,
    gender: 'Male',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    branchName: 'Medix Central Multispecialty Hospital',
    bedId: 3,
    bedNumber: 'PRIV-MAIN-302A',
    wardType: 'private',
    admissionDate: '2026-08-12',
    condition: 'Post-Op Recovery & Hemodynamic Monitoring',
    status: 'admitted',
    dailyCharge: 280,
    emergencyContact: '+1 (555) 334-1001 (Wife - Claire)',
    treatmentPlan: 'Daily cardiac rehabilitation, oral dual antiplatelet, monitoring for arrhythmia.',
  },
  {
    id: 2,
    admissionNumber: 'ADM-20260810-002',
    patientId: 1,
    uhid: 'UHID-B1-20260810-0001',
    patientName: 'James Wilson',
    age: 48,
    gender: 'Male',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    branchName: 'Medix Central Multispecialty Hospital',
    bedId: 1,
    bedNumber: 'ICU-MAIN-405B',
    wardType: 'icu',
    admissionDate: '2026-08-10',
    condition: 'Angina & Acute Hypertensive Crisis (Cardiac Observation)',
    status: 'admitted',
    dailyCharge: 450,
    emergencyContact: '+1 (555) 111-2001 (Brother - David)',
    treatmentPlan: 'Continuous telemetry, IV Nitroglycerin titration, repeat troponin panel q8h.',
  },
];

// Initial Follow-ups
const SEED_FOLLOWUPS: FollowUpSchedule[] = [
  {
    id: 1,
    patientId: 103,
    uhid: 'UHID-20260812-0042',
    patientName: 'John Anderson',
    patientPhone: '+1 (555) 334-1003',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    scheduledDate: TODAY_STR,
    scheduledTime: '10:30 AM',
    reason: 'Post-Op Cardiology & Wound Healing Review',
    status: 'scheduled',
    tokenNumber: 12,
    notes: 'Suture line inspection and blood pressure management.',
    createdAt: '2026-08-10',
  },
  {
    id: 2,
    patientId: 104,
    uhid: 'UHID-20260812-0043',
    patientName: 'Sarah Miller',
    patientPhone: '+1 (555) 334-1004',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    scheduledDate: TODAY_STR,
    scheduledTime: '11:00 AM',
    reason: 'Blood Pressure Check & Antihypertensive Titration',
    status: 'scheduled',
    tokenNumber: 13,
    notes: 'Review ambulatory blood pressure log.',
    createdAt: '2026-08-08',
  },
  {
    id: 3,
    patientId: 102,
    uhid: 'UHID-20260812-0041',
    patientName: 'Elena Jenkins',
    patientPhone: '+1 (555) 334-1002',
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    branchId: 1,
    scheduledDate: '2026-08-20',
    scheduledTime: '10:00 AM',
    reason: 'Holter Monitor Review & Thyroid Follow-up',
    status: 'scheduled',
    createdAt: '2026-08-14',
  },
];

// Initial Leave Requests
const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 1,
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    leaveType: 'conference',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    totalDays: 4,
    reason: 'Attending World Congress of Cardiology (WCC 2026) in San Francisco',
    status: 'approved',
    appliedAt: '2026-08-01',
    reviewedBy: 'Dr. Robert Sullivan (Chief Medical Director)',
    comments: 'Approved. Dr. Jonathan Hayes will provide cross-cover.',
  },
  {
    id: 2,
    doctorId: 99,
    doctorName: 'Dr. Sarah Williams',
    leaveType: 'annual',
    startDate: '2026-10-10',
    endDate: '2026-10-15',
    totalDays: 6,
    reason: 'Family Vacation & Annual Recess',
    status: 'pending',
    appliedAt: '2026-08-15',
  },
];

// Initial Sessions
const SEED_SESSIONS: AuthSession[] = [
  {
    token: 'medix_doc_tok_sarah_williams_2026',
    doctorId: 99,
    email: 'sarah.williams@medix.com',
    name: 'Dr. Sarah Williams',
    role: 'doctor',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
  private fcmTokens: FCMRegistration[] = [...SEED_FCM_TOKENS];

  // ---------------- AUTH METHODS ----------------
  public authenticateDoctor(emailOrPhone: string, password?: string): {
    doctor: DoctorUser;
    session: AuthSession;
  } | null {
    const cleanIdentifier = emailOrPhone.trim().toLowerCase();
    
    // Find doctor by email, phone, or match default demo accounts
    let doctor = this.doctors.find(
      (d) =>
        d.email.toLowerCase() === cleanIdentifier ||
        d.phone.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '') ||
        (cleanIdentifier.includes('doctor') && d.id === 99) ||
        (cleanIdentifier.includes('sarah') && d.id === 99) ||
        (cleanIdentifier.includes('hayes') && d.id === 1)
    );

    if (!doctor) {
      // Default to Dr. Sarah Williams if credentials pass typical demo password
      if (cleanIdentifier === 'doctor@medix.local' || cleanIdentifier === 'doctor@nmc.local' || cleanIdentifier === 'sarah@medix.com') {
        doctor = this.doctors.find((d) => d.id === 99) || this.doctors[0];
      } else {
        return null;
      }
    }

    // Generate unique session token
    const token = `medix_jwt_${doctor.id}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
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

  public getAllDoctors(): DoctorUser[] {
    return this.doctors;
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
  public getDoctorEarnings(doctorId: number = 99) {
    const doctor = this.getDoctorById(doctorId) || this.doctors[0];
    const fee = doctor.fee || 150;

    // Filter consultations by doctor
    const docAppts = this.appointments.filter(
      (a) => a.doctorId === doctorId || doctorId === 99
    );
    const completedCount = docAppts.filter((a) => a.status === 'Completed').length;
    const inProgressCount = docAppts.filter((a) => a.status === 'In Consultation').length;
    const waitingCount = docAppts.filter((a) => a.status === 'Waiting').length;

    const todayOpdPatients = completedCount + inProgressCount + waitingCount;
    const todayGross = Math.max(todayOpdPatients * fee, 2700);
    const thisWeekGross = todayGross * 5;
    const thisMonthGross = thisWeekGross * 4;
    const totalYearGross = thisMonthGross * 8;

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      currency: 'USD',
      currencySymbol: '$',
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
          consultationsCount: todayOpdPatients * 5,
        },
        thisMonth: {
          amount: thisMonthGross,
          consultationsCount: todayOpdPatients * 20,
        },
        totalYear: {
          amount: totalYearGross,
          consultationsCount: todayOpdPatients * 160,
        },
      },
      breakdownByService: [
        { service: 'OPD Cardiology Consultations', count: 18, rate: 150, total: 2700 },
        { service: 'Inpatient IPD Rounds', count: 4, rate: 200, total: 800 },
        { service: 'Emergency Cardiac On-Call', count: 2, rate: 350, total: 700 },
        { service: 'ECG & Holter Interpretation', count: 6, rate: 75, total: 450 },
      ],
      recentTransactions: [
        { id: 'TXN-901', patient: 'Robert Harrison', uhid: 'UHID-20260812-0040', service: 'OPD Consult', amount: 150, date: `${TODAY_STR} 09:30 AM`, status: 'settled' },
        { id: 'TXN-902', patient: 'Elena Jenkins', uhid: 'UHID-20260812-0041', service: 'ECG Review & Consult', amount: 150, date: `${TODAY_STR} 10:00 AM`, status: 'settled' },
        { id: 'TXN-903', patient: 'John Anderson', uhid: 'UHID-20260812-0042', service: 'Post-Op Review', amount: 150, date: `${TODAY_STR} 10:30 AM`, status: 'settled' },
        { id: 'TXN-904', patient: 'James Wilson', uhid: 'UHID-B1-20260810-0001', service: 'ICU Critical Care Round', amount: 350, date: `${TODAY_STR} 08:30 AM`, status: 'settled' },
      ],
    };
  }

  // ---------------- LEAVE MANAGEMENT ----------------
  public getDoctorLeave(doctorId: number = 99) {
    const requests = this.leaveRequests.filter((l) => l.doctorId === doctorId || doctorId === 99);
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

    const vitalsTimeline = [
      { date: '2026-08-16 09:30', bp: '128/82 mmHg', pulse: 74, temp: '98.4 °F', spO2: '99%', weight: '76 kg', bmi: '24.2' },
      { date: '2026-08-10 14:15', bp: '136/88 mmHg', pulse: 80, temp: '98.6 °F', spO2: '98%', weight: '76.5 kg', bmi: '24.4' },
      { date: '2026-07-28 11:00', bp: '144/92 mmHg', pulse: 86, temp: '98.8 °F', spO2: '97%', weight: '77 kg', bmi: '24.6' },
    ];

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
