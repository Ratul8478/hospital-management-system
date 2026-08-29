"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  Share2,
  Users,
  DollarSign,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Send,
  FileCheck,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  CreditCard,
  HeartHandshake,
  Award,
  AlertCircle
} from 'lucide-react';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';

export default function MarketingRepresentativeDashboard() {
  const {
    marketingRepresentatives,
    branches,
    referPatientWithMarketingCode,
    addPatient
  } = useApp();

  // Selected Marketing Representative (Default to logged-in representative or first active representative)
  const [selectedRepId, setSelectedRepId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medix_active_marketing_rep');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) return parsed.id;
        } catch (e) {}
      }
    }
    return (marketingRepresentatives && marketingRepresentatives[0]?.id) || 1;
  });

  const currentRep = (marketingRepresentatives || []).find(r => r.id === selectedRepId) || (marketingRepresentatives && marketingRepresentatives[0]) || {
    id: 1,
    name: 'Marketing Partner',
    referenceId: 'MKT-ARIYAN-DEMO',
    branchId: 1,
    branchName: 'ARIYAN HOSPITAL HQ',
    branchCode: 'ARIYAN-HQ',
    referredPatientsCount: 0,
    totalCommissionEarned: 0,
    pendingPayout: 0,
    territory: 'Central Region',
    status: 'active' as const,
    approvedDate: '2026-08-01',
    phone: '+91 98000 00000',
    email: 'marketing@ariyanhospital.com',
  };

  // Referral Link Generator State
  const [copiedLink, setCopiedLink] = useState(false);
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register?role=patient&ref=${currentRep?.referenceId}`
    : `http://localhost:3001/register?role=patient&ref=${currentRep?.referenceId}`;

  // Direct Patient Referral Form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientCondition, setPatientCondition] = useState('Cardiology & General Health Check');
  const [consultFee, setConsultFee] = useState('1000');
  const [referralSuccess, setReferralSuccess] = useState(false);
  const [referralFeedback, setReferralFeedback] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDirectPatientReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !currentRep) return;

    const feeNum = parseFloat(consultFee) || 1000;
    const newUhid = `UHID-B${currentRep.branchId}-MKT-${Math.floor(1000 + Math.random() * 9000)}`;

    // Add patient record
    addPatient({
      branchId: currentRep.branchId,
      uhid: newUhid,
      name: patientName,
      age: 42,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: patientPhone || '+91 98200 12345',
      condition: patientCondition,
      status: 'opd',
    });

    // Credit marketing rep
    referPatientWithMarketingCode(currentRep.referenceId, patientName, feeNum);

    const commissionEarned = Math.round(feeNum * 0.10);
    setReferralSuccess(true);
    setReferralFeedback(`✓ Patient ${patientName} (${newUhid}) successfully registered under Reference ID ${currentRep.referenceId}! ₹${commissionEarned} (10%) has been credited to your commission balance.`);

    setPatientName('');
    setPatientPhone('');

    setTimeout(() => {
      setReferralSuccess(false);
      setReferralFeedback('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#062c21] font-sans selection:bg-purple-200 selection:text-purple-950 pb-20">
      
      {/* GLOBAL HEADER */}
      <ConceptHeader theme="pastels" />

      {/* DASHBOARD HERO BANNER */}
      <div className="pt-8 pb-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-4">
        
        {/* Top bar with Representative Switcher & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black shadow-md">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
                  OFFICIAL MARKETING PORTAL
                </span>
                {currentRep?.status === 'fired' ? (
                  <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                    🔥 ACCOUNT TERMINATED / FIRED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Partner ✓
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {currentRep?.name || 'Marketing Partner Portal'}
              </h1>
              <p className="text-xs text-purple-800 font-mono font-bold">
                Reference ID: <span className="bg-purple-100 px-2 py-0.5 rounded-md text-purple-950">{currentRep?.referenceId || 'REF-MKT-PENDING'}</span> • {currentRep?.branchName || branches[0]?.name || 'ARIYAN HOSPITAL MULTISPECIALITY'}
              </p>
            </div>
          </div>

          {/* Switch Representative Account (Demo) */}
          <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-2xl border border-purple-200">
            <span className="text-xs font-bold text-purple-950 pl-2">Switch Rep:</span>
            <select
              value={selectedRepId}
              onChange={e => setSelectedRepId(Number(e.target.value))}
              disabled={marketingRepresentatives.length === 0}
              className="bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-xs font-bold text-purple-950 outline-none cursor-pointer"
            >
              {marketingRepresentatives.length === 0 ? (
                <option value={1}>No Representatives Registered</option>
              ) : (
                marketingRepresentatives.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.referenceId}) — {rep.branchCode}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* TERMINATED STATUS BANNER */}
        {currentRep?.status === 'fired' && (
          <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-sm flex items-start gap-3.5 text-rose-900 text-xs">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-sm text-rose-950">REPRESENTATIVE ACCOUNT TERMINATED / FIRED</h4>
              <p className="font-medium leading-relaxed text-rose-800">
                This marketing representative account has been formally terminated by Central Super Admin Executive Command. Your unique Reference ID (<strong>{currentRep?.referenceId}</strong>) has been deactivated. Direct patient referral submissions and commission payout withdrawals are frozen.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATS OVERVIEW CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-800 font-black uppercase">
              <span>Referred Patients</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{currentRep?.referredPatientsCount || 0}</p>
            <span className="text-[11px] text-emerald-700 font-bold">Verified OPD & IPD Registrations</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-black uppercase">
              <span>Total Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-700">₹ {(currentRep?.totalCommissionEarned || 0).toLocaleString()}</p>
            <span className="text-[11px] text-slate-500 font-medium">10% Standard Commission</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-800 font-black uppercase">
              <span>Pending Payout</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-700">₹ {(currentRep?.pendingPayout || 0).toLocaleString()}</p>
            <span className="text-[11px] text-amber-800 font-bold">Settled weekly via NEFT/UPI</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-800 font-black uppercase">
              <span>Covered Territory</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm font-black text-slate-900 line-clamp-1">{currentRep?.territory || 'Hospital Network'}</p>
            <span className="text-[11px] text-purple-700 font-bold">{currentRep?.approvedDate ? `Approved: ${currentRep.approvedDate}` : 'Official Network'}</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN WORKSPACE GRID: ID CARD & PATIENT REFERRAL FORM */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 5 COLS: OFFICIAL DIGITAL SMART MARKETING ID CARD */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 3D Smart Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white shadow-2xl border border-purple-500/40 relative overflow-hidden space-y-5">
              
              {/* Background ambient glow */}
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-sm shadow">
                    M+
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-wider uppercase">MEDIX HEALTHCARE NETWORK</h3>
                    <p className="text-[9px] text-purple-300 font-mono">FIELD MARKETING IDENTITY PASS</p>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                  OFFICIAL
                </span>
              </div>

              {/* Rep Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-purple-300 uppercase tracking-widest block">Representative Name</span>
                  <p className="text-xl font-black text-white">{currentRep?.name}</p>
                  <p className="text-xs text-purple-200">{currentRep?.email} • {currentRep?.phone}</p>
                </div>

                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-amber-300 uppercase font-black block">Generated Reference ID</span>
                    <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                      {currentRep?.referenceId}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-purple-300 block">Assigned Hospital</span>
                    <span className="font-bold text-white truncate block">{currentRep?.branchName}</span>
                  </div>
                  <div>
                    <span className="text-purple-300 block">Hospital Code</span>
                    <span className="font-mono font-bold text-emerald-300">{currentRep?.branchCode}</span>
                  </div>
                </div>
              </div>

              {/* KYC Verification Badges */}
              <div className="pt-3 border-t border-purple-500/30 flex items-center justify-between text-[10px] font-bold text-emerald-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Aadhar Verified
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PAN Verified
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> DL Verified
                </span>
              </div>
            </div>

            {/* Shareable Referral Link Box */}
            <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span>Your Referral Link</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  10% Commission
                </span>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-2xl border border-purple-200">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="w-full bg-transparent text-purple-950 font-mono text-xs font-medium outline-none truncate px-2"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Share this link with patients, doctors, or corporate wellness organizers. When patients register using your link, your Reference ID is automatically attached.
              </p>
            </div>

          </div>

          {/* RIGHT 7 COLS: DIRECT PATIENT REFERRAL ONBOARDING FORM */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-700" />
                    <span>Instant Patient Referral Onboarding</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Directly register a new patient under your Reference Code ({currentRep?.referenceId}) and instantly claim commission.
                  </p>
                </div>
              </div>

              {referralFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{referralFeedback}</span>
                </div>
              )}

              <form onSubmit={handleDirectPatientReferral} className="space-y-4 text-xs font-medium">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 text-slate-900 font-bold rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1">Patient Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 88990"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 text-slate-900 font-bold rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1">Treatment / Checkup Category *</label>
                    <select
                      value={patientCondition}
                      onChange={e => setPatientCondition(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 text-slate-900 font-bold rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Cardiology & Heart Health Consultation">Cardiology & Heart Health Consultation</option>
                      <option value="Orthopedic & Joint Pain Assessment">Orthopedic & Joint Pain Assessment</option>
                      <option value="Neurology & Spine Specialized Care">Neurology & Spine Specialized Care</option>
                      <option value="Pediatrics & Child Wellness">Pediatrics & Child Wellness</option>
                      <option value="Comprehensive Executive Health Checkup">Comprehensive Executive Health Checkup</option>
                      <option value="Diagnostic CT/MRI & Pathology Package">Diagnostic CT/MRI & Pathology Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1">Consultation / Package Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="1000"
                      value={consultFee}
                      onChange={e => setConsultFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 text-slate-900 font-bold rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Auto Calculated Commission Preview */}
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-700 font-black uppercase tracking-wider block">Your 10% Commission Payout</span>
                    <span className="text-base font-black text-purple-950 font-mono">
                      ₹ {Math.round((parseFloat(consultFee) || 1000) * 0.10)} INR
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                    Instant Credit to Wallet ✓
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={currentRep?.status === 'fired'}
                  className={`w-full py-3.5 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    currentRep?.status === 'fired'
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-700 hover:bg-purple-800 text-white cursor-pointer hover:scale-[1.01]'
                  }`}
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>
                    {currentRep?.status === 'fired'
                      ? 'Action Disabled: Account Terminated by Super Admin'
                      : 'Submit Patient Referral & Issue Universal Health ID'}
                  </span>
                </button>

              </form>
            </div>

            {/* Terms and Guidelines */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Medix Marketing Partner Charter & Settlement Policy</span>
              </h4>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Referral commissions are calculated on real-time OPD and diagnostic invoices.</li>
                <li>Payouts are processed automatically every Tuesday to the bank account registered during KYC.</li>
                <li>For support or special corporate tie-up rates, contact your assigned Branch Administrator.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
