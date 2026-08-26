import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, CheckCircle2, UserCheck, ArrowLeft, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
              <p className="text-sm text-slate-400">Medix Hospital Management System &amp; Doctor Android Application</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-2">
            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Effective Date: January 1, 2026</span>
            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Last Updated: August 2026</span>
            <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">Google Play Compliant</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          
          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" /> 1. Overview &amp; Scope
            </h2>
            <p>
              This Privacy Policy applies to the <strong>Medix Doctor Application</strong> (&ldquo;App&rdquo;), the <strong>Medix Hospital Management System</strong>, and associated healthcare services operated by <strong>Ariyan Hospital Multispeciality</strong> and connected partner health centers.
            </p>
            <p>
              We are committed to protecting the privacy, confidentiality, and security of registered healthcare professionals (doctors, clinical staff, administrators) and patient electronic health records (EHR) in compliance with applicable healthcare data protection standards including HIPAA, NABH, and IT Act data protection rules.
            </p>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> 2. Information We Collect
            </h2>
            <p>To provide clinical practice management and inter-hospital referral services, the Application collects and processes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Practitioner Information:</strong> Doctor Name, Medical Council Registration ID, Qualifications, Department/Specialty, Contact Phone, and Official Email.</li>
              <li><strong>Clinical Workflow Data:</strong> OPD Consultation queues, Electronic Prescriptions (Rx), Inpatient (IPD) ward rounds, and Inter-hospital patient referrals.</li>
              <li><strong>Device &amp; Network Data:</strong> IP address, device model, Android OS version, and Firebase Cloud Messaging (FCM) tokens strictly for urgent clinical alert notifications.</li>
            </ul>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> 3. App Permissions &amp; Justification
            </h2>
            <p>The Android Application requests only minimum necessary system permissions:</p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
                <strong className="text-white block">INTERNET &amp; ACCESS_NETWORK_STATE</strong>
                <span className="text-xs text-slate-400">Required to securely communicate with the encrypted Medix Central Hospital REST API over HTTPS/TLS 1.3.</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
                <strong className="text-white block">POST_NOTIFICATIONS (Android 13+)</strong>
                <span className="text-xs text-slate-400">Used strictly to send real-time clinical notifications: emergency patient referrals, critical lab biomarker alerts, and OPD token calls.</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 sm:col-span-2">
                <strong className="text-white block">USE_BIOMETRIC</strong>
                <span className="text-xs text-slate-400">Optional hardware biometric fingerprint / Face Unlock for fast and secure practitioner authentication without exposing plain-text credentials.</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" /> 4. Data Security &amp; Storage
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Encryption in Transit:</strong> All communications between the app and hospital servers are encrypted using 256-bit TLS 1.3 encryption.</li>
              <li><strong>Zero Ad Tracking &amp; No Third-Party Sales:</strong> We do NOT sell, rent, or monetize patient or doctor data to advertisers, data brokers, or commercial third parties.</li>
              <li><strong>Role-Based Access:</strong> Access to patient records is strictly restricted to verified attending physicians and authorized hospital department personnel.</li>
            </ul>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" /> 5. Data Deletion &amp; Contact
            </h2>
            <p>
              Registered doctors and institutions can request data exports, credential revocation, or full account and data deletion by contacting our Clinical Data Privacy Officer:
            </p>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 text-xs space-y-1">
              <p><strong className="text-white">Hospital Administration Desk:</strong> ARIYAN HOSPITAL MULTISPECIALITY</p>
              <p><strong className="text-white">Email:</strong> privacy@medix.hospital / support@medix.hospital</p>
              <p><strong className="text-white">Emergency Reception Hotline:</strong> +91 91443 76971</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
