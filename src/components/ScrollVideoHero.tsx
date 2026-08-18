"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Smile, Play, Pause, Film, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function ScrollVideoHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFrameIndex, setActiveFrameIndex] = useState(1);

  // Scroll listener to scrub video frames smoothly
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the hero card has scrolled into view
      // Progress goes from 0 (at top of screen) to 1 (when scrolled past)
      const totalScrollableDistance = windowHeight + rect.height;
      const currentScrollPos = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentScrollPos / totalScrollableDistance, 0), 1);

      setScrollProgress(progress);
      setActiveFrameIndex(Math.min(Math.floor(progress * 12) + 1, 12));

      if (videoRef.current && videoRef.current.duration) {
        const targetTime = progress * videoRef.current.duration;
        // Smoothly interpolate time
        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.05) {
          videoRef.current.currentTime = targetTime;
        }
      }
    };

    const onScrollThrottle = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottle, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottle);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update time display as video advances
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const jumpToProgress = (pct: number) => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pct * videoRef.current.duration;
      setScrollProgress(pct);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-300/80 shadow-2xl shadow-emerald-900/20 group transition-all"
    >
      {/* BACKGROUND VIDEO LAYER */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/cover-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        />

        {/* Soft pastel gradient tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-emerald-950/40 to-transparent pointer-events-none" />

        {/* TOP FLOATING GLASS CARD: Patient Wellness Index */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm">Patient Wellness Index</h3>
              <p className="text-[11px] font-bold text-emerald-700">98.9% Positive Telehealth Reviews</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300 shrink-0">
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" /> LIVE STREAM
          </span>
        </div>

        {/* BOTTOM FLOATING GLASS CARD: Telehealth Booking & Scroll Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
          
          {/* Telehealth Summary */}
          <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-lg text-xs text-emerald-950 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Seamless Telehealth Booking
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Frame {String(activeFrameIndex).padStart(2, '0')} / 12
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              Instant video consultation link generation with instant SMS reminders for patients.
            </p>
          </div>

          {/* INTERACTIVE SCROLL FILMSTRIP SCRUBBER */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 flex items-center justify-between gap-3 text-white">
            <button
              onClick={togglePlayPause}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shrink-0"
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Filmstrip Frame Steps */}
            <div className="flex-1 flex items-center gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => {
                const isActive = scrollProgress >= step;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToProgress(step)}
                    className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                      isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Jump to frame ${(idx + 1) * 2}`}
                  />
                );
              })}
            </div>

            <span className="text-[10px] font-mono font-bold text-emerald-300 shrink-0">
              {Math.round(scrollProgress * 100)}% SCRUB
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
