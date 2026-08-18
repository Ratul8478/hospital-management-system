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
  KeyRound,
  Heart,
  UserPlus
} from 'lucide-react';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole, setSelectedBranchId, branches } = useApp();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'super_admin' | 'branch_admin' | 'doctor' | 'patient' | 'accountant' | 'pharmacist' | 'lab_technician' | 'franchise_partner'>('super_admin');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fillDemo = (role: typeof loginRole, emailStr: string) => {
    setLoginRole(role);
    setLoginEmail(emailStr);
    setLoginPassword('Medix#2026Secure');
  };

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

          {/* DEMO QUICK PRESET */}
          <div className="p-4 bg-[#f0fdf4] rounded-2xl border border-[#d1fae5] space-y-2 text-xs">
            <p className="text-[11px] font-extrabold text-[#062c21] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-[#046a4e]" /> Demo Quick Login Presets:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => fillDemo('super_admin', 'admin.main@medix.com')} className="px-3 py-1.5 bg-[#046a4e] text-white rounded-full text-[11px] font-bold shadow-xs hover:bg-[#03523c] cursor-pointer">👑 Super Admin</button>
              <button type="button" onClick={() => fillDemo('branch_admin', 'admin.south@medix.com')} className="px-3 py-1.5 bg-[#046a4e] text-white rounded-full text-[11px] font-bold shadow-xs hover:bg-[#03523c] cursor-pointer">🏬 Branch Central Admin</button>
              <button type="button" onClick={() => fillDemo('doctor', 'dr.hayes@medix.com')} className="px-3 py-1.5 bg-[#046a4e] text-white rounded-full text-[11px] font-bold shadow-xs hover:bg-[#03523c] cursor-pointer">🩺 Doctor</button>
              <button type="button" onClick={() => fillDemo('patient', 'james.wilson@patient.com')} className="px-3 py-1.5 bg-[#046a4e] text-white rounded-full text-[11px] font-bold shadow-xs hover:bg-[#03523c] cursor-pointer">👤 Patient</button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-extrabold text-[#062c21] mb-1">Select User Scope & Role</label>
              <select
                value={loginRole}
                onChange={e => setLoginRole(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-extrabold rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none cursor-pointer"
              >
                <option value="super_admin">👑 Super Admin (All 9 Branches Control)</option>
                <option value="branch_admin">🏬 Branch Central Admin (Specific Branch Scope)</option>
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
    </div>
  );
}
