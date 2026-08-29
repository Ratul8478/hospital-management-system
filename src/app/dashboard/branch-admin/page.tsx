"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BedDouble,
  Pill,
  IndianRupee,
  ShieldCheck,
  Building2,
  Lock,
  Plus,
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  QrCode,
  Copy,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Award,
  Phone,
  Mail,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Activity,
  ChevronRight,
} from 'lucide-react';

export default function BranchAdminDashboard() {
  const {
    branches,
    doctors,
    patients,
    beds,
    medicines,
    labRequests,
    invoices,
    services,
    selectedBranchId,
    addDoctor,
    userRole,
    setUserRole,
    marketingRepresentatives,
    marketingJoinRequests,
    submitMarketingJoinRequest,
    branchAdminPreApproveMarketingRequest,
    approveMarketingJoinRequest,
    rejectMarketingJoinRequest,
    addMarketingRepresentative,
    updateMarketingRepStatus
  } = useApp();

  // Active Tab: 'overview' | 'marketing' | 'doctors' | 'pharmacy' | 'services'
  const [activeTab, setActiveTab] = useState<'overview' | 'marketing' | 'doctors' | 'pharmacy' | 'services'>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine active branch scope with safe fallback
  const activeBranch = (branches && branches.length > 0)
    ? (selectedBranchId === 'all'
        ? branches[0]
        : branches.find(b => b.id === selectedBranchId) || branches[0])
    : { id: 1, name: 'Main Hospital Branch', code: 'ARIYAN-HQ', location: 'Kolkata' };

  const branchId = activeBranch?.id || 1;

  // Scoped Data strictly matching active branch ID with defensive array checks
  const branchDoctors = (doctors || []).filter(d => d && d.branchId === branchId);
  const branchPatients = (patients || []).filter(p => p && p.branchId === branchId);
  const branchBeds = (beds || []).filter(b => b && b.branchId === branchId);
  const branchMedicines = (medicines || []).filter(m => m && m.branchId === branchId);
  const branchInvoices = (invoices || []).filter(i => i && i.branchId === branchId);
  const branchLabRequests = (labRequests || []).filter(l => l && l.branchId === branchId);
  const branchServices = (services || []).filter(s => s && s.branchId === branchId);

  // Marketing Data scoped to this branch
  const branchMarketingReps = (marketingRepresentatives || []).filter(m => m && m.branchId === branchId);
  const branchMarketingRequests = (marketingJoinRequests || []).filter(
    r => r && r.targetBranchId === branchId && (r.status === 'pending_branch_review' || r.status === 'pending_super_admin_approval' || (r.status as any) === 'pending')
  );

  const occupiedBeds = branchBeds.filter(b => b && b.status === 'occupied').length;
  const branchRevenue = branchInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0);

  // Marketing aggregates
  const totalReferredPatients = branchMarketingReps.reduce((sum, r) => sum + (r?.referredPatientsCount || 0), 0);
  const totalCommissionDisbursed = branchMarketingReps.reduce((sum, r) => sum + (r?.totalCommissionEarned || 0), 0);
  const totalPendingPayout = branchMarketingReps.reduce((sum, r) => sum + (r?.pendingPayout || 0), 0);

  // Modals state
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showManualAddRep, setShowManualAddRep] = useState(false);
  const [approvedRepModal, setApprovedRepModal] = useState<{ name: string; refId: string; phone: string; territory: string } | null>(null);
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null);

  // Hire Doctor Form State (Receptionist Onboarding)
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('General & Cardiology Medicine');
  const [docFee, setDocFee] = useState('800');
  const [docPhone, setDocPhone] = useState('');
  const [docQualification, setDocQualification] = useState('MD, MBBS');
  const [docImage, setDocImage] = useState('');
  const [docImagePreview, setDocImagePreview] = useState('');
  const [docSuccessMsg, setDocSuccessMsg] = useState('');

  // Handle local doctor photo file upload
  const handleDocImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDocImage(base64String);
        setDocImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manual Add Marketing Rep State
  const [manualRepName, setManualRepName] = useState('');
  const [manualRepEmail, setManualRepEmail] = useState('');
  const [manualRepPhone, setManualRepPhone] = useState('');
  const [manualRepTerritory, setManualRepTerritory] = useState('Central District Clinics & Corporate Parks');
  const [manualRepExp, setManualRepExp] = useState('4');
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  const handleHireDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    addDoctor({
      branchId: activeBranch.id,
      name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
      specialty: docSpecialty || 'General & Cardiology Medicine',
      fee: parseFloat(docFee) || 800,
      status: 'available',
      contact: docPhone || '+91 9804222142',
      image: docImage || undefined,
      qualification: docQualification || 'MD, MBBS',
      registeredBy: `Hospital Receptionist (${activeBranch.name})`,
      registrationDate: new Date().toISOString().split('T')[0],
    });

    setDocSuccessMsg(`Dr. ${docName} registered with photo for ${activeBranch.code}!`);
    setTimeout(() => {
      setDocSuccessMsg('');
      setDocName('');
      setDocPhone('');
      setDocImage('');
      setDocImagePreview('');
      setShowAddDoctor(false);
    }, 1200);
  };

  const handleApproveMarketingRequest = (reqId: number, reqName: string, reqPhone: string, reqTerritory: string) => {
    const generatedRef = approveMarketingJoinRequest(reqId, activeBranch.adminName, activeBranch.adminEmail);
    setApprovedRepModal({
      name: reqName,
      refId: generatedRef,
      phone: reqPhone,
      territory: reqTerritory,
    });
  };

  const handleManualAddMarketingRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRepName) return;

    submitMarketingJoinRequest({
      name: manualRepName,
      gender: 'Male',
      fatherOrMotherName: 'Guardian',
      dob: '1994-01-01',
      bloodGroup: 'O+',
      aadharNumber: 'XXXX-XXXX-XXXX',
      panNumber: 'XXXXX0000X',
      drivingLicenceNumber: 'DL-XXXXX',
      address: 'Hospital Catchment Area',
      pinCode: '700001',
      district: activeBranch.location,
      state: 'West Bengal',
      country: 'India',
      email: manualRepEmail || `${manualRepName.toLowerCase().replace(/\s+/g, '.')}@medixpartner.local`,
      emailVerified: true,
      phone: manualRepPhone || '+91 98200 00000',
      targetBranchId: activeBranch.id,
      targetBranchCode: activeBranch.code,
      targetBranchName: activeBranch.name,
      territory: manualRepTerritory || 'Branch Catchment Area',
      experienceYears: parseInt(manualRepExp) || 3,
      expectedMonthlyReferrals: 30,
      qualificationsOrNotes: `Directly recommended by Branch Admin (${activeBranch.adminName})`,
      source: 'branch_hired',
      branchAdminApprovedDate: new Date().toISOString().split('T')[0],
      branchAdminName: activeBranch.adminName,
      branchAdminEmail: activeBranch.adminEmail,
    });

    setManualSuccessMsg(`Candidate ${manualRepName} pre-approved & submitted to Super Admin for 2-step verification!`);
    setTimeout(() => {
      setManualSuccessMsg('');
      setManualRepName('');
      setManualRepEmail('');
      setManualRepPhone('');
      setShowManualAddRep(false);
    }, 1800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRefId(text);
    setTimeout(() => setCopiedRefId(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 rounded-3xl p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-600">Initializing Branch Command Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* SCOPE ISOLATION HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 text-xs font-black bg-emerald-500 text-slate-950 rounded-full uppercase tracking-wider">
              {activeBranch.code}
            </span>
            <span className="px-3 py-1 text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> ISOLATED HOSPITAL ADMIN SCOPE
            </span>
            {branchMarketingRequests.length > 0 && (
              <span className="px-3 py-1 text-xs font-black bg-purple-500 text-white rounded-full flex items-center gap-1 animate-pulse">
                <Share2 className="w-3.5 h-3.5" /> {branchMarketingRequests.length} Marketing Requests
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{activeBranch.name}</h1>
          
          <p className="text-xs text-emerald-100/80 font-medium">
            Branch Administrator: <span className="text-white font-extrabold">{activeBranch.adminName}</span> ({activeBranch.adminEmail}) • Govt Reg: <span className="font-mono text-emerald-300 font-bold">{activeBranch.govRegNumber}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => {
              setActiveTab('marketing');
              setShowManualAddRep(true);
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <UserPlus className="w-4 h-4" /> Add Marketing Rep
          </button>

          <Link
            href="/receptionist"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 border border-amber-300"
          >
            <Building2 className="w-4 h-4 text-amber-900" /> Receptionist Desk
          </Link>

          <button
            onClick={() => setShowAddDoctor(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" /> Hire Doctor
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview & Operations
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'marketing'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-purple-800 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Marketing & Referral Network</span>
          {branchMarketingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {branchMarketingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'doctors'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Assigned Doctors ({branchDoctors.length})
        </button>

        <button
          onClick={() => setActiveTab('pharmacy')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pharmacy'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" /> Pharmacy Inventory ({branchMedicines.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" /> Hospital Services ({branchServices.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MARKETING SECTION (AS REQUESTED BY USER) */}
      {/* ========================================================================= */}
      {activeTab === 'marketing' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* MARKETING BANNER & ACTION HEADER */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-black border border-purple-400/40 uppercase">
                  FRANCHISE GROWTH ENGINE
                </span>
                <span className="text-xs text-purple-200 font-bold">Auto Reference ID Generation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Hospital Field Marketing & Referral Management</h2>
              <p className="text-xs text-purple-200/80 max-w-xl">
                Review incoming marketing representative join requests, approve them to instantly generate a unique Reference ID, and track patient referrals and commission disbursements.
              </p>
            </div>

            <button
              onClick={() => setShowManualAddRep(true)}
              className="px-5 py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Direct Onboard Marketing Rep
            </button>
          </div>

          {/* MARKETING KEY PERFORMANCE METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Active Marketing Reps</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{branchMarketingReps.length}</p>
              <span className="text-xs text-purple-700 font-bold">Assigned to {activeBranch.code}</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Pending Join Requests</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-amber-600">{branchMarketingRequests.length}</p>
              <span className="text-xs text-amber-700 font-bold">Awaiting Approval</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Total Referred Patients</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-emerald-700">{totalReferredPatients}</p>
              <span className="text-xs text-emerald-600 font-bold">Onboarded via Referral IDs</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Commission Earned</span>
                <IndianRupee className="h-4 w-4 text-[#159A67]" />
              </div>
              <p className="text-3xl font-black text-[#159A67]">₹ {totalCommissionDisbursed.toLocaleString()}</p>
              <span className="text-xs text-slate-500 font-mono font-bold">Pending: ₹ {totalPendingPayout.toLocaleString()}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PENDING MARKETING JOIN REQUESTS QUEUE */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>Incoming Marketing Representative Join Requests</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                    {branchMarketingRequests.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve an applicant to automatically assign a unique Reference ID / Referral Code.
                </p>
              </div>
            </div>

            {branchMarketingRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-extrabold text-slate-800 text-sm">All Marketing Join Requests Processed!</p>
                <p className="text-xs text-slate-500">
                  New marketing partners can apply via the Registration page, or you can onboard them directly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchMarketingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-gradient-to-br from-purple-50/50 to-white border-2 border-purple-200 shadow-xs space-y-3.5 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          APPLICANT #{req.id} • {req.appliedDate}
                        </span>
                        <h4 className="font-black text-base text-slate-900 mt-1">{req.name}</h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-purple-600" />
                          <span>{req.territory}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-mono font-black text-[10px]">
                        {req.experienceYears}y Exp
                      </span>
                    </div>

                    {/* KYC Summary Card */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-2xl border border-purple-100 space-y-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Father/Mother Name</span>
                        <span className="font-bold text-slate-800">{req.fatherOrMotherName || 'Alok Sen'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Blood Group & Gender</span>
                        <span className="font-bold text-purple-900 font-mono">{req.bloodGroup || 'O+'} • {req.gender || 'Male'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Aadhar Number</span>
                        <span className="font-bold text-slate-800 font-mono">{req.aadharNumber || 'XXXX-XXXX-XXXX'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">PAN Card</span>
                        <span className="font-bold text-slate-800 font-mono">{req.panNumber || 'XXXXX0000X'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Phone & Email</span>
                        <span className="font-bold text-slate-800 font-mono">{req.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Expected Referrals</span>
                        <span className="font-bold text-emerald-700 font-mono">{req.expectedMonthlyReferrals} Patients/Mo</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic leading-relaxed">
                      &ldquo;{req.qualificationsOrNotes}&rdquo;
                    </p>

                    {/* 2-TIER STATUS & ACTION BUTTONS */}
                    {req.status === 'pending_super_admin_approval' ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-2">
                        <div className="text-[11px] text-amber-900 font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Pre-Approved by Branch Admin • Awaiting Super Admin Final Approval & Email Dispatch</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2 border-t border-purple-100">
                        {activeBranch.id === 1 ? (
                          // Direct HQ Approval
                          <button
                            onClick={() => handleApproveMarketingRequest(req.id, req.name, req.phone, req.territory)}
                            className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Approve & Dispatch Reference ID</span>
                          </button>
                        ) : (
                          // Branch Pre-Approval
                          <button
                            onClick={() => branchAdminPreApproveMarketingRequest(req.id, activeBranch.adminName, activeBranch.adminEmail)}
                            className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                          >
                            <Check className="w-3.5 h-3.5 text-amber-300" />
                            <span>Pre-Approve & Forward to Super Admin</span>
                          </button>
                        )}

                        <button
                          onClick={() => rejectMarketingJoinRequest(req.id)}
                          className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* ACTIVE MARKETING REPRESENTATIVES ROSTER */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Active Marketing Representatives & Reference ID Roster</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                    {branchMarketingReps.length} Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned reference codes, patient referral tracking, and commission settlement.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                Commission Standard: 10% on OPD & Diagnostics
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase bg-slate-50/70">
                    <th className="py-3 px-4">Marketing Representative</th>
                    <th className="py-3 px-4">Unique Reference ID</th>
                    <th className="py-3 px-4">Territory / Area</th>
                    <th className="py-3 px-4 text-center">Referred Patients</th>
                    <th className="py-3 px-4 text-right">Commission Earned</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {branchMarketingReps.map((rep) => (
                    <tr key={rep.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-slate-900 text-sm">{rep.name}</p>
                        <p className="text-[11px] text-slate-500">{rep.email} • {rep.phone}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-950 font-mono font-black text-xs px-2.5 py-1 rounded-lg border border-purple-300 shadow-2xs">
                          <span>{rep.referenceId}</span>
                          <button
                            onClick={() => copyToClipboard(rep.referenceId)}
                            title="Copy Reference ID"
                            className="text-purple-600 hover:text-purple-900 p-0.5 cursor-pointer"
                          >
                            {copiedRefId === rep.referenceId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 font-bold">{rep.territory}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Since {rep.approvedDate}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-black font-mono text-xs">
                          {rep.referredPatientsCount} Patients
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-emerald-700 text-sm">₹ {rep.totalCommissionEarned.toLocaleString()}</span>
                        <span className="block text-[10px] text-amber-600 font-bold">Pending: ₹ {rep.pendingPayout.toLocaleString()}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          rep.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rep.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setApprovedRepModal({
                            name: rep.name,
                            refId: rep.referenceId,
                            phone: rep.phone,
                            territory: rep.territory,
                          })}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-all cursor-pointer"
                        >
                          View ID Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* BRANCH ISOLATED METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Branch Revenue</span>
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">₹{branchRevenue.toLocaleString()}</p>
              <span className="text-xs text-emerald-600 font-bold">{branchInvoices.length} Invoices</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Branch Patients</span>
                <Users className="h-4 w-4 text-sky-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{branchPatients.length}</p>
              <span className="text-xs text-sky-600 font-bold">Scoped EHRs</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Bed Occupancy</span>
                <BedDouble className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{occupiedBeds} / {branchBeds.length}</p>
              <span className="text-xs text-amber-600 font-bold">Wards Occupied</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Hospital Services</span>
                <Activity className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{branchServices.length}</p>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-xs text-emerald-600 font-bold">
                  {branchServices.filter(s => s.is24x7 || s.status === '24x7').length} 24x7 Ready
                </span>
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-[11px] font-black text-[#046a4e] hover:underline cursor-pointer"
                >
                  View →
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase">
                <span>Marketing Force</span>
                <Share2 className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-purple-700">{branchMarketingReps.length} Reps</p>
              <span className="text-xs text-purple-600 font-bold">{totalReferredPatients} Referrals</span>
            </div>
          </div>

          {/* OPERATIONAL SECTIONS: DOCTORS & MARKETING HIGHLIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Branch Assigned Doctors */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#046a4e]" />
                  <span>Assigned Branch Doctors ({branchDoctors.length})</span>
                </h2>
                <button
                  onClick={() => setShowAddDoctor(true)}
                  className="text-xs font-extrabold text-[#046a4e] hover:underline cursor-pointer"
                >
                  + Hire Doctor
                </button>
              </div>

              <div className="space-y-3">
                {branchDoctors.map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{doc.name}</p>
                      <p className="text-xs text-[#046a4e] font-bold">{doc.specialty}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 text-xs font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                        ${doc.fee} Consult Fee
                      </span>
                      <p className="text-xs text-slate-500 font-mono mt-1">{doc.contact || '+1 (555) 019-8800'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Marketing Overview */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  <span>Branch Marketing Suite</span>
                </h2>
                <button
                  onClick={() => setActiveTab('marketing')}
                  className="text-xs font-extrabold text-purple-700 hover:underline cursor-pointer"
                >
                  Open Full Hub →
                </button>
              </div>

              <div className="space-y-3">
                {branchMarketingReps.slice(0, 3).map(rep => (
                  <div key={rep.id} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{rep.name}</p>
                      <p className="text-xs text-purple-700 font-mono font-bold">{rep.referenceId}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-xs">
                        {rep.referredPatientsCount} Referrals
                      </span>
                      <p className="text-xs text-emerald-700 font-black mt-1">₹ {rep.totalCommissionEarned.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DOCTORS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-[#046a4e]" />
              <span>Assigned Branch Doctors ({branchDoctors.length})</span>
            </h2>
            <button
              onClick={() => setShowAddDoctor(true)}
              className="px-4 py-2 bg-[#046a4e] text-white rounded-xl text-xs font-black shadow-sm cursor-pointer"
            >
              + Hire New Doctor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchDoctors.map(doc => (
              <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {doc.image ? (
                    <div className="h-12 w-12 rounded-2xl overflow-hidden border border-emerald-200 shrink-0 bg-white shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-[#046a4e] text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                      {doc.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{doc.name}</p>
                    <p className="text-xs text-[#046a4e] font-bold">{doc.specialty}</p>
                    {doc.qualification && (
                      <p className="text-[10px] text-slate-400">{doc.qualification}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1 text-xs font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    ₹{doc.fee} Consult Fee
                  </span>
                  <p className="text-xs text-slate-500 font-mono mt-1">{doc.contact || '+91 9804222142'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PHARMACY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'pharmacy' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Pill className="h-5 w-5 text-emerald-600" />
            <span>Branch Scoped Pharmacy Stock ({branchMedicines.length} Items)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchMedicines.map(med => (
              <div key={med.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">{med.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{med.category} • Exp: {med.expiryDate}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-sm">{med.stock} units</span>
                  <p className="text-xs text-slate-500 font-bold">${med.price} / unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOSPITAL SERVICES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-600" />
                <span>Hospital Clinical & Emergency Services ({branchServices.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official clinical, ICU, surgery, diagnostic, and 24x7 facilities configured for <strong>{activeBranch.name}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/services"
                className="px-4 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
              >
                <span>Full Services Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/receptionist"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Receptionist Desk
              </Link>
            </div>
          </div>

          {branchServices.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-slate-300 text-center space-y-3 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-black text-slate-900">No Services Registered Yet</h4>
                <p className="text-xs text-slate-500">
                  {activeBranch.name} does not have any clinical services registered. No placeholder demo data is loaded. The hospital receptionist can add services through the Receptionist Desk or Services Portal.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Open Services Portal</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branchServices.map(srv => (
                <div key={srv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{srv.name}</h4>
                      <p className="text-xs text-[#046a4e] font-bold">{srv.category}</p>
                    </div>
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

                  <p className="text-xs text-slate-600 font-medium line-clamp-2">
                    {srv.description || 'Clinical specialty service.'}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="font-black text-slate-900">
                      {srv.price !== undefined ? `₹ ${srv.price.toLocaleString('en-IN')} / ${srv.priceUnit || 'Unit'}` : 'Hospital Covered'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {srv.timing || '24x7 Operational'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPROVED MARKETING REPRESENTATIVE REFERENCE ID CELEBRATION */}
      {/* ========================================================================= */}
      {approvedRepModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border-2 border-purple-300 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setApprovedRepModal(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 border-2 border-purple-400 flex items-center justify-center mx-auto text-purple-700 shadow-md">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                OFFICIAL REFERENCE ID GENERATED
              </span>
              <h3 className="font-black text-2xl text-slate-900">{approvedRepModal.name}</h3>
              <p className="text-xs text-slate-500">
                Approved as Field Marketing Partner for <strong className="text-purple-900">{activeBranch.name}</strong>
              </p>
            </div>

            {/* REFERENCE ID HIGHLIGHT CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs text-purple-200">
                <span>Unique Partner Reference Code</span>
                <span className="font-mono">{activeBranch.code}</span>
              </div>

              <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-purple-400/40">
                <span className="text-2xl font-black font-mono tracking-wider text-amber-300">
                  {approvedRepModal.refId}
                </span>
                <button
                  onClick={() => copyToClipboard(approvedRepModal.refId)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedRefId === approvedRepModal.refId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRefId === approvedRepModal.refId ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-purple-200 pt-1">
                <div>
                  <span className="opacity-70 block text-[10px]">Territory</span>
                  <span className="font-bold text-white">{approvedRepModal.territory}</span>
                </div>
                <div>
                  <span className="opacity-70 block text-[10px]">Contact</span>
                  <span className="font-bold text-white">{approvedRepModal.phone}</span>
                </div>
              </div>
            </div>

            {/* SIMULATED SMS / WHATSAPP NOTIFICATION DISPATCH */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Reference ID dispatched to partner via SMS & Email. Patient registrations with this code will earn 10% commission automatically!</span>
            </div>

            <button
              onClick={() => setApprovedRepModal(null)}
              className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Done & Return to Roster
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIRECT ONBOARD MARKETING REPRESENTATIVE */}
      {/* ========================================================================= */}
      {showManualAddRep && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-purple-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowManualAddRep(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                {activeBranch.code} Marketing Hub
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">Onboard Marketing Representative</h3>
              <p className="text-xs text-slate-500">Auto-generates a Reference ID for patient referrals.</p>
            </div>

            {manualSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{manualSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleManualAddMarketingRep} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Representative Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={manualRepName}
                  onChange={(e) => setManualRepName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 11223"
                    value={manualRepPhone}
                    onChange={(e) => setManualRepPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={manualRepExp}
                    onChange={(e) => setManualRepExp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="ramesh.k@partner.local"
                  value={manualRepEmail}
                  onChange={(e) => setManualRepEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Territory / Area</label>
                <input
                  type="text"
                  required
                  value={manualRepTerritory}
                  onChange={(e) => setManualRepTerritory(e.target.value)}
                  placeholder="e.g. Bandra & Khar Clinics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Issue Reference ID & Add to Roster</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HIRE DOCTOR */}
      {/* ========================================================================= */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddDoctor(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Scope
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">Hire Doctor for {activeBranch.name}</h3>
            </div>

            {docSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{docSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleHireDoctorSubmit} className="space-y-4 text-xs font-medium">
              {/* Doctor Photo Upload Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <label className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#046a4e]" />
                  <span>Doctor Profile Photo *</span>
                </label>

                <div className="flex items-center gap-3.5">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white shadow-xs flex items-center justify-center shrink-0">
                    {docImagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={docImagePreview} alt="Doctor Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-1 text-slate-400">
                        <Upload className="h-5 w-5 mx-auto mb-0.5 text-slate-400" />
                        <span className="text-[8px] font-bold block">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-800 cursor-pointer shadow-xs transition">
                      <Upload className="w-3.5 h-3.5 text-[#046a4e]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDocImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={docImage.startsWith('data:') ? '' : docImage}
                      onChange={(e) => {
                        setDocImage(e.target.value);
                        setDocImagePreview(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[10px] outline-none focus:border-[#046a4e]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr . Jiarul Haque"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="General & Cardiology"
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="MD, MBBS"
                    value={docQualification}
                    onChange={(e) => setDocQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Consult Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="800"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    placeholder="+91 9804222142"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Confirm Registration & Save Doctor Photo</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
