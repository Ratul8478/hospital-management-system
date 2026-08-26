import React from 'react';
import Link from 'next/link';
import { FileCheck, ShieldAlert, Scale, AlertTriangle, ArrowLeft, Building2 } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Hospital Portal
        </Link>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Terms &amp; Conditions</h1>
              <p className="text-sm text-slate-400">Medix Hospital Management System &amp; Doctor Application</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-2">
            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Effective Date: January 1, 2026</span>
            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Version 2.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          
          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-400" /> 1. Professional Medical Practitioner Agreement
            </h2>
            <p>
              By accessing or using the Medix Doctor Application (&ldquo;Service&rdquo;), registered physicians confirm that they are licensed medical practitioners in good standing with the applicable State Medical Council / National Medical Commission (NMC).
            </p>
            <p>
              The platform serves as an Electronic Health Record (EHR) companion, clinical queue manager, prescription generator, and inter-hospital referral system. All medical diagnosis and treatment decisions remain the independent professional clinical judgment of the attending physician.
            </p>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" /> 2. Inter-Hospital Referrals &amp; Commission Terms
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Referral Dispatch:</strong> Inter-hospital patient referrals dispatched via the platform must be clinically justified for higher-level specialty care, ICU admission, or diagnostic intervention.</li>
              <li><strong>Commission &amp; Wallet Settlements:</strong> Authorized referral incentives (e.g., 15% hospital bill commission, T&amp;C apply) are settled according to institutional hospital agreements directly into verified bank accounts of registered medical consultants.</li>
              <li><strong>Dispute Resolution:</strong> Hospital admission verification is subject to physical patient check-in at the destination hospital reception desk.</li>
            </ul>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> 3. Emergency Medical Disclaimer
            </h2>
            <p>
              In life-threatening medical emergencies (e.g. cardiac arrest, acute severe trauma), clinical staff must follow standard hospital emergency protocols and immediate triage. The app acts as an auxiliary record system and should not delay life-saving emergency care.
            </p>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> 4. Data Confidentiality &amp; Security
            </h2>
            <p>
              Users agree to maintain strict confidentiality of their biometric credentials and session tokens. Any unauthorized attempt to tamper with EHR records, patient diagnoses, or hospital billing records will result in immediate termination of access and reporting to appropriate hospital authorities.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
