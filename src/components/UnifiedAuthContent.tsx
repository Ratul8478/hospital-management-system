"use client";

import React, { useState, useEffect } from 'react';
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
  KeyRound,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Smile,
  Stethoscope,
  Building2,
  Users
} from 'lucide-react';

export function UnifiedAuthContent({ defaultTab = 'register' }: { defaultTab?: 'login' | 'register' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams?.get('mode') as 'login' | 'register') || defaultTab;

  const { setUserRole, setSelectedBranchId, branches, addBranch, hireAdmin, addBranchAdmin, addDoctor, addPatient } = useApp();

  // Active Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    const mode = searchParams?.get('mode') as 'login' | 'register';
    if (mode === 'login' || mode === 'register') {
      setActiveTab(mode);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [searchParams, defaultTab]);


  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'super_admin' | 'branch_admin' | 'doctor' | 'patient' | 'accountant' | 'pharmacist' | 'lab_technician' | 'franchise_partner'>('super_admin');

  // REGISTER STATE
  const [regRole, setRegRole] = useState<'patient' | 'doctor' | 'admin' | 'hospital' | 'staff'>('patient');
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('Hospital');
  const [selectedRegBranchId, setSelectedRegBranchId] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [govRegNumber, setGovRegNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology & Vascular Medicine');
  const [consultFee, setConsultFee] = useState('150');
  const [patientAge, setPatientAge] = useState('35');
  const [patientGender, setPatientGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalCondition, setMedicalCondition] = useState('General OPD Consultation');
  const [staffRole, setStaffRole] = useState<'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant'>('receptionist');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // COMMON UI STATE
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedUhid, setGeneratedUhid] = useState('');

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserRole(loginRole as any);
      if (loginRole === 'branch_admin') {
        const targetBranch = branches.find(b => b.adminEmail.toLowerCase() === loginEmail.toLowerCase());
        if (targetBranch) {
          setSelectedBranchId(targetBranch.id);
        } else {
          setSelectedBranchId(1);
        }
      }
      setSuccessMsg(`Welcome back! Authenticated as ${loginRole.toUpperCase().replace('_', ' ')}.`);

      setTimeout(() => {
        if (loginRole === 'doctor') router.push('/dashboard/doctor');
        else if (loginRole === 'patient') router.push('/dashboard/patient');
        else if (loginRole === 'branch_admin') router.push('/dashboard/branch-admin');
        else router.push('/dashboard/super-admin');
      }, 900);
    }, 700);
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetBranchObj = branches.find(b => b.id === selectedRegBranchId) || branches[0];

      if (regRole === 'admin') {
        addBranchAdmin({
          branchId: targetBranchObj.id,
          branchCode: targetBranchObj.code,
          branchName: targetBranchObj.name,
          name: fullName,
          email: regEmail,
          phone: regPhone || '+1 (555) 777-1234',
          status: 'active',
          roleTitle: 'Branch Central Admin',
        });
        hireAdmin(targetBranchObj.id, fullName, regEmail);
        setUserRole('branch_admin');
        setSelectedBranchId(targetBranchObj.id);
        setSuccessMsg(`Branch Central Admin Account Created! Assigned to ${targetBranchObj.code} — ${targetBranchObj.name}.`);
        setTimeout(() => router.push('/dashboard/branch-admin'), 1200);
      } else if (regRole === 'hospital') {
        const newBranchCode = branchCode || `BRANCH-0${branches.length + 1}`;
        addBranch({
          name: orgName || 'New Medix Branch',
          code: newBranchCode,
          facilityType: facilityType,
          govRegNumber: govRegNumber || `GOVT-REG-2026-00${branches.length + 1}`,
          location: 'Central Sector',
          adminName: fullName || 'Central Admin',
          adminEmail: regEmail,
        });
        setUserRole('super_admin');
        setSuccessMsg(`Registration Complete! Onboarded new ${facilityType} (${newBranchCode}).`);
        setTimeout(() => router.push('/dashboard/super-admin'), 1200);
      } else if (regRole === 'doctor') {
        addDoctor({
          branchId: targetBranchObj.id,
          name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
          specialty: specialty,
          fee: parseFloat(consultFee) || 150,
          status: 'available',
          contact: regPhone || '+1 (555) 019-8800',
        });
        setUserRole('doctor');
        setSelectedBranchId(targetBranchObj.id);
        setSuccessMsg(`Doctor Registration Successful for ${targetBranchObj.code}!`);
        setTimeout(() => router.push('/dashboard/doctor'), 1200);
      } else if (regRole === 'patient') {
        const newUhid = `UHID-B${targetBranchObj.id}-20260811-${Math.floor(1000 + Math.random() * 9000)}`;
        setGeneratedUhid(newUhid);
        addPatient({
          branchId: targetBranchObj.id,
          uhid: newUhid,
          name: fullName,
          age: parseInt(patientAge) || 30,
          gender: patientGender,
          bloodGroup: bloodGroup,
          phone: regPhone || '+1 (555) 333-2211',
          condition: medicalCondition || 'General OPD Consultation',
          status: 'opd',
        });
        setUserRole('patient');
        setSelectedBranchId(targetBranchObj.id);
        setSuccessMsg(`Patient Registered! Universal Health ID: ${newUhid}`);
        setTimeout(() => router.push(`/dashboard/patient?name=${encodeURIComponent(fullName)}&uhid=${encodeURIComponent(newUhid)}`), 1400);
      } else {
        setUserRole(staffRole);
        setSelectedBranchId(targetBranchObj.id);
        setSuccessMsg(`Registered as ${staffRole.toUpperCase().replace('_', ' ')} for ${targetBranchObj.code}!`);
        setTimeout(() => router.push('/appointments'), 1200);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#062c21] font-sans flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#d1fae5] selection:text-[#062c21]">
      
      {/* Header Navigation Bar matching Landing Page Header */}
      <header className="sticky top-0 z-50 bg-[#f0fdf4]/90 border-b border-[#d1fae5] backdrop-blur-md text-[#062c21] mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 p-1 shadow-lg group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1 shadow-inner">
                <Image
                  src="/logo.png"
                  alt="Medix Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain rounded-full"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tight leading-none text-[#062c21] group-hover:opacity-90 transition-opacity">
                Medix
              </span>
              <span className="text-xs font-extrabold tracking-widest uppercase text-[#046a4e] mt-1">
                Hospital System
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 text-xs font-bold rounded-full text-[#062c21] hover:bg-[#d1fae5] transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Badge & Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center z-10 space-y-3 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-[#046a4e] text-xs font-extrabold shadow-xs">
          <Heart className="w-4 h-4 text-[#046a4e] fill-[#046a4e]" />
          <span>MEDIX ENTERPRISE • REGISTRATION PORTAL</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#062c21] tracking-tight leading-tight">
          Join the Medix Care System
        </h1>
        <p className="text-sm text-[#046a4e] max-w-md mx-auto font-medium">
          Complete your registration below to generate your Universal Health ID or Access Scope.
        </p>
      </div>

      {/* Main Registration & Sign In Card (Identical Landing Page White Rounded Card) */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="bg-white p-6 sm:p-8 shadow-xl rounded-3xl border border-[#d1fae5] space-y-6">

          {/* Unified Compact Segmented Control (Dual Tabs) */}
          <div className="bg-[#f0fdf4] p-1.5 rounded-2xl border border-[#d1fae5] flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
              className={`w-1/2 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#046a4e] text-white shadow-md shadow-emerald-900/20'
                  : 'text-[#062c21] hover:bg-[#d1fae5]/50'
              }`}
            >
              <UserPlus className="h-4 w-4" /> Register New Account
            </button>

            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
              className={`w-1/2 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#046a4e] text-white shadow-md shadow-emerald-900/20'
                  : 'text-[#062c21] hover:bg-[#d1fae5]/50'
              }`}
            >
              <LogIn className="h-4 w-4" /> Sign In (Login)
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-[#f0fdf4] border border-[#a7f3d0] text-[#062c21] text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#046a4e]" />
              <div>
                <div>{successMsg}</div>
                {generatedUhid && (
                  <div className="font-mono text-[11px] font-black text-[#046a4e] mt-1">
                    Your Universal Health ID: <span className="bg-[#d1fae5] px-2 py-0.5 rounded-md text-[#062c21]">{generatedUhid}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: REGISTER */}
          {activeTab === 'register' ? (
            <div className="space-y-5">
              
              {/* Select Registration Role Category */}
              <div>
                <label className="block text-xs font-extrabold text-[#062c21] uppercase tracking-wider mb-2">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: 'patient', label: 'Patient Registration', desc: 'Universal UHID EHR' },
                    { id: 'doctor', label: 'Doctor / Specialist', desc: 'Consultant Portal' },
                    { id: 'admin', label: 'Branch Central Admin', desc: 'Central Control' },
                    { id: 'hospital', label: 'New Branch Node', desc: 'Onboard Hospital' },
                    { id: 'staff', label: 'Department Staff', desc: 'Pharmacy / Lab' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRegRole(item.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        regRole === item.id
                          ? 'bg-[#046a4e] border-[#046a4e] text-white shadow-md ring-2 ring-[#046a4e]/20'
                          : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/60'
                      }`}
                    >
                      <div className="font-extrabold text-[11px] truncate">{item.label}</div>
                      <div className={`text-[9px] mt-0.5 truncate ${regRole === item.id ? 'text-emerald-100' : 'text-[#046a4e]'}`}>{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-medium">
                
                {/* Dynamic Branch Selection */}
                {regRole !== 'hospital' && (
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Target Hospital Branch ({branches.length} Active Nodes)</label>
                    <select
                      value={selectedRegBranchId}
                      onChange={e => setSelectedRegBranchId(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] font-bold outline-none"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>
                          🏥 {b.name} ({b.code}) — {b.location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Role Specific Inputs */}
                {regRole === 'hospital' && (
                  <>
                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Facility Category</label>
                      <div className="flex gap-2">
                        {(['Hospital', 'Nursing Home', 'Diagnostic Center'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFacilityType(type)}
                            className={`flex-1 py-2.5 text-[11px] font-bold rounded-2xl border transition-all cursor-pointer ${
                              facilityType === type ? 'bg-[#046a4e] border-[#046a4e] text-white shadow-xs' : 'bg-[#f0fdf4] border-[#d1fae5] text-[#062c21]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">Organization / Branch Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Medix Metro Care"
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">Govt Reg Number</label>
                        <input
                          type="text"
                          required
                          placeholder="GOVT-REG-2026-001"
                          value={govRegNumber}
                          onChange={e => setGovRegNumber(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {regRole === 'doctor' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Medical Specialty</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiology & Surgery"
                        value={specialty}
                        onChange={e => setSpecialty(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="500"
                        value={consultFee}
                        onChange={e => setConsultFee(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {regRole === 'patient' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Age</label>
                      <input
                        type="number"
                        required
                        placeholder="35"
                        value={patientAge}
                        onChange={e => setPatientAge(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Gender</label>
                      <select
                        value={patientGender}
                        onChange={e => setPatientGender(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-bold"
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
                        className="w-full px-3 py-2.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-bold"
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
                )}

                {regRole === 'staff' && (
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Department Role</label>
                    <select
                      value={staffRole}
                      onChange={e => setStaffRole(e.target.value as any)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-bold"
                    >
                      <option value="receptionist">📋 OPD & Emergency Receptionist</option>
                      <option value="pharmacist">💊 Pharmacy Inventory Manager</option>
                      <option value="lab_technician">🧪 Lab Diagnostics Specialist</option>
                      <option value="accountant">💰 Billing & Claims Accountant</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@medix.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 019-2831"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm rounded-full shadow-lg shadow-emerald-900/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  {isLoading ? <span>Processing Registration...</span> : <><span>Create Account & Assign Scope</span> <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>

              {/* Switch to Login */}
              <div className="text-center pt-3 border-t border-[#d1fae5]">
                <p className="text-xs text-[#046a4e] font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                    className="font-extrabold text-[#046a4e] hover:text-[#062c21] underline transition-colors cursor-pointer"
                  >
                    Sign In Here →
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* TAB 2: SIGN IN (LOGIN) */
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Select User Scope & Role</label>
                  <select
                    value={loginRole}
                    onChange={e => setLoginRole(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-extrabold rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  >
                    <option value="super_admin">👑 Super Admin (Headquarters Master Control)</option>
                    <option value="branch_admin">🏬 Hospital Central Admin (Specific Branch Scope)</option>
                    <option value="doctor">🩺 Medical Consultant / Doctor</option>
                    <option value="patient">👤 Patient (UHID EHR Access)</option>
                    <option value="accountant">💰 Branch Accountant</option>
                    <option value="pharmacist">💊 Pharmacy Manager</option>
                    <option value="lab_technician">🧪 Lab Diagnostics Technician</option>
                    <option value="franchise_partner">🤝 Franchise Royalty Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Email / Phone / UHID</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#046a4e]" />
                    <input
                      type="text"
                      required
                      placeholder="admin.main@medix.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#046a4e]" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                    />
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3.5 top-3.5 text-[#046a4e]">
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm rounded-full shadow-lg shadow-emerald-900/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <span>Authenticating...</span> : <><span>Sign In To Portal</span> <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>

              {/* Switch to Register */}
              <div className="text-center pt-3 border-t border-[#d1fae5]">
                <p className="text-xs text-[#046a4e] font-medium">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
                    className="font-extrabold text-[#046a4e] hover:text-[#062c21] underline transition-colors cursor-pointer"
                  >
                    Register New Account →
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
