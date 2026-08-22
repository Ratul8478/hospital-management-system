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
  HospitalReferral,
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
  INITIAL_HOSPITAL_REFERRALS,
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
  hospitalReferrals: HospitalReferral[];
  addHospitalReferral: (referral: HospitalReferral) => void;
  updateHospitalReferralStatus: (id: string | number, status: HospitalReferral['status'], notes?: string) => void;
  deleteHospitalReferral: (id: string | number) => void;
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
  updateDoctor: (id: number, data: Partial<Doctor>) => void;
  deleteDoctor: (id: number) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: number, data: Partial<Patient>) => void;
  deletePatient: (id: number) => void;
  addBranch: (newBranch: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber'>) => void;
  updateAppointment: (id: number, data: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
  deleteAppointment: (id: number) => void;
  addBed: (bed: Omit<Bed, 'id'>) => void;
  updateBed: (id: number, data: Partial<Bed>) => void;
  deleteBed: (id: number) => void;
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: number, data: Partial<Medicine>) => void;
  deleteMedicine: (id: number) => void;
  addLabRequest: (lab: Omit<LabRequest, 'id'>) => void;
  updateLabRequest: (id: number, data: Partial<LabRequest>) => void;
  deleteLabRequest: (id: number) => void;
  updateMarketingRepresentative: (id: number, data: Partial<MarketingRepresentative>) => void;
  deleteMarketingRepresentative: (id: number) => void;
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
  const [hospitalReferrals, setHospitalReferrals] = useState<HospitalReferral[]>(INITIAL_HOSPITAL_REFERRALS);
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
        localStorage.setItem('medix_hospital_referrals', JSON.stringify(INITIAL_HOSPITAL_REFERRALS));
        localStorage.setItem('medix_db_schema_version', '2026_realtime_zero_state_v3');
        
        setSuperAdminProfile(DEFAULT_SUPER_ADMIN_PROFILE);
        setBranches(INITIAL_BRANCHES);
        setBranchAdmins(INITIAL_BRANCH_ADMINS);
        setDoctors(INITIAL_DOCTORS);
        setPatients(INITIAL_PATIENTS);
        setBeds(INITIAL_BEDS);
        setMedicines(INITIAL_MEDICINES);
        setAppointments(INITIAL_APPOINTMENTS);
        setHospitalReferrals(INITIAL_HOSPITAL_REFERRALS);
      } else {
        const safeParse = <T,>(key: string, fallback: T): T => {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return parsed !== null && parsed !== undefined ? parsed : fallback;
          } catch {
            return fallback;
          }
        };

        setSuperAdminProfile(safeParse('medix_super_admin_profile', DEFAULT_SUPER_ADMIN_PROFILE));
        setBranches(safeParse('medix_branches', INITIAL_BRANCHES));
        setBranchAdmins(safeParse('medix_branch_admins', INITIAL_BRANCH_ADMINS));
        setAdminApplications(safeParse('medix_admin_applications', INITIAL_ADMIN_APPLICATIONS));
        setMarketingRepresentatives(safeParse('medix_marketing_representatives', INITIAL_MARKETING_REPRESENTATIVES));
        setMarketingJoinRequests(safeParse('medix_marketing_join_requests', INITIAL_MARKETING_JOIN_REQUESTS));
        setMarketingEmailLogs(safeParse('medix_marketing_email_logs', INITIAL_MARKETING_EMAIL_LOGS));
        setDoctors(safeParse('medix_doctors', INITIAL_DOCTORS));
        setPatients(safeParse('medix_patients', INITIAL_PATIENTS));
        setBeds(safeParse('medix_beds', INITIAL_BEDS));
        setMedicines(safeParse('medix_medicines', INITIAL_MEDICINES));
        setAppointments(safeParse('medix_appointments', INITIAL_APPOINTMENTS));
        setHospitalReferrals(safeParse('medix_hospital_referrals', INITIAL_HOSPITAL_REFERRALS));
      }
      const savedRole = localStorage.getItem('medix_user_role') as UserRole;
      if (savedRole) setUserRole(savedRole);
      const concept = localStorage.getItem('medix_landing_concept');
      if (concept) setSelectedLandingConceptIdState(parseInt(concept, 10) || 7);
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
      window.dispatchEvent(new CustomEvent('medix_database_updated', { detail: { branches, doctors } }));
      document.querySelectorAll('iframe').forEach(frame => {
        try {
          frame.contentWindow?.postMessage({ type: 'MEDIX_DB_SYNC', branches, doctors }, '*');
        } catch (_) {}
      });
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
      window.dispatchEvent(new CustomEvent('medix_database_updated', { detail: { branches, doctors } }));
      document.querySelectorAll('iframe').forEach(frame => {
        try {
          frame.contentWindow?.postMessage({ type: 'MEDIX_DB_SYNC', branches, doctors }, '*');
        } catch (_) {}
      });

      // Synchronize live doctors & hospitals database with Cloud API Gateway
      try {
        fetch('/api/v1/database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'medix_master_sa_key_2026_ariyan_hq_wb9144376971'
          },
          body: JSON.stringify({ branches, doctors })
        }).catch(() => {});
      } catch (_) {}
    }
  }, [doctors, branches]);

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

  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_hospital_referrals', JSON.stringify(hospitalReferrals));
    }
  }, [hospitalReferrals]);

  // Real-time Event Listeners for Doctor App Dispatches
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomReferral = (e: any) => {
      if (e.detail) {
        setHospitalReferrals(prev => {
          if (prev.some(r => r.referralId === e.detail.referralId || r.id === e.detail.id)) return prev;
          return [e.detail, ...prev];
        });
      }
    };

    const handleWindowMessage = (e: any) => {
      if (e.data && (e.data.type === 'MEDIX_REFERRAL_DISPATCHED' || e.data.type === 'MEDIX_NEW_REFERRAL') && e.data.referral) {
        setHospitalReferrals(prev => {
          if (prev.some(r => r.referralId === e.data.referral.referralId || r.id === e.data.referral.id)) return prev;
          return [e.data.referral, ...prev];
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'medix_hospital_referrals' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setHospitalReferrals(parsed);
        } catch (_) {}
      }
    };

    // Multi-device & Cross-Client Cloud Synchronization Poller
    const syncWithServerReferrals = async () => {
      try {
        const res = await fetch('/api/v1/doctor/referrals', {
          headers: {
            'x-api-key': 'medix_master_sa_key_2026_ariyan_hq_wb9144376971'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && Array.isArray(data.data.referrals)) {
            const serverRefs = data.data.referrals;
            setHospitalReferrals(prev => {
              const merged = [...prev];
              serverRefs.forEach((sr: any) => {
                const existingIndex = merged.findIndex(r => r.referralId === sr.referralId || r.id === sr.id);
                if (existingIndex === -1) {
                  merged.unshift(sr);
                }
              });
              return merged;
            });
          }
        }
      } catch (_) {}
    };

    syncWithServerReferrals();
    const interval = setInterval(syncWithServerReferrals, 500);

    window.addEventListener('medix_referral_dispatched', handleCustomReferral);
    window.addEventListener('message', handleWindowMessage);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('medix_referral_dispatched', handleCustomReferral);
      window.removeEventListener('message', handleWindowMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      id: doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1,
    };
    setDoctors(prev => [...prev, created]);
  };

  const updateDoctor = (id: number, data: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDoctor = (id: number) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const addPatient = (newPatient: Omit<Patient, 'id'>) => {
    const created: Patient = {
      ...newPatient,
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
    };
    setPatients(prev => [...prev, created]);
  };

  const updatePatient = (id: number, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePatient = (id: number) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addBranch = (newBranchData: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'>) => {
    const newId = branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1;
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
          id: prev.length > 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1,
          branchId: newId,
          branchCode: newBranchData.code,
          branchName: newBranchData.name,
          name: newBranchData.adminName,
          email: newBranchData.adminEmail,
          phone: '+91 9804222142',
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
      id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
      tokenNumber: nextToken,
    };
    setAppointments(prev => [...prev, created]);
  };

  const updateAppointment = (id: number, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addBed = (newBed: Omit<Bed, 'id'>) => {
    const created: Bed = {
      ...newBed,
      id: beds.length > 0 ? Math.max(...beds.map(b => b.id)) + 1 : 1,
    };
    setBeds(prev => [...prev, created]);
  };

  const updateBed = (id: number, data: Partial<Bed>) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBed = (id: number) => {
    setBeds(prev => prev.filter(b => b.id !== id));
  };

  const addMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const created: Medicine = {
      ...newMed,
      id: medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1,
    };
    setMedicines(prev => [...prev, created]);
  };

  const updateMedicine = (id: number, data: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMedicine = (id: number) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const addLabRequest = (newLab: Omit<LabRequest, 'id'>) => {
    const created: LabRequest = {
      ...newLab,
      id: labRequests.length > 0 ? Math.max(...labRequests.map(l => l.id)) + 1 : 1,
    };
    setLabRequests(prev => [...prev, created]);
  };

  const updateLabRequest = (id: number, data: Partial<LabRequest>) => {
    setLabRequests(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLabRequest = (id: number) => {
    setLabRequests(prev => prev.filter(l => l.id !== id));
  };

  const addHospitalReferral = (newReferral: HospitalReferral) => {
    setHospitalReferrals(prev => {
      if (prev.some(r => r.referralId === newReferral.referralId || r.id === newReferral.id)) return prev;
      return [newReferral, ...prev];
    });
  };

  const updateHospitalReferralStatus = (id: string | number, status: HospitalReferral['status'], notes?: string) => {
    setHospitalReferrals(prev =>
      prev.map(r => (r.id === id || r.referralId === id ? {
        ...r,
        status,
        clinicalSummary: notes ? `${r.clinicalSummary}\n[Reception Note]: ${notes}` : r.clinicalSummary
      } : r))
    );
  };

  const deleteHospitalReferral = (id: string | number) => {
    setHospitalReferrals(prev => prev.filter(r => r.id !== id && r.referralId !== id));
  };

  const updateMarketingRepresentative = (id: number, data: Partial<MarketingRepresentative>) => {
    setMarketingRepresentatives(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteMarketingRepresentative = (id: number) => {
    setMarketingRepresentatives(prev => prev.filter(r => r.id !== id));
    setMarketingJoinRequests(prev => prev.filter(r => r.id !== id));
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
    const randomSuffix = Date.now().toString().slice(-4);
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
      id: `EML-DISPATCH-${Date.now().toString().slice(-6)}`,
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
      securityToken: `AUTH-SA-HQ-${Date.now().toString().slice(-6)}-SEC`,
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
        updateDoctor,
        deleteDoctor,
        addPatient,
        updatePatient,
        deletePatient,
        addBranch,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addBed,
        updateBed,
        deleteBed,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addLabRequest,
        updateLabRequest,
        deleteLabRequest,
        hospitalReferrals,
        addHospitalReferral,
        updateHospitalReferralStatus,
        deleteHospitalReferral,
        updateMarketingRepresentative,
        deleteMarketingRepresentative,
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
