"use client";

import React from 'react';
import { Zap, ShieldCheck, Activity, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept15() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff87] selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-[#00ff87]/40 text-[#00ff87] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,255,135,0.2)]">
            <Zap className="w-3.5 h-3.5 text-[#00ff87] animate-pulse" />
            <span>CONCEPT 15: MONOCHROMATIC OBSIDIAN & EMERALD PULSE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
            HYPER-SLEEK <span className="text-[#00ff87] drop-shadow-[0_0_25px_rgba(0,255,135,0.5)]">OBSIDIAN</span> CLINICAL OPERATING SYSTEM.
          </h1>

          <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
            Ultra-minimalist dark stealth architecture. Engineered for high-speed hospital queue processing, real-time bed monitoring, and automated EHR sync.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="/register"
              className="px-8 py-4 rounded-xl bg-[#00ff87] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,135,0.4)] hover:bg-[#00e077] hover:scale-105 transition-all flex items-center gap-2"
            >
              Launch Obsidian System <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all"
            >
              Inspect Architecture
            </a>
          </div>
        </div>

        {/* Minimalist Stat Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-zinc-900 font-mono">
          <div>
            <div className="text-3xl font-black text-[#00ff87]">0.08ms</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">EHR Query Speed</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">99.99%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Cloud Reliability</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#00ff87]">256-Bit</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Obsidian Shield</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">500+</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Active Hospitals</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Obsidian Modules</h2>
            <p className="text-xs text-zinc-500 font-mono">Pure performance. Zero visual noise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-[#00ff87]/50 transition-all space-y-4 shadow-2xl">
              <Activity className="w-8 h-8 text-[#00ff87]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">Stealth OPD Queuing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Instant token broadcasting to clinic screens with zero latency delay.</p>
            </div>

            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-[#00ff87]/50 transition-all space-y-4 shadow-2xl">
              <Stethoscope className="w-8 h-8 text-[#00ff87]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">Precision EHR Matrix</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">High-density patient charts allowing doctor prescription entry in under 15 seconds.</p>
            </div>

            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-[#00ff87]/50 transition-all space-y-4 shadow-2xl">
              <ShieldCheck className="w-8 h-8 text-[#00ff87]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">Quantum Security Vault</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Continuous encrypted backups for hospital financial billing and pharmacy dispensing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#00ff87] uppercase tracking-widest">ABOUT OBSIDIAN MEDIX</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Elegance Meets Blazing Operational Speed</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Medix Obsidian Edition removes all non-essential elements to deliver a sleek dark clinical environment that minimizes eye fatigue for night-shift doctors and nurses.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-[#00ff87] mx-auto" />
          <h3 className="text-2xl font-black text-white uppercase">Ready for Obsidian Speed?</h3>
          <a href="/register" className="inline-block px-8 py-3.5 rounded-xl bg-[#00ff87] text-black font-black text-xs uppercase tracking-widest hover:bg-[#00e077] transition-colors">
            Register Hospital Now
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-zinc-900 bg-black font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-950 border border-zinc-900">
            <PhoneCall className="w-6 h-6 text-[#00ff87]" />
            <div>
              <div className="text-xs text-zinc-500 uppercase">Direct Line</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-950 border border-zinc-900">
            <Mail className="w-6 h-6 text-[#00ff87]" />
            <div>
              <div className="text-xs text-zinc-500 uppercase">Obsidian Support</div>
              <div className="text-sm font-bold text-white">obsidian@medix-system.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-950 border border-zinc-900">
            <MapPin className="w-6 h-6 text-[#00ff87]" />
            <div>
              <div className="text-xs text-zinc-500 uppercase">Base Office</div>
              <div className="text-sm font-bold text-white">Tokyo & Zurich</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-zinc-900 text-center text-xs text-zinc-600 font-mono">
        © 2026 Medix Hospital Management System. Concept 15: Monochromatic Obsidian & Emerald Pulse.
      </footer>
    </div>
  );
}
