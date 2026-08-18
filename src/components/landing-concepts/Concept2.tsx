"use client";

import React from 'react';
import { ArrowRight, CheckCircle, Stethoscope, Users, Building, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept2() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="light" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-slate-700 text-xs font-semibold tracking-wide uppercase">
            <span>CONCEPT 2: SWISS MINIMALIST MEDICAL</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.05]">
            Precision hospital infrastructure engineered for clarity.
          </h1>

          <p className="text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
            A minimalist, highly functional operating platform designed to eliminate administrative friction for doctors, nurses, and hospital managers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="/register"
              className="px-8 py-4 bg-slate-950 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              Learn Design System
            </a>
          </div>
        </div>

        {/* Structured Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-slate-200">
          <div>
            <div className="text-4xl font-bold text-slate-950">99.9%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Uptime Reliability</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-950">&lt; 1 sec</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Patient Check-in</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-950">100%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">HIPAA Compliant</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-950">400+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Hospitals Active</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
              Structured Core Modules
            </h2>
            <p className="text-slate-600 text-base">
              Built on clean Swiss design standards—every workflow is focused, accessible, and fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-200 space-y-4 hover:border-slate-400 transition-all">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-950">Clinical OPD Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Streamline outpatient consultation, digital prescriptions, patient history lookup, and follow-up reminders.
              </p>
            </div>

            <div className="bg-white p-8 border border-slate-200 space-y-4 hover:border-slate-400 transition-all">
              <Building className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-950">Bed & ICU Allocation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time bed tracking across wards, emergency admissions, transfer workflows, and discharge summaries.
              </p>
            </div>

            <div className="bg-white p-8 border border-slate-200 space-y-4 hover:border-slate-400 transition-all">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-950">Billing & Pharmacy Sync</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Integrated medicine inventory, automated invoice generation, insurance processing, and revenue reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">ABOUT MEDIX</span>
          <h2 className="text-4xl font-black text-slate-950 leading-tight">
            Designed for healthcare professionals who demand perfection.
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Medix replaces legacy, convoluted hospital software with a clean, high-performance web interface. Whether managing outpatient consultations or complex surgical schedules, Medix provides absolute clarity.
          </p>
          <div className="space-y-3 font-medium text-slate-800 text-sm">
            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-blue-600" /> Zero training required for clinic staff</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-blue-600" /> Instant cloud syncing across all devices</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-blue-600" /> Automated daily data backups</div>
          </div>
        </div>

        <div className="p-10 bg-slate-950 text-white space-y-6">
          <h3 className="text-3xl font-bold">Simplify Your Hospital Workflow Today.</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Experience the Swiss standard of clinical software architecture. Contact our deployment team for a personalized onboarding plan.
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors uppercase tracking-wider"
          >
            Create Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 bg-white border border-slate-200">
            <PhoneCall className="w-6 h-6 text-slate-950" />
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Telephone</div>
              <div className="text-sm font-bold text-slate-950">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white border border-slate-200">
            <Mail className="w-6 h-6 text-slate-950" />
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Email</div>
              <div className="text-sm font-bold text-slate-950">info@medix-swiss.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white border border-slate-200">
            <MapPin className="w-6 h-6 text-slate-950" />
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Office</div>
              <div className="text-sm font-bold text-slate-950">Zurich & New York</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 2: Swiss Minimalist Medical.
      </footer>
    </div>
  );
}
