export interface Branch {
  id: number;
  code: string;
  name: string;
  location: string;
  address?: string;
  branchHead?: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  status: 'active' | 'inactive';
  badgeStatus?: 'ACTIVE' | 'EXPANSION' | 'UPCOMING';
  revenue: number;
  todayRevenueFormatted?: string;
  patientCount: number;
  activeConsultants?: number;
  bedOccupancy: string;
  bedOccupiedCount?: number;
  bedTotalCount?: number;
  facilityType?: 'Hospital' | 'Nursing Home' | 'Diagnostic Center' | 'Super-Specialty Center' | 'Maternity Hospital' | 'Super-Specialty Institute';
  govRegNumber?: string;
}

export interface BranchAdminUser {
  id: number;
  branchId: number;
  branchCode: string;
  branchName: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'vacant' | 'suspended';
  assignedDate: string;
  roleTitle: string;
}

export interface AdminApplicationRequest {
  id: number;
  applicantName: string;
  email: string;
  phone: string;
  targetBranchId: number;
  targetBranchCode: string;
  targetBranchName: string;
  experienceYears: number;
  qualifications: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface MarketingRepresentative {
  id: number;
  referenceId: string; // e.g. REF-MKT-B1-7892
  branchId: number;
  branchCode: string;
  branchName: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  fatherOrMotherName: string;
  dob: string;
  bloodGroup: string;
  aadharNumber: string;
  aadharDocUrl?: string;
  panNumber: string;
  panDocUrl?: string;
  drivingLicenceNumber: string;
  drivingLicenceDocUrl?: string;
  address: string;
  pinCode: string;
  district: string;
  state: string;
  country: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  territory: string;
  experienceYears: number;
  status: 'active' | 'fired' | 'inactive' | 'suspended';
  source?: 'self_registered' | 'branch_hired' | 'super_admin_hired';
  hiredBy?: string;
  approvedDate: string;
  firedDate?: string;
  firedReason?: string;
  branchAdminApprovedDate?: string;
  branchAdminName?: string;
  branchAdminEmail?: string;
  superAdminApprovedDate?: string;
  superAdminName?: string;
  referredPatientsCount: number;
  totalCommissionEarned: number;
  pendingPayout: number;
  commissionRate: string;
  passwordHash?: string;
}

export interface MarketingJoinRequest {
  id: number;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  fatherOrMotherName: string;
  dob: string;
  bloodGroup: string;
  aadharNumber: string;
  aadharDocUrl?: string;
  panNumber: string;
  panDocUrl?: string;
  drivingLicenceNumber: string;
  drivingLicenceDocUrl?: string;
  address: string;
  pinCode: string;
  district: string;
  state: string;
  country: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  targetBranchId: number;
  targetBranchCode: string;
  targetBranchName: string;
  territory: string;
  experienceYears: number;
  expectedMonthlyReferrals: number;
  qualificationsOrNotes: string;
  appliedDate: string;
  source?: 'self_registered' | 'branch_hired' | 'super_admin_hired';
  status: 'pending_branch_review' | 'pending_super_admin_approval' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedReferenceId?: string;
  branchAdminApprovedDate?: string;
  branchAdminName?: string;
  branchAdminEmail?: string;
  superAdminApprovedDate?: string;
  superAdminName?: string;
  password?: string;
}

export interface MarketingEmailDispatchLog {
  id: string;
  requestId: number;
  recipientName: string;
  recipientEmail: string;
  referenceId: string;
  targetBranchId: number;
  targetBranchCode: string;
  targetBranchName: string;
  dispatchedAt: string;
  dispatchedBySuperAdmin: string;
  deliveryStatus: 'delivered' | 'pending' | 'failed';
  smtpServer: string;
  emailSubject: string;
  securityToken: string;
}

export interface Doctor {
  id: number;
  branchId: number;
  name: string;
  specialty: string;
  fee: number;
  status: 'available' | 'busy' | 'off-duty';
  contact: string;
  image?: string;
  avatarUrl?: string;
  email?: string;
  qualification?: string;
  department?: string;
  scheduleTime?: string; // e.g. "10:00 AM - 02:00 PM"
  chamberRoom?: string; // e.g. "OPD Chamber 102"
  registeredBy?: string;
  registrationDate?: string;
}

export interface Patient {
  id: number;
  branchId: number;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  condition: string;
  status: 'opd' | 'admitted' | 'discharged';
  address?: string;
  admittedDate?: string;
  registeredBy?: string;
  registrationDate?: string;
}

export interface Bed {
  id: number;
  branchId: number;
  bedNumber: string;
  wardType: 'icu' | 'general' | 'private' | 'deluxe';
  dailyCharge: number;
  status: 'available' | 'occupied' | 'maintenance';
  patientName?: string;
  patientUhid?: string;
  admissionDate?: string;
  expectedDischargeDate?: string;
  expectedReleaseTime?: string; // e.g. "02:00 PM"
  assignedDoctor?: string;
}

export interface Medicine {
  id: number;
  branchId: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  batchNumber?: string;
  dosageForm?: string; // Tablet, Syrup, Injection, Capsule
}

export interface LabRequest {
  id: number;
  branchId: number;
  requestNumber: string;
  patientName: string;
  patientUhid?: string;
  testName: string;
  category: string;
  doctorName: string;
  status: 'pending' | 'processing' | 'ready';
  testPrice?: number;
  sampleCollectedAt?: string;
  reportUrl?: string;
}

export interface Invoice {
  id: number;
  branchId: number;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface Appointment {
  id: number;
  branchId: number;
  patientName: string;
  uhid: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: number;
  type: 'OPD' | 'Follow-up' | 'Emergency' | 'Consultation';
  status: 'Scheduled' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No-show';
}

export interface AuditLog {
  id: number;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  module: string;
  action: string;
  ipAddress: string;
  metadata: string;
}

export interface SuperAdminProfile {
  hospitalName: string;
  govtRegNumber: string;
  medixRefNumber: string;
  ownerName: string;
  managerName: string;
  ownerContact: string;
  managerContact: string;
  receptionCall: string;
  receptionWhatsapp: string;
  email: string;
  password: string;
  address: string;
}

export const DEFAULT_SUPER_ADMIN_PROFILE: SuperAdminProfile = {
  hospitalName: 'ARIYAN HOSPITAL MULTISPECIALITY',
  govtRegNumber: 'WB.33735581',
  medixRefNumber: 'XXXXXXX',
  ownerName: 'Dr . Jiarul Haque',
  managerName: 'Anichul Haque',
  ownerContact: '9804222142',
  managerContact: '9144376971',
  receptionCall: '+919144376971',
  receptionWhatsapp: '7810900370',
  email: 'ariyanhospital9@gmail.com',
  password: 'admin@2019',
  address: 'Newtown, Noapara, Sukanta Polli Road, Kolkata 700157, West Bengal, India'
};

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 1,
    code: 'ARIYAN-HQ',
    name: 'ARIYAN HOSPITAL MULTISPECIALITY',
    location: 'Kolkata, West Bengal',
    address: 'Newtown, Noapara, Sukanta Polli Road, Kolkata 700157, West Bengal, India',
    branchHead: 'Dr . Jiarul Haque (Owner & Medical Director)',
    adminName: 'Anichul Haque (Super Admin)',
    adminEmail: 'ariyanhospital9@gmail.com',
    adminPhone: '+91 91443 76971',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 0,
    activeConsultants: 4,
    bedOccupancy: 'Emergency & ICU Beds Ready (24x7)',
    bedOccupiedCount: 14,
    bedTotalCount: 40,
    facilityType: 'Hospital',
    govRegNumber: 'WB.33735581',
  },
  {
    id: 2,
    code: 'MEDIX-TRAUMA',
    name: 'Medix Specialty & Trauma Center',
    location: 'Kolkata, West Bengal',
    address: 'EM Bypass Connector, Salt Lake Sector V, Kolkata 700091',
    branchHead: 'Dr. Robert Jenkins (Chief of Surgery)',
    adminName: 'Dr. Robert Jenkins',
    adminEmail: 'trauma@medix.hospital',
    adminPhone: '+91 98310 99482',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 0,
    activeConsultants: 3,
    bedOccupancy: 'Level-1 Trauma & Emergency Standby',
    bedOccupiedCount: 22,
    bedTotalCount: 50,
    facilityType: 'Super-Specialty Center',
    govRegNumber: 'WB.33991204',
  },
  {
    id: 3,
    code: 'MEDIX-MATERNITY',
    name: 'Medix Mother & Child Super-Specialty',
    location: 'Kolkata, West Bengal',
    address: 'Park Circus Clinical Corridor, Kolkata 700017',
    branchHead: 'Dr. Sunita Roy (Head of Neonatology)',
    adminName: 'Dr. Sunita Roy',
    adminEmail: 'maternity@medix.hospital',
    adminPhone: '+91 97480 12345',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 0,
    activeConsultants: 3,
    bedOccupancy: 'NICU Level-3 & Birthing Ready',
    bedOccupiedCount: 18,
    bedTotalCount: 35,
    facilityType: 'Maternity Hospital',
    govRegNumber: 'WB.33876109',
  },
  {
    id: 4,
    code: 'MEDIX-NEURO',
    name: 'Kolkata Institute of Neurosciences & Nephrology',
    location: 'Kolkata, West Bengal',
    address: 'AJC Bose Road, Mullick Bazar, Kolkata 700020',
    branchHead: 'Dr. Debanjan Ghosh (Director of Neuro Sciences)',
    adminName: 'Dr. Debanjan Ghosh',
    adminEmail: 'neuro@medix.hospital',
    adminPhone: '+91 94330 88219',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 0,
    activeConsultants: 3,
    bedOccupancy: 'Acute Stroke & 24x7 Hemodialysis Unit',
    bedOccupiedCount: 29,
    bedTotalCount: 60,
    facilityType: 'Super-Specialty Institute',
    govRegNumber: 'WB.33654128',
  }
];

export const INITIAL_BRANCH_ADMINS: BranchAdminUser[] = [
  {
    id: 1,
    branchId: 1,
    branchCode: 'ARIYAN-HQ',
    branchName: 'ARIYAN HOSPITAL MULTISPECIALITY',
    name: 'Anichul Haque',
    email: 'ariyanhospital9@gmail.com',
    phone: '9144376971',
    status: 'active',
    assignedDate: '2026-08-01',
    roleTitle: 'Super Admin & Hospital General Manager'
  },
];

export const INITIAL_ADMIN_APPLICATIONS: AdminApplicationRequest[] = [];

export const INITIAL_DOCTORS: (Doctor & { image?: string; rating?: string; experience?: string; qualification?: string })[] = [
  // Ariyan Hospital
  {
    id: 101,
    branchId: 1,
    name: 'Dr. Sabyachi Mondal',
    specialty: 'Medicine & Critical Care',
    department: 'Critical Care & Medicine',
    qualification: 'MBBS, MD',
    rating: '0.0',
    experience: '7 years experience',
    fee: 700,
    status: 'available',
    contact: '+91 91443 76971',
    image: ''
  },
  {
    id: 102,
    branchId: 1,
    name: 'Dr . Jiarul Haque',
    specialty: 'General & Cardiology Medicine',
    department: 'Cardiology',
    qualification: 'MBBS, MD (Cardio)',
    rating: '0.0',
    experience: '12 years experience',
    fee: 800,
    status: 'available',
    contact: '+91 91443 76971',
    image: ''
  },
  {
    id: 103,
    branchId: 1,
    name: 'Dr. Sarah Williams',
    specialty: 'Interventional Cardiology & Cath Lab',
    department: 'Cardiology',
    qualification: 'MD, DM (Cardio), FACC',
    rating: '0.0',
    experience: '10 years experience',
    fee: 900,
    status: 'available',
    contact: '+91 91443 76971',
    image: ''
  },
  {
    id: 104,
    branchId: 1,
    name: 'Dr. Ananya Sen',
    specialty: 'Obstetrics & High-Risk Pregnancy',
    department: 'Obstetrics & Gynecology',
    qualification: 'MBBS, MS (OBG)',
    rating: '0.0',
    experience: '8 years experience',
    fee: 750,
    status: 'available',
    contact: '+91 91443 76971',
    image: ''
  },

  // Medix Specialty & Trauma Center
  {
    id: 201,
    branchId: 2,
    name: 'Dr. Robert Jenkins',
    specialty: 'Trauma & Orthopedic Surgery',
    department: 'Orthopedics',
    qualification: 'MS (Ortho), MCh',
    rating: '0.0',
    experience: '15 years experience',
    fee: 1000,
    status: 'available',
    contact: '+91 98310 99482',
    image: ''
  },
  {
    id: 202,
    branchId: 2,
    name: 'Dr. Vikram Malhotra',
    specialty: 'Emergency Triage & Acute Critical Care',
    department: 'Emergency Medicine',
    qualification: 'MD (Emergency Med)',
    rating: '0.0',
    experience: '9 years experience',
    fee: 850,
    status: 'available',
    contact: '+91 98310 99482',
    image: ''
  },
  {
    id: 203,
    branchId: 2,
    name: 'Dr. Priya Nair',
    specialty: 'Neurology & Neurosurgery',
    department: 'Neurology',
    qualification: 'DM (Neuro), MCh',
    rating: '0.0',
    experience: '11 years experience',
    fee: 950,
    status: 'available',
    contact: '+91 98310 99482',
    image: ''
  },

  // Medix Mother & Child Super-Specialty
  {
    id: 301,
    branchId: 3,
    name: 'Dr. Sunita Roy',
    specialty: 'Obstetrics, Gynecology & Pediatrics',
    department: 'Pediatrics',
    qualification: 'MD (Pediatrics), DCH',
    rating: '0.0',
    experience: '14 years experience',
    fee: 800,
    status: 'available',
    contact: '+91 97480 12345',
    image: ''
  },
  {
    id: 302,
    branchId: 3,
    name: 'Dr. Rajesh Sharma',
    specialty: 'Pediatric & Neonatal Intensive Care',
    department: 'NICU & Pediatrics',
    qualification: 'MD (Ped), DM (Neonatology)',
    rating: '0.0',
    experience: '10 years experience',
    fee: 900,
    status: 'available',
    contact: '+91 97480 12345',
    image: ''
  },
  {
    id: 303,
    branchId: 3,
    name: 'Dr. Meera Banerjee',
    specialty: 'Fetal Medicine & Advanced Gynecology',
    department: 'Gynecology',
    qualification: 'MS (OBG), Fellowship Fetal Med',
    rating: '0.0',
    experience: '12 years experience',
    fee: 850,
    status: 'available',
    contact: '+91 97480 12345',
    image: ''
  },

  // Kolkata Institute of Neurosciences & Nephrology
  {
    id: 401,
    branchId: 4,
    name: 'Dr. Debanjan Ghosh',
    specialty: 'Neurology & Neurosurgery',
    department: 'Neurosurgery',
    qualification: 'MCh (Neurosurgery), FINR',
    rating: '0.0',
    experience: '16 years experience',
    fee: 1200,
    status: 'available',
    contact: '+91 94330 88219',
    image: ''
  },
  {
    id: 402,
    branchId: 4,
    name: 'Dr. Pooja Chawla',
    specialty: 'Nephrology & Renal Dialysis Unit',
    department: 'Nephrology',
    qualification: 'DM (Nephrology), DNB',
    rating: '0.0',
    experience: '8 years experience',
    fee: 900,
    status: 'available',
    contact: '+91 94330 88219',
    image: ''
  },
  {
    id: 403,
    branchId: 4,
    name: 'Dr. Amitava Roy',
    specialty: 'Medical & Surgical Oncology',
    department: 'Oncology',
    qualification: 'MD, DM (Medical Oncology)',
    rating: '0.0',
    experience: '13 years experience',
    fee: 1100,
    status: 'available',
    contact: '+91 94330 88219',
    image: ''
  }
];

export const INITIAL_PATIENTS: Patient[] = [];

export const INITIAL_BEDS: Bed[] = [];

export const INITIAL_MEDICINES: Medicine[] = [];

export const INITIAL_LAB_REQUESTS: LabRequest[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    timestamp: '2026-08-20 00:00:00',
    userId: 'USR-SA-01',
    userName: 'Anichul Haque (Super Admin HQ)',
    role: 'Super Admin',
    module: 'System Security',
    action: 'Live Production System Initialized',
    ipAddress: '127.0.0.1',
    metadata: 'ARIYAN HOSPITAL MULTISPECIALITY Live Core System'
  }
];

export interface HospitalReferral {
  id: string | number;
  referralId: string;
  patientId: number;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone?: string;
  patientBlood?: string;
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
  // Connected Marketing Representative (PRO / Marketing Man) Profile
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
  receiptDate?: string;
  estimatedBill?: number;
  referralCommission?: number;
}

export const INITIAL_HOSPITAL_REFERRALS: HospitalReferral[] = [];

export const INITIAL_MARKETING_REPRESENTATIVES: MarketingRepresentative[] = [];

export const INITIAL_MARKETING_JOIN_REQUESTS: MarketingJoinRequest[] = [];

export const INITIAL_MARKETING_EMAIL_LOGS: MarketingEmailDispatchLog[] = [];

export interface HospitalService {
  id: number;
  branchId: number;
  name: string;
  category: string; // e.g. "Emergency & Trauma", "ICU & Critical Care", "Diagnostics & Imaging", "Pathology & Lab", "OPD & Consultations", "Surgery", "Pharmacy", "Maternity & Child", "Dialysis", "Dental", "Eye Care", "Cardiology", "General"
  department?: string;
  description: string;
  price?: number;
  priceUnit?: string; // e.g. "Per Consultation", "Per Test", "Per Day", "Starting From", "Fixed", "Free"
  status: 'active' | 'inactive' | '24x7' | 'available' | 'unavailable';
  is24x7?: boolean;
  isEmergency?: boolean;
  timing?: string; // e.g. "24x7 All Days", "08:00 AM - 08:00 PM"
  roomOrFloor?: string; // e.g. "Ground Floor, Emergency Wing"
  contactNumber?: string;
  icon?: string;
  createdDate?: string;
  updatedDate?: string;
  addedBy?: string; // e.g. "Receptionist"
}

export const INITIAL_HOSPITAL_SERVICES: HospitalService[] = [];

