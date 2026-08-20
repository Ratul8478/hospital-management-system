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
  facilityType?: 'Hospital' | 'Nursing Home' | 'Diagnostic Center';
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
}

export interface Bed {
  id: number;
  branchId: number;
  bedNumber: string;
  wardType: 'icu' | 'general' | 'private' | 'deluxe';
  dailyCharge: number;
  status: 'available' | 'occupied' | 'maintenance';
  patientName?: string;
}

export interface Medicine {
  id: number;
  branchId: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
}

export interface LabRequest {
  id: number;
  branchId: number;
  requestNumber: string;
  patientName: string;
  testName: string;
  category: string;
  doctorName: string;
  status: 'pending' | 'processing' | 'ready';
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
  receptionCall: '+917003831600',
  receptionWhatsapp: '9733662319',
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
    adminPhone: '9144376971',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 0,
    activeConsultants: 0,
    bedOccupancy: '0 / 0 Beds',
    bedOccupiedCount: 0,
    bedTotalCount: 0,
    facilityType: 'Hospital',
    govRegNumber: 'WB.33735581',
  },
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

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 1,
    branchId: 1,
    name: 'Dr . Jiarul Haque',
    specialty: 'General & Cardiology Medicine',
    fee: 800,
    status: 'available',
    contact: '9804222142'
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

export const INITIAL_MARKETING_REPRESENTATIVES: MarketingRepresentative[] = [];

export const INITIAL_MARKETING_JOIN_REQUESTS: MarketingJoinRequest[] = [];

export const INITIAL_MARKETING_EMAIL_LOGS: MarketingEmailDispatchLog[] = [];



