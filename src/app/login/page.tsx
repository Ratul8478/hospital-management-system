"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  LogIn,
  Heart,
  UserPlus,
  Crown,
  RefreshCw,
  Send
} from 'lucide-react';
import { detectSuspiciousPayload } from '@/lib/security';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';
import SuperAdminModal from '@/components/SuperAdminModal';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [loginRole, setLoginRole] = useState<'branch_admin' | 'receptionist' | 'marketing' | 'doctor' | 'patient' | 'accountant' | 'pharmacist' | 'lab_technician' | 'franchise_partner'>('branch_admin');
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Handle direct verification link query params (?verifyToken=...&email=...) with AbortController
  useEffect(() => {
    const verifyToken = searchParams.get('verifyToken');
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setLoginEmail(emailParam);
    }

    if (verifyToken) {
      const controller = new AbortController();
      setIsLoading(true);
      fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verifyToken, email: emailParam || undefined }),
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          setIsLoading(false);
          if (data.success) {
            setSuccessMsg(data.data?.message || 'Email verified successfully! You can now sign in.');
            setError('');
          } else {
            setError(data.error?.message || 'Verification token invalid or expired.');
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          setIsLoading(false);
          setError('Failed to verify token. Please check your network connection.');
        });

      return () => controller.abort();
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!unverifiedEmail || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await res.json();
      setIsResending(false);
      if (data.success) {
        setSuccessMsg(data.data?.message || `A new verification link has been sent to ${unverifiedEmail}.`);
      } else {
        setError(data.error?.message || 'Failed to resend verification email.');
      }
    } catch {
      setIsResending(false);
      setError('Network error while resending verification email.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setSuccessMsg('');
    setUnverifiedEmail(null);

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

    // Block Super Admin from standard form and guide to use dedicated Super Admin button
    if (
      loginEmail.trim().toLowerCase() === 'ariyanhospital9@gmail.com' ||
      loginEmail.trim().toLowerCase() === 'varshahealth01@gmail.com' ||
      loginEmail.trim().toLowerCase() === (superAdminProfile?.email || '').toLowerCase()
    ) {
      setError('Super Administrator cannot sign in through the standard login form. Please use the dedicated "👑 Super Admin Login" button below.');
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
          setError(`Application Pending: Marketing Application #${pendingReq.id} for ${pendingReq.name} is awaiting Super Admin Master Approval.`);
          return;
        }

        setError('Authentication Failed: Invalid Marketing Reference ID.');
        return;
      }

      if (targetRep.status !== 'active') {
        setError(`Access Suspended: Marketing Reference ID ${cleanRef} is currently ${targetRep.status.toUpperCase()}.`);
        return;
      }
    }

    // Real-Time Server-Side Authentication via API
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          role: loginRole,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        if (res.status === 403 && data.error?.details?.requiresVerification) {
          setUnverifiedEmail(data.error.details.email || loginEmail);
          setError(data.error.message || 'Your email address is unverified. Please check your inbox and verify your email.');
          return;
        }
        setError(data.error?.message || 'Authentication failed. Please check your credentials.');
        return;
      }

      const authData = data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('medix_auth_token', authData.token);
        if (authData.refreshToken) {
          localStorage.setItem('medix_refresh_token', authData.refreshToken);
        }
      }

      setUserRole(loginRole as any);

      if (authData.user?.branchId) {
        setSelectedBranchId(authData.user.branchId);
      }

      setSuccessMsg(`Welcome back, ${authData.user?.name || loginRole}! Authenticated.`);

      setTimeout(() => {
        if (loginRole === 'doctor') router.push('/dashboard/doctor');
        else if (loginRole === 'patient') router.push(`/dashboard/patient?uhid=${encodeURIComponent(authData.user?.details?.uhid || '')}`);
        else if (loginRole === 'branch_admin') router.push('/dashboard/branch-admin');
        else if (loginRole === 'marketing') router.push('/dashboard/marketing');
        else if (loginRole === 'receptionist') router.push('/receptionist');
        else router.push('/dashboard/branch-admin');
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setError('Network connection error while communicating with Authentication Gateway.');
    }
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
          Select your portal role and enter your verified login credentials to access your healthcare workspace.
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
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              {unverifiedEmail && (
                <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                  <span className="text-[11px] text-rose-700">Didn&apos;t receive verification email?</span>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 text-white rounded-lg text-[11px] font-black hover:bg-rose-800 cursor-pointer transition-all"
                  >
                    {isResending ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    <span>Resend Link</span>
                  </button>
                </div>
              )}
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
                <option value="branch_admin">🏬 Hospital Central Admin (Specific Hospital Dashboard)</option>
                <option value="receptionist">🏢 Receptionist (Front Office & Hospital Services Manager)</option>
                <option value="marketing">📢 Marketing Partner / Representative (Ref ID Dashboard)</option>
                <option value="doctor">🩺 Medical Consultant / Doctor</option>
                <option value="patient">👤 Patient (UHID EHR Access)</option>
                <option value="accountant">💰 Branch Accountant</option>
                <option value="pharmacist">💊 Pharmacy Manager</option>
                <option value="lab_technician">🧪 Lab Diagnostics Technician</option>
                <option value="franchise_partner">🤝 Franchise Royalty Partner</option>
              </select>
            </div>

            {/* MARKETING MAN SPECIFIC REFERENCE ID */}
            {loginRole === 'marketing' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-purple-950">
                    Approved Marketing Reference ID <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                    Mandatory
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
              </div>
            )}

            <div>
              <label className="block font-extrabold text-[#062c21] mb-1">Email / Mobile Number</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#046a4e]" />
                <input
                  type="text"
                  required
                  placeholder="name@medix.com or +91 98042 22142"
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
              className="w-full py-4 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm rounded-full shadow-lg shadow-emerald-900/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
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

          {/* DEDICATED SUPER ADMIN SECURE 2FA ACCESS */}
          <div className="pt-2 border-t border-[#d1fae5]">
            <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <Crown className="w-4 h-4 text-amber-700" />
                  <span>Super Admin Master Access</span>
                </div>
                <p className="text-[11px] text-amber-900 font-medium">
                  Headquarters master control requires 2-Factor OTP verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuperAdminModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 shrink-0"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin Login</span>
              </button>
            </div>
          </div>

          {/* CROSS NAVIGATION */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#046a4e] font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-extrabold text-[#046a4e] hover:text-[#062c21] underline transition-colors"
              >
                Register New Hospital / Account →
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center text-[#046a4e] font-bold">Loading Medix Authentication Gateway...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
