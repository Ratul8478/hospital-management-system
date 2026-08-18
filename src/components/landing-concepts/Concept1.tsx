"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, Cpu, Stethoscope, ArrowRight, CheckCircle2, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept1() {
  const [activeTab, setActiveTab] = useState<'opd' | 'lab' | 'icu'>('opd');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      {/* Background Cyber Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="cyber" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>CONCEPT 1: CYBERPUNK NEON HEALTH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
              Next-Gen <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">AI Clinical Telemetry</span> Engine
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Empower hospital ecosystems with real-time bio-metric streams, autonomous OPD queuing, and automated PAC imaging diagnostics in an ultra-secure cyber infrastructure.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:scale-105 transition-all flex items-center gap-2"
              >
                Launch Cyber Console <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-bold text-sm hover:bg-cyan-950/40 hover:border-cyan-400 transition-all"
              >
                Explore Modules
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-cyan-400 font-mono">99.98%</div>
                <div className="text-xs text-slate-400 font-medium">Diagnostic Speed</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">0.12ms</div>
                <div className="text-xs text-slate-400 font-medium">EHR Sync Latency</div>
              </div>
              <div>
                <div className="text-2xl font-black text-teal-400 font-mono">256-Bit</div>
                <div className="text-xs text-slate-400 font-medium">Quantum Shield</div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Hologram Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-slate-950/90 border-2 border-cyan-500/50 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-cyan-300">SYSTEM TELEMETRY: LIVE</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">STATUS: OPTIMAL</span>
              </div>

              {/* Console Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('opd')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${activeTab === 'opd' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400'}`}
                >
                  OPD QUEUE
                </button>
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${activeTab === 'lab' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400'}`}
                >
                  LAB MATRIX
                </button>
                <button
                  onClick={() => setActiveTab('icu')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${activeTab === 'icu' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400'}`}
                >
                  ICU TELEMETRY
                </button>
              </div>

              {/* Dynamic Console Content */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
                {activeTab === 'opd' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Doctor: Dr. Sarah Vance (Cardiology)</span>
                      <span className="text-emerald-400">Queue: 4 Waiting</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[78%]" />
                    </div>
                    <div className="text-[11px] text-cyan-400">Next Patient: #MED-9401 - Cardiac Triage</div>
                  </div>
                )}
                {activeTab === 'lab' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>PACS Blood Analysis</span>
                      <span className="text-cyan-400">Completed 0.04s</span>
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-cyan-500/30 text-[11px] text-emerald-300">
                      Zero anomalies detected. Auto-routed to EHR record.
                    </div>
                  </div>
                )}
                {activeTab === 'icu' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>ICU Bed 04 - SpO2 Sync</span>
                      <span className="text-rose-400 animate-pulse">99% Normal</span>
                    </div>
                    <div className="h-8 w-full bg-black/60 rounded border border-slate-800 flex items-center justify-center text-xs text-cyan-400">
                      /\_/\_/\____/\_/\_ Signal Stabilized
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Cyber-Core Hospital <span className="text-cyan-400">Features</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Integrated hospital management system designed for speed, precision, and zero-downtime care delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant OPD & Queue Management</h3>
              <p className="text-sm text-slate-400">Live doctor allocation, automated token numbering, and queue status broadcasts across hospital displays.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI PACs Imaging Diagnostics</h3>
              <p className="text-sm text-slate-400">Automated pathology scanning, instant lab test uploads, and real-time medical report sharing.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-teal-500/30 hover:border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">HIPAA & GDPR Encryption</h3>
              <p className="text-sm text-slate-400">Quantum-ready encryption standards protecting patient health records, pharmacy billing, and lab history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">ABOUT MEDIX SYSTEM</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Transforming Medical Operations Worldwide
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Medix delivers a unified operating system for healthcare institutions. From small clinics to multi-branch regional hospital networks, Medix streamlines doctor scheduling, bed management, pharmacy dispensing, and patient registration into a single unified cloud portal.
            </p>
            <div className="space-y-3 font-mono text-xs text-cyan-300">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-branch EHR synchronization</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated insurance billing & payment collection</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time bed & ICU occupancy matrix</div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-cyan-500/30 text-center space-y-4">
            <Stethoscope className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Ready to Upgrade Your Clinic?</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Join over 450+ medical centers using Medix to optimize patient care and administrative workflows.
            </p>
            <a href="/register" className="inline-block px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors">
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 border-t border-slate-800 bg-slate-950/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <PhoneCall className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">24/7 Medical Support</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <Mail className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Direct Email</div>
              <div className="text-sm font-bold text-white">support@medix-health.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <MapPin className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Global HQ</div>
              <div className="text-sm font-bold text-white">Medical Innovation Hub, NY</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        © 2026 Medix Hospital Management System. Concept 1: Cyberpunk Neon Health. All rights reserved.
      </footer>
    </div>
  );
}
