"use client";

import React from 'react';
import { Leaf, ShieldCheck, Heart, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept10() {
  return (
    <div className="min-h-screen bg-[#0f1715] text-emerald-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-emerald-900/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 text-xs font-medium tracking-widest uppercase">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>CONCEPT 10: NORDIC BIO-ORGANIC HEALTH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight leading-tight">
              Holistic Scandinavian <span className="font-bold text-emerald-400">Clinical Harmony</span>
            </h1>

            <p className="text-lg text-emerald-200/80 max-w-xl leading-relaxed">
              Quiet sophistication meets comprehensive hospital administration. Designed to foster calm efficiency across patient check-ins and clinical workflows.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm shadow-xl transition-all flex items-center gap-2"
              >
                Register Health Portal <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 font-medium text-sm hover:bg-emerald-900/50 transition-all"
              >
                Nordic Design System
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-emerald-950/40 border border-emerald-800/40 space-y-6">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-lg">Serene Patient Workflow</h3>
                <p className="text-xs text-emerald-300">99.4% Staff Satisfaction</p>
              </div>
            </div>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Automated waiting room ambiance monitoring, serene appointment reminders, and effortless doctor consultations.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-black/40 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-light text-white">Nordic Bio-Features</h2>
            <p className="text-emerald-300/70 text-sm">Quiet, sustainable healthcare infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-4 hover:border-emerald-500 transition-all">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Paperless Green EHR</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">100% paperless medical record management with zero ecological footprint.</p>
            </div>

            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-4 hover:border-emerald-500 transition-all">
              <Heart className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Calm OPD Queuing</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">Reduces patient waiting anxiety with quiet digital notifications on personal devices.</p>
            </div>

            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-4 hover:border-emerald-500 transition-all">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Secure Data Sanctuary</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">Strict European privacy protections and encrypted medical vault storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ABOUT NORDIC MEDIX</span>
          <h2 className="text-3xl font-light text-white">Simplicity, Sustainability, Care.</h2>
          <p className="text-emerald-200/80 text-sm leading-relaxed">
            Medix Nordic brings Scandinavian principles of human-centric design to hospital management, ensuring staff operate with calm focus.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-900/60 border border-emerald-700/40 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-emerald-300 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Join Nordic Medical Network</h3>
          <a href="/register" className="inline-block px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
            Register Hospital Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-emerald-900/40 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-emerald-400 uppercase">Nordic Desk</div>
              <div className="text-sm font-bold text-white">+91 91443 76971</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <Mail className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-emerald-400 uppercase">Nordic Email</div>
              <div className="text-sm font-bold text-white">nordic@medix-health.se</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs text-emerald-400 uppercase">Main HQ</div>
              <div className="text-sm font-bold text-white">Stockholm & Oslo</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-emerald-900/40 text-center text-xs text-emerald-600">
        © 2026 Medix Hospital Management System. Concept 10: Nordic Bio-Organic Health.
      </footer>
    </div>
  );
}
