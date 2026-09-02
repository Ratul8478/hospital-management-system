"use client";

import React, { useState } from 'react';
import { Activity, ShieldCheck, Cpu, ArrowRight, Terminal, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept4() {
  const [consoleMode, setConsoleMode] = useState<'icu' | 'opd' | 'pharmacy'>('icu');

  return (
    <div className="min-h-screen bg-[#060d16] text-teal-100 font-mono selection:bg-teal-500 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-12 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-teal-900/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-950 border border-teal-500/40 text-teal-400 text-xs font-bold uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>CONCEPT 4: BIO-TELEMETRY DARK CONSOLE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
              High-Density <span className="text-teal-400">Bio-Telemetry</span> Command Matrix
            </h1>

            <p className="text-base text-slate-300 font-sans leading-relaxed max-w-xl">
              Engineered for ICU command centers, high-volume OPD clinics, and regional hospital operations demanding real-time data streaming.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-3.5 rounded bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                Access Terminal <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-3.5 rounded bg-slate-900 border border-teal-900 text-teal-300 font-bold text-xs hover:bg-slate-800 transition-colors uppercase"
              >
                View Console Spec
              </a>
            </div>
          </div>

          {/* Tactical Console Mockup */}
          <div className="lg:col-span-5 p-5 rounded-lg bg-black border border-teal-500/30 space-y-4 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
            <div className="flex justify-between items-center border-b border-teal-900 pb-2 text-xs">
              <span className="text-teal-400">CONSOLE ID: #MEDIX-NODE-01</span>
              <span className="text-emerald-400 animate-pulse">LIVE TELEMETRY</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setConsoleMode('icu')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${consoleMode === 'icu' ? 'bg-teal-500 text-black' : 'bg-slate-900 text-teal-400 border border-teal-900'}`}
              >
                ICU Matrix
              </button>
              <button
                onClick={() => setConsoleMode('opd')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${consoleMode === 'opd' ? 'bg-teal-500 text-black' : 'bg-slate-900 text-teal-400 border border-teal-900'}`}
              >
                OPD Telemetry
              </button>
              <button
                onClick={() => setConsoleMode('pharmacy')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${consoleMode === 'pharmacy' ? 'bg-teal-500 text-black' : 'bg-slate-900 text-teal-400 border border-teal-900'}`}
              >
                Pharmacy Sync
              </button>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-teal-900/60 text-xs space-y-2 text-slate-300">
              {consoleMode === 'icu' && (
                <>
                  <div className="flex justify-between">
                    <span>Bed 01: SpO2 99% | Pulse 74bpm</span>
                    <span className="text-emerald-400">STABLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed 02: SpO2 97% | Pulse 82bpm</span>
                    <span className="text-emerald-400">STABLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed 03: SpO2 95% | Pulse 91bpm</span>
                    <span className="text-amber-400">MONITOR</span>
                  </div>
                </>
              )}
              {consoleMode === 'opd' && (
                <>
                  <div className="text-teal-400">Dr. Williams - Cardiology Dept</div>
                  <div>Active Tokens: 12 Processed | 3 Waiting</div>
                  <div className="text-xs text-slate-400">Estimated wait: 4.2 mins / patient</div>
                </>
              )}
              {consoleMode === 'pharmacy' && (
                <>
                  <div className="text-emerald-400">Dispensary Node Online</div>
                  <div>Inventory Alert: Amoxicillin 500mg (Normal Stock)</div>
                  <div>Processed Orders Today: 184 Prescriptions</div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 border-b border-teal-900/40 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Console Modules</h2>
            <p className="text-slate-400 text-xs">High throughput data management designed for hospital operators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="p-6 rounded bg-slate-900/80 border border-teal-900 space-y-3">
              <Activity className="w-8 h-8 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Continuous Vital Streaming</h3>
              <p className="text-xs text-slate-400">Real-time sync between bed monitors, patient wearable devices, and central nursing station.</p>
            </div>

            <div className="p-6 rounded bg-slate-900/80 border border-teal-900 space-y-3">
              <Cpu className="w-8 h-8 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Automated Triage Algorithm</h3>
              <p className="text-xs text-slate-400">Prioritizes emergency room check-ins based on severity telemetry and vital signs.</p>
            </div>

            <div className="p-6 rounded bg-slate-900/80 border border-teal-900 space-y-3">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Secure Operational Vault</h3>
              <p className="text-xs text-slate-400">Encrypted audit logs for every prescription dispensed, admission order, and lab test request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-teal-400 tracking-widest uppercase">ABOUT MEDIX CONSOLE</span>
          <h2 className="text-3xl font-black text-white">Precision Command Architecture</h2>
          <p className="text-slate-300 text-sm font-sans leading-relaxed">
            Medix Telemetry Console replaces slow legacy EHR systems with an ultra-responsive operational grid. Built specifically for high-capacity hospital departments.
          </p>
        </div>

        <div className="p-8 rounded bg-teal-950/60 border border-teal-500/30 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-teal-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Deploy Medix Bio-Console</h3>
          <a href="/register" className="inline-block px-6 py-2.5 rounded bg-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
            Register Hospital Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-teal-900/40 bg-black/60 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-teal-900">
            <PhoneCall className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Direct Hotline</div>
              <div className="text-sm font-bold text-white">+91 91443 76971</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-teal-900">
            <Mail className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Ops Email</div>
              <div className="text-sm font-bold text-white">telemetry@medix-console.io</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-teal-900">
            <MapPin className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Base HQ</div>
              <div className="text-sm font-bold text-white">Boston Medical District, MA</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-teal-900/40 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 4: Bio-Telemetry Dark Console.
      </footer>
    </div>
  );
}
