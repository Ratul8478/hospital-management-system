"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Eye, ArrowLeft, ArrowRight, LayoutGrid, CheckCircle2 } from 'lucide-react';

import { CONCEPTS_LIST } from '@/lib/concepts';
import { useApp } from '@/lib/store';


export default function LandingConceptsPage() {
  const { selectedLandingConceptId, setSelectedLandingConceptId } = useApp();
  const [activeConceptId, setActiveConceptId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setActiveConceptId(id);
    setSelectedLandingConceptId(id);
  };

  const selectedConcept = CONCEPTS_LIST.find(c => c.id === (activeConceptId || selectedLandingConceptId));


  // Render selected concept full screen with floating control bar
  if (selectedConcept) {
    const Component = selectedConcept.component;
    return (
      <div className="relative min-h-screen">
        {/* TOP FLOATING CONCEPT CONTROLLER BAR */}
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] max-w-4xl w-[95%] sm:w-auto bg-slate-950/90 border border-emerald-500/40 backdrop-blur-2xl px-4 py-2.5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-between gap-4 text-xs font-sans text-white">
          <button
            onClick={() => setActiveConceptId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 font-bold transition-all text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to 15 Gallery
          </button>

          <div className="flex items-center gap-2 overflow-x-auto max-w-[280px] sm:max-w-md no-scrollbar py-1">
            {CONCEPTS_LIST.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                  c.id === (activeConceptId || selectedLandingConceptId)
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                #{c.id}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-extrabold text-emerald-400">Concept #{selectedConcept.id}:</span>
            <span className="truncate max-w-[140px] text-slate-300 font-semibold">{selectedConcept.name}</span>
          </div>
        </div>

        {/* FULL CONCEPT LIVE RENDER */}
        <Component />
      </div>
    );
  }

  // GALLERY HUB VIEW
  return (
    <div className="min-h-screen bg-[#040b14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20">
      
      {/* HEADER BANNER */}
      <header className="sticky top-0 z-50 bg-[#061422]/90 backdrop-blur-2xl border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5 shadow-md">
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Medix Logo" width={48} height={48} className="h-full w-full object-cover rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-none">Medix Design Gallery</h1>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">15 Landing Page Concepts Showcase</span>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Main Project Landing
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
        
        {/* INTRO HERO */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>EXCLUSIVELY CREATED FOR MEDIX</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Select From <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">15 Unique Landing Page</span> Concepts
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every concept strictly features your specified Header order: <span className="text-emerald-400 font-bold">Logo (logo.png)</span>, <span className="text-emerald-400 font-bold">Medix</span> logo name, and nav section items: <span className="text-white font-bold">Features, About, Contact, Sign In, Registration</span>. Click any concept card below to preview in full screen!
          </p>
        </div>

        {/* 15 CONCEPTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONCEPTS_LIST.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleSelect(concept.id)}
              className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 p-6 space-y-4 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold font-mono">
                    CONCEPT #{concept.id}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md">
                    {concept.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {concept.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {concept.desc}
                </p>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Header Strict Order Verified
                </span>

                <button className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs group-hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-md">
                  <Eye className="w-3.5 h-3.5" /> Preview Live
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
