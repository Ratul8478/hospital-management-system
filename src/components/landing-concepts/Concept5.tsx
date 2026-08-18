"use client";

import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, ShieldCheck, ArrowRight, Stethoscope, PhoneCall, Mail, MapPin } from 'lucide-react';
import ConceptHeader from './ConceptHeader';

export default function Concept5() {
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const runAiDemo = () => {
    setAiAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAiAnalyzing(false);
      setResult("AI Triage Analysis Complete: SpO2 99%, Heart Rate 72bpm. 0 Anomaly risks identified.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090514] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Neural Nodes & Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-purple-700/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="dark" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold tracking-wide">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>CONCEPT 5: AI NEURAL CLINICAL ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
              Autonomous <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">AI Diagnostic</span> Hospital Brain
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Integrate neural AI models directly into outpatient consultations, radiograph scanning, pharmacy inventory forecasting, and patient intake triage.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-all flex items-center gap-2"
              >
                Launch AI Engine <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold text-sm hover:bg-purple-900/50 transition-all"
              >
                View Neural Architecture
              </a>
            </div>
          </div>

          {/* Interactive AI Demo Card */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-bold text-white">Medix AI Clinical Assistant</span>
                </div>
                <span className="text-xs text-cyan-400 font-mono">v4.8 Neural Model</span>
              </div>

              <p className="text-xs text-slate-300">
                Click below to simulate real-time patient triage & radiology scan analysis using Medix AI neural net.
              </p>

              <button
                onClick={runAiDemo}
                disabled={aiAnalyzing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {aiAnalyzing ? "Analyzing Patient Telemetry..." : "Run AI Triage Simulator"}
              </button>

              {result && (
                <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-400/30 text-xs text-emerald-300 font-mono animate-fadeIn">
                  {result}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-purple-900/40 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white">AI Neural Capabilities</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Seamless intelligence embedded across every hospital workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-purple-950/20 border border-purple-800/40 hover:border-purple-500 transition-all space-y-4">
              <Brain className="w-10 h-10 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Automated AI Triage</h3>
              <p className="text-sm text-slate-300">Instant patient risk scoring and priority queuing based on symptom telemetry.</p>
            </div>

            <div className="p-8 rounded-2xl bg-purple-950/20 border border-purple-800/40 hover:border-purple-500 transition-all space-y-4">
              <Cpu className="w-10 h-10 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Neural PACS Radiography</h3>
              <p className="text-sm text-slate-300">Computer vision model scanning X-rays and MRI scans for early detection insights.</p>
            </div>

            <div className="p-8 rounded-2xl bg-purple-950/20 border border-purple-800/40 hover:border-purple-500 transition-all space-y-4">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Predictive Stock Management</h3>
              <p className="text-sm text-slate-300">Smart forecasting for pharmacy medicines and ICU equipment utilization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">ABOUT MEDIX AI</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Next-Generation Clinical Decision Support</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Medix integrates deep learning models directly into clinical routines, empowering physicians with instant insights while maintaining human clinical authority.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-center space-y-6">
          <Stethoscope className="w-12 h-12 text-pink-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Supercharge Your Hospital's AI Potential</h3>
          <a href="/register" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider">
            Register Hospital Account
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 border-t border-purple-900/40 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <PhoneCall className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">AI Support Line</div>
              <div className="text-sm font-bold text-white">+1 (800) 555-MEDIX</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <Mail className="w-6 h-6 text-pink-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">AI Inquiries</div>
              <div className="text-sm font-bold text-white">ai@medix-health.ai</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase">AI Innovation Lab</div>
              <div className="text-sm font-bold text-white">Palo Alto, CA</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-purple-900/40 text-center text-xs text-slate-500">
        © 2026 Medix Hospital Management System. Concept 5: AI Neural Clinical Engine.
      </footer>
    </div>
  );
}
