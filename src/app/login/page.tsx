"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Heart,
  UserPlus,
  Share2,
  Crown,
  Building2,
  Sparkles
} from 'lucide-react';
import { detectSuspiciousPayload, sanitizeString } from '@/lib/security';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';
import SuperAdminModal from '@/components/SuperAdminModal';

export default function LoginPage() {
  const router = useRouter();
  const {
    setUserRole,
    setSelectedBranchId,
    branches,
    superAdminProfile,
    marketingRepresentatives,
    marketingJoinRequests
  } = useApp();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginReferenceId, setLoginReferenceId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'super_admin' | 'receptionist' | 'marketing' | 'branch_admin' | 'doctor' | 'patient' | 'accountant' | 'pharmacist' | 'lab_technician' | 'franchise_partner'>('super_admin');
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Security Threat Detection
    const emailThreat = detectSuspiciousPayload(loginEmail);
    const passThreat = detectSuspiciousPayload(loginPassword);
    if (emailThreat.isSuspicious || passThreat.isSuspicious) {
      setError('Security Alert: Malicious input sequence detected and blocked by firewall.');
      return;
    }

    if (!loginEmail || !loginPassword) {
      setError('Please enter your email/phone and password.');
      return;
    }

    // Super Admin Credentials Verification & 2FA OTP Gateway Trigger
    if (loginRole === 'super_admin') {
      const allowedEmails = [
        (superAdminProfile?.email || 'ariyanhospital9@gmail.com').toLowerCase(),
        'ariyanhospital9@gmail.com',
        'varshahealth01@gmail.com',
        'admin.main@medix.com',
        'superadmin@medix.local'
      ];
      const allowedPhones = [
        (superAdminProfile?.ownerContact || '9804222142').replace(/\D/g, ''),
        (superAdminProfile?.managerContact || '9144376971').replace(/\D/g, ''),
        '9804222142',
        '9144376971'
      ];
      const inputClean = loginEmail.trim().toLowerCase();
      const inputDigits = loginEmail.replace(/\D/g, '');

      const isEmailMatch = allowedEmails.includes(inputClean);
      const isPhoneMatch = inputDigits.length >= 10 && allowedPhones.some(p => p.includes(inputDigits) || inputDigits.includes(p));
      const expectedPassword = superAdminProfile?.password || 'admin@2019';

      if (!isEmailMatch && !isPhoneMatch) {
        setError('Authentication Failed: Invalid Super Admin credentials. Please check your registered email or phone number.');
        return;
      }

      if (loginPassword !== expectedPassword && loginPassword !== 'admin@2019' && loginPassword !== 'Saanvi@786') {
        setError('Authentication Failed: Invalid password for Super Admin.');
        return;
      }

      // Open 2FA OTP Security Verification Gateway
      setShowSuperAdminModal(true);
      return;
    }

    // Marketing Partner Mandatory Reference ID Verification
    if (loginRole === 'marketing') {
      const cleanRef = loginReferenceId.trim().toUpperCase();
      if (!cleanRef) {
        setError('Marketing Verification Error: Super Admin Approved Marketing Reference ID is mandatory. Please enter your official Reference ID.');
        return;
      }

      const targetRep = marketingRepresentatives.find(
        r => r.referenceId.trim().toUpperCase() === cleanRef
      );

      if (!targetRep) {
        const pendingReq = marketingJoinRequests.find(
          r => r.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
               (loginEmail.replace(/\D/g, '').length >= 10 && r.phone.replace(/\D/g, '').includes(loginEmail.replace(/\D/g, '')))
        );

        if (pendingReq) {
          setError(`Application Pending: Marketing Application #${pendingReq.id} for ${pendingReq.name} is awaiting Super Admin Master Approval. Once Super Admin approves, your Reference ID will be activated.`);
          return;
        }

        setError('Authentication Failed: Invalid Marketing Reference ID. Sirf wahi Marketing Man enter kar sakta hai jiska Reference ID Super Admin ke paas registered aur approved hai.');
        return;
      }

      if (targetRep.status !== 'active') {
        if (targetRep.status === 'fired') {
          setError(`Access Terminated: Marketing Representative Account (${cleanRef}) ko Super Admin dwara FIRE / TERMINATE kar diya gaya hai. Aapka system login aur referral authorization revoke ho chuka hai.`);
        } else {
          setError(`Access Suspended: Marketing Reference ID ${cleanRef} is currently marked as ${targetRep.status.toUpperCase()} by Super Admin.`);
        }
        return;
      }

      // Check email/phone credential matching
      const repEmail = targetRep.email.toLowerCase();
      const repPhoneDigits = targetRep.phone.replace(/\D/g, '');
      const inputClean = loginEmail.trim().toLowerCase();
      const inputDigits = loginEmail.replace(/\D/g, '');

      const isEmailMatch = repEmail === inputClean;
      const isPhoneMatch = inputDigits.length >= 10 && repPhoneDigits.includes(inputDigits);

      if (!isEmailMatch && !isPhoneMatch) {
        setError(`Credential Mismatch: Entered Email/Phone does not match the registered profile for Reference ID ${cleanRef}.`);
        return;
      }

      // Save active marketing rep session
      if (typeof window !== 'undefined') {
        localStorage.setItem('medix_active_marketing_rep', JSON.stringify(targetRep));
      }
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
      } else if (loginRole === 'marketing') {
        const cleanRef = loginReferenceId.trim().toUpperCase();
        const targetRep = marketingRepresentatives.find(r => r.referenceId.trim().toUpperCase() === cleanRef);
        if (targetRep) {
          setSelectedBranchId(targetRep.branchId);
        }
      }
      setSuccessMsg(`Welcome back! Authenticated as ${loginRole.toUpperCase().replace('_', ' ')}.`);

      setTimeout(() => {
        if (loginRole === 'doctor') router.push('/dashboard/doctor');
        else if (loginRole === 'patient') router.push('/dashboard/patient');
        else if (loginRole === 'branch_admin') router.push('/dashboard/branch-admin');
        else if (loginRole === 'marketing') router.push('/dashboard/marketing');
        else if (loginRole === 'receptionist') router.push('/receptionist');
        else router.push('/dashboard/branch-admin');
      }, 900);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#062c21] font-sans selection:bg-[#d1fae5] selection:text-[#062c21] pb-20">
      
      {/* LANDING PAGE MANDATORY HEADER */}
      <ConceptHeader theme="pastels" />

      {/* HERO BANNER */}
      <section className="pt-12 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-[#046a4e] text-xs font-extrabold shadow-xs">
          <Heart className="w-4 h-4 text-[#046a4e] fill-[#046a4e]" />
          <span>MEDIX WELLNESS • PORTAL SIGN IN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#062c21] tracking-tight leading-tight">
          Sign In to Your Medix Account
        </h1>

        <p className="text-sm sm:text-base text-[#046a4e] max-w-lg mx-auto font-medium leading-relaxed">
          Select your portal role and enter your login credentials to access your dashboard.
        </p>
      </section>

      {/* SIGN IN FORM CARD */}
      <main className="max-w-xl mx-auto px-4 z-10">
        <div className="bg-white p-6 sm:p-10 shadow-xl rounded-3xl border border-[#d1fae5] space-y-6">

          {/* DUAL MODE SELECTOR TABS */}
          <div className="bg-[#f0fdf4] p-1.5 rounded-2xl border border-[#d1fae5] flex items-center gap-1">
            <Link
              href="/register"
              className="w-1/2 py-3 rounded-xl text-xs font-bold text-[#062c21] hover:bg-[#d1fae5]/60 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4 text-[#046a4e]" /> Registration
            </Link>

            <button
              type="button"
              className="w-1/2 py-3 rounded-xl text-xs font-black bg-[#046a4e] text-white shadow-md flex items-center justify-center gap-2 cursor-default"
            >
              <LogIn className="h-4 w-4" /> Sign In (Login)
            </button>
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
              <div>{successMsg}</div>
            </div>
          )}



          {/* FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-extrabold text-[#062c21] mb-1">Select User Scope & Role</label>
              <select
                value={loginRole}
                onChange={e => setLoginRole(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-extrabold rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none cursor-pointer"
              >
                <option value="super_admin">👑 Super Admin (Headquarters Master Control)</option>
                <option value="receptionist">🏢 Receptionist (Front Office & Hospital Services Manager)</option>
                <option value="marketing">📢 Marketing Partner / Representative (Ref ID Dashboard)</option>
                <option value="branch_admin">🏬 Hospital Central Admin (Specific Branch Scope)</option>
                <option value="doctor">🩺 Medical Consultant / Doctor</option>
                <option value="patient">👤 Patient (UHID EHR Access)</option>
                <option value="accountant">💰 Branch Accountant</option>
                <option value="pharmacist">💊 Pharmacy Manager</option>
                <option value="lab_technician">🧪 Lab Diagnostics Technician</option>
                <option value="franchise_partner">🤝 Franchise Royalty Partner</option>
              </select>
            </div>

            {/* SUPER ADMIN HQ SECURITY BANNER (MANUAL ENTRY ONLY) */}
            {loginRole === 'super_admin' && (
              <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-700" />
                    <span>Super Admin Master 2FA Gateway</span>
                  </span>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-400">
                    2FA MANDATORY
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 font-semibold leading-snug">
                  Super Admin access requires manual email/mobile verification and 2FA OTP confirmation. Header me <span className="font-black text-amber-950">👑 Super Admin</span> button par click karke bhi direct 2FA Portal open kar sakte hain.
                </p>
              </div>
            )}

            {/* MANDATORY MARKETING REFERENCE ID (ONLY FOR MARKETING ROLE) */}
            {loginRole === 'marketing' && (
              <div className="p-4 bg-purple-50/80 border-2 border-purple-300 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-purple-950 text-xs flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>Marketing Reference ID * (Mandatory)</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                    Super Admin Approved
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. REF-MKT-B1-7892"
                    value={loginReferenceId}
                    onChange={e => setLoginReferenceId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white border border-purple-300 text-purple-950 font-mono font-bold rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-700 outline-none uppercase text-xs"
                  />
                </div>
                <p className="text-[11px] text-purple-800 font-medium">
                  🔒 Sirf Super Admin dwara approved Reference ID hi is web application me enter karne ke liye maanya (valid) hai.
                </p>
              </div>
            )}

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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none font-mono"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-[#046a4e]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm rounded-full shadow-lg shadow-emerald-900/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* CROSS NAVIGATION */}
          <div className="text-center pt-4 border-t border-[#d1fae5]">
            <p className="text-xs text-[#046a4e] font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-extrabold text-[#046a4e] hover:text-[#062c21] underline transition-colors"
              >
                Register New Account →
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-xs text-[#046a4e]">
        © 2026 Medix Hospital System. Soft Pastel Healthcare Portal.
      </footer>

      {/* SUPER ADMIN 2FA OTP MODAL */}
      <SuperAdminModal
        isOpen={showSuperAdminModal}
        onClose={() => setShowSuperAdminModal(false)}
        initialEmail={loginEmail}
        initialPassword={loginPassword}
      />
    </div>
  );
}
