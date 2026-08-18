"use client";

import React from 'react';
import { Zap, ShieldCheck, Activity, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept9() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-emerald-400 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="brutalist" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b-4 border-black">
        <div className="space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-black uppercase">
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>CONCEPT 9: NEO-BRUTALIST TECH MEDICAL</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tight leading-[1.05] uppercase">
            BOLD CLINICAL SOFTWARE FOR MODERN HOSPITALS.
          </h1>

          <p className="text-xl font-bold text-slate-800 leading-relaxed max-w-2xl">
            No fluff. No complicated menus. Just raw, hyper-fast hospital queue tracking, lab report sync, and doctor scheduling.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="/register"
              className="px-8 py-4 bg-emerald-400 border-3 border-black text-black font-black text-sm uppercase shadow-[5px_5px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              Start Registration <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-white border-3 border-black text-black font-black text-sm uppercase shadow-[5px_5px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Check Features
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-emerald-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <h2 className="text-4xl font-black text-black uppercase tracking-tight">Core Tech Blocks</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] space-y-4">
              <Activity className="w-10 h-10 text-black" />
              <h3 className="text-2xl font-black text-black uppercase">OPD Queues</h3>
              <p className="text-sm font-bold text-slate-800">Instant token assignment and live status screens across hospital waiting halls.</p>
            </div>

            <div className="p-8 bg-rose-300 border-3 border-black shadow-[6px_6px_0px_0px_#000] space-y-4">
              <Zap className="w-10 h-10 text-black" />
              <h3 className="text-2xl font-black text-black uppercase">AI Lab Testing</h3>
              <p className="text-sm font-bold text-slate-800">Automated pathology reports routed straight to patient smartphones.</p>
            </div>

            <div className="p-8 bg-cyan-300 border-3 border-black shadow-[6px_6px_0px_0px_#000] space-y-4">
              <ShieldCheck className="w-10 h-10 text-black" />
              <h3 className="text-2xl font-black text-black uppercase">HIPAA Vault</h3>
              <p className="text-sm font-bold text-slate-800">Unbreakable encryption protecting all medical history records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="px-3 py-1 bg-black text-white text-xs font-black uppercase">ABOUT MEDIX BRUTALIST</span>
          <h2 className="text-4xl font-black text-black uppercase">HIGH SPEED. ZERO DISTRACTION.</h2>
          <p className="text-base font-bold text-slate-800 leading-relaxed">
            Medix Neo-Brutalist strips away design fluff to give doctors and hospital staff absolute clarity and blazing operational speed.
          </p>
        </div>

        <div className="p-10 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_#000] text-center space-y-6">
          <Stethoscope className="w-14 h-14 text-black mx-auto" />
          <h3 className="text-3xl font-black text-black uppercase">READY TO UPGRADE?</h3>
          <a href="/register" className="inline-block px-8 py-4 bg-black text-white font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] hover:bg-emerald-400 hover:text-black transition-colors">
            CREATE ACCOUNT
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-emerald-200 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-4">
            <PhoneCall className="w-8 h-8 text-black" />
            <div>
              <div className="text-xs font-black uppercase">HOTLINE</div>
              <div className="text-sm font-black">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="p-6 bg-cyan-200 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-4">
            <Mail className="w-8 h-8 text-black" />
            <div>
              <div className="text-xs font-black uppercase">EMAIL</div>
              <div className="text-sm font-black">support@medix-brutal.com</div>
            </div>
          </div>
          <div className="p-6 bg-rose-200 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-4">
            <MapPin className="w-8 h-8 text-black" />
            <div>
              <div className="text-xs font-black uppercase">LOCATION</div>
              <div className="text-sm font-black">BERLIN & AUSTIN</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t-4 border-black text-center text-xs font-black uppercase">
        © 2026 Medix Hospital Management System. Concept 9: Neo-Brutalist Tech Medical.
      </footer>
    </div>
  );
}
