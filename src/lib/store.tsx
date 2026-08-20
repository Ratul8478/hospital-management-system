"use client";

import React, { createContext, useContext, useState } from 'react';
import type {
  Branch,
  BranchAdminUser,
  AdminApplicationRequest,
  MarketingRepresentative,
  MarketingJoinRequest,
  MarketingEmailDispatchLog,
  Doctor,
  Patient,
  Bed,
  Medicine,
  LabRequest,
  Invoice,
  Appointment,
  AuditLog,
  SuperAdminProfile,
} from './data';
import {
  INITIAL_BRANCHES,
  INITIAL_BRANCH_ADMINS,
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_MARKETING_REPRESENTATIVES,
  INITIAL_MARKETING_JOIN_REQUESTS,
  INITIAL_MARKETING_EMAIL_LOGS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_MEDICINES,
  INITIAL_LAB_REQUESTS,
  INITIAL_INVOICES,
  INITIAL_APPOINTMENTS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_SUPER_ADMIN_PROFILE,
} from './data';

export type UserRole = 
  | 'super_admin' 
  | 'branch_admin' 
  | 'receptionist' 
  | 'doctor' 
  | 'patient' 
  | 'accountant' 
  | 'pharmacist' 
  | 'lab_technician' 
  | 'franchise_partner';


interface AppContextType {
  superAdminProfile: SuperAdminProfile;
  updateSuperAdminProfile: (profile: Partial<SuperAdminProfile>) => void;
  branches: Branch[];
  branchAdmins: BranchAdminUser[];
  adminApplications: AdminApplicationRequest[];
  marketingRepresentatives: MarketingRepresentative[];
  marketingJoinRequests: MarketingJoinRequest[];
  marketingEmailLogs: MarketingEmailDispatchLog[];
  doctors: Doctor[];
  patients: Patient[];
  beds: Bed[];
  medicines: Medicine[];
  labRequests: LabRequest[];
  invoices: Invoice[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  selectedBranchId: number | 'all';
  setSelectedBranchId: (id: number | 'all') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedLandingConceptId: number;
  setSelectedLandingConceptId: (id: number) => void;
  hireAdmin: (branchId: number, name: string, email: string, phone?: string) => void;
  fireAdmin: (branchId: number) => void;
  approveAdminApplication: (applicationId: number) => void;
  rejectAdminApplication: (applicationId: number) => void;
  submitAdminApplication: (appData: Omit<AdminApplicationRequest, 'id' | 'appliedDate' | 'status'>) => void;
  submitMarketingJoinRequest: (requestData: Omit<MarketingJoinRequest, 'id' | 'appliedDate' | 'status'>) => void;
  branchAdminPreApproveMarketingRequest: (requestId: number, adminName?: string, adminEmail?: string) => void;
  superAdminFinalApproveMarketingRequest: (requestId: number, superAdminName?: string) => string;
  superAdminDirectApproveMainHospitalRequest: (requestId: number, superAdminName?: string) => string;
  approveMarketingJoinRequest: (requestId: number, approverAdminName?: string, approverAdminEmail?: string) => string;
  rejectMarketingJoinRequest: (requestId: number) => void;
  directHireMarketingRepresentative: (candidateData: {
    name: string;
    email: string;
    phone: string;
    targetBranchId: number;
    territory: string;
    experienceYears?: number;
    expectedMonthlyReferrals?: number;
    qualificationsOrNotes?: string;
  }) => void;
  fireMarketingRepresentative: (repId: number, reason?: string) => void;
  reinstateMarketingRepresentative: (repId: number) => void;
  referPatientWithMarketingCode: (refId: string, patientName: string, amount?: number) => boolean;
  addMarketingRepresentative: (rep: Omit<MarketingRepresentative, 'id' | 'approvedDate'>) => void;
  updateMarketingRepStatus: (id: number, status: 'active' | 'fired' | 'inactive' | 'suspended') => void;
  addBranchAdmin: (admin: Omit<BranchAdminUser, 'id' | 'assignedDate'>) => void;
  updateBranchAdminStatus: (id: number, status: 'active' | 'vacant' | 'suspended') => void;
  reassignBranchAdmin: (adminId: number, newBranchId: number) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  addBranch: (newBranch: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber'>) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isLoadedRef = React.useRef(false);

  const [superAdminProfile, setSuperAdminProfile] = useState<SuperAdminProfile>(DEFAULT_SUPER_ADMIN_PROFILE);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [branchAdmins, setBranchAdmins] = useState<BranchAdminUser[]>(INITIAL_BRANCH_ADMINS);
  const [adminApplications, setAdminApplications] = useState<AdminApplicationRequest[]>(INITIAL_ADMIN_APPLICATIONS);
  const [marketingRepresentatives, setMarketingRepresentatives] = useState<MarketingRepresentative[]>(INITIAL_MARKETING_REPRESENTATIVES);
  const [marketingJoinRequests, setMarketingJoinRequests] = useState<MarketingJoinRequest[]>(INITIAL_MARKETING_JOIN_REQUESTS);
  const [marketingEmailLogs, setMarketingEmailLogs] = useState<MarketingEmailDispatchLog[]>(INITIAL_MARKETING_EMAIL_LOGS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [labRequests, setLabRequests] = useState<LabRequest[]>(INITIAL_LAB_REQUESTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [selectedBranchId, setSelectedBranchId] = useState<number | 'all'>('all');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');
  const [selectedLandingConceptId, setSelectedLandingConceptIdState] = useState<number>(7);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);

  // 1. Initial Load from localStorage after mount (Prevents SSR hydration mismatch)
  React.useEffect(() => {
    try {
      const schemaVer = localStorage.getItem('medix_db_schema_version');
      if (schemaVer !== '2026_realtime_zero_state_v3') {
        // Clear out old demo data keys and initialize fresh production zero state data
        localStorage.setItem('medix_super_admin_profile', JSON.stringify(DEFAULT_SUPER_ADMIN_PROFILE));
        localStorage.setItem('medix_branches', JSON.stringify(INITIAL_BRANCHES));
        localStorage.setItem('medix_branch_admins', JSON.stringify(INITIAL_BRANCH_ADMINS));
        localStorage.setItem('medix_doctors', JSON.stringify(INITIAL_DOCTORS));
        localStorage.setItem('medix_patients', JSON.stringify(INITIAL_PATIENTS));
        localStorage.setItem('medix_beds', JSON.stringify(INITIAL_BEDS));
        localStorage.setItem('medix_medicines', JSON.stringify(INITIAL_MEDICINES));
        localStorage.setItem('medix_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
        localStorage.setItem('medix_admin_applications', JSON.stringify(INITIAL_ADMIN_APPLICATIONS));
        localStorage.setItem('medix_marketing_representatives', JSON.stringify(INITIAL_MARKETING_REPRESENTATIVES));
        localStorage.setItem('medix_marketing_join_requests', JSON.stringify(INITIAL_MARKETING_JOIN_REQUESTS));
        localStorage.setItem('medix_marketing_email_logs', JSON.stringify(INITIAL_MARKETING_EMAIL_LOGS));
        localStorage.setItem('medix_db_schema_version', '2026_realtime_zero_state_v3');
        
        setSuperAdminProfile(DEFAULT_SUPER_ADMIN_PROFILE);
        setBranches(INITIAL_BRANCHES);
        setBranchAdmins(INITIAL_BRANCH_ADMINS);
        setDoctors(INITIAL_DOCTORS);
        setPatients(INITIAL_PATIENTS);
        setBeds(INITIAL_BEDS);
        setMedicines(INITIAL_MEDICINES);
        setAppointments(INITIAL_APPOINTMENTS);
      } else {
        const sap = localStorage.getItem('medix_super_admin_profile');
        if (sap) setSuperAdminProfile(JSON.parse(sap));
        const b = localStorage.getItem('medix_branches');
        if (b) setBranches(JSON.parse(b));
        const ba = localStorage.getItem('medix_branch_admins');
        if (ba) setBranchAdmins(JSON.parse(ba));
        const aa = localStorage.getItem('medix_admin_applications');
        if (aa) setAdminApplications(JSON.parse(aa));
        const mr = localStorage.getItem('medix_marketing_representatives');
        if (mr) setMarketingRepresentatives(JSON.parse(mr));
        const mj = localStorage.getItem('medix_marketing_join_requests');
        if (mj) setMarketingJoinRequests(JSON.parse(mj));
        const mel = localStorage.getItem('medix_marketing_email_logs');
        if (mel) setMarketingEmailLogs(JSON.parse(mel));
        const doc = localStorage.getItem('medix_doctors');
        if (doc) setDoctors(JSON.parse(doc));
        const pat = localStorage.getItem('medix_patients');
        if (pat) setPatients(JSON.parse(pat));
        const bd = localStorage.getItem('medix_beds');
        if (bd) setBeds(JSON.parse(bd));
        const med = localStorage.getItem('medix_medicines');
        if (med) setMedicines(JSON.parse(med));
        const appt = localStorage.getItem('medix_appointments');
        if (appt) setAppointments(JSON.parse(appt));
      }
      const savedRole = localStorage.getItem('medix_user_role') as UserRole;
      if (savedRole) setUserRole(savedRole);
      const concept = localStorage.getItem('medix_landing_concept');
      if (concept) setSelectedLandingConceptIdState(parseInt(concept, 10));
    } catch (e) {
      console.error('Error loading state from localStorage', e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  const setSelectedLandingConceptId = (id: number) => {
    setSelectedLandingConceptIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_landing_concept', id.toString());
    }
  };

  // 2. Persist to localStorage only after initial load completed
  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_user_role', userRole);
    }
  }, [userRole]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_super_admin_profile', JSON.stringify(superAdminProfile));
    }
  }, [superAdminProfile]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_branches', JSON.stringify(branches));
    }
  }, [branches]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_branch_admins', JSON.stringify(branchAdmins));
    }
  }, [branchAdmins]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_admin_applications', JSON.stringify(adminApplications));
    }
  }, [adminApplications]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_marketing_representatives', JSON.stringify(marketingRepresentatives));
    }
  }, [marketingRepresentatives]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_marketing_join_requests', JSON.stringify(marketingJoinRequests));
    }
  }, [marketingJoinRequests]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_marketing_email_logs', JSON.stringify(marketingEmailLogs));
    }
  }, [marketingEmailLogs]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_doctors', JSON.stringify(doctors));
    }
  }, [doctors]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_patients', JSON.stringify(patients));
    }
  }, [patients]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_beds', JSON.stringify(beds));
    }
  }, [beds]);

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_medicines', JSON.stringify(medicines));
    }
  }, [medicines]);

  // Direct Super Admin Hire Action
  const hireAdmin = (branchId: number, name: string, email: string, phone?: string) => {
    const branchObj = branches.find(b => b.id === branchId);

    setBranches(prev =>
      prev.map(b => (b.id === branchId ? { ...b, adminName: name, adminEmail: email } : b))
    );

    setBranchAdmins(prev => {
      const exists = prev.find(ba => ba.branchId === branchId);
      if (exists) {
        return prev.map(ba =>
          ba.branchId === branchId
            ? { ...ba, name, email, phone: phone || ba.phone || '+1 (555) 000-1111', status: 'active', roleTitle: 'Branch Central Admin' }
            : ba
        );
      } else {
        return [
          ...prev,
          {
            id: prev.length + 1,
            branchId,
            branchCode: branchObj?.code || `B-${branchId}`,
            branchName: branchObj?.name || `Branch #${branchId}`,
            name,
            email,
            phone: phone || '+1 (555) 000-1111',
            status: 'active',
            assignedDate: new Date().toISOString().split('T')[0],
            roleTitle: 'Branch Central Admin',
          },
        ];
      }
    });
  };

  // Direct Super Admin Fire Action (Revokes and vacates admin dashboard access)
  const fireAdmin = (branchId: number) => {
    setBranches(prev =>
      prev.map(b => (b.id === branchId ? { ...b, adminName: 'VACANT (Fired)', adminEmail: 'vacant@medix.com' } : b))
    );
    setBranchAdmins(prev =>
      prev.map(ba => (ba.branchId === branchId ? { ...ba, name: 'VACANT (Fired)', email: 'vacant@medix.com', status: 'vacant' } : ba))
    );
  };

  // Approve Incoming Admin Application Request
  const approveAdminApplication = (applicationId: number) => {
    const targetApp = adminApplications.find(a => a.id === applicationId);
    if (!targetApp) return;

    // Hire as official Branch Central Admin
    hireAdmin(targetApp.targetBranchId, targetApp.applicantName, targetApp.email, targetApp.phone);

    // Update Application Status
    setAdminApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'approved' } : a))
    );
  };

  // Reject Incoming Admin Application Request
  const rejectAdminApplication = (applicationId: number) => {
    setAdminApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'rejected' } : a))
    );
  };

  // Submit new candidate request for branch admin post
  const submitAdminApplication = (appData: Omit<AdminApplicationRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newApp: AdminApplicationRequest = {
      ...appData,
      id: adminApplications.length + 1,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setAdminApplications(prev => [newApp, ...prev]);
  };

  const addBranchAdmin = (newAdminData: Omit<BranchAdminUser, 'id' | 'assignedDate'>) => {
    const newId = branchAdmins.length + 1;
    const created: BranchAdminUser = {
      ...newAdminData,
      id: newId,
      assignedDate: new Date().toISOString().split('T')[0],
    };
    setBranchAdmins(prev => [...prev, created]);
    setBranches(prev =>
      prev.map(b => b.id === newAdminData.branchId ? { ...b, adminName: newAdminData.name, adminEmail: newAdminData.email, status: 'active' } : b)
    );
  };

  const updateBranchAdminStatus = (id: number, status: 'active' | 'vacant' | 'suspended') => {
    setBranchAdmins(prev => prev.map(ba => ba.id === id ? { ...ba, status } : ba));
    const targetAdmin = branchAdmins.find(ba => ba.id === id);
    if (targetAdmin) {
      setBranches(prev =>
        prev.map(b => b.id === targetAdmin.branchId ? { ...b, status: status === 'active' ? 'active' : 'inactive' } : b)
      );
    }
  };

  const reassignBranchAdmin = (adminId: number, newBranchId: number) => {
    const newBranch = branches.find(b => b.id === newBranchId);
    if (!newBranch) return;
    setBranchAdmins(prev =>
      prev.map(ba =>
        ba.id === adminId
          ? {
              ...ba,
              branchId: newBranchId,
              branchCode: newBranch.code,
              branchName: newBranch.name,
            }
          : ba
      )
    );
  };

  const addDoctor = (newDoc: Omit<Doctor, 'id'>) => {
    const created: Doctor = {
      ...newDoc,
      id: doctors.length + 1,
    };
    setDoctors(prev => [...prev, created]);
  };

  const addPatient = (newPatient: Omit<Patient, 'id'>) => {
    const created: Patient = {
      ...newPatient,
      id: patients.length + 1,
    };
    setPatients(prev => [...prev, created]);
  };

  const addBranch = (newBranchData: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'>) => {
    const newId = branches.length + 1;
    const createdBranch: Branch = {
      ...newBranchData,
      id: newId,
      status: 'active',
      revenue: 0.0,
      patientCount: 0,
      bedOccupancy: '0 / 0 Occupied',
    };
    setBranches(prev => [...prev, createdBranch]);

    // Also register the branch admin slot
    if (newBranchData.adminName && newBranchData.adminName !== 'Unassigned') {
      setBranchAdmins(prev => [
        ...prev,
        {
          id: prev.length + 1,
          branchId: newId,
          branchCode: newBranchData.code,
          branchName: newBranchData.name,
          name: newBranchData.adminName,
          email: newBranchData.adminEmail,
          phone: '+1 (555) 999-8888',
          status: 'active',
          assignedDate: new Date().toISOString().split('T')[0],
          roleTitle: 'Branch Central Admin',
        },
      ]);
    }
  };

  const addAppointment = (newApp: Omit<Appointment, 'id' | 'tokenNumber'>) => {
    const nextToken = 100 + appointments.length + 1;
    const created: Appointment = {
      ...newApp,
      id: appointments.length + 1,
      tokenNumber: nextToken,
    };
    setAppointments(prev => [...prev, created]);
  };

  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const submitMarketingJoinRequest = (requestData: Omit<MarketingJoinRequest, 'id' | 'appliedDate' | 'status'>) => {
    // If targeted at Branch 1 (Super Admin HQ), status is 'pending_super_admin_approval'
    // If targeted at any other branch (Branch 2..9), status is 'pending_branch_review'
    const initialStatus: MarketingJoinRequest['status'] =
      requestData.targetBranchId === 1 ? 'pending_super_admin_approval' : 'pending_branch_review';

    const newRequest: MarketingJoinRequest = {
      ...requestData,
      id: marketingJoinRequests.length + 1,
      appliedDate: new Date().toISOString().split('T')[0],
      status: initialStatus,
    };
    setMarketingJoinRequests(prev => [newRequest, ...prev]);
  };

  // Step 1 for Branch Hospital: Branch Admin recommends/pre-approves and forwards to Super Admin
  const branchAdminPreApproveMarketingRequest = (requestId: number, adminName?: string, adminEmail?: string) => {
    const targetReq = marketingJoinRequests.find(r => r.id === requestId);
    if (!targetReq) return;

    const branchObj = branches.find(b => b.id === targetReq.targetBranchId);
    const finalAdminName = adminName || branchObj?.adminName || 'Branch Hospital Administrator';
    const finalAdminEmail = adminEmail || branchObj?.adminEmail || 'admin@hospital.local';

    setMarketingJoinRequests(prev =>
      prev.map(r => r.id === requestId ? {
        ...r,
        status: 'pending_super_admin_approval',
        branchAdminApprovedDate: new Date().toISOString().split('T')[0],
        branchAdminName: finalAdminName,
        branchAdminEmail: finalAdminEmail,
      } : r)
    );
  };

  // Step 2: Super Admin grants final approval -> Generates Reference ID and dispatches to email
  const superAdminFinalApproveMarketingRequest = (requestId: number, superAdminName?: string): string => {
    const targetReq = marketingJoinRequests.find(r => r.id === requestId);
    if (!targetReq) return '';

    const finalSuperAdmin = superAdminName || 'Anichul Haque (Super Admin HQ)';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `REF-MKT-B${targetReq.targetBranchId}-${randomSuffix}`;
    const approvalDate = new Date().toISOString().split('T')[0];

    // Update Request Record
    setMarketingJoinRequests(prev =>
      prev.map(r => r.id === requestId ? {
        ...r,
        status: 'approved',
        approvedReferenceId: generatedRefId,
        superAdminApprovedDate: approvalDate,
        superAdminName: finalSuperAdmin,
      } : r)
    );

    // Create Active Marketing Representative Record
    const newRep: MarketingRepresentative = {
      id: marketingRepresentatives.length + 1,
      referenceId: generatedRefId,
      branchId: targetReq.targetBranchId,
      branchCode: targetReq.targetBranchCode,
      branchName: targetReq.targetBranchName,
      name: targetReq.name,
      gender: targetReq.gender || 'Male',
      fatherOrMotherName: targetReq.fatherOrMotherName || 'Guardian',
      dob: targetReq.dob || '1995-01-01',
      bloodGroup: targetReq.bloodGroup || 'O+',
      aadharNumber: targetReq.aadharNumber || 'XXXX-XXXX-XXXX',
      aadharDocUrl: targetReq.aadharDocUrl,
      panNumber: targetReq.panNumber || 'XXXXX0000X',
      panDocUrl: targetReq.panDocUrl,
      drivingLicenceNumber: targetReq.drivingLicenceNumber || 'DL-XXXX-XXXXXXX',
      drivingLicenceDocUrl: targetReq.drivingLicenceDocUrl,
      address: targetReq.address || 'Hospital Catchment Area',
      pinCode: targetReq.pinCode || '400001',
      district: targetReq.district || 'City Center',
      state: targetReq.state || 'State',
      country: targetReq.country || 'India',
      email: targetReq.email,
      emailVerified: true,
      phone: targetReq.phone,
      territory: targetReq.territory,
      experienceYears: targetReq.experienceYears,
      status: 'active',
      approvedDate: approvalDate,
      branchAdminApprovedDate: targetReq.branchAdminApprovedDate,
      branchAdminName: targetReq.branchAdminName,
      branchAdminEmail: targetReq.branchAdminEmail,
      superAdminApprovedDate: approvalDate,
      superAdminName: finalSuperAdmin,
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: '10% on Diagnostics & OPD',
    };

    setMarketingRepresentatives(prev => [newRep, ...prev]);

    // Dispatch Simulated Email and Record in Email Log
    const newEmailLog: MarketingEmailDispatchLog = {
      id: `EML-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      requestId: targetReq.id,
      recipientName: targetReq.name,
      recipientEmail: targetReq.email,
      referenceId: generatedRefId,
      targetBranchId: targetReq.targetBranchId,
      targetBranchCode: targetReq.targetBranchCode,
      targetBranchName: targetReq.targetBranchName,
      dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      dispatchedBySuperAdmin: finalSuperAdmin,
      deliveryStatus: 'delivered',
      smtpServer: 'smtp-relay.medix-network.internal:587',
      emailSubject: `Welcome to Medix: Your Official Marketing Reference ID ${generatedRefId}`,
      securityToken: `AUTH-SA-HQ-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
    };

    setMarketingEmailLogs(prev => [newEmailLog, ...prev]);

    return generatedRefId;
  };

  // Direct Approval for Super Admin's Main Hospital (Branch 1)
  const superAdminDirectApproveMainHospitalRequest = (requestId: number, superAdminName?: string): string => {
    return superAdminFinalApproveMarketingRequest(requestId, superAdminName);
  };

  // Backward compatibility alias
  const approveMarketingJoinRequest = (requestId: number, approverAdminName?: string, approverAdminEmail?: string): string => {
    const targetReq = marketingJoinRequests.find(r => r.id === requestId);
    if (!targetReq) return '';
    if (targetReq.targetBranchId === 1) {
      return superAdminDirectApproveMainHospitalRequest(requestId, approverAdminName);
    } else {
      branchAdminPreApproveMarketingRequest(requestId, approverAdminName, approverAdminEmail);
      return superAdminFinalApproveMarketingRequest(requestId, 'Super Admin Master Desk');
    }
  };

  const rejectMarketingJoinRequest = (requestId: number) => {
    setMarketingJoinRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
    );
  };

  const directHireMarketingRepresentative = (candidateData: {
    name: string;
    email: string;
    phone: string;
    targetBranchId: number;
    territory: string;
    experienceYears?: number;
    expectedMonthlyReferrals?: number;
    qualificationsOrNotes?: string;
  }) => {
    const branchObj = branches.find(b => b.id === candidateData.targetBranchId) || branches[0];
    const newRequest: MarketingJoinRequest = {
      id: Date.now(),
      name: candidateData.name,
      gender: 'Male',
      fatherOrMotherName: 'Direct Hire Candidate',
      dob: '1995-01-01',
      bloodGroup: 'O+',
      aadharNumber: 'XXXX-XXXX-XXXX',
      panNumber: 'XXXXX0000X',
      drivingLicenceNumber: 'DL-XXXX-XXXXXXX',
      address: branchObj?.address || branchObj?.location || 'Hospital Catchment Area',
      pinCode: '700001',
      district: branchObj?.location || 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      email: candidateData.email,
      emailVerified: true,
      phone: candidateData.phone,
      targetBranchId: candidateData.targetBranchId,
      targetBranchCode: branchObj?.code || 'ARIYAN-HQ',
      targetBranchName: branchObj?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
      territory: candidateData.territory || 'Hospital Catchment Area',
      experienceYears: candidateData.experienceYears || 2,
      expectedMonthlyReferrals: candidateData.expectedMonthlyReferrals || 50,
      qualificationsOrNotes: candidateData.qualificationsOrNotes || 'Directly Onboarded by Super Admin',
      appliedDate: new Date().toISOString().split('T')[0],
      source: 'super_admin_hired',
      status: 'pending_super_admin_approval',
    };
    setMarketingJoinRequests(prev => [newRequest, ...prev]);
  };

  const fireMarketingRepresentative = (repId: number, reason: string = 'Terminated by Central Super Admin Authority') => {
    const currentDate = new Date().toISOString().split('T')[0];
    setMarketingRepresentatives(prev =>
      prev.map(r => r.id === repId ? {
        ...r,
        status: 'fired',
        firedDate: currentDate,
        firedReason: reason,
      } : r)
    );
  };

  const reinstateMarketingRepresentative = (repId: number) => {
    setMarketingRepresentatives(prev =>
      prev.map(r => r.id === repId ? {
        ...r,
        status: 'active',
        firedDate: undefined,
        firedReason: undefined,
      } : r)
    );
  };

  // Refer patient under marketing code and calculate commissions
  const referPatientWithMarketingCode = (refId: string, patientName: string, amount: number = 800): boolean => {
    const targetRep = marketingRepresentatives.find(r => r.referenceId.toLowerCase() === refId.toLowerCase());
    if (!targetRep || targetRep.status !== 'active') return false;

    const commissionAmount = Math.round(amount * 0.10); // 10%

    setMarketingRepresentatives(prev =>
      prev.map(r => r.id === targetRep.id ? {
        ...r,
        referredPatientsCount: r.referredPatientsCount + 1,
        totalCommissionEarned: r.totalCommissionEarned + commissionAmount,
        pendingPayout: r.pendingPayout + commissionAmount,
      } : r)
    );
    return true;
  };

  const addMarketingRepresentative = (rep: Omit<MarketingRepresentative, 'id' | 'approvedDate'>) => {
    const newRep: MarketingRepresentative = {
      ...rep,
      id: marketingRepresentatives.length + 1,
      approvedDate: new Date().toISOString().split('T')[0],
    };
    setMarketingRepresentatives(prev => [newRep, ...prev]);
  };

  const updateMarketingRepStatus = (id: number, status: 'active' | 'fired' | 'inactive' | 'suspended') => {
    setMarketingRepresentatives(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
  };

  const updateSuperAdminProfile = (updated: Partial<SuperAdminProfile>) => {
    setSuperAdminProfile(prev => {
      const merged = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('medix_super_admin_profile', JSON.stringify(merged));
      }
      return merged;
    });

    if (updated.hospitalName || updated.govtRegNumber || updated.address || updated.ownerName || updated.managerName || updated.email || updated.ownerContact) {
      setBranches(prev => prev.map(b => b.id === 1 ? {
        ...b,
        name: updated.hospitalName || b.name,
        govRegNumber: updated.govtRegNumber || b.govRegNumber,
        address: updated.address || b.address,
        branchHead: updated.ownerName ? `${updated.ownerName} (Owner & Medical Director)` : b.branchHead,
        adminName: updated.managerName ? `${updated.managerName} (Manager)` : b.adminName,
        adminEmail: updated.email || b.adminEmail,
        adminPhone: updated.ownerContact || b.adminPhone,
      } : b));
    }
  };

  return (
    <AppContext.Provider
      value={{
        superAdminProfile,
        updateSuperAdminProfile,
        branches,
        branchAdmins,
        adminApplications,
        marketingRepresentatives,
        marketingJoinRequests,
        marketingEmailLogs,
        doctors,
        patients,
        beds,
        medicines,
        labRequests,
        invoices,
        appointments,
        auditLogs,
        selectedBranchId,
        setSelectedBranchId,
        userRole,
        setUserRole,
        selectedLandingConceptId,
        setSelectedLandingConceptId,
        hireAdmin,
        fireAdmin,
        approveAdminApplication,
        rejectAdminApplication,
        submitAdminApplication,
        submitMarketingJoinRequest,
        branchAdminPreApproveMarketingRequest,
        superAdminFinalApproveMarketingRequest,
        superAdminDirectApproveMainHospitalRequest,
        approveMarketingJoinRequest,
        rejectMarketingJoinRequest,
        directHireMarketingRepresentative,
        fireMarketingRepresentative,
        reinstateMarketingRepresentative,
        referPatientWithMarketingCode,
        addMarketingRepresentative,
        updateMarketingRepStatus,
        addBranchAdmin,
        updateBranchAdminStatus,
        reassignBranchAdmin,
        addDoctor,
        addPatient,
        addBranch,
        addAppointment,
        updateAppointmentStatus,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
