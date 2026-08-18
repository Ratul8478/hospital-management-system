"use client";

import React, { createContext, useContext, useState } from 'react';
import {
  Branch,
  BranchAdminUser,
  AdminApplicationRequest,
  MarketingRepresentative,
  MarketingJoinRequest,
  Doctor,
  Patient,
  Bed,
  Medicine,
  LabRequest,
  Invoice,
  Appointment,
  AuditLog,
  INITIAL_BRANCHES,
  INITIAL_BRANCH_ADMINS,
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_MARKETING_REPRESENTATIVES,
  INITIAL_MARKETING_JOIN_REQUESTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_MEDICINES,
  INITIAL_LAB_REQUESTS,
  INITIAL_INVOICES,
  INITIAL_APPOINTMENTS,
  INITIAL_AUDIT_LOGS,
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
  branches: Branch[];
  branchAdmins: BranchAdminUser[];
  adminApplications: AdminApplicationRequest[];
  marketingRepresentatives: MarketingRepresentative[];
  marketingJoinRequests: MarketingJoinRequest[];
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
  approveMarketingJoinRequest: (requestId: number, approverAdminName?: string, approverAdminEmail?: string) => string;
  rejectMarketingJoinRequest: (requestId: number) => void;
  addMarketingRepresentative: (rep: Omit<MarketingRepresentative, 'id' | 'approvedDate'>) => void;
  updateMarketingRepStatus: (id: number, status: 'active' | 'inactive' | 'suspended') => void;
  addBranchAdmin: (admin: Omit<BranchAdminUser, 'id' | 'assignedDate'>) => void;
  updateBranchAdminStatus: (id: number, status: 'active' | 'vacant' | 'suspended') => void;
  reassignBranchAdmin: (adminId: number, newBranchId: number) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  addBranch: (newBranch: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber'>) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_branches');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BRANCHES;
  });

  const [branchAdmins, setBranchAdmins] = useState<BranchAdminUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_branch_admins');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BRANCH_ADMINS;
  });

  const [adminApplications, setAdminApplications] = useState<AdminApplicationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_admin_applications');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_APPLICATIONS;
  });

  const [marketingRepresentatives, setMarketingRepresentatives] = useState<MarketingRepresentative[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_marketing_representatives');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MARKETING_REPRESENTATIVES;
  });

  const [marketingJoinRequests, setMarketingJoinRequests] = useState<MarketingJoinRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_marketing_join_requests');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MARKETING_JOIN_REQUESTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_doctors');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_patients');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PATIENTS;
  });

  const [beds] = useState<Bed[]>(INITIAL_BEDS);
  const [medicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [labRequests] = useState<LabRequest[]>(INITIAL_LAB_REQUESTS);
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_appointments');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_APPOINTMENTS;
  });

  const [auditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [selectedBranchId, setSelectedBranchId] = useState<number | 'all'>('all');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');

  const [selectedLandingConceptId, setSelectedLandingConceptIdState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_landing_concept');
      if (saved) try { return parseInt(saved, 10); } catch (e) {}
    }
    return 7;
  });

  const setSelectedLandingConceptId = (id: number) => {
    setSelectedLandingConceptIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_landing_concept', id.toString());
    }
  };

  // Sync to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_branches', JSON.stringify(branches));
    }
  }, [branches]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_branch_admins', JSON.stringify(branchAdmins));
    }
  }, [branchAdmins]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_admin_applications', JSON.stringify(adminApplications));
    }
  }, [adminApplications]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_marketing_representatives', JSON.stringify(marketingRepresentatives));
    }
  }, [marketingRepresentatives]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_marketing_join_requests', JSON.stringify(marketingJoinRequests));
    }
  }, [marketingJoinRequests]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_doctors', JSON.stringify(doctors));
    }
  }, [doctors]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_patients', JSON.stringify(patients));
    }
  }, [patients]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medix_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

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
    const newRequest: MarketingJoinRequest = {
      ...requestData,
      id: marketingJoinRequests.length + 1,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setMarketingJoinRequests(prev => [newRequest, ...prev]);
  };

  const approveMarketingJoinRequest = (requestId: number, approverAdminName?: string, approverAdminEmail?: string): string => {
    const targetReq = marketingJoinRequests.find(r => r.id === requestId);
    if (!targetReq) return '';

    // Target branch and approver info
    const branchObj = branches.find(b => b.id === targetReq.targetBranchId);
    const finalApproverName = approverAdminName || branchObj?.adminName || 'Hospital Administrator';
    const finalApproverEmail = approverAdminEmail || branchObj?.adminEmail || 'admin@hospital.local';

    // Generate unique Reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `REF-MKT-B${targetReq.targetBranchId}-${randomSuffix}`;

    // Update request status
    setMarketingJoinRequests(prev =>
      prev.map(r => r.id === requestId ? {
        ...r,
        status: 'approved',
        approvedReferenceId: generatedRefId,
        approvedByAdminName: finalApproverName,
        approvedByAdminEmail: finalApproverEmail,
      } : r)
    );

    // Add to active Marketing Representatives
    const newRep: MarketingRepresentative = {
      id: marketingRepresentatives.length + 1,
      referenceId: generatedRefId,
      branchId: targetReq.targetBranchId,
      branchCode: targetReq.targetBranchCode,
      branchName: targetReq.targetBranchName,
      name: targetReq.name,
      email: targetReq.email,
      phone: targetReq.phone,
      territory: targetReq.territory,
      experienceYears: targetReq.experienceYears,
      status: 'active',
      approvedDate: new Date().toISOString().split('T')[0],
      approvedByAdminName: finalApproverName,
      approvedByAdminEmail: finalApproverEmail,
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: '10% on Diagnostics & OPD',
    };

    setMarketingRepresentatives(prev => [newRep, ...prev]);
    return generatedRefId;
  };

  const rejectMarketingJoinRequest = (requestId: number) => {
    setMarketingJoinRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
    );
  };

  const addMarketingRepresentative = (rep: Omit<MarketingRepresentative, 'id' | 'approvedDate'>) => {
    const newRep: MarketingRepresentative = {
      ...rep,
      id: marketingRepresentatives.length + 1,
      approvedDate: new Date().toISOString().split('T')[0],
    };
    setMarketingRepresentatives(prev => [newRep, ...prev]);
  };

  const updateMarketingRepStatus = (id: number, status: 'active' | 'inactive' | 'suspended') => {
    setMarketingRepresentatives(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
  };

  return (
    <AppContext.Provider
      value={{
        branches,
        branchAdmins,
        adminApplications,
        marketingRepresentatives,
        marketingJoinRequests,
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
        approveMarketingJoinRequest,
        rejectMarketingJoinRequest,
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
