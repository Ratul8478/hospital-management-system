"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Stethoscope,
  Building2,
  Users,
  Smile,
  PhoneCall,
  Crown,
  Share2,
  Sparkles,
  MapPin,
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
    addBranch,
    hireAdmin,
    addBranchAdmin,
    addDoctor,
    addPatient,
    submitMarketingJoinRequest
  } = useApp();

  // Primary Division: 'super_admin' | 'branch_admin' | 'doctor' | 'patient' | 'marketing' | 'staff'
  const [primaryDivision, setPrimaryDivision] = useState<'super_admin' | 'branch_admin'>(
    initialRoleParam === 'super_admin' ? 'super_admin' : 'branch_admin'
  );

  // Sub-role selection for non-admin accounts
  const [accountType, setAccountType] = useState<'super_admin' | 'branch_admin' | 'doctor' | 'patient' | 'marketing' | 'staff'>(
    initialRoleParam === 'super_admin' ? 'super_admin' : 'branch_admin'
  );

  // Facility & Branch State
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('Hospital');
  const [selectedBranchId, setSelectedBranchIdState] = useState<number>(1);
  
  // Super Admin specific fields
  const [hqMasterKey, setHqMasterKey] = useState('MEDIX-HQ-MASTER-2026');
  const [networkScope, setNetworkScope] = useState('All 9 Multi-Campus Branches');

  // Branch Admin specific fields
  const [adminRoleTitle, setAdminRoleTitle] = useState('Branch Central Administrator');

  // Marketing Representative specific fields
  const [territory, setTerritory] = useState('South & West Suburbs Healthcare Hub');
  const [experienceYears, setExperienceYears] = useState('5');
  const [expectedMonthlyReferrals, setExpectedMonthlyReferrals] = useState('30');
  const [marketingNotes, setMarketingNotes] = useState('Tie-ups with local clinics and diagnostic lead networks');

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [govRegNumber, setGovRegNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology & Surgery');
  const [consultFee, setConsultFee] = useState('150');
  const [patientAge, setPatientAge] = useState('35');
  const [patientGender, setPatientGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalCondition, setMedicalCondition] = useState('General OPD Consultation');
  const [staffRole, setStaffRole] = useState<'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant'>('receptionist');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedUhid, setGeneratedUhid] = useState('');
  const [generatedRefId, setGeneratedRefId] = useState('');

  // Handle Division Switch
  const handleDivisionChange = (division: 'super_admin' | 'branch_admin') => {
    setPrimaryDivision(division);
    setAccountType(division);
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

      if (accountType === 'super_admin') {
        // 1. SUPER ADMIN REGISTRATION
        setUserRole('super_admin');
        setSelectedBranchId('all');
        setSuccessMsg(`Super Admin Master Account created successfully for ${fullName || 'Administrator'}! Full access granted across all hospital branches.`);
        setTimeout(() => router.push('/dashboard/super-admin'), 1200);
      } else if (accountType === 'branch_admin') {
        // 2. INDIVIDUAL HOSPITAL / BRANCH ADMIN REGISTRATION
        addBranchAdmin({
          branchId: targetBranch.id,
          branchCode: targetBranch.code,
          branchName: targetBranch.name,
          name: fullName,
          email: email,
          phone: phone || '+1 (555) 777-1234',
          status: 'active',
          roleTitle: adminRoleTitle || 'Branch Central Administrator',
        });
        hireAdmin(targetBranch.id, fullName, email, phone);
        setUserRole('branch_admin');
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`Hospital Admin Registered for ${targetBranch.name} (${targetBranch.code})! Marketing Section is now active on your dashboard.`);
        setTimeout(() => router.push('/dashboard/branch-admin'), 1200);
      } else if (accountType === 'marketing') {
        // 3. MARKETING REPRESENTATIVE REGISTRATION / JOIN REQUEST
        submitMarketingJoinRequest({
          name: fullName,
          email: email,
          phone: phone || '+91 98200 00000',
          targetBranchId: targetBranch.id,
          targetBranchCode: targetBranch.code,
          targetBranchName: targetBranch.name,
          territory: territory,
          experienceYears: parseInt(experienceYears) || 3,
          expectedMonthlyReferrals: parseInt(expectedMonthlyReferrals) || 20,
          qualificationsOrNotes: marketingNotes || 'Application submitted via Online Portal',
        });
        setSuccessMsg(`Marketing Partner Application submitted for ${targetBranch.name}! Your request has been queued for the Hospital Admin. A unique Reference ID will be generated upon approval.`);
        setTimeout(() => router.push('/login'), 2200);
      } else if (accountType === 'doctor') {
        addDoctor({
          branchId: targetBranch.id,
          name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
          specialty: specialty,
          fee: parseFloat(consultFee) || 150,
          status: 'available',
          contact: phone || '+1 (555) 019-8800',
        });
        setUserRole('doctor');
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`Doctor Profile Created for ${targetBranch.code}!`);
        setTimeout(() => router.push('/dashboard/doctor'), 1200);
      } else if (accountType === 'patient') {
        const newUhid = `UHID-B${targetBranch.id}-20260814-${Math.floor(1000 + Math.random() * 9000)}`;
        setGeneratedUhid(newUhid);
        addPatient({
          branchId: targetBranch.id,
          uhid: newUhid,
          name: fullName,
          age: parseInt(patientAge) || 30,
          gender: patientGender,
          bloodGroup: bloodGroup,
          phone: phone || '+1 (555) 333-2211',
          condition: medicalCondition || 'General OPD Consultation',
          status: 'opd',
        });
        setUserRole('patient');
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`Patient Registered! Universal Health ID: ${newUhid}`);
        setTimeout(() => router.push(`/dashboard/patient?name=${encodeURIComponent(fullName)}&uhid=${encodeURIComponent(newUhid)}`), 1400);
      } else {
        setUserRole(staffRole);
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`Registered as ${staffRole.toUpperCase()} for ${targetBranch.code}!`);
        setTimeout(() => router.push('/appointments'), 1200);
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
          Select whether you are registering as a <strong className="text-[#062c21]">Super Admin</strong> (Multi-Hospital HQ) or an <strong className="text-[#062c21]">Admin</strong> (Individual Hospital/Branch with Marketing Suite).
        </p>
      </section>

      {/* REGISTRATION FORM CARD */}
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
            <label className="block text-xs font-black text-[#062c21] uppercase tracking-wider">
              Choose Administrative Division
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* DIVISION 1: SUPER ADMIN */}
              <button
                type="button"
                onClick={() => handleDivisionChange('super_admin')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  primaryDivision === 'super_admin' && accountType === 'super_admin'
                    ? 'bg-gradient-to-br from-[#062c21] to-[#046a4e] border-[#046a4e] text-white shadow-lg ring-2 ring-[#046a4e]/40'
                    : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                    primaryDivision === 'super_admin' && accountType === 'super_admin'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-[#d1fae5] text-[#046a4e]'
                  }`}>
                    <Crown className="w-4 h-4" />
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    primaryDivision === 'super_admin' && accountType === 'super_admin'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    HQ MASTER
                  </span>
                </div>
                <h3 className="font-black text-sm">Division 1: Super Admin</h3>
                <p className={`text-[11px] mt-1 leading-snug ${
                  primaryDivision === 'super_admin' && accountType === 'super_admin' ? 'text-emerald-100' : 'text-slate-600'
                }`}>
                  Full hospital network access, recruit/fire branch admins, view global hospital metrics.
                </p>
              </button>

              {/* DIVISION 2: HOSPITAL ADMIN (BRANCH ADMIN) */}
              <button
                type="button"
                onClick={() => handleDivisionChange('branch_admin')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  primaryDivision === 'branch_admin' && accountType === 'branch_admin'
                    ? 'bg-gradient-to-br from-[#046a4e] to-[#022c22] border-[#046a4e] text-white shadow-lg ring-2 ring-[#046a4e]/40'
                    : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                    primaryDivision === 'branch_admin' && accountType === 'branch_admin'
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-[#d1fae5] text-[#046a4e]'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    primaryDivision === 'branch_admin' && accountType === 'branch_admin'
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    WITH MARKETING
                  </span>
                </div>
                <h3 className="font-black text-sm">Division 2: Hospital Admin</h3>
                <p className={`text-[11px] mt-1 leading-snug ${
                  primaryDivision === 'branch_admin' && accountType === 'branch_admin' ? 'text-emerald-100' : 'text-slate-600'
                }`}>
                  Individual hospital facility admin with Marketing Requests & Reference ID generation.
                </p>
              </button>

            </div>
          </div>

          {/* OTHER SUPPORTING ROLES SELECTOR */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
              Other Specialized Registration Portals:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {[
                { id: 'marketing', label: '📢 Marketing Partner Apply', desc: 'Join as Referral Agent' },
                { id: 'doctor', label: '👨‍⚕️ Doctor / Consultant', desc: 'OPD Clinical Portal' },
                { id: 'patient', label: '🏥 Patient Registration', desc: 'Universal UHID EHR' },
                { id: 'staff', label: '💼 Department Staff', desc: 'Pharmacy / Lab POS' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAccountType(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    accountType === item.id
                      ? 'bg-[#046a4e] border-[#046a4e] text-white shadow-xs'
                      : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

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
          {/* REGISTRATION FORM */}
          {/* ========================================================================= */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">

            {/* 1. SUPER ADMIN SPECIFIC FIELDS */}
            {accountType === 'super_admin' && (
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
                <p className="text-[11px] text-[#046a4e] leading-snug">
                  ✓ Full administrative control over all hospital branches, recruit & fire branch admins, view financial & bed analytics.
                </p>
              </div>
            )}

            {/* 2. HOSPITAL ADMIN (BRANCH ADMIN) SPECIFIC FIELDS */}
            {accountType === 'branch_admin' && (
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
                        🏥 {b.name} ({b.code}) — {b.location} [Current Admin: {b.adminName}]
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
            {accountType === 'marketing' && (
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
            {accountType === 'doctor' && (
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
            {accountType === 'patient' && (
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
                      className="w-full px-3 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none font-bold cursor-pointer"
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
                      className="w-full px-3 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none font-bold cursor-pointer"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* COMMON IDENTITY INPUTS */}
            <div>
              <label className="block font-extrabold text-[#062c21] mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="Enter Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@medix.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                />
              </div>
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98200 12345"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-extrabold text-[#062c21] mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-sm font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading
                    ? 'bg-slate-400 text-white cursor-not-allowed'
                    : accountType === 'super_admin'
                    ? 'bg-gradient-to-r from-[#062c21] to-[#046a4e] text-white hover:shadow-emerald-900/30 hover:scale-[1.01]'
                    : accountType === 'branch_admin'
                    ? 'bg-[#046a4e] hover:bg-[#03523c] text-white hover:scale-[1.01]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.01]'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {accountType === 'super_admin'
                        ? 'Complete Super Admin HQ Registration'
                        : accountType === 'branch_admin'
                        ? 'Register Hospital Admin & Activate Marketing Suite'
                        : accountType === 'marketing'
                        ? 'Submit Field Marketing Join Request'
                        : 'Complete Registration'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* FOOTER */}
          <div className="pt-4 border-t border-[#d1fae5] text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-[#046a4e] hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}