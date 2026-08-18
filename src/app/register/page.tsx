"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Heart,
  Building2,
  Crown,
  Share2,
  Sparkles,
  Stethoscope,
  Users,
  ShieldCheck,
  Briefcase,
  KeyRound,
  FileCheck
} from 'lucide-react';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const {
    setUserRole,
    setSelectedBranchId,
    branches,
    hireAdmin,
    addBranchAdmin,
    addDoctor,
    addPatient,
    submitMarketingJoinRequest
  } = useApp();

  // Primary Division: 'super_admin' | 'hospital_admin'
  const [primaryDivision, setPrimaryDivision] = useState<'super_admin' | 'hospital_admin'>(
    initialRoleParam === 'super_admin' ? 'super_admin' : 'hospital_admin'
  );

  // Sub-role within Hospital Admin division
  const [adminSubRole, setAdminSubRole] = useState<'branch_admin' | 'marketing' | 'doctor' | 'patient' | 'staff'>(
    initialRoleParam && ['marketing', 'doctor', 'patient', 'staff'].includes(initialRoleParam)
      ? (initialRoleParam as any)
      : 'branch_admin'
  );

  // Facility & Branch State
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('Hospital');
  const [selectedBranchId, setSelectedBranchIdState] = useState<number>(1);
  
  // Super Admin specific fields
  const [hqMasterKey, setHqMasterKey] = useState('MEDIX-HQ-MASTER-2026');
  const [networkScope, setNetworkScope] = useState('All 9 Multi-Campus Branches');
  const [govRegNumber, setGovRegNumber] = useState('GOV-HOSP-2026-HQ9');

  // Branch Admin specific fields
  const [adminRoleTitle, setAdminRoleTitle] = useState('Branch Central Administrator');

  // Marketing Representative specific fields
  const [territory, setTerritory] = useState('South & West Suburbs Healthcare Hub');
  const [experienceYears, setExperienceYears] = useState('5');
  const [expectedMonthlyReferrals, setExpectedMonthlyReferrals] = useState('30');
  const [marketingNotes, setMarketingNotes] = useState('Tie-ups with local clinics, pharmacies, and corporate health leads');

  // Doctor specific fields
  const [specialty, setSpecialty] = useState('Cardiology & Vascular Medicine');
  const [consultFee, setConsultFee] = useState('800');

  // Patient specific fields
  const [patientAge, setPatientAge] = useState('35');
  const [patientGender, setPatientGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalCondition, setMedicalCondition] = useState('General OPD Consultation');

  // Staff specific fields
  const [staffRole, setStaffRole] = useState<'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant'>('receptionist');

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedUhid, setGeneratedUhid] = useState('');

  // Handle Primary Division Change
  const handleSelectDivision = (division: 'super_admin' | 'hospital_admin') => {
    setPrimaryDivision(division);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

      if (primaryDivision === 'super_admin') {
        // ==========================================
        // 1. SUPER ADMIN REGISTRATION
        // ==========================================
        setUserRole('super_admin');
        setSelectedBranchId('all');
        setSuccessMsg(`👑 Super Admin Master Account registered successfully! You have full access to the Main Headquarters Hospital and complete authority to recruit/fire branch admins and audit all hospital operations.`);
        setTimeout(() => router.push('/dashboard/super-admin'), 1300);

      } else {
        // ==========================================
        // 2. HOSPITAL ADMIN / BRANCH ROLES
        // ==========================================
        if (adminSubRole === 'branch_admin') {
          // Branch Central Admin
          addBranchAdmin({
            branchId: targetBranch.id,
            branchCode: targetBranch.code,
            branchName: targetBranch.name,
            name: fullName,
            email: email,
            phone: phone || '+91 98200 11223',
            status: 'active',
            roleTitle: adminRoleTitle || 'Branch Central Administrator',
          });
          hireAdmin(targetBranch.id, fullName, email, phone);
          setUserRole('branch_admin');
          setSelectedBranchId(targetBranch.id);
          setSuccessMsg(`🏥 Hospital Admin registered for ${targetBranch.name} (${targetBranch.code})! The dedicated Marketing Suite and Reference ID generator is now active on your dashboard.`);
          setTimeout(() => router.push('/dashboard/branch-admin'), 1300);

        } else if (adminSubRole === 'marketing') {
          // Field Marketing Partner
          submitMarketingJoinRequest({
            name: fullName,
            email: email,
            phone: phone || '+91 98200 45678',
            targetBranchId: targetBranch.id,
            targetBranchCode: targetBranch.code,
            targetBranchName: targetBranch.name,
            territory: territory,
            experienceYears: parseInt(experienceYears) || 3,
            expectedMonthlyReferrals: parseInt(expectedMonthlyReferrals) || 20,
            qualificationsOrNotes: marketingNotes || 'Application submitted via Online Portal',
          });
          setSuccessMsg(`📢 Marketing Partner Application submitted for ${targetBranch.name}! Your request is queued for Hospital Admin approval. A unique Reference ID will be generated upon approval.`);
          setTimeout(() => router.push('/login'), 2200);

        } else if (adminSubRole === 'doctor') {
          // Doctor Profile
          addDoctor({
            branchId: targetBranch.id,
            name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
            specialty: specialty,
            fee: parseFloat(consultFee) || 800,
            status: 'available',
            contact: phone || '+91 98200 99887',
          });
          setUserRole('doctor');
          setSelectedBranchId(targetBranch.id);
          setSuccessMsg(`🩺 Medical Consultant Profile created for ${targetBranch.code}!`);
          setTimeout(() => router.push('/dashboard/doctor'), 1200);

        } else if (adminSubRole === 'patient') {
          // Patient Registration
          const newUhid = `UHID-B${targetBranch.id}-20260814-${Math.floor(1000 + Math.random() * 9000)}`;
          setGeneratedUhid(newUhid);
          addPatient({
            branchId: targetBranch.id,
            uhid: newUhid,
            name: fullName,
            age: parseInt(patientAge) || 30,
            gender: patientGender,
            bloodGroup: bloodGroup,
            phone: phone || '+91 98200 55443',
            condition: medicalCondition || 'General OPD Consultation',
            status: 'opd',
          });
          setUserRole('patient');
          setSelectedBranchId(targetBranch.id);
          setSuccessMsg(`👤 Patient Registered! Universal Health ID: ${newUhid}`);
          setTimeout(() => router.push(`/dashboard/patient?name=${encodeURIComponent(fullName)}&uhid=${encodeURIComponent(newUhid)}`), 1400);

        } else {
          // Department Staff
          setUserRole(staffRole);
          setSelectedBranchId(targetBranch.id);
          setSuccessMsg(`💼 Registered as ${staffRole.toUpperCase()} for ${targetBranch.code}!`);
          setTimeout(() => router.push('/appointments'), 1200);
        }
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#062c21] font-sans selection:bg-[#d1fae5] selection:text-[#062c21] pb-20">
      
      {/* LANDING PAGE MANDATORY HEADER */}
      <ConceptHeader theme="pastels" />

      {/* HERO REGISTRATION BANNER */}
      <section className="pt-10 pb-6 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-[#046a4e] text-xs font-extrabold shadow-xs">
          <Heart className="w-4 h-4 text-[#046a4e] fill-[#046a4e]" />
          <span>MEDIX ENTERPRISE HEALTHCARE • REGISTRATION PORTAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#062c21] tracking-tight leading-tight">
          Hospital & Network Administration Registration
        </h1>

        <p className="text-sm sm:text-base text-[#046a4e] max-w-xl mx-auto font-medium leading-relaxed">
          Select your registration division: <strong className="text-[#062c21]">Super Admin</strong> (Multi-Hospital Master Control) or <strong className="text-[#062c21]">Hospital Admin</strong> (Facility Administration & Roles).
        </p>
      </section>

      {/* MAIN REGISTRATION CARD */}
      <main className="max-w-2xl mx-auto px-4 z-10">
        <div className="bg-white p-6 sm:p-10 shadow-2xl rounded-3xl border border-[#d1fae5] space-y-6">

          {/* DUAL MODE SELECTOR TABS (SIGN IN / REGISTER) */}
          <div className="bg-[#f0fdf4] p-1.5 rounded-2xl border border-[#d1fae5] flex items-center gap-1">
            <button
              type="button"
              className="w-1/2 py-3 rounded-xl text-xs font-black bg-[#046a4e] text-white shadow-md flex items-center justify-center gap-2 cursor-default"
            >
              <UserPlus className="h-4 w-4" /> Registration
            </button>

            <Link
              href="/login"
              className="w-1/2 py-3 rounded-xl text-xs font-bold text-[#062c21] hover:bg-[#d1fae5]/60 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4 text-[#046a4e]" /> Sign In (Login)
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* PRIMARY TWO DIVISIONS SELECTOR: SUPER ADMIN vs HOSPITAL ADMIN */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#062c21] uppercase tracking-wider">
                Select Administrative Division:
              </label>
              <span className="text-[11px] font-bold text-[#046a4e]">2 Primary Divisions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* DIVISION 1: SUPER ADMIN */}
              <button
                type="button"
                onClick={() => handleSelectDivision('super_admin')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  primaryDivision === 'super_admin'
                    ? 'bg-gradient-to-br from-[#062c21] to-[#046a4e] border-[#046a4e] text-white shadow-lg ring-2 ring-[#046a4e]/40 scale-[1.02]'
                    : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    primaryDivision === 'super_admin'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-[#d1fae5] text-[#046a4e]'
                  }`}>
                    <Crown className="w-5 h-5" />
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    primaryDivision === 'super_admin'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    HQ MASTER
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base">1. Super Admin</h3>
                <p className={`text-[11px] mt-1 leading-snug ${
                  primaryDivision === 'super_admin' ? 'text-emerald-100' : 'text-slate-600'
                }`}>
                  Main hospital full operations, recruit/fire branch admins, view global vital metrics & audit marketing approvals.
                </p>
              </button>

              {/* DIVISION 2: HOSPITAL ADMIN */}
              <button
                type="button"
                onClick={() => handleSelectDivision('hospital_admin')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  primaryDivision === 'hospital_admin'
                    ? 'bg-gradient-to-br from-[#046a4e] to-[#022c22] border-[#046a4e] text-white shadow-lg ring-2 ring-[#046a4e]/40 scale-[1.02]'
                    : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    primaryDivision === 'hospital_admin'
                      ? 'bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-[#d1fae5] text-[#046a4e]'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    primaryDivision === 'hospital_admin'
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    WITH MARKETING
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base">2. Hospital Admin</h3>
                <p className={`text-[11px] mt-1 leading-snug ${
                  primaryDivision === 'hospital_admin' ? 'text-emerald-100' : 'text-slate-600'
                }`}>
                  Individual hospital facility administration with full Marketing Requests & Reference ID generation suite.
                </p>
              </button>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* DIVISION 2 SUB-ROLES SELECTOR (REVEALED WHEN HOSPITAL ADMIN IS ACTIVE) */}
          {/* ========================================================================= */}
          {primaryDivision === 'hospital_admin' && (
            <div className="p-4 bg-[#f0fdf4] border border-[#a7f3d0] rounded-2xl space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#046a4e] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Select Hospital Role / Profile:</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Scoped to Target Hospital</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'branch_admin', icon: Building2, label: '🏬 Hospital Admin', badge: 'Marketing Hub' },
                  { id: 'marketing', icon: Share2, label: '📢 Marketing Partner', badge: 'Get Reference ID' },
                  { id: 'doctor', icon: Stethoscope, label: '🩺 Doctor / Consultant', badge: 'OPD Queue' },
                  { id: 'patient', icon: Users, label: '👤 Patient Register', badge: 'Universal UHID' },
                  { id: 'staff', icon: Briefcase, label: '💼 Dept Staff', badge: 'Pharmacy/Lab' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAdminSubRole(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      adminSubRole === item.id
                        ? 'bg-[#046a4e] border-[#046a4e] text-white shadow-xs'
                        : 'bg-white border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/60'
                    }`}
                  >
                    <p className="font-black text-xs leading-tight">{item.label}</p>
                    <span className={`text-[9px] font-bold block mt-0.5 ${
                      adminSubRole === item.id ? 'text-emerald-200' : 'text-emerald-700'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ALERTS */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-[#f0fdf4] border border-[#a7f3d0] text-[#062c21] text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#046a4e]" />
              <div>
                <div>{successMsg}</div>
                {generatedUhid && (
                  <div className="font-mono text-[11px] font-black text-[#046a4e] mt-1">
                    Universal Health ID: <span className="bg-[#d1fae5] px-2 py-0.5 rounded-md text-[#062c21]">{generatedUhid}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REGISTRATION FORM FIELDS */}
          {/* ========================================================================= */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">

            {/* 1. SUPER ADMIN SPECIFIC FIELDS */}
            {primaryDivision === 'super_admin' && (
              <div className="p-4 bg-[#f0fdf4] border-2 border-emerald-500/40 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#046a4e] font-black text-xs uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Super Admin Master Privileges Configuration</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Network Access Scope</label>
                    <input
                      type="text"
                      disabled
                      value={networkScope}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-slate-700 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">HQ Master Authorization Key</label>
                    <input
                      type="text"
                      required
                      value={hqMasterKey}
                      onChange={e => setHqMasterKey(e.target.value)}
                      placeholder="MEDIX-HQ-MASTER-2026"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-mono font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Govt Hospital License Reg Number</label>
                  <input
                    type="text"
                    required
                    value={govRegNumber}
                    onChange={e => setGovRegNumber(e.target.value)}
                    placeholder="GOV-HOSP-2026-HQ9"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-mono font-bold rounded-xl outline-none text-xs"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-[#046a4e] font-bold space-y-1">
                  <p>✓ Complete operational access to Main Headquarters Hospital ({branches[0]?.name}).</p>
                  <p>✓ Hire & Fire authority over Branch Central Admins of all other branches.</p>
                  <p>✓ Cross-hospital vital telemetry (Revenue, Bed Occupancy, Doctors, Patients).</p>
                  <p>✓ Comprehensive Marketing Approver Audit Log tracking which hospital admin approved which marketing rep.</p>
                </div>
              </div>
            )}

            {/* 2. HOSPITAL ADMIN (BRANCH ADMIN) SPECIFIC FIELDS */}
            {primaryDivision === 'hospital_admin' && adminSubRole === 'branch_admin' && (
              <div className="p-4 bg-[#f0fdf4] border-2 border-[#046a4e]/40 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#046a4e] font-black text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Target Individual Hospital Assignment</span>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Select Hospital Branch ({branches.length} Available)</label>
                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl focus:ring-2 focus:ring-[#046a4e]/20 font-bold outline-none cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        🏥 {b.name} ({b.code}) — {b.location} [Admin: {b.adminName}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Admin Role Designation</label>
                    <input
                      type="text"
                      required
                      value={adminRoleTitle}
                      onChange={e => setAdminRoleTitle(e.target.value)}
                      placeholder="Branch Central Administrator"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Facility Category</label>
                    <select
                      value={facilityType}
                      onChange={e => setFacilityType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl outline-none text-xs cursor-pointer"
                    >
                      <option value="Hospital">Hospital</option>
                      <option value="Nursing Home">Nursing Home</option>
                      <option value="Diagnostic Center">Diagnostic Center</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#046a4e] text-[11px] font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Includes built-in Marketing Hub to approve field marketing reps and generate Reference IDs.</span>
                </div>
              </div>
            )}

            {/* 3. MARKETING REPRESENTATIVE SPECIFIC FIELDS */}
            {primaryDivision === 'hospital_admin' && adminSubRole === 'marketing' && (
              <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wider">
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <span>Field Marketing Partner Join Application</span>
                </div>

                <div>
                  <label className="block font-extrabold text-purple-950 mb-1">Apply for Target Hospital Branch</label>
                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-purple-200 text-purple-950 rounded-xl font-bold outline-none cursor-pointer text-xs"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        🏥 {b.name} ({b.code}) — {b.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Covered Territory / City</label>
                    <input
                      type="text"
                      required
                      value={territory}
                      onChange={e => setTerritory(e.target.value)}
                      placeholder="e.g. South Mumbai Clinics"
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      value={experienceYears}
                      onChange={e => setExperienceYears(e.target.value)}
                      placeholder="5"
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-mono font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-purple-950 mb-1">Expected Monthly Patient Referrals</label>
                  <input
                    type="number"
                    required
                    value={expectedMonthlyReferrals}
                    onChange={e => setExpectedMonthlyReferrals(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-mono font-bold rounded-xl outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-purple-950 mb-1">Background / Doctor Network Tie-ups</label>
                  <textarea
                    rows={2}
                    value={marketingNotes}
                    onChange={e => setMarketingNotes(e.target.value)}
                    placeholder="Describe your medical referral network, clinic tie-ups, or corporate health lead sources..."
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-medium rounded-xl outline-none text-xs"
                  />
                </div>
              </div>
            )}

            {/* 4. DOCTOR SPECIFIC FIELDS */}
            {primaryDivision === 'hospital_admin' && adminSubRole === 'doctor' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Select Hospital Branch</label>
                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl font-bold outline-none cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        🏥 {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Medical Specialty</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiology & Surgery"
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="800"
                      value={consultFee}
                      onChange={e => setConsultFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. PATIENT SPECIFIC FIELDS */}
            {primaryDivision === 'hospital_admin' && adminSubRole === 'patient' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Age</label>
                    <input
                      type="number"
                      required
                      placeholder="35"
                      value={patientAge}
                      onChange={e => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Chief Medical Complaint</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hypertension, Joint Pain, Fever"
                    value={medicalCondition}
                    onChange={e => setMedicalCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            {/* 6. STAFF SPECIFIC FIELDS */}
            {primaryDivision === 'hospital_admin' && adminSubRole === 'staff' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Hospital Branch</label>
                    <select
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Staff Designation</label>
                    <select
                      value={staffRole}
                      onChange={e => setStaffRole(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold capitalize"
                    >
                      <option value="receptionist">Receptionist / OPD Desk</option>
                      <option value="pharmacist">Pharmacy Manager</option>
                      <option value="lab_technician">Lab Diagnostics Technician</option>
                      <option value="accountant">Branch Accountant</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* COMMON CONTACT & AUTHENTICATION FIELDS */}
            {/* ========================================================================= */}
            <div>
              <label className="block font-extrabold text-[#062c21] mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder={primaryDivision === 'super_admin' ? "e.g. Dr. Robert Sullivan" : "e.g. Dr. Jane Smith"}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-bold rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                />
              </div>
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#046a4e] hover:text-[#062c21]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-[#046a4e] to-[#022c22] text-white shadow-xl hover:from-[#03523c] hover:to-[#011a14] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Account & Provisioning Workspace...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {primaryDivision === 'super_admin'
                      ? 'Register Super Admin HQ Master Account'
                      : adminSubRole === 'marketing'
                      ? 'Submit Marketing Partner Application'
                      : `Register as ${adminSubRole.toUpperCase().replace('_', ' ')}`}
                  </span>
                </>
              )}
            </button>

          </form>

        </div>
      </main>

    </div>
  );
}