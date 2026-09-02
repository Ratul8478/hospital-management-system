"use client";

import React from 'react';
import { Crown, ShieldCheck, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept8() {
  return (
    <div className="min-h-screen bg-[#030712] text-amber-50 font-sans selection:bg-amber-500 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="luxury" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-amber-900/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif tracking-widest uppercase shadow-[0_0_20px_rgba(217,119,6,0.2)]">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>CONCEPT 8: MIDNIGHT GOLD CONCIERGE</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
            VIP Concierge Medicine & Executive Health Suites
          </h1>

          <p className="text-lg text-amber-200/80 max-w-2xl mx-auto font-light leading-relaxed">
            Tailored luxury healthcare management platform for premium private clinics, executive health programs, and VIP patient services.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <a
              href="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-all flex items-center gap-2"
            >
              Request VIP Access <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950/80 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300">Bespoke Concierge Features</h2>
            <p className="text-amber-200/60 text-xs tracking-wide uppercase">Highest distinction in clinical care administration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-amber-500/30 space-y-4 shadow-xl">
              <Crown className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-serif font-bold text-white">Private Suite Reservations</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">Dedicated VIP inpatient suite booking with personalized care team assignations.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-amber-500/30 space-y-4 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-bold font-serif text-white">White-Glove Health Vault</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">Ultra-private medical history records with multi-factor biometric key authentication.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-amber-500/30 space-y-4 shadow-xl">
              <Stethoscope className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-serif font-bold text-white">Direct Physician Line</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">Instant 24/7 direct encrypted video consultations with senior specialist physicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest">ABOUT MEDIX MIDNIGHT</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto">
          Excellence in Medical Discretion & Precision
        </h2>
        <p className="text-amber-200/70 text-sm max-w-xl mx-auto leading-relaxed">
          Medix Concierge Edition provides top-tier private hospitals and boutique medical practices with an uncompromised experience of distinction.
        </p>

        <div className="pt-4">
          <a href="/register" className="inline-block px-8 py-3.5 rounded-xl border border-amber-500/60 text-amber-300 font-bold text-xs uppercase tracking-widest hover:bg-amber-500/10 transition-colors">
            Register Private Practice
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-amber-900/30 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <PhoneCall className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs text-amber-400 font-serif uppercase">Private Desk</div>
              <div className="text-sm font-bold text-white">+91 91443 76971</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <Mail className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs text-amber-400 font-serif uppercase">VIP Concierge</div>
              <div className="text-sm font-bold text-white">ariyanhospital9@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <MapPin className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs text-amber-400 font-serif uppercase">Private Suite</div>
              <div className="text-sm font-bold text-white">Manhattan & Geneva</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-amber-900/30 text-center text-xs text-amber-500/60 font-serif">
        © 2026 Medix Hospital Management System. Concept 8: Midnight Gold Concierge.
      </footer>
    </div>
  );
}
