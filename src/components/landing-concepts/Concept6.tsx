"use client";

import React from 'react';
import { Building2, ShieldCheck, Award, ArrowRight, CheckCircle2, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept6() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-sky-950 border border-sky-500/40 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>CONCEPT 6: EXECUTIVE HEALTHCARE ENTERPRISE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Grade <span className="text-sky-400">Hospital Command</span> System
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Scalable, HIPAA-compliant hospital governance software connecting executive leadership, chief medical officers, and department heads across multi-location healthcare networks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center gap-2"
              >
                Schedule Executive Demo <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-all"
              >
                Enterprise Whitepaper
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 uppercase">Hospital Performance Scorecard</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-white">99.98%</div>
                <div className="text-xs text-slate-400 mt-1">EHR System Uptime</div>
              </div>
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-emerald-400">14.2 Min</div>
                <div className="text-xs text-slate-400 mt-1">Avg Patient Cycle Time</div>
              </div>
            </div>

            <div className="p-4 rounded bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200">
              ISO 27001 & HIPAA Certified Enterprise Architecture.
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Enterprise Core Solutions</h2>
            <p className="text-slate-400 text-sm">Designed for high-capacity multi-hospital networks and medical groups.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-sky-500 transition-all">
              <Building2 className="w-8 h-8 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Multi-Branch Administration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Centralized management for multiple hospital branches, OPD clinics, and diagnostic labs.</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-sky-500 transition-all">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Role-Based Access Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Strict security clearance protocols for doctors, nurses, accountants, and lab staff.</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-sky-500 transition-all">
              <Award className="w-8 h-8 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Executive Revenue Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Real-time revenue telemetry, bed occupancy rates, and pharmacy inventory turnover graphs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">ABOUT MEDIX ENTERPRISE</span>
          <h2 className="text-3xl font-black text-white">Built for Scalable Institutional Healthcare</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix Enterprise provides executive leaders with full visibility into hospital operations while maintaining rapid clinical workflows for medical staff on the ground.
          </p>
          <div className="space-y-2 text-xs font-semibold text-sky-200">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-branch EHR data integration</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated insurance claims processing</div>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-sky-950 border border-sky-500/30 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-sky-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Request Executive Consultation</h3>
          <a href="/register" className="inline-block px-6 py-3 rounded bg-sky-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
            Register Hospital Enterprise
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <PhoneCall className="w-6 h-6 text-sky-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Enterprise Sales</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <Mail className="w-6 h-6 text-sky-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Executive Relations</div>
              <div className="text-sm font-bold text-white">executive@medix-enterprise.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded bg-slate-900 border border-slate-800">
            <MapPin className="w-6 h-6 text-sky-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Corporate Center</div>
              <div className="text-sm font-bold text-white">Chicago, IL</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 6: Executive Healthcare Enterprise.
      </footer>
    </div>
  );
}
