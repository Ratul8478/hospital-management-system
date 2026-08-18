"use client";

import React, { useState } from 'react';
import { UserCheck, User, ArrowRight, ShieldCheck, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept12() {
  const [focus, setFocus] = useState<'doctor' | 'patient'>('doctor');

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION WITH DUAL SPLIT SCREEN INTERACTION */}
      <section className="pt-12 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-800">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <span>CONCEPT 12: DUAL FOCUS SPLIT SCREEN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Two Perspectives. <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">One Unified Platform.</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Switch views below to experience Medix tailored for Medical Specialists or Patients.
          </p>

          {/* Perspective Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 gap-2">
            <button
              onClick={() => setFocus('doctor')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${focus === 'doctor' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              <UserCheck className="w-4 h-4" /> Doctor Care View
            </button>
            <button
              onClick={() => setFocus('patient')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${focus === 'patient' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Patient Portal View
            </button>
          </div>
        </div>

        {/* DUAL SPLIT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doctor View Panel */}
          <div className={`p-8 rounded-3xl border transition-all ${focus === 'doctor' ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase">DOCTOR CLINICAL HUB</span>
              <Stethoscope className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">OPD Consultation & EHR Desk</h2>
            <p className="text-xs text-slate-300 mb-6">Automated patient queue management, e-prescriptions, and lab history access.</p>
            <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors">
              Sign In as Doctor <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Patient View Panel */}
          <div className={`p-8 rounded-3xl border transition-all ${focus === 'patient' ? 'bg-blue-950/40 border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase">PATIENT HEALTH PORTAL</span>
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Self Check-in & Appointments</h2>
            <p className="text-xs text-slate-300 mb-6">Instant doctor booking, digital lab report downloads, and online medicine orders.</p>
            <a href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors">
              Register as Patient <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Dual Interface Features</h2>
            <p className="text-slate-400 text-sm">Perfect sync between medical providers and patients.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-emerald-500 transition-all">
              <Stethoscope className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Doctor Queue Console</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Streamlined OPD queueing with instant digital prescription writing.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-blue-500 transition-all">
              <User className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Patient Mobile Wallet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Patients receive instant prescription PDFs and appointment reminders.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500 transition-all">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
              <h3 className="text-xl font-bold text-white">Encrypted Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Real-time bi-directional data flow with zero information loss.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ABOUT MEDIX DUAL</span>
          <h2 className="text-3xl font-black text-white">Connecting Care Teams & Patients</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix Dual Focus bridges the communication gap between healthcare providers and patients through aligned real-time portals.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Join Medix Dual Platform</h3>
          <a href="/register" className="inline-block px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
            Register Account Now
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-slate-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Dual Desk</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <Mail className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Dual Email</div>
              <div className="text-sm font-bold text-white">support@medix-dual.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <MapPin className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">HQ Center</div>
              <div className="text-sm font-bold text-white">New York & Toronto</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 12: Dual Focus Split Screen.
      </footer>
    </div>
  );
}
