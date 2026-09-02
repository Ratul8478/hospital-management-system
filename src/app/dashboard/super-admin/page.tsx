"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useApp } from '@/lib/store';
import { MarketingJoinRequest, MarketingRepresentative } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Crown,
  User,
  CalendarDays,
  Stethoscope,
  Activity,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  Coins,
  Handshake,
  TrendingUp,
  Users,
  Shield,
  Settings,
  ClipboardList,
  Building2,
  DollarSign,
  Plus,
  PlusCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Check,
  Trash2,
  Eye,
  Phone,
  Mail,
  Briefcase,
  ArrowRight,
  UserPlus,
  MapPin,
  Rocket,
  Search,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Sparkles,
  ChevronRight,
  Share2,
  UserCheck,
  Lock,
  FileText,
  Send,
  Key,
  Radio
} from 'lucide-react';

function SuperAdminDashboardContent() {
  const router = useRouter();
  const {
    branches,
    doctors,
    patients,
    beds,
    medicines,
    labRequests,
    invoices,
    appointments,
    auditLogs,
    adminApplications,
    marketingRepresentatives,
    marketingJoinRequests,
    marketingEmailLogs,
    superAdminFinalApproveMarketingRequest,
    superAdminDirectApproveMainHospitalRequest,
    rejectMarketingJoinRequest,
    directHireMarketingRepresentative,
    fireMarketingRepresentative,
    reinstateMarketingRepresentative,
    hireAdmin,
    fireAdmin,
    approveAdminApplication,
    rejectAdminApplication,
    addBranch,
    updateBranch,
    deleteBranch,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addMarketingRepresentative,
    services,
    addService,
    updateService,
    deleteService,
    setSelectedBranchId,
    setUserRole,
    userRole,
  } = useApp();

  // Active Division / Tab
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'branches' | 'campus' | 'clinical' | 'finance' | 'admin' | 'applications' | 'marketing-hq' | 'marketing-branch' | 'marketing' | 'inspector' | 'services'>('branches');
  const [inspectedBranchId, setInspectedBranchId] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize tab from URL query params (e.g. ?tab=marketing-hq)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['branches', 'campus', 'clinical', 'finance', 'admin', 'applications', 'marketing-hq', 'marketing-branch', 'marketing', 'inspector', 'services'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Computed Pending Marketing Queues
  const directHqPending = useMemo(() => {
    return marketingJoinRequests.filter(r => r.targetBranchId === 1 && r.status === 'pending_super_admin_approval');
  }, [marketingJoinRequests]);

  const branchForwardedPending = useMemo(() => {
    return marketingJoinRequests.filter(r => r.targetBranchId !== 1 && r.status === 'pending_super_admin_approval');
  }, [marketingJoinRequests]);

  const rejectedMarketingRequests = useMemo(() => {
    return marketingJoinRequests.filter(r => r.status === 'rejected');
  }, [marketingJoinRequests]);

  // Marketing Pipeline Sub-Tab in Super Admin
  const [marketingSubTab, setMarketingSubTab] = useState<'all' | 'hq_direct' | 'branch_forwarded' | 'email_logs' | 'directory'>('all');

  // KYC Dossier Inspector Modal
  const [inspectingKycReq, setInspectingKycReq] = useState<MarketingJoinRequest | null>(null);

  // Marketing Email Dispatch Celebration Modal
  const [dispatchedEmailModal, setDispatchedEmailModal] = useState<{
    repName: string;
    refId: string;
    email: string;
    branchName: string;
    adminName: string;
  } | null>(null);

  // Search & Filter state for Branches Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<'ALL' | 'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPANSION'>('ALL');

  // Admin details modal state
  const [selectedBranchForDetails, setSelectedBranchForDetails] = useState<number | null>(null);

  // Modals state
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showHireAdmin, setShowHireAdmin] = useState(false);
  const [hireBranchId, setHireBranchId] = useState<number | null>(null);

  // Notifications
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Form inputs
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchLoc, setNewBranchLoc] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchHead, setNewBranchHead] = useState('');
  const [newFacilityType, setNewFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('Hospital');
  const [newGovRegNumber, setNewGovRegNumber] = useState('');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Hire Doctor Modal State
  const [showHireDoctor, setShowHireDoctor] = useState(false);
  const [docName, setDocName] = useState('');
  const [docBranchId, setDocBranchId] = useState<number>(1);
  const [docSpecialty, setDocSpecialty] = useState('General & Cardiology Medicine');
  const [docFee, setDocFee] = useState<number>(800);
  const [docContact, setDocContact] = useState('');
  const [docStatus, setDocStatus] = useState<'available' | 'busy' | 'off-duty'>('available');

  // Hire Marketing Rep Modal State
  const [showHireMarketingRep, setShowHireMarketingRep] = useState(false);
  const [mktName, setMktName] = useState('');
  const [mktBranchId, setMktBranchId] = useState<number>(1);
  const [mktTerritory, setMktTerritory] = useState('');
  const [mktPhone, setMktPhone] = useState('');
  const [mktEmail, setMktEmail] = useState('');
  const [mktExperience, setMktExperience] = useState<number>(3);
  const [mktCommission, setMktCommission] = useState('10% on Diagnostics & OPD');

  // Total KPIs across all 9 branches
  const totalRev = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPatients = patients.length;
  const totalBedsOccupied = beds.filter(b => b.status === 'occupied').length;
  const totalBedsCount = beds.length;

  const pendingApplications = adminApplications.filter(a => a.status === 'pending');

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        (b.branchHead && b.branchHead.toLowerCase().includes(q)) ||
        b.adminName.toLowerCase().includes(q);

      const matchesFacility =
        facilityFilter === 'ALL' || b.facilityType === facilityFilter;

      const matchesStatus =
        statusFilter === 'ALL' || (b.badgeStatus || 'ACTIVE') === statusFilter;

      return matchesSearch && matchesFacility && matchesStatus;
    });
  }, [branches, searchQuery, facilityFilter, statusFilter]);

  const handleExportExecutiveReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Branch Code,Name,Location,Status,Branch Head,Admin,Today Revenue,Bed Occupancy,Active Doctors\n" +
        branches
          .map(
            (b) =>
              `"${b.code}","${b.name}","${b.location}","${b.badgeStatus || 'ACTIVE'}","${b.branchHead || 'Dr. Head'}","${b.adminName}","${b.todayRevenueFormatted || '₹ 1,50,000'}","${b.bedOccupancy}","${b.activeConsultants || 20}"`
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Medix_Enterprise_Network_Audit_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setActionAlert({
        type: 'success',
        message: 'Executive 9-Branch Network Audit CSV Report exported successfully!',
      });
      setTimeout(() => setActionAlert(null), 3500);
    }, 800);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode || !newGovRegNumber) return;
    addBranch({
      name: newBranchName,
      code: newBranchCode,
      facilityType: newFacilityType,
      govRegNumber: newGovRegNumber,
      location: newBranchLoc || 'Central Sector',
      address: newBranchAddress || `${newBranchLoc}, Medical Enclave`,
      branchHead: newBranchHead || 'Dr. Assigned Head (Medical Director)',
      adminName: 'Unassigned',
      adminEmail: 'pending@hospital.com',
      badgeStatus: 'ACTIVE',
    });
    setNewBranchName('');
    setNewBranchCode('');
    setNewBranchLoc('');
    setNewBranchAddress('');
    setNewBranchHead('');
    setNewGovRegNumber('');
    setShowAddBranch(false);
    setActionAlert({ type: 'success', message: `Hospital Node ${newBranchCode} onboarded successfully!` });
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleHireAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hireBranchId && adminName && adminEmail) {
      hireAdmin(hireBranchId, adminName, adminEmail, adminPhone || '+91 98000 00000');
      const targetB = branches.find(b => b.id === hireBranchId);
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
      setShowHireAdmin(false);
      setActionAlert({ type: 'success', message: `${adminName} appointed as Branch Central Admin for ${targetB?.code} (${targetB?.name})!` });
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const handleHireDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDoctor({
      branchId: Number(docBranchId),
      name: docName.trim(),
      specialty: docSpecialty,
      fee: Number(docFee) || 500,
      status: docStatus,
      contact: docContact.trim() || '+91 98000 00000',
    });

    const targetBranch = branches.find(b => b.id === Number(docBranchId));
    setActionAlert({
      type: 'success',
      message: `Doctor ${docName.trim()} hired & appointed successfully to ${targetBranch?.name || 'Hospital Campus'}!`,
    });
    setTimeout(() => setActionAlert(null), 4500);

    setDocName('');
    setDocContact('');
    setShowHireDoctor(false);
  };

  const handleDeleteDoctorAction = (docId: number, name: string) => {
    if (confirm(`Are you sure you want to remove Doctor ${name} from the roster?`)) {
      deleteDoctor(docId);
      setActionAlert({
        type: 'error',
        message: `Doctor ${name} has been removed from the central clinical roster.`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const handleToggleDoctorStatus = (docId: number, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === 'available' ? 'busy' : currentStatus === 'busy' ? 'off-duty' : 'available';
    updateDoctor(docId, { status: nextStatus as any });
    setActionAlert({
      type: 'success',
      message: `Doctor ${name} status updated to "${nextStatus.toUpperCase()}".`,
    });
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleDeleteBranchAction = (branchId: number, branchName: string, branchCode: string) => {
    if (confirm(`Are you sure you want to decommission / delete Hospital Branch "${branchCode} - ${branchName}"? This will remove all associated telemetry.`)) {
      deleteBranch(branchId);
      setActionAlert({
        type: 'error',
        message: `Hospital Branch ${branchCode} (${branchName}) has been decommissioned & deleted.`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const handleHireMarketingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mktName.trim() || !mktEmail.trim()) return;

    directHireMarketingRepresentative({
      name: mktName.trim(),
      email: mktEmail.trim(),
      phone: mktPhone.trim() || '+91 98000 00000',
      targetBranchId: Number(mktBranchId),
      territory: mktTerritory.trim() || 'General Regional Healthcare Network',
      experienceYears: Number(mktExperience) || 2,
      qualificationsOrNotes: mktCommission || 'Directly Onboarded by Super Admin',
    });

    setActionAlert({
      type: 'success',
      message: `Candidate ${mktName.trim()} submitted to Super Admin Approval Queue! Review & click "Approve & Dispatch Reference ID" for final activation.`,
    });
    setTimeout(() => setActionAlert(null), 5000);

    setMktName('');
    setMktPhone('');
    setMktEmail('');
    setMktTerritory('');
    setShowHireMarketingRep(false);
    setActiveTab('marketing-hq');
  };

  const handleFireMarketingRepAction = (rep: MarketingRepresentative) => {
    if (confirm(`Are you sure you want to terminate / fire ${rep.name} (${rep.referenceId})? Their system access and referral tracking will be revoked immediately.`)) {
      fireMarketingRepresentative(rep.id, 'Terminated by Super Admin Executive Command');
      setActionAlert({
        type: 'error',
        message: `Marketing Representative ${rep.name} (${rep.referenceId}) has been FIRED / TERMINATED. Portal access is revoked immediately.`,
      });
      setTimeout(() => setActionAlert(null), 5000);
    }
  };

  const handleReinstateMarketingRepAction = (rep: MarketingRepresentative) => {
    reinstateMarketingRepresentative(rep.id);
    setActionAlert({
      type: 'success',
      message: `Marketing Representative ${rep.name} (${rep.referenceId}) has been RE-ACTIVATED & RE-HIRED. Portal access is restored.`,
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleFireAdminAction = (branchId: number) => {
    const targetB = branches.find(b => b.id === branchId);
    const oldAdmin = targetB?.adminName;
    fireAdmin(branchId);
    setActionAlert({
      type: 'error',
      message: `${oldAdmin} has been removed from ${targetB?.code}. Position is now VACANT and dashboard access is revoked.`,
    });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleApproveApplicant = (appId: number) => {
    const app = adminApplications.find(a => a.id === appId);
    if (app) {
      approveAdminApplication(appId);
      setActionAlert({
        type: 'success',
        message: `Approved! ${app.applicantName} is now the active Branch Central Admin for ${app.targetBranchCode} (${app.targetBranchName}).`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const handleRejectApplicant = (appId: number) => {
    const app = adminApplications.find(a => a.id === appId);
    rejectAdminApplication(appId);
    setActionAlert({
      type: 'error',
      message: `Application from ${app?.applicantName} for ${app?.targetBranchCode} has been rejected.`,
    });
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleApproveMarketingDirect = (req: MarketingJoinRequest) => {
    const generatedRef = superAdminDirectApproveMainHospitalRequest(req.id, 'Anichul Haque (Super Admin HQ Master)');
    setDispatchedEmailModal({
      repName: req.name,
      refId: generatedRef,
      email: req.email,
      branchName: 'ARIYAN HOSPITAL MULTISPECIALITY (HQ)',
      adminName: 'Anichul Haque (Super Admin HQ Master)',
    });
    setActionAlert({
      type: 'success',
      message: `Direct HQ Marketing Representative ${req.name} Approved! Reference ID ${generatedRef} dispatched to ${req.email}.`,
    });
    setTimeout(() => setActionAlert(null), 4500);
  };

  const handleApproveMarketingBranch = (req: MarketingJoinRequest) => {
    const targetBranchObj = branches.find(b => b.id === req.targetBranchId);
    const generatedRef = superAdminFinalApproveMarketingRequest(req.id, 'Anichul Haque (Super Admin HQ Master)');
    setDispatchedEmailModal({
      repName: req.name,
      refId: generatedRef,
      email: req.email,
      branchName: req.targetBranchName,
      adminName: req.branchAdminName || targetBranchObj?.adminName || 'Branch Administrator',
    });
    setActionAlert({
      type: 'success',
      message: `Branch-Forwarded Candidate ${req.name} Granted Final Master Approval! Reference ID ${generatedRef} dispatched to ${req.email}.`,
    });
    setTimeout(() => setActionAlert(null), 4500);
  };

  const handleRejectMarketing = (reqId: number, reqName?: string) => {
    rejectMarketingJoinRequest(reqId);
    setActionAlert({
      type: 'error',
      message: `Marketing application #${reqId} (${reqName || 'Applicant'}) has been rejected by Super Admin.`,
    });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleEnterBranchERP = (branchId: number) => {
    setInspectedBranchId(branchId);
    setActiveTab('inspector');
  };

  const inspectedBranch = branches.find(b => b.id === inspectedBranchId) || branches[0];
  const inspectedDocs = doctors.filter(d => d.branchId === inspectedBranch.id);
  const inspectedPatients = patients.filter(p => p.branchId === inspectedBranch.id);
  const inspectedBeds = beds.filter(b => b.branchId === inspectedBranch.id);
  const inspectedMeds = medicines.filter(m => m.branchId === inspectedBranch.id);
  const inspectedInvoices = invoices.filter(i => i.branchId === inspectedBranch.id);
  const inspectedRev = inspectedInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const detailedBranch = branches.find(b => b.id === selectedBranchForDetails);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 rounded-3xl p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#046a4e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-600">Initializing Enterprise Super Admin Command Center...</p>
        </div>
      </div>
    );
  }

  if (userRole === 'patient') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Restricted Headquarters Command</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            This module is exclusively reserved for <strong>Anichul Haque (Super Admin)</strong>. Patient accounts cannot view or alter central hospital infrastructure, financial ledgers, or branch administrators.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/patient"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#046a4e] hover:bg-[#03543e] text-white rounded-2xl font-bold text-xs shadow-md transition-all"
            >
              Return to Patient Care Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* EXECUTIVE COMMAND HEADER (3D TEA GREEN / FOREST LUXURY THEME) */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#044e3b] to-[#064e3b] text-white p-6 sm:p-8 rounded-3xl border border-emerald-600/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden card-3d">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#065f46] border border-emerald-400/50 text-emerald-100 text-xs font-extrabold shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 live-pulse"></span>
            <Crown className="w-4 h-4 text-amber-300" />
            <span>ENTERPRISE SUPER ADMIN CONTROL PANEL • HEALTH GROW INDIA</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Super Admin Enterprise Command Center
          </h1>
          
          <p className="text-xs text-emerald-100/90 font-medium max-w-2xl">
            Supervise all 9 hospital branch nodes, inspect clinical operations, financial ledgers, and appoint Branch Central Admins with isolated scope.
          </p>

          <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-200 font-bold">
            <span className="flex items-center gap-1.5 bg-[#012019]/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Latency: 18ms (Real-time)
            </span>
            <span className="flex items-center gap-1.5 bg-[#012019]/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Activity className="w-3.5 h-3.5 text-emerald-300" /> Network Sync: 100% Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => setShowHireDoctor(true)}
            className="flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white font-black text-xs px-4 py-3 rounded-full border border-emerald-300/40 shadow-lg transition-all cursor-pointer hover:scale-105 btn-premium-3d"
          >
            <Stethoscope className="h-4 w-4 text-emerald-200" />
            <span>+ Hire Doctor</span>
          </button>

          <button
            onClick={() => setShowHireMarketingRep(true)}
            className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-4 py-3 rounded-full border border-purple-400/40 shadow-lg transition-all cursor-pointer hover:scale-105 btn-premium-3d"
          >
            <UserPlus className="h-4 w-4 text-purple-200" />
            <span>+ Hire Marketing Rep</span>
          </button>

          <Link
            href="/receptionist"
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs px-4 py-3 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 btn-premium-3d border border-amber-300"
          >
            <Building2 className="h-4 w-4 text-amber-900" />
            <span>Receptionist Command Hub</span>
          </Link>

          <button
            onClick={() => setShowAddBranch(true)}
            className="flex items-center gap-2 bg-[#6ee7b7] hover:bg-[#34d399] text-[#022c22] font-black text-xs px-4 py-3 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 btn-premium-3d"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Onboard Branch</span>
          </button>

          <button
            onClick={handleExportExecutiveReport}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-[#064e3b] hover:bg-[#08634d] text-emerald-100 font-black text-xs px-3.5 py-3 rounded-full border border-emerald-400/40 shadow-md transition-all cursor-pointer hover:scale-105"
          >
            {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ACTION ALERT TOAST */}
      {actionAlert && (
        <div className={`p-4 rounded-2xl border text-xs font-black flex items-center justify-between gap-3 shadow-lg animate-in fade-in ${
          actionAlert.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-2.5">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionAlert.message}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EXECUTIVE PRIMARY TABS BAR */}
      <div className="bg-white p-2 rounded-2xl border border-emerald-200 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'branches', label: 'Hospitals & Branches', icon: Building2, count: branches.length, color: 'text-emerald-700' },
            { id: 'campus', label: 'Network Overview', icon: BarChart3, color: 'text-teal-700' },
            { id: 'clinical', label: 'Clinical Suite & Doctors', icon: Stethoscope, count: doctors.length, color: 'text-sky-700' },
            { id: 'finance', label: 'Finance & Invoices', icon: DollarSign, color: 'text-emerald-700' },
            { id: 'admin', label: 'Branch Central Admins', icon: Crown, count: branches.filter(b => b.adminName !== 'Unassigned').length, color: 'text-amber-700' },
            { id: 'applications', label: 'Admin Applications', icon: UserCheck, count: pendingApplications.length, isBadgeAlert: pendingApplications.length > 0, color: 'text-blue-700' },
            { id: 'marketing-hq', label: 'Direct HQ Marketing', icon: Share2, count: directHqPending.length, isBadgeAlert: directHqPending.length > 0, color: 'text-amber-700' },
            { id: 'marketing-branch', label: 'Branch Marketing Approvals', icon: Rocket, count: branchForwardedPending.length, isBadgeAlert: branchForwardedPending.length > 0, color: 'text-purple-700' },
            { id: 'services', label: 'Hospital Services Matrix', icon: Activity, count: services.length, color: 'text-rose-700' },
            { id: 'inspector', label: 'Branch Deep Inspector', icon: Radio, color: 'text-rose-700' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#046a4e] text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : tab.color}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive 
                      ? 'bg-emerald-800 text-white' 
                      : tab.isBadgeAlert 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: HOSPITAL BRANCHES DIRECTORY (3D INTERACTIVE CARDS) */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          
          {/* SEARCH & FACILITY FILTER BAR */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200 px-4 py-2.5 rounded-2xl w-full md:w-96 focus-within:border-[#046a4e] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-[#046a4e] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches, campus, doctors, code..."
                className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                {(['ALL', 'Hospital', 'Nursing Home', 'Diagnostic Center'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFacilityFilter(type)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      facilityFilter === type
                        ? 'bg-[#046a4e] text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === 'ALL' ? `All (${branches.length})` : type === 'Hospital' ? '🏥 Hospitals' : type === 'Nursing Home' ? '🏣 Nursing Homes' : '🔬 Diagnostics'}
                  </button>
                ))}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 rounded-xl outline-none"
              >
                <option value="ALL">Status: All</option>
                <option value="ACTIVE">Active Only</option>
                <option value="EXPANSION">Expansion Only</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              Hospital Branches Directory ({filteredBranches.length})
            </h2>
            <span className="text-xs font-black text-emerald-800">
              Showing {filteredBranches.length} of {branches.length} Campuses
            </span>
          </div>

          {/* 3D MULTI-COLUMN DIRECTORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBranches.map((branch, index) => {
              const occupiedBeds = branch.bedOccupiedCount ?? (branch.id === 1 ? 84 : branch.id === 2 ? 58 : branch.id === 3 ? 46 : branch.id === 4 ? 12 : branch.id === 5 ? 0 : 30);
              const totalBeds = branch.bedTotalCount ?? (branch.id === 1 ? 120 : branch.id === 2 ? 75 : branch.id === 3 ? 60 : branch.id === 4 ? 25 : branch.id === 5 ? 100 : 50);
              const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
              const consultants = branch.activeConsultants ?? (branch.id === 1 ? 42 : branch.id === 2 ? 28 : branch.id === 3 ? 22 : branch.id === 4 ? 15 : branch.id === 5 ? 18 : 20);
              const revenueDisplay = branch.todayRevenueFormatted ?? (branch.id === 5 ? '₹ 0' : `₹ ${(branch.revenue || 150000).toLocaleString()}`);
              const isFirstCard = index === 0 && searchQuery === '';

              return (
                <div
                  key={branch.id}
                  className={`bg-white rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 relative shadow-sm card-3d ${
                    isFirstCard
                      ? 'border-2 border-[#046a4e] shadow-md shadow-emerald-900/10'
                      : 'border border-emerald-100 hover:border-emerald-400 hover:shadow-xl'
                  }`}
                >
                  
                  <div className="space-y-4">
                    
                    {/* Top Row: Branch Code Badge & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 text-[11px] font-black rounded-lg bg-emerald-50 text-[#046a4e] border border-emerald-200 tracking-wider">
                        {branch.code}
                      </span>
                      
                      <span className={`px-3 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                        branch.badgeStatus === 'EXPANSION'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {branch.badgeStatus || 'ACTIVE'}
                      </span>
                    </div>

                    {/* Branch Title */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {branch.name}
                      </h3>
                    </div>

                    {/* Location Pin & Campus Details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-rose-700">
                        <MapPin className="w-3.5 h-3.5 shrink-0 fill-rose-600 text-white" />
                        <span className="text-emerald-950">{branch.location}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {branch.address || `${branch.location}, Medical Zone`}
                      </p>
                    </div>

                    {/* Leadership & Admin Details Box */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-xs">
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Branch Head:</span>
                        <span className="col-span-8 font-extrabold text-slate-900 truncate">
                          {branch.branchHead || 'Dr. Medical Director'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Branch Admin:</span>
                        <span className="col-span-8 font-extrabold text-emerald-900 truncate">
                          {branch.adminName}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Admin Email:</span>
                        <span className="col-span-8 text-slate-600 font-mono truncate">
                          {branch.adminEmail}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Admin Phone:</span>
                        <span className="col-span-8 text-slate-700 font-mono font-bold truncate">
                          {branch.adminPhone || '+91 98000 00000'}
                        </span>
                      </div>
                    </div>

                    {/* Operational Metrics Row */}
                    <div className="pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Today&apos;s Revenue</span>
                          <span className="text-sm font-black text-[#046a4e]">{revenueDisplay}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">Active Doctors</span>
                          <span className="text-xs font-black text-slate-900">{consultants} Consultants</span>
                        </div>
                      </div>

                      {/* Bed Occupancy Progress Bar with dynamic fill */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Bed Occupancy</span>
                          <span className="text-slate-800">{occupiedBeds} / {totalBeds} Beds</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions Row: Enter ERP & Admin Details & Delete */}
                  <div className="grid grid-cols-12 gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleEnterBranchERP(branch.id)}
                      className="col-span-7 py-2.5 px-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow-md shadow-emerald-950/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-premium-3d"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Enter {branch.code} ERP</span>
                    </button>

                    <button
                      onClick={() => setSelectedBranchForDetails(branch.id)}
                      className="col-span-3 py-2.5 px-1 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-[11px] border border-emerald-200 transition-all cursor-pointer text-center"
                    >
                      Admin
                    </button>

                    {branch.id !== 1 && (
                      <button
                        onClick={() => handleDeleteBranchAction(branch.id, branch.name, branch.code)}
                        title="Decommission Branch"
                        className="col-span-2 py-2.5 px-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CAMPUS DASHBOARD */}
      {activeTab === 'campus' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">MAIN DIVISION</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900 rounded-md">Executive</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Campus & Multi-Branch</h3>
              <p className="text-xs text-slate-500">Enterprise operational monitoring across all {branches.length} campus branches.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <button onClick={() => setActiveTab('branches')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Open Hospital Branches Directory <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">CLINICAL & PATIENTS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">Healthcare</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">EHR, OPD, IPD & Beds</h3>
              <p className="text-xs text-slate-500">{doctors.length} doctors, {appointments.length} appointments, and {medicines.length} pharmacy items.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <button onClick={() => setActiveTab('clinical')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  View Clinical Modules <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">FINANCE & PARTNERS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">Revenue</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Billing, Ledger & Franchise</h3>
              <p className="text-xs text-slate-500">₹{totalRev.toLocaleString()} collected across {invoices.length} invoices network-wide.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <button onClick={() => setActiveTab('finance')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Explore Financial Hub <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">ADMINISTRATION</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md">Security</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Users, Roles & Audit</h3>
              <p className="text-xs text-slate-500">Full RBAC role matrix, security parameters, and {auditLogs.length} logged audit events.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <button onClick={() => setActiveTab('admin')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Access Administration <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Access Matrix */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Super Admin Quick Module Directory</h2>
              <p className="text-xs text-slate-500 font-medium">Direct navigation to all 17 clinical, financial, and administrative workspaces.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Patients (EHR)', href: '/patients', icon: User, color: 'text-purple-600 bg-purple-50', count: `${patients.length} Records` },
                { name: 'Appointments & Tokens', href: '/appointments', icon: CalendarDays, color: 'text-blue-600 bg-blue-50', count: `${appointments.length} Scheduled` },
                { name: 'OPD Workspace', href: '/doctors', icon: Stethoscope, color: 'text-teal-600 bg-teal-50', count: `${doctors.length} Doctors` },
                { name: 'IPD & Admissions', href: '/beds', icon: Activity, color: 'text-indigo-600 bg-indigo-50', count: `${totalBedsOccupied} Admitted` },
                { name: 'Bed Matrix', href: '/beds', icon: BedDouble, color: 'text-rose-600 bg-rose-50', count: `${totalBedsCount} Beds` },
                { name: 'Pharmacy & POS', href: '/pharmacy', icon: Pill, color: 'text-pink-600 bg-pink-50', count: `${medicines.length} Medicines` },
                { name: 'Laboratory Diagnostic', href: '/laboratory', icon: FlaskConical, color: 'text-cyan-600 bg-cyan-50', count: `${labRequests.length} Tests` },
                { name: 'Billing & Invoicing', href: '/billing', icon: Receipt, color: 'text-slate-600 bg-slate-100', count: `${invoices.length} Invoices` },
                { name: 'Accounts & Ledger', href: '/accounting', icon: Coins, color: 'text-amber-600 bg-amber-50', count: `₹${totalRev.toLocaleString()}` },
                { name: 'Franchise / Referrals', href: '/franchise', icon: Handshake, color: 'text-yellow-600 bg-yellow-50', count: 'Active Network' },
                { name: 'Enterprise Reports', href: '/accounting', icon: TrendingUp, color: 'text-sky-600 bg-sky-50', count: 'Audit Analytics' },
                { name: 'User Accounts & Roles', href: '/admin', icon: Users, color: 'text-purple-600 bg-purple-50', count: 'RBAC Control' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={idx}
                    href={m.href}
                    className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-white hover:border-[#046a4e] hover:shadow-md transition-all space-y-2 group card-3d"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${m.color} shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500">{m.count}</span>
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#046a4e] transition-colors">{m.name}</h4>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL & PATIENTS */}
      {activeTab === 'clinical' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 2</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical & Patients Workspace</h2>
            <p className="text-xs text-slate-500 font-medium">Manage EHR patients, OPD queue, IPD admissions, beds, pharmacy POS, and lab tests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/patients" className="p-6 rounded-3xl border border-emerald-100 bg-purple-50/40 hover:bg-purple-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <User className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-black text-purple-950">{patients.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Patients (EHR)</h3>
              <p className="text-xs text-slate-600">Electronic Health Records with UHID tracking.</p>
            </Link>

            <Link href="/appointments" className="p-6 rounded-3xl border border-emerald-100 bg-blue-50/40 hover:bg-blue-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-black text-blue-950">{appointments.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Appointments & Tokens</h3>
              <p className="text-xs text-slate-600">OPD scheduling and live token counters.</p>
            </Link>

            <Link href="/doctors" className="p-6 rounded-3xl border border-emerald-100 bg-teal-50/40 hover:bg-teal-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Stethoscope className="w-6 h-6 text-teal-600" />
                <span className="text-xl font-black text-teal-950">{doctors.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">OPD Workspace</h3>
              <p className="text-xs text-slate-600">Doctor consultation roaster and prescriptions.</p>
            </Link>

            <Link href="/beds" className="p-6 rounded-3xl border border-emerald-100 bg-indigo-50/40 hover:bg-indigo-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Activity className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-black text-indigo-950">{totalBedsOccupied}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">IPD & Admissions</h3>
              <p className="text-xs text-slate-600">Inpatient ward management and discharge.</p>
            </Link>

            <Link href="/beds" className="p-6 rounded-3xl border border-emerald-100 bg-rose-50/40 hover:bg-rose-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <BedDouble className="w-6 h-6 text-rose-600" />
                <span className="text-xl font-black text-rose-950">{totalBedsCount}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Bed Matrix</h3>
              <p className="text-xs text-slate-600">ICU, Private, and General ward beds.</p>
            </Link>

            <Link href="/pharmacy" className="p-6 rounded-3xl border border-emerald-100 bg-pink-50/40 hover:bg-pink-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Pill className="w-6 h-6 text-pink-600" />
                <span className="text-xl font-black text-pink-950">{medicines.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Pharmacy & POS</h3>
              <p className="text-xs text-slate-600">Medicine dispensing and stock control.</p>
            </Link>

            <Link href="/laboratory" className="p-6 rounded-3xl border border-emerald-100 bg-cyan-50/40 hover:bg-cyan-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <FlaskConical className="w-6 h-6 text-cyan-600" />
                <span className="text-xl font-black text-cyan-950">{labRequests.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Laboratory Diagnostic</h3>
              <p className="text-xs text-slate-600">Pathology tests, biochemistry, and reports.</p>
            </Link>
          </div>

          {/* DOCTORS & SPECIALISTS HIRING & ROSTER DESK */}
          <div className="bg-[#f0fdf4] p-6 rounded-3xl border border-emerald-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  CLINICAL TALENT & CONSULTANTS
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Appointed Medical Doctors & Specialists ({doctors.length})</h3>
                <p className="text-xs text-slate-600">Super Admin direct recruitment, campus deployment, and OPD roaster.</p>
              </div>

              <button
                onClick={() => setShowHireDoctor(true)}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 self-start sm:self-auto btn-premium-3d"
              >
                <Stethoscope className="w-4 h-4 text-emerald-200" />
                <span>+ Hire & Deploy Doctor</span>
              </button>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Stethoscope className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold">No doctors currently hired. Click '+ Hire & Deploy Doctor' above to onboard doctors.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-100/60 text-[#062c21] font-extrabold uppercase text-[10px] tracking-wider rounded-xl">
                    <tr>
                      <th className="p-3">Doctor Name</th>
                      <th className="p-3">Specialty / Department</th>
                      <th className="p-3">Assigned Campus</th>
                      <th className="p-3">Consultation Fee</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100 font-medium">
                    {doctors.map(doc => {
                      const branch = branches.find(b => b.id === doc.branchId);
                      return (
                        <tr key={doc.id} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="p-3 font-black text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#046a4e] text-white flex items-center justify-center font-bold text-xs">
                              {doc.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <span>{doc.name}</span>
                          </td>
                          <td className="p-3 text-slate-700 font-bold">{doc.specialty}</td>
                          <td className="p-3 text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              {branch?.name || `Branch #${doc.branchId}`}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#046a4e]">₹ {doc.fee}</td>
                          <td className="p-3 font-mono text-slate-600">{doc.contact}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                              doc.status === 'available'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : doc.status === 'busy'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleDoctorStatus(doc.id, doc.status, doc.name)}
                                title="Toggle Status (Available / Busy / Off-duty)"
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#046a4e] border border-emerald-200 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                              >
                                Status
                              </button>
                              <Link
                                href="/doctors"
                                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-[#046a4e] border border-emerald-300 rounded-lg text-[10px] font-bold transition-all inline-block"
                              >
                                OPD
                              </Link>
                              <button
                                onClick={() => handleDeleteDoctorAction(doc.id, doc.name)}
                                title="Remove Doctor"
                                className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCE & PARTNERS */}
      {activeTab === 'finance' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 3</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Finance & Partners Hub</h2>
            <p className="text-xs text-slate-500 font-medium">Billing settlements, financial accounts, franchise commissions, and audit reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/billing" className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 hover:bg-white hover:border-[#046a4e] transition-all space-y-2 group card-3d">
              <Receipt className="w-6 h-6 text-slate-700" />
              <h3 className="font-extrabold text-sm text-slate-900">Billing & Invoicing</h3>
              <p className="text-xs text-slate-500">{invoices.length} Settled invoices</p>
            </Link>

            <Link href="/accounting" className="p-6 rounded-3xl border border-emerald-100 bg-amber-50/50 hover:bg-amber-50 transition-all space-y-2 group card-3d">
              <Coins className="w-6 h-6 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Accounts & Ledger</h3>
              <p className="text-xs text-slate-500">₹{totalRev.toLocaleString()} Balance sheet</p>
            </Link>

            <Link href="/franchise" className="p-6 rounded-3xl border border-emerald-100 bg-yellow-50/50 hover:bg-yellow-50 transition-all space-y-2 group card-3d">
              <Handshake className="w-6 h-6 text-yellow-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Franchise / Referrals</h3>
              <p className="text-xs text-slate-500">Partner revenue sharing model</p>
            </Link>

            <Link href="/accounting" className="p-6 rounded-3xl border border-emerald-100 bg-teal-50/50 hover:bg-teal-50 transition-all space-y-2 group card-3d">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Enterprise Reports</h3>
              <p className="text-xs text-slate-500">Automated financial audits</p>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: ADMINISTRATION */}
      {activeTab === 'admin' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 4</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Administration & Security</h2>
            <p className="text-xs text-slate-500 font-medium">User account management, RBAC roles & permissions, hospital configurations, and audit trail.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-purple-50/40 hover:bg-purple-50 transition-all space-y-2 group card-3d">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="font-extrabold text-sm text-slate-900">User Accounts</h3>
              <p className="text-xs text-slate-600">Enterprise user directory</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition-all space-y-2 group card-3d">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Roles & Permissions</h3>
              <p className="text-xs text-slate-600">RBAC security matrix</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-slate-50 hover:bg-slate-100 transition-all space-y-2 group card-3d">
              <Settings className="w-6 h-6 text-slate-700" />
              <h3 className="font-extrabold text-sm text-slate-900">Hospital Settings</h3>
              <p className="text-xs text-slate-600">Multi-branch system parameters</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-amber-50/40 hover:bg-amber-50 transition-all space-y-2 group card-3d">
              <ClipboardList className="w-6 h-6 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Audit Trail</h3>
              <p className="text-xs text-slate-600">{auditLogs.length} Security logs</p>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 6: ADMIN APPLICATIONS QUEUE */}
      {activeTab === 'applications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-4 gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Branch Admin Candidate Requests & Applications</h2>
              <p className="text-xs text-slate-500 font-medium">Review candidates requesting appointment for Branch Central Admin positions. Approve to grant instant dashboard access.</p>
            </div>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full w-fit">
              {pendingApplications.length} Pending Approval
            </span>
          </div>

          {adminApplications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Inbox className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-sm">No incoming applications in queue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminApplications.map(app => (
                <div
                  key={app.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 card-3d ${
                    app.status === 'approved'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : app.status === 'rejected'
                      ? 'bg-rose-50/50 border-rose-200 opacity-75'
                      : 'bg-white border-emerald-100 shadow-sm hover:border-[#046a4e]'
                  }`}
                >
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-black text-slate-900">{app.applicantName}</span>
                      <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#022c22] text-white rounded-md">
                        Applying for: {app.targetBranchCode}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        app.status === 'approved'
                          ? 'bg-emerald-200 text-emerald-900'
                          : app.status === 'rejected'
                          ? 'bg-rose-200 text-rose-900'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-emerald-800">
                      Target Hospital Node: {app.targetBranchName}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {app.experienceYears} Years Exp</span>
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-2xl text-xs text-slate-700 space-y-1 border border-emerald-100">
                      <p className="font-bold text-slate-900">🎓 Credentials & Qualifications: <span className="font-medium text-slate-600">{app.qualifications}</span></p>
                      {app.notes && <p className="text-slate-500 italic">&ldquo;{app.notes}&rdquo;</p>}
                    </div>
                  </div>

                  {/* Actions for Application */}
                  <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveApplicant(app.id)}
                          className="flex-1 lg:flex-none px-5 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 btn-premium-3d"
                        >
                          <Check className="w-4 h-4" /> Approve as Admin
                        </button>
                        <button
                          onClick={() => handleRejectApplicant(app.id)}
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-full transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : app.status === 'approved' ? (
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active Branch Admin</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full">
                        Application Declined
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: DIRECT HQ MARKETING QUEUE (SUPER ADMIN 1-CLICK APPROVE OR REJECT)    */}
      {/* ========================================================================= */}
      {activeTab === 'marketing-hq' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-6 animate-in fade-in">
          {/* Header & Status Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-amber-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-3 py-1 rounded-full border border-amber-400 flex items-center gap-1.5 shadow-2xs">
                  <Crown className="w-3.5 h-3.5 text-amber-700" />
                  DIRECT HEADQUARTERS MARKETING DESK (BRANCH 1)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">
                  <Radio className="w-3 h-3 text-emerald-600 animate-spin" />
                  REAL-TIME QUEUE ACTIVE
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1.5">
                Direct Super Admin HQ Marketing Requests
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-3xl mt-0.5">
                Candidates applying directly for entry into Super Admin&apos;s Main Hospital (Medix Central). Review complete KYC, grant instant approval to dispatch Reference ID to email, or reject application.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 text-xs font-mono font-bold border border-amber-300">
                Pending Direct Action: {directHqPending.length}
              </span>
              <button
                onClick={() => setActiveTab('marketing-branch')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Switch to Branch Queue ({branchForwardedPending.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Protocol Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-black text-amber-950">SUPER ADMIN DIRECT DISPATCH RULES</h4>
              <p className="text-amber-900 font-medium leading-relaxed">
                Jab aap kisi Direct HQ applicant ko <strong>Approve</strong> karenge, tab system instantly ek unique <strong>Reference ID</strong> generate karega aur marketing man ke registered verified email par email confirmation bhej dega. Agar aap <strong>Reject</strong> karte hain, to request turant decline ho jayegi aur koi Reference ID issue nahi hoga.
              </p>
            </div>
          </div>

          {/* Pending Direct HQ Applicants Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-amber-600" />
              <span>Incoming Direct HQ Candidates Pending Action</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-mono text-xs font-black">
                {directHqPending.length} Pending
              </span>
            </h3>

            {directHqPending.length === 0 ? (
              <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-black text-sm text-slate-800">All Direct HQ Applications Processed</h4>
                <p className="text-xs text-slate-500">No pending marketing applicants waiting for Direct Super Admin action.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {directHqPending.map((req) => (
                  <div key={req.id} className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 to-white border-2 border-amber-300 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-md border border-amber-400">
                            HQ DIRECT CANDIDATE #{req.id}
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            Target: Medix Central (Branch 1 HQ)
                          </span>
                        </div>
                        <h4 className="font-black text-lg text-slate-900 mt-1.5">{req.name}</h4>
                        <p className="text-xs text-slate-600 font-medium">{req.territory}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-black text-xs">
                        {req.experienceYears}y Exp
                      </span>
                    </div>

                    {/* Detailed KYC Info Grid */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs bg-white p-3.5 rounded-2xl border border-amber-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian Name</span>
                        <span className="font-bold text-slate-900">{req.fatherOrMotherName || 'Alok Sen'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">DOB & Blood Group</span>
                        <span className="font-bold text-purple-900 font-mono">{req.dob || '1993-08-14'} • {req.bloodGroup || 'B+'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Aadhar Card</span>
                        <span className="font-mono font-bold text-slate-900">{req.aadharNumber || '8877-6655-4433'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">PAN Card</span>
                        <span className="font-mono font-bold text-slate-900">{req.panNumber || 'AFGPD1122Q'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Driving Licence</span>
                        <span className="font-mono font-bold text-slate-900">{req.drivingLicenceNumber || 'MH03-2017-0099881'}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
                        <span className="text-slate-700 font-medium">{req.address || 'Hospital Catchment Area'}, Pin: {req.pinCode || '400058'}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-200 text-amber-950 text-xs font-bold flex items-center justify-between">
                      <span>Verified Email: <strong className="font-mono">{req.email}</strong> ✓</span>
                      <span className="text-emerald-700 font-mono">Target: {req.expectedMonthlyReferrals} Patients/Mo</span>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                      <button
                        onClick={() => setInspectingKycReq(req)}
                        className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-4 h-4 text-amber-700" />
                        <span>Inspect KYC</span>
                      </button>

                      <button
                        onClick={() => handleApproveMarketingDirect(req)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                      >
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>Approve & Dispatch Reference ID</span>
                      </button>

                      <button
                        onClick={() => handleRejectMarketing(req.id, req.name)}
                        className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-xl border border-rose-300 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Direct HQ Representatives List */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Active Direct HQ Marketing Representatives</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                {marketingRepresentatives.filter(r => r.branchId === 1).length} Active in HQ
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketingRepresentatives.filter(r => r.branchId === 1).map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rep.name}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 font-mono text-xs font-black">
                      {rep.referenceId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{rep.territory}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 font-medium">
                    <span className="text-emerald-700 font-bold">Referred: {rep.referredPatientsCount} Patients</span>
                    <span className="font-bold text-slate-900">₹ {rep.totalCommissionEarned.toLocaleString()} Earned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: BRANCH RECOMMENDED MARKETING QUEUE (SUPER ADMIN FINAL APPROVE/REJECT)*/}
      {/* ========================================================================= */}
      {activeTab === 'marketing-branch' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-xs space-y-6 animate-in fade-in">
          {/* Header & Status Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-indigo-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950 bg-indigo-200 px-3 py-1 rounded-full border border-indigo-400 flex items-center gap-1.5 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                  MULTI-BRANCH FORWARDED MARKETING QUEUE (BRANCH 2 TO 9)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">
                  <Radio className="w-3 h-3 text-emerald-600 animate-spin" />
                  AWAITING FINAL SUPER ADMIN MASTER DECISION
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1.5">
                Branch Admin Pre-Approved Marketing Candidates
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-3xl mt-0.5">
                These marketing representatives applied for branch hospitals (South, North, West, etc.) and were verified and recommended by the respective Branch Hospital Administrator. They require Super Admin&apos;s Final Approval to issue the Reference ID and send the confirmation email.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-950 text-xs font-mono font-bold border border-indigo-300">
                Awaiting SA Master Approval: {branchForwardedPending.length}
              </span>
              <button
                onClick={() => setActiveTab('marketing-hq')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Switch to Direct HQ Queue ({directHqPending.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Protocol Alert */}
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-300 shadow-xs flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-black text-indigo-950">BRANCH FORWARDED APPROVAL GATEWAY</h4>
              <p className="text-indigo-900 font-medium leading-relaxed">
                Branch Admins candidate ko sirf &quot;Recommend&quot; kar sakte hain. <strong>Jab tak Super Admin yahan &quot;Grant Final Super Admin Approval&quot; par click nahi karta, tab tak koi Reference ID candidate ko nahi jayega.</strong> Super Admin chahe to kisi bhi candidate ko reject bhi kar sakta hai.
              </p>
            </div>
          </div>

          {/* Pending Branch-Forwarded Applicants Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Candidates Pre-Approved by Branch Admins (Pending Super Admin Final Action)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-950 font-mono text-xs font-black">
                {branchForwardedPending.length} Candidates
              </span>
            </h3>

            {branchForwardedPending.length === 0 ? (
              <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-black text-sm text-slate-800">No Branch Recommended Candidates Pending</h4>
                <p className="text-xs text-slate-500">All branch-forwarded marketing applications have been reviewed by Super Admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {branchForwardedPending.map((req) => {
                  const targetBranchObj = branches.find(b => b.id === req.targetBranchId);
                  return (
                    <div key={req.id} className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-white border-2 border-indigo-300 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-indigo-950 bg-indigo-200 px-2.5 py-0.5 rounded-md border border-indigo-400">
                              BRANCH CANDIDATE #{req.id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Pre-Approved by {req.branchAdminName || targetBranchObj?.adminName || 'Branch Admin'}
                            </span>
                          </div>
                          <h4 className="font-black text-lg text-slate-900 mt-2">{req.name}</h4>
                          <p className="text-xs text-indigo-950 font-bold">Target Facility: {req.targetBranchName} ({req.targetBranchCode})</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{req.territory}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono font-black text-xs">
                          {req.experienceYears}y Exp
                        </span>
                      </div>

                      {/* Detailed KYC Info Grid */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs bg-white p-3.5 rounded-2xl border border-indigo-200">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian Name</span>
                          <span className="font-bold text-slate-900">{req.fatherOrMotherName || 'Suresh Hegde'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">DOB & Blood Group</span>
                          <span className="font-bold text-purple-900 font-mono">{req.dob || '1990-12-10'} • {req.bloodGroup || 'A+'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Aadhar Card</span>
                          <span className="font-mono font-bold text-slate-900">{req.aadharNumber || '6677-8899-0011'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">PAN Card</span>
                          <span className="font-mono font-bold text-slate-900">{req.panNumber || 'CDGHG9900L'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Driving Licence</span>
                          <span className="font-mono font-bold text-slate-900">{req.drivingLicenceNumber || 'KA01-2015-0044556'}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-100">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
                          <span className="text-slate-700 font-medium">{req.address || 'Hospital Catchment Area'}, Pin: {req.pinCode || '560095'}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-indigo-100/60 border border-indigo-200 text-indigo-950 text-xs font-bold flex items-center justify-between">
                        <span>Email: <strong className="font-mono">{req.email}</strong> (Verified ✓)</span>
                        <span className="text-emerald-700 font-mono">Exp Referrals: {req.expectedMonthlyReferrals}/Mo</span>
                      </div>

                      {/* Interactive Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-indigo-200">
                        <button
                          onClick={() => setInspectingKycReq(req)}
                          className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-indigo-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-4 h-4 text-indigo-700" />
                          <span>Inspect KYC</span>
                        </button>

                        <button
                          onClick={() => handleApproveMarketingBranch(req)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-indigo-700 to-purple-900 hover:from-indigo-800 hover:to-purple-950 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                        >
                          <Key className="w-4 h-4 text-amber-300" />
                          <span>Grant Final Super Admin Approval & Send Reference ID</span>
                        </button>

                        <button
                          onClick={() => handleRejectMarketing(req.id, req.name)}
                          className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-xl border border-rose-300 transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Initial Branch Review Queue (Monitoring / Fast-track bypass) */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Applications Awaiting Initial Branch Admin Review</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                {marketingJoinRequests.filter(r => r.targetBranchId !== 1 && r.status === 'pending_branch_review').length} Awaiting Local Branch Action
              </span>
            </h3>

            {marketingJoinRequests.filter(r => r.targetBranchId !== 1 && r.status === 'pending_branch_review').length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">✓ No pending initial reviews at any branch.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketingJoinRequests.filter(r => r.targetBranchId !== 1 && r.status === 'pending_branch_review').map(req => (
                  <div key={req.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{req.name}</p>
                      <p className="text-xs text-slate-500">Target: {req.targetBranchName} • {req.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const targetBranchObj = branches.find(b => b.id === req.targetBranchId);
                          handleApproveMarketingBranch(req);
                        }}
                        className="px-3 py-1.5 bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-indigo-800"
                      >
                        Super Admin Fast-Track Approve
                      </button>
                      <button
                        onClick={() => handleRejectMarketing(req.id, req.name)}
                        className="px-3 py-1.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl cursor-pointer hover:bg-rose-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: GLOBAL MARKETING FORCE DIRECTORY, EMAIL LOGS & AUDIT LEDGER          */}
      {/* ========================================================================= */}
      {activeTab === 'marketing' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-emerald-100 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-purple-700" />
                  GLOBAL MARKETING DIRECTORY & EMAIL AUDIT LEDGER
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">
                  <Radio className="w-3 h-3 text-emerald-600 animate-spin" />
                  REAL-TIME NETWORK SYNC
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1.5">
                Marketing Force Roster & Real-Time Email Logs
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-3xl mt-0.5">
                Audit all active marketing representatives, commission disbursements, and dispatched Reference ID emails.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowHireMarketingRep(true)}
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 btn-premium-3d"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-200" />
                <span>+ Hire Marketing Rep</span>
              </button>

              <button
                onClick={() => setActiveTab('marketing-hq')}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>HQ Direct Queue ({directHqPending.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('marketing-branch')}
                className="px-3.5 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-bold text-xs rounded-xl border border-indigo-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>Branch Queue ({branchForwardedPending.length})</span>
              </button>
            </div>
          </div>

          {/* Marketing KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider">Active Field Reps</span>
              <p className="text-2xl font-black text-purple-950">{marketingRepresentatives.length}</p>
              <span className="text-[11px] text-purple-700 font-bold">Across {branches.length} Branches</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">HQ Direct Pending</span>
              <p className="text-2xl font-black text-amber-950">{directHqPending.length}</p>
              <span className="text-[11px] text-amber-700 font-bold">Awaiting 1-Click SA Action</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">Branch Forwarded</span>
              <p className="text-2xl font-black text-indigo-950">{branchForwardedPending.length}</p>
              <span className="text-[11px] text-indigo-700 font-bold">Pre-Approved by Branch Admins</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Total Dispatched Emails</span>
              <p className="text-2xl font-black text-emerald-950">{marketingEmailLogs.length}</p>
              <span className="text-[11px] text-emerald-700 font-bold">Verified SMTP 200 OK</span>
            </div>
          </div>

          {/* Subtabs within Consolidated View */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setMarketingSubTab('all')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer ${
                marketingSubTab === 'all'
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              All Overview
            </button>

            <button
              onClick={() => setMarketingSubTab('email_logs')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                marketingSubTab === 'email_logs'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>📨 Email Dispatch Logs ({marketingEmailLogs.length})</span>
            </button>

            <button
              onClick={() => setMarketingSubTab('directory')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                marketingSubTab === 'directory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👥 Active Representatives Directory ({marketingRepresentatives.length})</span>
            </button>
          </div>

          {/* SECTION: REAL-TIME EMAIL DISPATCH LOGS */}
          {(marketingSubTab === 'all' || marketingSubTab === 'email_logs') && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-600" />
                    <span>Real-Time Reference ID Email Dispatch Stream</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cryptographic audit trail of all confirmation emails dispatched to marketing representatives after Super Admin approval.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-mono font-black border border-emerald-300">
                  {marketingEmailLogs.length} Verified Dispatches
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase bg-emerald-50/50">
                      <th className="py-3 px-4">Dispatch ID & Timestamp</th>
                      <th className="py-3 px-4">Recipient Partner</th>
                      <th className="py-3 px-4">Issued Reference ID</th>
                      <th className="py-3 px-4">Hospital Facility</th>
                      <th className="py-3 px-4">Authorized By</th>
                      <th className="py-3 px-4">SMTP Relay Server</th>
                      <th className="py-3 px-4 text-center">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {marketingEmailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-black text-emerald-950 text-xs block">{log.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.dispatchedAt}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{log.recipientName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{log.recipientEmail}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-100 text-purple-950 font-mono font-black px-2 py-0.5 rounded border border-purple-300 text-xs">
                            {log.referenceId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-slate-900 block">{log.targetBranchCode}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[120px] block">{log.targetBranchName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-amber-900">{log.dispatchedBySuperAdmin}</span>
                          <span className="text-[9px] text-slate-400 font-mono block">{log.securityToken}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-600 font-mono text-[10px]">{log.smtpServer}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>DELIVERED (200 OK)</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: ACTIVE REPRESENTATIVES DIRECTORY */}
          {(marketingSubTab === 'all' || marketingSubTab === 'directory') && (
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <span>Global Active Marketing Representatives Directory</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Complete multi-branch roster tracking authorized representatives, generated reference codes, and referral commission disbursements.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase bg-purple-50/50">
                      <th className="py-3.5 px-4">Authorized Approver</th>
                      <th className="py-3.5 px-4">Hospital Facility</th>
                      <th className="py-3.5 px-4">Marketing Representative</th>
                      <th className="py-3.5 px-4">Issued Reference ID</th>
                      <th className="py-3.5 px-4">Assigned Territory</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Referred Patients</th>
                      <th className="py-3.5 px-4 text-right">Commission Earned</th>
                      <th className="py-3.5 px-4 text-center">Executive Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {marketingRepresentatives.map((rep) => {
                      const branchObj = branches.find(b => b.id === rep.branchId);
                      const approver = rep.branchAdminName || rep.superAdminName || branchObj?.adminName || 'Hospital Administrator';
                      const approverEmail = rep.branchAdminEmail || (rep.superAdminName ? 'superadmin@medix.local' : branchObj?.adminEmail) || 'admin@hospital.local';
                      const isFired = rep.status === 'fired';
                      return (
                        <tr key={rep.id} className={`transition-colors ${isFired ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-purple-50/30'}`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 border ${isFired ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-purple-100 text-purple-800 border-purple-300'}`}>
                                ADM
                              </span>
                              <div>
                                <p className="font-extrabold text-purple-950 text-xs">{approver}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{approverEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-black text-slate-900">{rep.branchCode}</span>
                            <span className="block text-[10px] text-slate-500 truncate max-w-[140px]">{rep.branchName}</span>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-black text-slate-900 text-xs">{rep.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{rep.phone}</p>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`font-mono font-black px-2.5 py-1 rounded-lg text-xs border shadow-2xs ${isFired ? 'bg-rose-100 text-rose-950 border-rose-300 line-through' : 'bg-purple-100 text-purple-950 border-purple-300'}`}>
                              {rep.referenceId}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="text-slate-700 font-bold">{rep.territory}</span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isFired ? (
                              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black uppercase border border-rose-300">
                                🔥 FIRED / TERMINATED
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase border border-emerald-300">
                                ✓ ACTIVE
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="font-black font-mono text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                              {rep.referredPatientsCount}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <span className="font-black text-emerald-700 text-xs">₹ {rep.totalCommissionEarned.toLocaleString()}</span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isFired ? (
                              <button
                                onClick={() => handleReinstateMarketingRepAction(rep)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                              >
                                ✓ Re-Hire / Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFireMarketingRepAction(rep)}
                                className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs border border-rose-300 shadow-xs transition-all cursor-pointer"
                              >
                                🔥 Fire / Terminate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: HOSPITAL SERVICES & CLINICAL MATRIX */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-emerald-100 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ENTERPRISE CLINICAL CATALOG
                </span>
                <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  👑 Super Admin HQ Master Control
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Hospital Services & Facilities Matrix
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Audit, configure, and inspect clinical, emergency, ICU, and diagnostic services for <strong>ARIYAN HOSPITAL MULTISPECIALITY (HQ)</strong> and connected franchise campuses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 bg-emerald-50/70 p-2 rounded-2xl border border-emerald-200">
                <label className="text-xs font-black text-emerald-900">Hospital Scope:</label>
                <select
                  value={inspectedBranchId}
                  onChange={(e) => setInspectedBranchId(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-xs font-black rounded-xl outline-none text-slate-900 cursor-pointer focus:ring-2 focus:ring-[#046a4e]"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href="/services"
                className="px-5 py-3 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add / Manage Services</span>
              </Link>
            </div>
          </div>

          {/* Scope Statistics */}
          {(() => {
            const currentScopeServices = services.filter(s => s.branchId === inspectedBranchId);
            const currentBranch = branches.find(b => b.id === inspectedBranchId) || branches[0];

            return (
              <div className="space-y-6">
                {/* Metric Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Services Configured</span>
                    <p className="text-2xl font-black text-emerald-950">{currentScopeServices.length}</p>
                    <span className="text-xs text-emerald-700 font-bold">{currentBranch.name}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1">
                    <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">24x7 Round-The-Clock</span>
                    <p className="text-2xl font-black text-teal-950">
                      {currentScopeServices.filter(s => s.is24x7 || s.status === '24x7').length}
                    </p>
                    <span className="text-xs text-teal-700 font-bold">Uninterrupted Care</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                    <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Emergency Units</span>
                    <p className="text-2xl font-black text-rose-950">
                      {currentScopeServices.filter(s => s.isEmergency).length}
                    </p>
                    <span className="text-xs text-rose-700 font-bold">Trauma & ICU Ready</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                    <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider">Total Campus Network</span>
                    <p className="text-2xl font-black text-purple-950">{services.length} Network Services</p>
                    <span className="text-xs text-purple-700 font-bold">{branches.length} Registered Hospitals</span>
                  </div>
                </div>

                {/* Services Roster or Zero-State */}
                {currentScopeServices.length === 0 ? (
                  <div className="p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-4 bg-slate-50/50">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-[#046a4e] flex items-center justify-center mx-auto shadow-inner">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="text-base font-black text-slate-900">
                        No Services Registered for {currentBranch.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This hospital currently has 0 registered services. When a hospital registers on Medix, no placeholder or foreign demo data is loaded. As Super Admin or the hospital receptionist, you can configure clinical services below.
                      </p>
                    </div>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-2xl shadow-lg transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Register Services for {currentBranch.name}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentScopeServices.map(srv => (
                      <div
                        key={srv.id}
                        className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-300 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-black text-slate-900 text-sm">{srv.name}</h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                srv.status === 'active' || srv.status === '24x7'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {srv.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                              {srv.category}
                            </span>
                            {srv.department && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                {srv.department}
                              </span>
                            )}
                            {srv.isEmergency && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md font-black">
                                🚨 Emergency
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                            {srv.description || 'Clinical specialty and patient care facility.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-black text-slate-900">
                            {srv.price !== undefined ? `₹ ${srv.price.toLocaleString('en-IN')} / ${srv.priceUnit || 'Unit'}` : 'Covered'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {srv.timing || '24x7'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 8: LIVE BRANCH CENTRAL DASHBOARD INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                LIVE EMBEDDED BRANCH CENTRAL DASHBOARD
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {inspectedBranch.name} ({inspectedBranch.code})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Admin: <span className="font-bold text-slate-900">{inspectedBranch.adminName}</span> • Govt Reg: <span className="font-mono text-emerald-800">{inspectedBranch.govRegNumber}</span>
              </p>
            </div>

            {/* Quick Branch Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-extrabold text-slate-700">Switch Branch:</label>
              <select
                value={inspectedBranchId}
                onChange={(e) => setInspectedBranchId(Number(e.target.value))}
                className="px-3.5 py-2 bg-emerald-50/50 border border-emerald-200 text-xs font-bold rounded-xl outline-none focus:border-[#046a4e]"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.code} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scoped Branch KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Branch Revenue</span>
              <p className="text-2xl font-black text-emerald-950">₹{inspectedRev.toLocaleString()}</p>
              <span className="text-[11px] font-bold text-emerald-700">{inspectedInvoices.length} Invoices</span>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-teal-800 uppercase">Branch Patients</span>
              <p className="text-2xl font-black text-teal-950">{inspectedPatients.length}</p>
              <span className="text-[11px] font-bold text-teal-700">Scoped UHID Records</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase">Inpatient Bed Count</span>
              <p className="text-2xl font-black text-amber-950">{inspectedBeds.filter(b => b.status === 'occupied').length} / {inspectedBeds.length}</p>
              <span className="text-[11px] font-bold text-amber-700">Active Wards</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-[#046a4e] uppercase">Medical Consultants</span>
              <p className="text-2xl font-black text-slate-900">{inspectedDocs.length}</p>
              <span className="text-[11px] font-bold text-emerald-700">Specialists on Duty</span>
            </div>
          </div>

          {/* Detailed Doctors & Pharmacy Lists for this branch */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Scoped Doctors */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#046a4e]" />
                <span>Assigned Medical Staff ({inspectedDocs.length})</span>
              </h3>

              <div className="space-y-2.5">
                {inspectedDocs.map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between card-3d">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-[#046a4e] font-bold">{doc.specialty}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                      ${doc.fee} Consult
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoped Pharmacy */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>Branch Pharmacy Inventory ({inspectedMeds.length})</span>
              </h3>

              <div className="space-y-2.5">
                {inspectedMeds.map(med => (
                  <div key={med.id} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between card-3d">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{med.name}</p>
                      <p className="text-[11px] text-slate-500">{med.category} • Exp: {med.expiryDate}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700">{med.stock} units</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Direct Admin Control for this inspected branch */}
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-black text-sm text-slate-900">Branch Central Administrator Controls</p>
              <p className="text-xs text-slate-600 font-medium">Currently Managed by: <span className="font-bold text-slate-900">{inspectedBranch.adminName}</span> ({inspectedBranch.adminEmail})</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFireAdminAction(inspectedBranch.id)}
                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs rounded-full transition-all cursor-pointer"
              >
                Fire Current Admin
              </button>
              <button
                onClick={() => {
                  setHireBranchId(inspectedBranch.id);
                  setShowHireAdmin(true);
                }}
                className="px-5 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow transition-all cursor-pointer btn-premium-3d"
              >
                Reassign / Hire New Admin
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ADMIN DETAILS MODAL */}
      {selectedBranchForDetails && detailedBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-emerald-200 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-50 text-[#046a4e] rounded-md border border-emerald-200">
                  {detailedBranch.code}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">{detailedBranch.name}</h3>
              </div>
              <button onClick={() => setSelectedBranchForDetails(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <h4 className="font-extrabold text-emerald-950 text-sm">Branch Leadership & Administration</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Medical Director / Head</span>
                    <span className="font-black text-slate-900">{detailedBranch.branchHead || 'Dr. Medical Director'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Branch Central Admin</span>
                    <span className="font-black text-[#046a4e]">{detailedBranch.adminName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Email Address</span>
                    <span className="font-mono text-slate-700">{detailedBranch.adminEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Direct Phone</span>
                    <span className="font-mono text-slate-700">{detailedBranch.adminPhone || '+91 98000 00000'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Official Campus Address</span>
                <p className="text-slate-800 font-medium">{detailedBranch.address || `${detailedBranch.location}, Medical Enclave`}</p>
                {detailedBranch.govRegNumber && (
                  <p className="text-[11px] font-mono font-bold text-emerald-800 pt-1">
                    Govt. Reg: {detailedBranch.govRegNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
              <button
                onClick={() => {
                  setSelectedBranchForDetails(null);
                  handleFireAdminAction(detailedBranch.id);
                }}
                className="flex-1 py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs transition-all cursor-pointer"
              >
                Fire Current Admin
              </button>

              <button
                onClick={() => {
                  const branchId = detailedBranch.id;
                  setSelectedBranchForDetails(null);
                  setHireBranchId(branchId);
                  setShowHireAdmin(true);
                }}
                className="flex-1 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow transition-all cursor-pointer btn-premium-3d"
              >
                Reassign / Hire Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BRANCH MODAL */}
      {showAddBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-emerald-200 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">Onboard New Hospital Branch</h3>
              <button onClick={() => setShowAddBranch(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Facility Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'Hospital', label: 'Hospital', icon: '🏥' },
                    { id: 'Nursing Home', label: 'Nursing Home', icon: '🏣' },
                    { id: 'Diagnostic Center', label: 'Diagnostic', icon: '🔬' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setNewFacilityType(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                        newFacilityType === item.id
                          ? 'border-[#046a4e] bg-emerald-50 text-[#046a4e]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.icon} {item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medix South-West Care Center"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MEDIX-SOUTH-05"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">City / Zone</label>
                  <input
                    type="text"
                    placeholder="Bengaluru (South Campus)"
                    value={newBranchLoc}
                    onChange={(e) => setNewBranchLoc(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Full Campus Address</label>
                <input
                  type="text"
                  placeholder="45, Outer Ring Road, Tech Corridor"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Branch Medical Head</label>
                <input
                  type="text"
                  placeholder="Dr. Suresh Verma (HOD Trauma)"
                  value={newBranchHead}
                  onChange={(e) => setNewBranchHead(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Govt. Certified Registration No. *</label>
                <input
                  type="text"
                  required
                  placeholder="GOVT-REG-2026-005"
                  value={newGovRegNumber}
                  onChange={(e) => setNewGovRegNumber(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Onboard Branch Node
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HIRE ADMIN MODAL */}
      {showHireAdmin && hireBranchId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-emerald-200 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">Appoint Branch Central Admin</h3>
              <button onClick={() => setShowHireAdmin(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHireAdminSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Administrator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Roy"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ananya.roy@medix.local"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98450 33445"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Confirm Appointment & Assign Isolated Scope
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FULL KYC DOSSIER & DOCUMENT INSPECTOR */}
      {inspectingKycReq && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border-2 border-indigo-300 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectingKycReq(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 shadow-xs">
                <FileText className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-300">
                  CONFIDENTIAL KYC DOSSIER • APPLICANT #{inspectingKycReq.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{inspectingKycReq.name}</h3>
                <p className="text-xs text-slate-500">
                  Target Facility: <strong className="text-indigo-900">{inspectingKycReq.targetBranchName} ({inspectingKycReq.targetBranchCode})</strong>
                </p>
              </div>
            </div>

            {/* Personal & Guardian Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Gender</span>
                <span className="font-bold text-slate-900">{inspectingKycReq.gender || 'Male'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Father / Mother</span>
                <span className="font-bold text-slate-900">{inspectingKycReq.fatherOrMotherName || 'Guardian'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">DOB & Blood Group</span>
                <span className="font-bold text-purple-900 font-mono">{inspectingKycReq.dob || '1993-08-14'} ({inspectingKycReq.bloodGroup || 'B+'})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Email (Verified ✓)</span>
                <span className="font-mono font-bold text-emerald-800">{inspectingKycReq.email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Phone Contact</span>
                <span className="font-mono font-bold text-slate-900">{inspectingKycReq.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Experience & Target</span>
                <span className="font-bold text-slate-900">{inspectingKycReq.experienceYears}y • {inspectingKycReq.expectedMonthlyReferrals} Referrals/Mo</span>
              </div>
            </div>

            {/* Residential Address */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Verified Residential Address</span>
              <p className="font-medium text-slate-800">
                {inspectingKycReq.address || 'Hospital Catchment Area'}, Pin: {inspectingKycReq.pinCode || '400001'}, District: {inspectingKycReq.district || 'City'}, State: {inspectingKycReq.state || 'State'}, Country: {inspectingKycReq.country || 'India'}
              </p>
            </div>

            {/* 3 Government Document Verification Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Government ID Verification & Document Previews</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Aadhar Card */}
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-900">Aadhar Card</span>
                    <span className="text-[10px] font-bold text-emerald-700">Verified ✓</span>
                  </div>
                  <p className="font-mono font-black text-xs text-amber-950">{inspectingKycReq.aadharNumber || '8877-6655-4433'}</p>
                  <div className="h-16 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                    [Aadhar Photo Scanned]
                  </div>
                </div>

                {/* PAN Card */}
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-purple-900">PAN Card</span>
                    <span className="text-[10px] font-bold text-emerald-700">Verified ✓</span>
                  </div>
                  <p className="font-mono font-black text-xs text-purple-950">{inspectingKycReq.panNumber || 'AFGPD1122Q'}</p>
                  <div className="h-16 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                    [PAN Photo Scanned]
                  </div>
                </div>

                {/* Driving Licence */}
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-900">Driving Licence</span>
                    <span className="text-[10px] font-bold text-emerald-700">Verified ✓</span>
                  </div>
                  <p className="font-mono font-black text-xs text-blue-950">{inspectingKycReq.drivingLicenceNumber || 'MH03-2017-0099881'}</p>
                  <div className="h-16 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                    [DL Photo Scanned]
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectingKycReq(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Dossier
              </button>

              <button
                onClick={() => {
                  const req = inspectingKycReq;
                  const generatedRef = req.targetBranchId === 1
                    ? superAdminDirectApproveMainHospitalRequest(req.id, 'Anichul Haque (Super Admin HQ)')
                    : superAdminFinalApproveMarketingRequest(req.id, 'Anichul Haque (Super Admin HQ)');
                  setInspectingKycReq(null);
                  setDispatchedEmailModal({
                    repName: req.name,
                    refId: generatedRef,
                    email: req.email,
                    branchName: req.targetBranchName,
                    adminName: 'Anichul Haque (Super Admin HQ)',
                  });
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Grant Super Admin Final Approval & Dispatch Reference ID to Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCHED MARKETING REFERENCE ID EMAIL CONFIRMATION */}
      {dispatchedEmailModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border-2 border-purple-400 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setDispatchedEmailModal(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 border-2 border-purple-400 flex items-center justify-center mx-auto text-purple-700 shadow-md">
                <Mail className="w-8 h-8 text-purple-700" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                EMAIL DISPATCH CONFIRMATION ✓
              </span>
              <h3 className="font-black text-2xl text-slate-900">Reference ID Dispatched!</h3>
              <p className="text-xs text-slate-500">
                Super Admin final approval has been registered. An official onboarding email with security credentials and Reference ID has been sent to the marketing partner.
              </p>
            </div>

            {/* Email Payload Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                <span>To: <strong className="text-purple-300">{dispatchedEmailModal.email}</strong></span>
                <span className="text-emerald-400 font-bold">STATUS: SENT (200 OK)</span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Subject:</p>
                <p className="text-emerald-300 font-bold">Welcome to Medix Network — Your Official Marketing Reference ID</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-700 text-center space-y-1">
                <span className="text-[10px] text-purple-300 uppercase">Assigned Reference Code</span>
                <p className="text-xl font-black text-amber-300 tracking-wider">{dispatchedEmailModal.refId}</p>
                <span className="text-[10px] text-purple-200 block">Scope: {dispatchedEmailModal.branchName}</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 space-y-0.5">
                <p>• Approved By: <span className="text-slate-200">{dispatchedEmailModal.adminName}</span></p>
                <p>• Super Admin Authorization: <span className="text-emerald-400">Anichul Haque (HQ Master)</span></p>
                <p>• Direct Login Portal: <span className="text-purple-300">/dashboard/marketing</span></p>
              </div>
            </div>

            <button
              onClick={() => setDispatchedEmailModal(null)}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Done & Return to Marketing Hub
            </button>
          </div>
        </div>
      )}

      {/* MODAL: HIRE / ONBOARD MEDICAL DOCTOR */}
      {showHireDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-emerald-200 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#046a4e] text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Appoint & Hire Medical Doctor</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Super Admin Direct Recruitment & OPD Workspace Assignment</p>
                </div>
              </div>
              <button onClick={() => setShowHireDoctor(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHireDoctorSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Doctor Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amitabha Roy"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Campus / Branch *</label>
                  <select
                    value={docBranchId}
                    onChange={(e) => setDocBranchId(Number(e.target.value))}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-3 py-3 text-xs font-bold outline-none focus:border-[#046a4e] cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Medical Specialty *</label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-3 py-3 text-xs font-bold outline-none focus:border-[#046a4e] cursor-pointer"
                  >
                    <option value="General & Cardiology Medicine">General & Cardiology Medicine</option>
                    <option value="Cardiology & Vascular Medicine">Cardiology & Vascular Medicine</option>
                    <option value="General & Trauma Surgery">General & Trauma Surgery</option>
                    <option value="Pediatric & Adolescent Care">Pediatric & Adolescent Care</option>
                    <option value="Neurology & Brain Sciences">Neurology & Brain Sciences</option>
                    <option value="Orthopedics & Joint Surgery">Orthopedics & Joint Surgery</option>
                    <option value="Dermatology & Skin Care">Dermatology & Skin Care</option>
                    <option value="Gastroenterology & Hepatology">Gastroenterology & Hepatology</option>
                    <option value="Critical Care & Pulmonology">Critical Care & Pulmonology</option>
                    <option value="Nephrology & Renal Transplant">Nephrology & Renal Transplant</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="800"
                    value={docFee}
                    onChange={(e) => setDocFee(Number(e.target.value))}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Initial Duty Status</label>
                  <select
                    value={docStatus}
                    onChange={(e) => setDocStatus(e.target.value as any)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-3 py-3 text-xs font-bold outline-none focus:border-[#046a4e] cursor-pointer"
                  >
                    <option value="available">🟢 Available (On-Duty)</option>
                    <option value="busy">🟡 In Consultation (Busy)</option>
                    <option value="off-duty">⚪ Off-Duty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+91 98000 12345"
                  value={docContact}
                  onChange={(e) => setDocContact(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Confirm Doctor Appointment & Deploy to OPD
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HIRE / ONBOARD MARKETING REPRESENTATIVE */}
      {showHireMarketingRep && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-purple-200 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Appoint Marketing Partner</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Instant Reference ID Generation & Commission Ledger Setup</p>
                </div>
              </div>
              <button onClick={() => setShowHireMarketingRep(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHireMarketingSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Representative Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer Sen"
                  value={mktName}
                  onChange={(e) => setMktName(e.target.value)}
                  className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-purple-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Target Campus / Branch *</label>
                  <select
                    value={mktBranchId}
                    onChange={(e) => setMktBranchId(Number(e.target.value))}
                    className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-3 py-3 text-xs font-bold outline-none focus:border-purple-700 cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="3"
                    value={mktExperience}
                    onChange={(e) => setMktExperience(Number(e.target.value))}
                    className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Territory / Coverage Hub *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kolkata North & Corporate Healthcare Zones"
                  value={mktTerritory}
                  onChange={(e) => setMktTerritory(e.target.value)}
                  className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@medix.local"
                    value={mktEmail}
                    onChange={(e) => setMktEmail(e.target.value)}
                    className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-purple-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98000 12345"
                    value={mktPhone}
                    onChange={(e) => setMktPhone(e.target.value)}
                    className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Commission Structure</label>
                <input
                  type="text"
                  placeholder="10% on Diagnostics & OPD"
                  value={mktCommission}
                  onChange={(e) => setMktCommission(e.target.value)}
                  className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-purple-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Appoint Marketing Partner & Generate Ref ID
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07131e] flex items-center justify-center text-slate-300 font-bold">Loading Super Admin HQ...</div>}>
      <SuperAdminDashboardContent />
    </Suspense>
  );
}
