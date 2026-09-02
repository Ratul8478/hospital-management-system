"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeroScrollCanvasBackgroundProps {
  totalFrames?: number;
  framePrefix?: string;
  className?: string;
  fps?: number;
}

export default function HeroScrollCanvasBackground({
  totalFrames = 102,
  framePrefix = '/hero-frames/',
  className = '',
  fps = 24,
}: HeroScrollCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Loaded images cache
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);

  const currentFrameRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const isMutedRef = useRef<boolean>(false);
  const hasSpokenThisCycleRef = useRef<boolean>(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // The receptionist namaste / pranam greeting gesture occurs around frame 20-35
  const GREETING_FRAME_TRIGGER = 22;

  // Format frame number to 4 digits: frame_0001.jpg
  const getFrameUrl = useCallback((index: number) => {
    const num = Math.min(Math.max(index + 1, 1), totalFrames);
    const padded = String(num).padStart(4, '0');
    return `${framePrefix}frame_${padded}.jpg`;
  }, [framePrefix, totalFrames]);

  // Luxury Medical Greeting Sound Synth + Speech Synthesis
  const playVoiceGreeting = useCallback(() => {
    if (isMutedRef.current || typeof window === 'undefined') return;

    try {
      // 1. Play Soft Harmonic Medical Chime via Web Audio API
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const playTone = (freq: number, delay: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + dur);
        };
        // Harmonic major triad chime (C5 - E5 - G5 - C6)
        playTone(523.25, 0.0, 1.2);
        playTone(659.25, 0.1, 1.2);
        playTone(783.99, 0.2, 1.4);
      }

      // 2. High Quality Voice: "Welcome to Medix Health Grow India"
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any pending queue

        const utterance = new SpeechSynthesisUtterance("Welcome to Medix Health Grow India");
        const voices = window.speechSynthesis.getVoices();

        // Pick most welcoming English female/natural voice
        const preferredVoice = voices.find(v => 
          (v.lang.startsWith('en') && (
            v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('serena') ||
            v.name.toLowerCase().includes('karen')
          ))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 0.93;  // Natural, clear, polite pacing
        utterance.pitch = 1.06; // Warm, friendly hospital receptionist tone
        utterance.volume = 1.0;

        // Slight micro-delay to align seamlessly with the namaste gesture
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
          setAudioPlayed(true);
        }, 150);
      }
    } catch (e) {
      console.log('Voice greeting audio note:', e);
    }
  }, []);

  // Preload all frames into memory
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (!mounted) return;
        loaded++;
        setLoadProgress(Math.round((loaded / totalFrames) * 100));
        if (loaded === 1) {
          drawFrame(0);
        }
        if (loaded >= 8) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        if (!mounted) return;
        loaded++;
      };
      images.push(img);
    }

    imagesRef.current = images;

    // Load voices list
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    return () => {
      mounted = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [totalFrames, getFrameUrl]);

  // Draw frame with 1080p Crystal Clear rendering & High-DPI
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 2x DPR for maximum sharpness

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // High quality bicubic filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Aspect-ratio Cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Continuous Video Playback Loop (Time-based 24fps / 30fps)
  useEffect(() => {
    let active = true;
    const frameIntervalMs = 1000 / fps;

    const videoLoop = (timestamp: number) => {
      if (!active) return;

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (isPlayingRef.current && elapsed >= frameIntervalMs) {
        lastFrameTimeRef.current = timestamp - (elapsed % frameIntervalMs);

        let nextFrame = currentFrameRef.current + 1;

        // Loop seamlessly or hold on end
        if (nextFrame >= totalFrames) {
          nextFrame = 0;
          hasSpokenThisCycleRef.current = false; // Reset speech flag for next loop cycle
        }

        currentFrameRef.current = nextFrame;
        setCurrentFrameIndex(nextFrame);
        drawFrame(nextFrame);

        // Check if we hit the Namaste / Receptionist Pranam greeting gesture
        if (nextFrame >= GREETING_FRAME_TRIGGER && !hasSpokenThisCycleRef.current) {
          hasSpokenThisCycleRef.current = true;
          playVoiceGreeting();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(videoLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(videoLoop);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [fps, totalFrames, drawFrame, playVoiceGreeting]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Autoplay Unmute helper on first user touch/click
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (currentFrameRef.current >= GREETING_FRAME_TRIGGER && !hasSpokenThisCycleRef.current) {
        hasSpokenThisCycleRef.current = true;
        playVoiceGreeting();
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, [playVoiceGreeting]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    isPlayingRef.current = next;
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    isMutedRef.current = next;
    if (!next && !hasSpokenThisCycleRef.current) {
      playVoiceGreeting();
    }
  };

  const restartVideo = () => {
    currentFrameRef.current = 0;
    setCurrentFrameIndex(0);
    hasSpokenThisCycleRef.current = false;
    setIsPlaying(true);
    isPlayingRef.current = true;
    drawFrame(0);
  };

  const progressPercent = Math.round((currentFrameIndex / (totalFrames - 1)) * 100);
  const currentTimeSec = ((currentFrameIndex / fps)).toFixed(1);
  const totalTimeSec = ((totalFrames / fps)).toFixed(1);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* HTML5 Crystal Clear Video Canvas Surface */}
      <canvas
        ref={canvasRef}
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-500"
        style={{ opacity: isReady ? 1 : 0.4 }}
      />

      {/* Smooth Loading Indicator before first frame ready */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0fdf4] text-emerald-950 z-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-md text-xs font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-[#046a4e] animate-spin" />
            <span>Loading Hospital Video Stream... {loadProgress}%</span>
          </div>
        </div>
      )}

      {/* Subtle bottom fade transition into next section */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f0fdf4] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f0fdf4]/50 to-transparent pointer-events-none" />

      {/* Video Controls & Greeting Voice Pill */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-wrap items-center gap-3">
        
        {/* Receptionist Greeting Audio Indicator Badge */}
        <div 
          onClick={playVoiceGreeting}
          className="cursor-pointer flex items-center gap-2 text-emerald-950 font-bold text-xs bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-emerald-300 shadow-lg hover:bg-emerald-50 transition-all active:scale-95"
          title="Click to replay official audio greeting"
        >
          <Sparkles className="w-4 h-4 text-[#046a4e] animate-pulse" />
          <span className="hidden sm:inline font-semibold">Voice Greeting:</span>
          <span className="text-[#046a4e] font-extrabold italic">&ldquo;Welcome to Medix Health Grow India&rdquo;</span>
        </div>

        {/* Video Player Floating Toolbar */}
        <div className="flex items-center gap-2 bg-emerald-950/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-700/50 shadow-xl text-xs font-semibold">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full hover:bg-emerald-800 transition-all active:scale-90"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-300" /> : <Play className="w-3.5 h-3.5 text-emerald-300" />}
          </button>

          {/* Replay */}
          <button
            onClick={restartVideo}
            className="p-1.5 rounded-full hover:bg-emerald-800 transition-all active:scale-90"
            title="Restart Video from Beginning"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
          </button>

          {/* Mute / Unmute Voice */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-emerald-800 transition-all active:scale-90"
            title={isMuted ? "Unmute Greeting Voice" : "Mute Greeting Voice"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
          </button>

          {/* Time Counter */}
          <span className="text-[11px] text-emerald-200 font-mono px-1">
            00:{String(Math.floor(Number(currentTimeSec))).padStart(2, '0')} / 00:{String(Math.floor(Number(totalTimeSec))).padStart(2, '0')}
          </span>
        </div>

      </div>

      {/* Thin Video Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-950/20 z-20">
        <div 
          className="h-full bg-[#046a4e] transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
