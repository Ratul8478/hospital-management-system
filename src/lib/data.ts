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
  email: string;
  phone: string;
  territory: string;
  experienceYears: number;
  status: 'active' | 'inactive' | 'suspended';
  approvedDate: string;
  approvedByAdminName?: string;
  approvedByAdminEmail?: string;
  referredPatientsCount: number;
  totalCommissionEarned: number;
  pendingPayout: number;
  commissionRate: string;
}

export interface MarketingJoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  targetBranchId: number;
  targetBranchCode: string;
  targetBranchName: string;
  territory: string;
  experienceYears: number;
  expectedMonthlyReferrals: number;
  qualificationsOrNotes: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedReferenceId?: string;
  approvedByAdminName?: string;
  approvedByAdminEmail?: string;
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

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 1,
    code: 'MEDIX-MAIN',
    name: 'Medix Central Multispecialty Hospital',
    location: 'Mumbai (Central Campus)',
    address: 'Plot 104, Healthcare City Parkway, Medical Enclave, Mumbai - 400001',
    branchHead: 'Dr. Robert Sullivan (Chief Medical Director)',
    adminName: 'Dr. Robert Sullivan',
    adminEmail: 'admin@nmc.local',
    adminPhone: '+91 98200 11223',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 345000,
    todayRevenueFormatted: '₹ 3,45,000',
    patientCount: 42,
    activeConsultants: 42,
    bedOccupancy: '84 / 120 Beds',
    bedOccupiedCount: 84,
    bedTotalCount: 120,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-MH-2026-001',
  },
  {
    id: 2,
    code: 'MEDIX-SOUTH',
    name: 'Medix Specialty & Trauma Center',
    location: 'Bengaluru (South Campus)',
    address: '45, Outer Ring Road, Tech Corridor, Bengaluru - 560103',
    branchHead: 'Dr. Suresh Verma (HOD Trauma & Ortho)',
    adminName: 'Dr. Ananya Roy',
    adminEmail: 'ananya.roy@medix.local',
    adminPhone: '+91 98450 33445',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 215400,
    todayRevenueFormatted: '₹ 2,15,400',
    patientCount: 28,
    activeConsultants: 28,
    bedOccupancy: '58 / 75 Beds',
    bedOccupiedCount: 58,
    bedTotalCount: 75,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-KA-2026-002',
  },
  {
    id: 3,
    code: 'MEDIX-NORTH',
    name: 'Medix Mother & Child Super-Specialty',
    location: 'New Delhi (North Campus)',
    address: '12-A, Ring Road Enclave, Model Town, Delhi - 110009',
    branchHead: 'Dr. Shalini Gupta (Chief Gynecologist)',
    adminName: 'Dr. Vikram Malhotra',
    adminEmail: 'vikram.m@medix.local',
    adminPhone: '+91 98110 55667',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 182900,
    todayRevenueFormatted: '₹ 1,82,900',
    patientCount: 22,
    activeConsultants: 22,
    bedOccupancy: '46 / 60 Beds',
    bedOccupiedCount: 46,
    bedTotalCount: 60,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-DL-2026-003',
  },
  {
    id: 4,
    code: 'MEDIX-WEST',
    name: 'Medix Daycare & Diagnostic Satellite Hub',
    location: 'Pune (West Campus)',
    address: 'Kalyani Nagar Main Road, Pune - 411006',
    branchHead: 'Dr. Meera Joshi (Pathology Director)',
    adminName: 'Rajesh Patil',
    adminEmail: 'rajesh.p@medix.local',
    adminPhone: '+91 98230 77880',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 94500,
    todayRevenueFormatted: '₹ 94,500',
    patientCount: 15,
    activeConsultants: 15,
    bedOccupancy: '12 / 25 Beds',
    bedOccupiedCount: 12,
    bedTotalCount: 25,
    facilityType: 'Diagnostic Center',
    govRegNumber: 'GOVT-REG-MH-2026-004',
  },
  {
    id: 5,
    code: 'MEDIX-EAST',
    name: 'Medix Cardiac & Neuro Institute (Upcoming)',
    location: 'Kolkata (East Campus)',
    address: 'Sector V, Salt Lake City, Kolkata - 700091',
    branchHead: 'Dr. Alok Banerjee (Sr. Neurosurgeon)',
    adminName: 'Debanjan Sen',
    adminEmail: 'debanjan.s@medix.local',
    adminPhone: '+91 98300 99001',
    status: 'active',
    badgeStatus: 'EXPANSION',
    revenue: 0,
    todayRevenueFormatted: '₹ 0',
    patientCount: 18,
    activeConsultants: 18,
    bedOccupancy: '0 / 100 Beds',
    bedOccupiedCount: 0,
    bedTotalCount: 100,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-WB-2026-005',
  },
  {
    id: 6,
    code: 'MEDIX-CENTRAL-2',
    name: 'Medix Advanced Oncology Care Center',
    location: 'Hyderabad (Central Campus II)',
    address: 'Gachibowli Financial District, Hyderabad - 500032',
    branchHead: 'Dr. K. Srinivas Rao (Chief Oncologist)',
    adminName: 'Rohan Deshmukh',
    adminEmail: 'rohan.d@medix.local',
    adminPhone: '+91 98490 22334',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 280000,
    todayRevenueFormatted: '₹ 2,80,000',
    patientCount: 34,
    activeConsultants: 30,
    bedOccupancy: '65 / 80 Beds',
    bedOccupiedCount: 65,
    bedTotalCount: 80,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-TS-2026-006',
  },
  {
    id: 7,
    code: 'MEDIX-NORTH-EAST',
    name: 'Medix Regional Wellness & Nephrology Clinic',
    location: 'Guwahati (North-East Campus)',
    address: 'GS Road, Dispur, Guwahati - 781005',
    branchHead: 'Dr. Bipin Sarma (Nephrology HOD)',
    adminName: 'Priya Bordoloi',
    adminEmail: 'priya.b@medix.local',
    adminPhone: '+91 98640 11223',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 140000,
    todayRevenueFormatted: '₹ 1,40,000',
    patientCount: 20,
    activeConsultants: 16,
    bedOccupancy: '30 / 40 Beds',
    bedOccupiedCount: 30,
    bedTotalCount: 40,
    facilityType: 'Nursing Home',
    govRegNumber: 'GOVT-REG-AS-2026-007',
  },
  {
    id: 8,
    code: 'MEDIX-COASTAL',
    name: 'Medix Coastal Orthopedic & Rehab Institute',
    location: 'Chennai (Coastal Campus)',
    address: 'Old Mahabalipuram Road, Sholinganallur, Chennai - 600119',
    branchHead: 'Dr. R. Natarajan (Sr. Ortho Surgeon)',
    adminName: 'Siddharth Iyer',
    adminEmail: 'siddharth.i@medix.local',
    adminPhone: '+91 98400 44556',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 195000,
    todayRevenueFormatted: '₹ 1,95,000',
    patientCount: 26,
    activeConsultants: 24,
    bedOccupancy: '42 / 50 Beds',
    bedOccupiedCount: 42,
    bedTotalCount: 50,
    facilityType: 'Hospital',
    govRegNumber: 'GOVT-REG-TN-2026-008',
  },
  {
    id: 9,
    code: 'MEDIX-SATELLITE',
    name: 'Medix Emergency & Satellite Poly-Clinic',
    location: 'Ahmedabad (West Corridor)',
    address: 'SG Highway, Bodakdev, Ahmedabad - 380054',
    branchHead: 'Dr. Harshil Patel (Emergency Director)',
    adminName: 'Nisha Shah',
    adminEmail: 'nisha.s@medix.local',
    adminPhone: '+91 98790 66778',
    status: 'active',
    badgeStatus: 'ACTIVE',
    revenue: 110000,
    todayRevenueFormatted: '₹ 1,10,000',
    patientCount: 16,
    activeConsultants: 14,
    bedOccupancy: '18 / 30 Beds',
    bedOccupiedCount: 18,
    bedTotalCount: 30,
    facilityType: 'Diagnostic Center',
    govRegNumber: 'GOVT-REG-GJ-2026-009',
  },
];

export const INITIAL_BRANCH_ADMINS: BranchAdminUser[] = [
  { id: 1, branchId: 1, branchCode: 'MAIN-01', branchName: 'Medix City Hospital — Main Central Branch', name: 'Arthur Pendelton', email: 'admin.main@medix.com', phone: '+1 (555) 101-0001', status: 'active', assignedDate: '2025-01-15', roleTitle: 'Branch Central Admin' },
  { id: 2, branchId: 2, branchCode: 'NORTH-02', branchName: 'Medix Metro Care — North Suburb Branch', name: 'Elena Rostova', email: 'admin.north@medix.com', phone: '+1 (555) 102-0002', status: 'active', assignedDate: '2025-02-10', roleTitle: 'Branch Central Admin' },
  { id: 3, branchId: 3, branchCode: 'EAST-03', branchName: 'Medix Sunrise Clinic — East Coast Branch', name: 'Marcus Vance', email: 'admin.east@medix.com', phone: '+1 (555) 103-0003', status: 'active', assignedDate: '2025-03-01', roleTitle: 'Branch Central Admin' },
  { id: 4, branchId: 4, branchCode: 'WEST-04', branchName: 'Medix Valley Medical — West Coast Branch', name: 'David Sterling', email: 'admin.west@medix.com', phone: '+1 (555) 104-0004', status: 'active', assignedDate: '2025-04-12', roleTitle: 'Branch Central Admin' },
  { id: 5, branchId: 5, branchCode: 'SOUTH-05', branchName: 'Medix South Care Specialty Hospital', name: 'Dr. Samantha Vance', email: 'admin.south@medix.com', phone: '+1 (555) 105-0005', status: 'active', assignedDate: '2025-05-20', roleTitle: 'Branch Central Admin' },
  { id: 6, branchId: 6, branchCode: 'MIDWEST-06', branchName: 'Medix Midwest General Hospital', name: 'Vikram Malhotra', email: 'admin.midwest@medix.com', phone: '+1 (555) 106-0006', status: 'active', assignedDate: '2025-06-18', roleTitle: 'Branch Central Admin' },
  { id: 7, branchId: 7, branchCode: 'FLORIDA-07', branchName: 'Medix Apex Heart & Trauma Center', name: 'Beatrice Holloway', email: 'admin.apex@medix.com', phone: '+1 (555) 107-0007', status: 'active', assignedDate: '2025-07-22', roleTitle: 'Branch Central Admin' },
  { id: 8, branchId: 8, branchCode: 'PACIFIC-08', branchName: 'Medix St. Jude Regional Medical Center', name: 'Gabriel Thorne', email: 'admin.stjude@medix.com', phone: '+1 (555) 108-0008', status: 'active', assignedDate: '2025-08-05', roleTitle: 'Branch Central Admin' },
  { id: 9, branchId: 9, branchCode: 'ROCKY-09', branchName: 'Medix Horizon Children & Maternity Center', name: 'Olivia Bennett', email: 'admin.horizon@medix.com', phone: '+1 (555) 109-0009', status: 'active', assignedDate: '2025-09-14', roleTitle: 'Branch Central Admin' },
];

export const INITIAL_ADMIN_APPLICATIONS: AdminApplicationRequest[] = [
  {
    id: 1,
    applicantName: "Dr. Alexander Sterling",
    email: "alexander.sterling@healthcare.org",
    phone: "+1 (555) 342-9911",
    targetBranchId: 5,
    targetBranchCode: "SOUTH-05",
    targetBranchName: "Medix South Care Specialty Hospital",
    experienceYears: 12,
    qualifications: "M.D. Healthcare Administration, Former Chief Medical Director",
    appliedDate: "2026-08-12",
    status: "pending",
    notes: "Applied for Branch Central Admin post with 12 years hospital operations leadership."
  },
  {
    id: 2,
    applicantName: "Dr. Clara Oswald",
    email: "clara.oswald@traumacare.com",
    phone: "+1 (555) 789-2234",
    targetBranchId: 7,
    targetBranchCode: "FLORIDA-07",
    targetBranchName: "Medix Apex Heart & Trauma Center",
    experienceYears: 9,
    qualifications: "MBA Hospital Management, Senior Clinical Operations Lead",
    appliedDate: "2026-08-13",
    status: "pending",
    notes: "Specialized in emergency triage workflow and tertiary multi-specialty management."
  },
  {
    id: 3,
    applicantName: "Julian Ross, MHA",
    email: "julian.ross@medix-applicant.com",
    phone: "+1 (555) 456-1122",
    targetBranchId: 3,
    targetBranchCode: "EAST-03",
    targetBranchName: "Medix Sunrise Clinic — East Coast Branch",
    experienceYears: 7,
    qualifications: "Master of Health Administration, Clinical Audit Director",
    appliedDate: "2026-08-14",
    status: "pending",
    notes: "Candidate seeking Branch Administrator leadership position for East Coast Branch."
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 1, branchId: 1, name: 'Dr. Jonathan Hayes', specialty: 'Cardiology & Vascular Medicine', fee: 150, status: 'available', contact: '+1 (555) 019-2831' },
  { id: 2, branchId: 1, name: 'Dr. Sarah Jenkins', specialty: 'General & Trauma Surgery', fee: 200, status: 'busy', contact: '+1 (555) 019-2832' },
  { id: 3, branchId: 2, name: 'Dr. Maya Lin', specialty: 'Pediatric & Adolescent Care', fee: 120, status: 'available', contact: '+1 (555) 028-4921' },
  { id: 4, branchId: 2, name: 'Dr. Robert Chen', specialty: 'Neurology & Brain Sciences', fee: 180, status: 'off-duty', contact: '+1 (555) 028-4922' },
  { id: 5, branchId: 3, name: 'Dr. Alistair Thorne', specialty: 'Orthopedics & Joint Surgery', fee: 190, status: 'available', contact: '+1 (555) 037-1101' },
  { id: 6, branchId: 3, name: 'Dr. Evelyn Reed', specialty: 'Dermatology & Skin Care', fee: 130, status: 'available', contact: '+1 (555) 037-1102' },
  { id: 7, branchId: 4, name: 'Dr. Carlos Mendez', specialty: 'Emergency Medicine & Trauma Center', fee: 160, status: 'busy', contact: '+1 (555) 046-8811' },
  { id: 8, branchId: 4, name: 'Dr. Hannah Abbott', specialty: 'Critical Care & Pulmonology', fee: 210, status: 'available', contact: '+1 (555) 046-8812' },
  { id: 9, branchId: 5, name: 'Dr. Nathaniel Drake', specialty: 'Interventional Cardiology', fee: 220, status: 'available', contact: '+1 (555) 055-3001' },
  { id: 10, branchId: 6, name: 'Dr. Priya Sharma', specialty: 'Gastroenterology & Hepatology', fee: 175, status: 'available', contact: '+1 (555) 066-4001' },
  { id: 11, branchId: 7, name: 'Dr. Lucas Vance', specialty: 'Cardiothoracic Surgery', fee: 250, status: 'busy', contact: '+1 (555) 077-5001' },
  { id: 12, branchId: 8, name: 'Dr. Katherine Wells', specialty: 'Nephrology & Renal Transplant', fee: 195, status: 'available', contact: '+1 (555) 088-6001' },
  { id: 13, branchId: 9, name: 'Dr. Sophia Loren', specialty: 'Obstetrics & Neonatology', fee: 185, status: 'available', contact: '+1 (555) 099-7001' },
];

export const INITIAL_PATIENTS: Patient[] = [
  { id: 1, branchId: 1, uhid: 'UHID-B1-20260810-0001', name: 'James Wilson', age: 48, gender: 'Male', bloodGroup: 'A+', phone: '+1 (555) 111-2001', condition: 'Angina & Hypertensive Crisis', status: 'admitted' },
  { id: 2, branchId: 1, uhid: 'UHID-B1-20260810-0002', name: 'Sophia Martinez', age: 34, gender: 'Female', bloodGroup: 'O+', phone: '+1 (555) 111-2002', condition: 'Post-op Laparoscopic Cholecystectomy', status: 'admitted' },
  { id: 3, branchId: 2, uhid: 'UHID-B2-20260810-0001', name: 'Oliver Taylor', age: 8, gender: 'Male', bloodGroup: 'AB+', phone: '+1 (555) 222-3001', condition: 'Pediatric Pyrexia of Unknown Origin', status: 'admitted' },
  { id: 4, branchId: 2, uhid: 'UHID-B2-20260810-0002', name: 'Emma Anderson', age: 29, gender: 'Female', bloodGroup: 'O-', phone: '+1 (555) 222-3002', condition: 'Intractable Migraine Protocol', status: 'admitted' },
  { id: 5, branchId: 3, uhid: 'UHID-B3-20260810-0001', name: 'Noah Thomas', age: 41, gender: 'Male', bloodGroup: 'A-', phone: '+1 (555) 333-4001', condition: 'Right Knee ACL Sprain', status: 'opd' },
  { id: 6, branchId: 3, uhid: 'UHID-B3-20260810-0002', name: 'Isabella White', age: 26, gender: 'Female', bloodGroup: 'B+', phone: '+1 (555) 333-4002', condition: 'Acute Contact Dermatitis', status: 'admitted' },
  { id: 7, branchId: 4, uhid: 'UHID-B4-20260810-0001', name: 'Ethan Wright', age: 55, gender: 'Male', bloodGroup: 'B-', phone: '+1 (555) 444-5001', condition: 'Acute Respiratory Distress', status: 'admitted' },
  { id: 8, branchId: 4, uhid: 'UHID-B4-20260810-0002', name: 'Mia Robinson', age: 31, gender: 'Female', bloodGroup: 'AB-', phone: '+1 (555) 444-5002', condition: 'Multiple Trauma Evaluation', status: 'admitted' },
  { id: 9, branchId: 5, uhid: 'UHID-B5-20260810-0001', name: 'Benjamin Scott', age: 62, gender: 'Male', bloodGroup: 'O+', phone: '+1 (555) 555-6001', condition: 'Coronary Artery Disease', status: 'admitted' },
  { id: 10, branchId: 6, uhid: 'UHID-B6-20260810-0001', name: 'Charlotte Green', age: 39, gender: 'Female', bloodGroup: 'A+', phone: '+1 (555) 666-7001', condition: 'Acute Pancreatitis', status: 'admitted' },
  { id: 11, branchId: 7, uhid: 'UHID-B7-20260810-0001', name: 'Daniel Miller', age: 51, gender: 'Male', bloodGroup: 'B+', phone: '+1 (555) 777-8001', condition: 'Post Infarction Care', status: 'admitted' },
  { id: 12, branchId: 8, uhid: 'UHID-B8-20260810-0001', name: 'Amelia Harris', age: 44, gender: 'Female', bloodGroup: 'AB+', phone: '+1 (555) 888-9001', condition: 'Renal Insufficiency', status: 'admitted' },
  { id: 13, branchId: 9, uhid: 'UHID-B9-20260810-0001', name: 'Lucas Nelson', age: 4, gender: 'Male', bloodGroup: 'O-', phone: '+1 (555) 999-0001', condition: 'Neonatal Care & Jaundice', status: 'admitted' },
];

export const INITIAL_BEDS: Bed[] = [
  { id: 1, branchId: 1, bedNumber: 'ICU-MAIN-01', wardType: 'icu', dailyCharge: 450, status: 'occupied', patientName: 'James Wilson' },
  { id: 2, branchId: 1, bedNumber: 'GEN-MAIN-101', wardType: 'general', dailyCharge: 120, status: 'available' },
  { id: 3, branchId: 1, bedNumber: 'PRIV-MAIN-201', wardType: 'private', dailyCharge: 280, status: 'occupied', patientName: 'Sophia Martinez' },
  { id: 4, branchId: 2, bedNumber: 'ICU-NORTH-01', wardType: 'icu', dailyCharge: 420, status: 'available' },
  { id: 5, branchId: 2, bedNumber: 'GEN-NORTH-101', wardType: 'general', dailyCharge: 110, status: 'occupied', patientName: 'Oliver Taylor' },
  { id: 6, branchId: 2, bedNumber: 'PRIV-NORTH-201', wardType: 'private', dailyCharge: 260, status: 'occupied', patientName: 'Emma Anderson' },
  { id: 7, branchId: 3, bedNumber: 'ICU-EAST-01', wardType: 'icu', dailyCharge: 400, status: 'available' },
  { id: 8, branchId: 3, bedNumber: 'GEN-EAST-101', wardType: 'general', dailyCharge: 100, status: 'occupied', patientName: 'Isabella White' },
  { id: 9, branchId: 3, bedNumber: 'PRIV-EAST-201', wardType: 'private', dailyCharge: 250, status: 'available' },
  { id: 10, branchId: 4, bedNumber: 'ICU-WEST-01', wardType: 'icu', dailyCharge: 480, status: 'occupied', patientName: 'Ethan Wright' },
  { id: 11, branchId: 4, bedNumber: 'GEN-WEST-101', wardType: 'general', dailyCharge: 130, status: 'available' },
  { id: 12, branchId: 4, bedNumber: 'PRIV-WEST-201', wardType: 'private', dailyCharge: 300, status: 'occupied', patientName: 'Mia Robinson' },
  { id: 13, branchId: 5, bedNumber: 'ICU-SOUTH-01', wardType: 'icu', dailyCharge: 460, status: 'occupied', patientName: 'Benjamin Scott' },
  { id: 14, branchId: 5, bedNumber: 'GEN-SOUTH-101', wardType: 'general', dailyCharge: 125, status: 'occupied', patientName: 'David Lee' },
  { id: 15, branchId: 5, bedNumber: 'PRIV-SOUTH-201', wardType: 'private', dailyCharge: 290, status: 'available' },
  { id: 16, branchId: 6, bedNumber: 'ICU-MIDWEST-01', wardType: 'icu', dailyCharge: 440, status: 'occupied', patientName: 'Charlotte Green' },
  { id: 17, branchId: 6, bedNumber: 'GEN-MIDWEST-101', wardType: 'general', dailyCharge: 115, status: 'occupied', patientName: 'Grace King' },
  { id: 18, branchId: 6, bedNumber: 'PRIV-MIDWEST-201', wardType: 'private', dailyCharge: 270, status: 'available' },
  { id: 19, branchId: 7, bedNumber: 'ICU-FLORIDA-01', wardType: 'icu', dailyCharge: 500, status: 'occupied', patientName: 'Daniel Miller' },
  { id: 20, branchId: 7, bedNumber: 'GEN-FLORIDA-101', wardType: 'general', dailyCharge: 140, status: 'occupied', patientName: 'Anthony Baker' },
  { id: 21, branchId: 7, bedNumber: 'PRIV-FLORIDA-201', wardType: 'private', dailyCharge: 320, status: 'occupied', patientName: 'Victoria Adams' },
  { id: 22, branchId: 8, bedNumber: 'ICU-PACIFIC-01', wardType: 'icu', dailyCharge: 430, status: 'available' },
  { id: 23, branchId: 8, bedNumber: 'GEN-PACIFIC-101', wardType: 'general', dailyCharge: 105, status: 'occupied', patientName: 'Amelia Harris' },
  { id: 24, branchId: 8, bedNumber: 'PRIV-PACIFIC-201', wardType: 'private', dailyCharge: 260, status: 'available' },
  { id: 25, branchId: 9, bedNumber: 'ICU-ROCKY-01', wardType: 'icu', dailyCharge: 410, status: 'occupied', patientName: 'Lucas Nelson' },
  { id: 26, branchId: 9, bedNumber: 'GEN-ROCKY-101', wardType: 'general', dailyCharge: 100, status: 'occupied', patientName: 'Chloe Clark' },
  { id: 27, branchId: 9, bedNumber: 'PRIV-ROCKY-201', wardType: 'private', dailyCharge: 245, status: 'available' },
];

export const INITIAL_MEDICINES: Medicine[] = [
  { id: 1, branchId: 1, name: 'Atorvastatin 20mg', category: 'Cardiovascular', stock: 450, price: 18.50, expiryDate: '2027-11-30' },
  { id: 2, branchId: 1, name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 1200, price: 12.00, expiryDate: '2026-09-15' },
  { id: 3, branchId: 2, name: 'Pediatric Paracetamol Syrup', category: 'Analgesics', stock: 320, price: 8.50, expiryDate: '2027-04-10' },
  { id: 4, branchId: 2, name: 'Sumatriptan 50mg', category: 'Neurology', stock: 180, price: 24.00, expiryDate: '2026-12-01' },
  { id: 5, branchId: 3, name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 600, price: 9.00, expiryDate: '2027-08-20' },
  { id: 6, branchId: 3, name: 'Hydrocortisone Cream 1%', category: 'Dermatology', stock: 140, price: 15.00, expiryDate: '2026-10-30' },
  { id: 7, branchId: 4, name: 'Epinephrine Auto-Injector 1mg', category: 'Emergency', stock: 85, price: 110.00, expiryDate: '2026-11-15' },
  { id: 8, branchId: 4, name: 'Normal Saline 0.9% 500ml', category: 'IV Fluids', stock: 950, price: 6.50, expiryDate: '2028-01-01' },
  { id: 9, branchId: 5, name: 'Clopidogrel 75mg', category: 'Cardiovascular', stock: 380, price: 22.00, expiryDate: '2027-06-30' },
  { id: 10, branchId: 6, name: 'Pantoprazole 40mg', category: 'Gastroenterology', stock: 520, price: 14.00, expiryDate: '2027-02-15' },
  { id: 11, branchId: 7, name: 'Heparin Sodium 5000 IU', category: 'Anticoagulant', stock: 290, price: 45.00, expiryDate: '2026-10-10' },
  { id: 12, branchId: 8, name: 'Furosemide 40mg', category: 'Nephrology', stock: 410, price: 11.50, expiryDate: '2027-09-01' },
  { id: 13, branchId: 9, name: 'Pediatric Electrolyte Solution', category: 'Pediatrics', stock: 680, price: 7.20, expiryDate: '2028-03-20' },
];

export const INITIAL_LAB_REQUESTS: LabRequest[] = [
  { id: 1, branchId: 1, requestNumber: 'LAB-B1-20260810-0001', patientName: 'James Wilson', testName: 'Lipid Profile & Troponin I', category: 'Cardiology', doctorName: 'Dr. Jonathan Hayes', status: 'ready' },
  { id: 2, branchId: 2, requestNumber: 'LAB-B2-20260810-0001', patientName: 'Oliver Taylor', testName: 'Complete Blood Count & Inflammatory Markers', category: 'Hematology', doctorName: 'Dr. Maya Lin', status: 'processing' },
  { id: 3, branchId: 3, requestNumber: 'LAB-B3-20260810-0001', patientName: 'Noah Thomas', testName: 'Right Knee MRI Scan', category: 'Radiology', doctorName: 'Dr. Alistair Thorne', status: 'ready' },
  { id: 4, branchId: 4, requestNumber: 'LAB-B4-20260810-0001', patientName: 'Ethan Wright', testName: 'High-Resolution Chest CT Scan', category: 'Pulmonology', doctorName: 'Dr. Hannah Abbott', status: 'processing' },
  { id: 5, branchId: 5, requestNumber: 'LAB-B5-20260810-0001', patientName: 'Benjamin Scott', testName: 'Coronary Angiogram & Trop T', category: 'Cardiology', doctorName: 'Dr. Nathaniel Drake', status: 'ready' },
  { id: 6, branchId: 6, requestNumber: 'LAB-B6-20260810-0001', patientName: 'Charlotte Green', testName: 'Serum Amylase & Lipase Profile', category: 'Gastroenterology', doctorName: 'Dr. Priya Sharma', status: 'processing' },
  { id: 7, branchId: 7, requestNumber: 'LAB-B7-20260810-0001', patientName: 'Daniel Miller', testName: 'Emergency Cardiac Enzymes Panel', category: 'Cardiothoracic', doctorName: 'Dr. Lucas Vance', status: 'ready' },
  { id: 8, branchId: 8, requestNumber: 'LAB-B8-20260810-0001', patientName: 'Amelia Harris', testName: 'Renal Function Test & Electrolytes', category: 'Nephrology', doctorName: 'Dr. Katherine Wells', status: 'processing' },
  { id: 9, branchId: 9, requestNumber: 'LAB-B9-20260810-0001', patientName: 'Lucas Nelson', testName: 'Serum Bilirubin Total & Direct', category: 'Pediatrics', doctorName: 'Dr. Sophia Loren', status: 'ready' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 1, branchId: 1, invoiceNumber: 'INV-B1-20260810-01', patientName: 'James Wilson', amount: 1200.00, date: '2026-08-10', status: 'paid' },
  { id: 2, branchId: 1, invoiceNumber: 'INV-B1-20260810-02', patientName: 'Sophia Martinez', amount: 500.00, date: '2026-08-09', status: 'paid' },
  { id: 3, branchId: 2, invoiceNumber: 'INV-B2-20260810-01', patientName: 'Oliver Taylor', amount: 650.00, date: '2026-08-10', status: 'paid' },
  { id: 4, branchId: 2, invoiceNumber: 'INV-B2-20260810-02', patientName: 'Emma Anderson', amount: 350.00, date: '2026-08-08', status: 'paid' },
  { id: 5, branchId: 3, invoiceNumber: 'INV-B3-20260810-01', patientName: 'Noah Thomas', amount: 450.00, date: '2026-08-10', status: 'paid' },
  { id: 6, branchId: 3, invoiceNumber: 'INV-B3-20260810-02', patientName: 'Isabella White', amount: 500.00, date: '2026-08-09', status: 'paid' },
  { id: 7, branchId: 4, invoiceNumber: 'INV-B4-20260810-01', patientName: 'Ethan Wright', amount: 1100.00, date: '2026-08-10', status: 'paid' },
  { id: 8, branchId: 4, invoiceNumber: 'INV-B4-20260810-02', patientName: 'Mia Robinson', amount: 750.00, date: '2026-08-09', status: 'paid' },
  { id: 9, branchId: 5, invoiceNumber: 'INV-B5-20260810-01', patientName: 'Benjamin Scott', amount: 1420.00, date: '2026-08-11', status: 'paid' },
  { id: 10, branchId: 6, invoiceNumber: 'INV-B6-20260810-01', patientName: 'Charlotte Green', amount: 1650.00, date: '2026-08-11', status: 'paid' },
  { id: 11, branchId: 7, invoiceNumber: 'INV-B7-20260810-01', patientName: 'Daniel Miller', amount: 2100.00, date: '2026-08-11', status: 'paid' },
  { id: 12, branchId: 8, invoiceNumber: 'INV-B8-20260810-01', patientName: 'Amelia Harris', amount: 1380.00, date: '2026-08-11', status: 'paid' },
  { id: 13, branchId: 9, invoiceNumber: 'INV-B9-20260810-01', patientName: 'Lucas Nelson', amount: 1550.00, date: '2026-08-11', status: 'paid' },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, branchId: 1, patientName: 'James Wilson', uhid: 'UHID-B1-20260810-0001', doctorName: 'Dr. Jonathan Hayes', department: 'Cardiology', appointmentDate: '2026-08-11', appointmentTime: '09:00 AM', tokenNumber: 101, type: 'OPD', status: 'In Consultation' },
  { id: 2, branchId: 1, patientName: 'Sophia Martinez', uhid: 'UHID-B1-20260810-0002', doctorName: 'Dr. Sarah Jenkins', department: 'Trauma Surgery', appointmentDate: '2026-08-11', appointmentTime: '09:30 AM', tokenNumber: 102, type: 'Follow-up', status: 'Waiting' },
  { id: 3, branchId: 2, patientName: 'Oliver Taylor', uhid: 'UHID-B2-20260810-0001', doctorName: 'Dr. Maya Lin', department: 'Pediatrics', appointmentDate: '2026-08-11', appointmentTime: '10:00 AM', tokenNumber: 201, type: 'OPD', status: 'Waiting' },
  { id: 4, branchId: 3, patientName: 'Noah Thomas', uhid: 'UHID-B3-20260810-0001', doctorName: 'Dr. Alistair Thorne', department: 'Orthopedics', appointmentDate: '2026-08-11', appointmentTime: '11:00 AM', tokenNumber: 301, type: 'Consultation', status: 'Scheduled' },
  { id: 5, branchId: 4, patientName: 'Ethan Wright', uhid: 'UHID-B4-20260810-0001', doctorName: 'Dr. Hannah Abbott', department: 'Pulmonology', appointmentDate: '2026-08-11', appointmentTime: '11:30 AM', tokenNumber: 401, type: 'Emergency', status: 'Completed' },
  { id: 6, branchId: 5, patientName: 'Benjamin Scott', uhid: 'UHID-B5-20260810-0001', doctorName: 'Dr. Nathaniel Drake', department: 'Interventional Cardiology', appointmentDate: '2026-08-11', appointmentTime: '01:00 PM', tokenNumber: 501, type: 'OPD', status: 'In Consultation' },
  { id: 7, branchId: 6, patientName: 'Charlotte Green', uhid: 'UHID-B6-20260810-0001', doctorName: 'Dr. Priya Sharma', department: 'Gastroenterology', appointmentDate: '2026-08-11', appointmentTime: '01:30 PM', tokenNumber: 601, type: 'Consultation', status: 'Waiting' },
  { id: 8, branchId: 7, patientName: 'Daniel Miller', uhid: 'UHID-B7-20260810-0001', doctorName: 'Dr. Lucas Vance', department: 'Cardiothoracic', appointmentDate: '2026-08-11', appointmentTime: '02:00 PM', tokenNumber: 701, type: 'Emergency', status: 'In Consultation' },
  { id: 9, branchId: 8, patientName: 'Amelia Harris', uhid: 'UHID-B8-20260810-0001', doctorName: 'Dr. Katherine Wells', department: 'Nephrology', appointmentDate: '2026-08-11', appointmentTime: '02:30 PM', tokenNumber: 801, type: 'Follow-up', status: 'Scheduled' },
  { id: 10, branchId: 9, patientName: 'Lucas Nelson', uhid: 'UHID-B9-20260810-0001', doctorName: 'Dr. Sophia Loren', department: 'Pediatrics', appointmentDate: '2026-08-11', appointmentTime: '03:00 PM', tokenNumber: 901, type: 'OPD', status: 'Completed' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 1, timestamp: '2026-08-11 14:30:12', userId: 'USR-001', userName: 'Arthur Pendelton', role: 'Branch Central Admin', module: 'IPD Admissions', action: 'Bed Transfer Executed', ipAddress: '192.168.1.45', metadata: 'Transferred Patient #UHID-B1-20260810-0001 from GEN-MAIN-101 to ICU-MAIN-01' },
  { id: 2, timestamp: '2026-08-11 13:15:00', userId: 'USR-004', userName: 'Dr. Jonathan Hayes', role: 'Doctor', module: 'Prescriptions', action: 'Prescription Issued', ipAddress: '192.168.1.88', metadata: 'Added Atorvastatin 20mg for James Wilson' },
  { id: 3, timestamp: '2026-08-11 11:05:44', userId: 'USR-012', userName: 'Receptionist Sarah', role: 'Receptionist', module: 'Appointments', action: 'Token Generated', ipAddress: '192.168.2.12', metadata: 'Generated Token #102 for Sophia Martinez' },
  { id: 4, timestamp: '2026-08-11 10:20:19', userId: 'USR-009', userName: 'Accountant Alex', role: 'Accountant', module: 'Billing', action: 'Invoice Posted', ipAddress: '192.168.1.99', metadata: 'Posted INV-B1-20260810-01 ($1,200.00)' },
  { id: 5, timestamp: '2026-08-11 09:00:01', userId: 'USR-001', userName: 'Mr. Ratul', role: 'Super Admin', module: 'Super Admin RBAC', action: 'Branch Admin Policy Verified', ipAddress: '192.168.1.1', metadata: 'Audited all 9 Branch Central Admin permissions' },
];

export const INITIAL_MARKETING_REPRESENTATIVES: MarketingRepresentative[] = [
  {
    id: 1,
    referenceId: 'REF-MKT-B1-7892',
    branchId: 1,
    branchCode: 'MEDIX-CENTRAL',
    branchName: 'Medix Central Hospital (Headquarters)',
    name: 'Sameer Sen',
    email: 'sameer.mkt@medix.local',
    phone: '+91 98200 45678',
    territory: 'South Mumbai & Corporate Business Hubs',
    experienceYears: 6,
    status: 'active',
    approvedDate: '2026-06-15',
    approvedByAdminName: 'Dr. Robert Sullivan',
    approvedByAdminEmail: 'admin@nmc.local',
    referredPatientsCount: 48,
    totalCommissionEarned: 38400,
    pendingPayout: 6200,
    commissionRate: '10% on Diagnostics & OPD',
  },
  {
    id: 2,
    referenceId: 'REF-MKT-B1-7895',
    branchId: 1,
    branchCode: 'MEDIX-CENTRAL',
    branchName: 'Medix Central Hospital (Headquarters)',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@medix.local',
    phone: '+91 98201 99887',
    territory: 'Navi Mumbai & Thane Residential Zones',
    experienceYears: 4,
    status: 'active',
    approvedDate: '2026-07-02',
    approvedByAdminName: 'Dr. Robert Sullivan',
    approvedByAdminEmail: 'admin@nmc.local',
    referredPatientsCount: 31,
    totalCommissionEarned: 24800,
    pendingPayout: 3500,
    commissionRate: '8% on Diagnostics & OPD',
  },
  {
    id: 3,
    referenceId: 'REF-MKT-B2-8821',
    branchId: 2,
    branchCode: 'MEDIX-SOUTH',
    branchName: 'Medix Specialty & Trauma Center',
    name: 'Kavita Menon',
    email: 'kavita.m@medix.local',
    phone: '+91 98450 11223',
    territory: 'Bengaluru Electronic City & Whitefield',
    experienceYears: 5,
    status: 'active',
    approvedDate: '2026-06-20',
    approvedByAdminName: 'Dr. Ananya Roy',
    approvedByAdminEmail: 'ananya.roy@medix.local',
    referredPatientsCount: 39,
    totalCommissionEarned: 31200,
    pendingPayout: 4800,
    commissionRate: '10% on Trauma & Diagnostics',
  },
  {
    id: 4,
    referenceId: 'REF-MKT-B3-9104',
    branchId: 3,
    branchCode: 'MEDIX-NORTH',
    branchName: 'Medix Mother & Child Super-Specialty',
    name: 'Pooja Bhatia',
    email: 'pooja.b@medix.local',
    phone: '+91 98110 77889',
    territory: 'Delhi NCR Maternal Clinics & Daycare Hubs',
    experienceYears: 7,
    status: 'active',
    approvedDate: '2026-05-18',
    approvedByAdminName: 'Dr. Vikram Malhotra',
    approvedByAdminEmail: 'vikram.m@medix.local',
    referredPatientsCount: 56,
    totalCommissionEarned: 44800,
    pendingPayout: 7100,
    commissionRate: '10% on Maternity & Pediatrics',
  },
];

export const INITIAL_MARKETING_JOIN_REQUESTS: MarketingJoinRequest[] = [
  {
    id: 1,
    name: 'Vikas Dubey',
    email: 'vikas.dubey@saleshealth.in',
    phone: '+91 98205 66778',
    targetBranchId: 1,
    targetBranchCode: 'MEDIX-CENTRAL',
    targetBranchName: 'Medix Central Hospital (Headquarters)',
    territory: 'Andheri West, Bandra & Juhu Clinics',
    experienceYears: 5,
    expectedMonthlyReferrals: 25,
    qualificationsOrNotes: 'Former Senior Medical Representative at Sun Pharma. Strong tie-ups with 30+ local general physicians.',
    appliedDate: '2026-08-15',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Anjali Sharma',
    email: 'anjali.s@healthcareleads.org',
    phone: '+91 98209 11442',
    targetBranchId: 1,
    targetBranchCode: 'MEDIX-CENTRAL',
    targetBranchName: 'Medix Central Hospital (Headquarters)',
    territory: 'Powai, Ghatkopar & Central Suburbs',
    experienceYears: 4,
    expectedMonthlyReferrals: 20,
    qualificationsOrNotes: 'Expertise in corporate employee health checkup camps and executive wellness referrals.',
    appliedDate: '2026-08-16',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Girish Hegde',
    email: 'girish.h@medpromoters.com',
    phone: '+91 98455 33221',
    targetBranchId: 2,
    targetBranchCode: 'MEDIX-SOUTH',
    targetBranchName: 'Medix Specialty & Trauma Center',
    territory: 'Koramangala, HSR Layout & Indiranagar',
    experienceYears: 6,
    expectedMonthlyReferrals: 30,
    qualificationsOrNotes: 'Connected with local IT parks for annual corporate diagnostics and health checkups.',
    appliedDate: '2026-08-14',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Manish Tyagi',
    email: 'manish.t@ncrhealthnet.in',
    phone: '+91 98115 99001',
    targetBranchId: 3,
    targetBranchCode: 'MEDIX-NORTH',
    targetBranchName: 'Medix Mother & Child Super-Specialty',
    territory: 'Rohini, Pitampura & North Delhi',
    experienceYears: 3,
    expectedMonthlyReferrals: 15,
    qualificationsOrNotes: 'Specialized in IVF clinic tie-ups and pediatrician referral network.',
    appliedDate: '2026-08-17',
    status: 'pending',
  },
];


