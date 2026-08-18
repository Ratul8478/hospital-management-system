"use client";

import React from 'react';
import { Sparkles, ShieldCheck, Cpu, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept11() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-pink-500 selection:text-white">
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
              <span>CONCEPT 11: HOLOGRAPHIC PRISM MEDICAL</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Spectral Iridescent <span className="bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Holographic PACS</span> Engine
            </h1>

            <p className="text-lg text-zinc-300 leading-relaxed max-w-xl">
              Immersive spectral visualization for radiograph scans, 3D pathology models, and multi-layered patient diagnostic history.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 transition-all flex items-center gap-2"
              >
                Launch Holographic PACS <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-bold text-sm hover:bg-zinc-800 transition-all"
              >
                View Shimmer Specs
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            <div className="p-6 rounded-[14px] bg-zinc-950 space-y-4">
              <div className="text-xs font-mono font-bold text-pink-400 uppercase">HOLOGRAPHIC DIAGNOSTIC FEED</div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300 space-y-2">
                <div>[Scan 0941] Lumbar Spine 3D Render</div>
                <div className="text-emerald-400">Prismatic Resolution: 4K Spectral</div>
                <div className="text-pink-300">Auto-tagged: Zero Fractures Detected</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Spectral Modules</h2>
            <p className="text-zinc-400 text-sm">Next-level clinical visualization.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-pink-500 transition-all">
              <Sparkles className="w-8 h-8 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Prismatic Imaging</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Multi-spectral medical imaging overlays for pathology and radiology scans.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-purple-500 transition-all">
              <Cpu className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">AI Neural Segmentation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Automated organ and tissue segmentation powered by deep neural networks.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-cyan-500 transition-all">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Spectral Data Vault</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Quantum encrypted cloud storage for high-resolution DICOM files.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">ABOUT MEDIX HOLOGRAPHIC</span>
          <h2 className="text-3xl font-black text-white">The Future of Medical Imaging</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Medix Holographic Edition allows radiologists and surgeons to review complex cases in rich 3D spectral fidelity, reducing diagnostic error margins.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/40 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-pink-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Register Hospital Account</h3>
          <a href="/register" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs uppercase tracking-wider">
            Create Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-zinc-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
            <PhoneCall className="w-6 h-6 text-pink-400" />
            <div>
              <div className="text-xs text-zinc-400 uppercase">Imaging Desk</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
            <Mail className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-xs text-zinc-400 uppercase">PACS Inquiries</div>
              <div className="text-sm font-bold text-white">pacs@medix-prism.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-xs text-zinc-400 uppercase">Spectral Lab</div>
              <div className="text-sm font-bold text-white">Tokyo & San Jose</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
        © 2026 Medix Hospital Management System. Concept 11: Holographic Prism Medical.
      </footer>
    </div>
  );
}
