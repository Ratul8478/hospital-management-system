"use client";

import React, { useState } from 'react';
import { Radio, ShieldCheck, Activity, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept13() {
  const [activeBed, setActiveBed] = useState<'icu' | 'opd' | 'emer'>('icu');

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 font-mono selection:bg-emerald-500 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-12 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>CONCEPT 13: TACTICAL HOSPITAL COMMAND CENTER</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-sans">
              Tactical Real-Time <span className="text-emerald-400">Occupancy & ICU</span> Radar
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-xl">
              High-density emergency hospital command center dashboard tracking bed availability, patient triage codes, and surgical room scheduling.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-3.5 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                Access Radar Console <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-3.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors uppercase"
              >
                View Command Spec
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-xs">
              <span className="text-emerald-400 font-bold">RADAR FREQUENCY: 142.8 MHz</span>
              <span className="text-amber-400">BED MATRIX: ACTIVE</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveBed('icu')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${activeBed === 'icu' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
              >
                ICU (18/20 Beds)
              </button>
              <button
                onClick={() => setActiveBed('opd')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${activeBed === 'opd' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
              >
                OPD (4 Wards)
              </button>
              <button
                onClick={() => setActiveBed('emer')}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${activeBed === 'emer' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
              >
                ER Triage
              </button>
            </div>

            <div className="p-4 rounded bg-black border border-slate-800 text-xs space-y-2 text-slate-300">
              {activeBed === 'icu' && (
                <>
                  <div className="flex justify-between">
                    <span>ICU Bed 01-A</span>
                    <span className="text-emerald-400">Occupied (SpO2 98%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICU Bed 02-A</span>
                    <span className="text-amber-400">Cleaning (Ready 5m)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICU Bed 03-A</span>
                    <span className="text-emerald-400 font-bold">VACANT (READY)</span>
                  </div>
                </>
              )}
              {activeBed === 'opd' && (
                <>
                  <div className="text-emerald-400">Cardiology OPD Ward</div>
                  <div>Live Doctor: Dr. Robert Vance</div>
                  <div>Current Token: #94 - In Room</div>
                </>
              )}
              {activeBed === 'emer' && (
                <>
                  <div className="text-rose-400">Emergency Trauma Desk</div>
                  <div>Incoming Ambulance ETA: 3 Minutes</div>
                  <div>Triage Code: Level 1 Trauma</div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 border-b border-slate-800 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-2 font-sans">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Command Modules</h2>
            <p className="text-slate-400 text-xs">Tactical management for complex hospital operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="p-6 rounded bg-slate-900 border border-slate-800 space-y-3">
              <Radio className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Emergency Bed Matrix</h3>
              <p className="text-xs text-slate-400">Instant bed availability status across ICU, General Ward, and Emergency bays.</p>
            </div>

            <div className="p-6 rounded bg-slate-900 border border-slate-800 space-y-3">
              <Activity className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Ambulance Telemetry</h3>
              <p className="text-xs text-slate-400">Real-time GPS tracking and pre-hospital vital stream from inbound emergency vehicles.</p>
            </div>

            <div className="p-6 rounded bg-slate-900 border border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase">Surgical OT Scheduler</h3>
              <p className="text-xs text-slate-400">Operation theater queue management and automated equipment sterilization logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-sans">
        <div className="space-y-6">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">ABOUT TACTICAL MEDIX</span>
          <h2 className="text-3xl font-black text-white">Tactical Operational Command</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix Command Center gives hospital directors complete control over patient flow, emergency room triage, and resource allocation.
          </p>
        </div>

        <div className="p-8 rounded bg-emerald-950/60 border border-emerald-500/30 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Deploy Command Radar</h3>
          <a href="/register" className="inline-block px-6 py-2.5 rounded bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
            Register Hospital
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-slate-800 bg-black font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Command Line</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <Mail className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Command Email</div>
              <div className="text-sm font-bold text-white">radar@medix-command.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Center Ops</div>
              <div className="text-sm font-bold text-white">Washington DC & Seattle</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
        © 2026 Medix Hospital Management System. Concept 13: Tactical Hospital Command Center.
      </footer>
    </div>
  );
}
