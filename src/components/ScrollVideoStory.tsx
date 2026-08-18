"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Smile,
  Activity,
  Sparkles,
  Stethoscope,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layers,
  Video
} from 'lucide-react';

const STORY_FRAMES = [
  {
    step: '01',
    time: '00:02',
    title: 'Digital Patient Check-in',
    subtitle: 'Instant UHID generation & contactless kiosk check-in.',
    tag: 'Triage Stage'
  },
  {
    step: '02',
    time: '00:04',
    title: 'HD Telehealth Consultation',
    subtitle: 'Live video doctor consultation with real-time vitals.',
    tag: 'Clinical OPD'
  },
  {
    step: '03',
    time: '00:06',
    title: 'Live Token Queue Display',
    subtitle: 'Digital OPD token board updates with wait estimates.',
    tag: 'Queue Manager'
  },
  {
    step: '04',
    time: '00:08',
    title: 'E-Prescription & Pharmacy',
    subtitle: 'Automated dosage sync directly to the hospital dispensary.',
    tag: 'Pharmacy Sync'
  },
  {
    step: '05',
    time: '00:10',
    title: 'Diagnostic Lab Telemetry',
    subtitle: 'Instant pathology report upload to Patient Health Passport.',
    tag: 'Diagnostics'
  },
  {
    step: '06',
    time: '00:12',
    title: 'Discharge & Recovery Plan',
    subtitle: 'Post-consultation follow-up SMS and digital receipt.',
    tag: 'Care Completion'
  }
];

export default function ScrollVideoStory() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFrame, setActiveFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track page scroll to advance frames and sync video
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress across hero & story container
      const totalDist = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentScroll / totalDist, 0), 1);

      setScrollProgress(progress);

      const frameIdx = Math.min(Math.floor(progress * STORY_FRAMES.length), STORY_FRAMES.length - 1);
      setActiveFrame(frameIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const jumpToFrame = (idx: number) => {
    setActiveFrame(idx);
    if (videoRef.current && videoRef.current.duration) {
      const targetTime = (idx / (STORY_FRAMES.length - 1)) * videoRef.current.duration;
      videoRef.current.currentTime = targetTime;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      
      {/* MAIN HERO VIDEO CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-400/60 shadow-2xl shadow-emerald-950/20 group">
        
        {/* HTML5 Video Player */}
        <div className="relative w-full h-[360px] sm:h-[400px] bg-slate-950 overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src="/cover-video.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

          {/* TOP FLOATING BADGE: Patient Wellness Index */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-emerald-950 text-xs sm:text-sm">Patient Wellness Index</h3>
                <p className="text-[11px] font-bold text-emerald-700">98.9% Positive Telehealth Reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
              <Activity className="w-3 h-3 text-emerald-600 animate-pulse" /> LIVE STREAM
            </div>
          </div>

          {/* BOTTOM OVERLAY: Live Frame Status & Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-20 space-y-2.5">
            
            {/* Active Telehealth Story Summary */}
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {STORY_FRAMES[activeFrame].title}
                </span>
                <span className="text-[10px] font-mono font-black text-[#046a4e] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Step {STORY_FRAMES[activeFrame].step} of 06
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium leading-tight">
                {STORY_FRAMES[activeFrame].subtitle}
              </p>
            </div>

            {/* Video Action Bar */}
            <div className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-[#046a4e] hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>

              {/* Progress Scrubber */}
              <div className="flex-1 flex items-center gap-1">
                {STORY_FRAMES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => jumpToFrame(i)}
                    className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                      activeFrame === i
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400/60'
                        : i < activeFrame
                        ? 'bg-emerald-600/70'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                SCROLL SYNC
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* MULTI-FRAME STORYBOARD FILMSTRIP (STEP BY STEP FRAMES) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#046a4e] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Cinematic Clinical Workflow Frames
          </span>
          <span className="text-[10px] font-bold text-emerald-700">Scroll to advance</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {STORY_FRAMES.map((frame, idx) => {
            const isActive = activeFrame === idx;
            return (
              <button
                key={frame.step}
                onClick={() => jumpToFrame(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white border-[#046a4e] shadow-md ring-2 ring-[#046a4e]/20 scale-[1.02]'
                    : 'bg-white/70 border-emerald-100 hover:bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-[#046a4e] text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Frame {frame.step}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{frame.time}</span>
                </div>
                <p className="text-xs font-black text-slate-900 truncate">{frame.title}</p>
                <p className="text-[10px] font-bold text-emerald-700 truncate">{frame.tag}</p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
