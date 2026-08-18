"use client";

import React from 'react';
import { Sparkles, ShieldCheck, HeartPulse, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept14() {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Animated Aurora Light Waves */}
      <div className="absolute -top-40 -left-40 w-[45rem] h-[45rem] bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-cyan-400/30 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-[40rem] h-[40rem] bg-gradient-to-bl from-teal-500/20 via-emerald-400/20 to-cyan-500/20 rounded-full blur-[160px] pointer-events-none" />

      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>CONCEPT 14: RADIANT AURORA GLOW</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
              Radiant Aurora <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">HealthTech Platform</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Illuminating healthcare operations with fluid light design, instant OPD scheduling, real-time bed telemetry, and seamless pharmacy billing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center gap-2"
              >
                Experience Aurora <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-950/40 transition-all"
              >
                Explore Modules
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)] space-y-6">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-lg">Aurora Patient Stream</h3>
                <p className="text-xs text-emerald-300">Continuous Health Metrics</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dynamic ambient light indicators display bed allocation statuses, waiting room queues, and doctor availability in real-time.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-emerald-900/30 bg-black/50 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Aurora Core Features</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Seamless light-guided hospital navigation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-400 transition-all space-y-4 shadow-xl">
              <HeartPulse className="w-10 h-10 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Live OPD Telemetry</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Ambient queue progress tracking for outpatients with automated SMS alerts.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-teal-500/30 hover:border-teal-400 transition-all space-y-4 shadow-xl">
              <Stethoscope className="w-10 h-10 text-teal-400" />
              <h3 className="text-xl font-bold text-white">Doctor Consultation Hub</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Instant medical history retrieval and e-prescription generation.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-4 shadow-xl">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Encrypted Cloud EHR</h3>
              <p className="text-sm text-slate-300 leading-relaxed">HIPAA compliant security protecting patient profiles and lab tests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ABOUT AURORA MEDIX</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Illuminating Modern Healthcare</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix Aurora Edition brings vibrant, fluid visual lighting to complex healthcare administrative systems.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-6">
          <Stethoscope className="w-12 h-12 text-teal-300 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Join 400+ Radiant Clinics</h3>
          <a href="/register" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            Register Hospital Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-emerald-900/30 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-emerald-900">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Aurora Desk</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-emerald-900">
            <Mail className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Aurora Email</div>
              <div className="text-sm font-bold text-white">aurora@medix-glow.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-emerald-900">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Global HQ</div>
              <div className="text-sm font-bold text-white">Reykjavik & Vancouver</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-emerald-900/30 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 14: Radiant Aurora Glow.
      </footer>
    </div>
  );
}
