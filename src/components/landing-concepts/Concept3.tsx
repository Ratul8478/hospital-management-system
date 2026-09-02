"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, HeartPulse, Activity, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept3() {
  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Dynamic Background Light Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="glass" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>CONCEPT 3: GLASSMORPHISM 3D HOLOGRAPHIC</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
              Next-Dimension <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">Glass Care Interface</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Experience seamless depth and visual elegance. Medix glass framework organizes clinical queues, diagnostic reports, and bed matrix with spatial visual clarity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-extrabold text-sm backdrop-blur-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Experience 3D Portal <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 font-bold text-sm backdrop-blur-md transition-all"
              >
                Explore Modules
              </a>
            </div>
          </div>

          {/* 3D Glass Layer Stack Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative space-y-4">
              {/* Layer 1 */}
              <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl hover:translate-y-[-4px] transition-transform">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-purple-300 uppercase">Live Vital Sync</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">98.4 bpm</div>
                <p className="text-xs text-slate-300">Continuous telemetry feed across ward A</p>
              </div>

              {/* Layer 2 (Shifted) */}
              <div className="p-6 rounded-3xl bg-white/15 border border-white/25 backdrop-blur-2xl shadow-2xl transform translate-x-4 hover:translate-x-2 transition-transform">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-pink-300 uppercase">AI Diagnosis Match</span>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-black text-white">99.6% Accuracy</div>
                <p className="text-xs text-slate-300">Instant radiograph scan analysis</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 relative border-t border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Glassmorphic Architecture</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Ultra-responsive visual layers tailored for fast medical decision making.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all space-y-4">
              <HeartPulse className="w-10 h-10 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Cardiology Telemetry</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Real-time cardiac output visualization and automatic ECG alarm routing.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all space-y-4">
              <Stethoscope className="w-10 h-10 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Smart OPD Doctor Hub</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Instant access to medical records, digital prescriptions, and patient consultation history.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all space-y-4">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Encrypted Cloud EHR</h3>
              <p className="text-sm text-slate-300 leading-relaxed">HIPAA compliant glass architecture with multi-layer encryption protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">ABOUT MEDIX</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Empowering Modern Clinics With Spatial Intelligence</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix combines glass UI aesthetics with enterprise-grade clinical backend architecture. We eliminate clutter so healthcare providers can focus on saving lives.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">Join 350+ Glass-Powered Medical Hubs</h3>
          <a href="/register" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider">
            Register Account Now
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <PhoneCall className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Support Hot Line</div>
              <div className="text-sm font-bold text-white">+91 91443 76971</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Mail className="w-6 h-6 text-pink-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">System Support</div>
              <div className="text-sm font-bold text-white">ariyanhospital9@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">Main Center</div>
              <div className="text-sm font-bold text-white">San Francisco, CA</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 3: Glassmorphism 3D Holographic.
      </footer>
    </div>
  );
}
