"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Smartphone, Maximize2, Minimize2, ExternalLink, RotateCcw, ShieldCheck, Stethoscope } from 'lucide-react';

export default function DoctorAppWebRunner() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [key, setKey] = useState(1);

  const reloadApp = () => setKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Navigation / Controller Bar */}
      <div className="w-full max-w-4xl bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white">ARIYAN HOSPITAL • Medix Doctor Portal</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected to Web API
              </span>
            </div>
            <p className="text-xs text-slate-400">Android Doctor Application Web Live View</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reloadApp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600"
            title="Reload Application"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload
          </button>
          
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded-lg transition-colors border border-cyan-500/40"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                Device Frame View
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                Full Browser View
              </>
            )}
          </button>

          <a
            href="/doctor-app/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-md shadow-blue-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Standalone Tab
          </a>
        </div>
      </div>

      {/* App Container */}
      {isFullScreen ? (
        <div className="w-full max-w-6xl h-[88vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe
            key={key}
            src="/doctor-app/index.html"
            className="w-full h-full border-0"
            title="Doctor Android Application"
          />
        </div>
      ) : (
        <div className="relative w-full flex justify-center">
          {/* Mobile Phone Mockup Frame - Adaptive for mobile, tablet, desktop */}
          <div className="w-full max-w-[420px] h-[85vh] sm:h-[860px] bg-slate-950 rounded-3xl sm:rounded-[48px] p-2 sm:p-3 shadow-2xl border-2 sm:border-[4px] border-slate-700 ring-1 ring-white/10 flex flex-col relative overflow-hidden">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-950 border border-slate-800 mr-2"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500/80 animate-pulse"></div>
            </div>

            {/* App Screen Iframe */}
            <div className="w-full h-full rounded-2xl sm:rounded-[38px] overflow-hidden bg-slate-900 pt-2">
              <iframe
                key={key}
                src="/doctor-app/index.html"
                className="w-full h-full border-0"
                title="Doctor Android Application"
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-slate-600 rounded-full z-20"></div>
          </div>
        </div>
      )}
    </div>
  );
}
