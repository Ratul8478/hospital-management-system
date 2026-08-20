"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HeroScrollCanvasBackgroundProps {
  totalFrames?: number;
  framePrefix?: string;
  className?: string;
}

export default function HeroScrollCanvasBackground({
  totalFrames = 102,
  framePrefix = '/hero-frames/',
  className = '',
}: HeroScrollCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Loaded images cache
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Animation interpolation state
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Format frame number to 4 digits: frame_0001.jpg
  const getFrameUrl = useCallback((index: number) => {
    const num = Math.min(Math.max(index + 1, 1), totalFrames);
    const padded = String(num).padStart(4, '0');
    return `${framePrefix}frame_${padded}.jpg`;
  }, [framePrefix, totalFrames]);

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
        if (loaded === 1) {
          drawFrame(0);
        }
        if (loaded >= 5) {
          setIsReady(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      mounted = false;
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 2x DPR for maximum crispness

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // High quality bicubic filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cover math
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

  // Smooth render loop with LERP for ultra-smooth 60fps/120fps motion
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.09; // Buttery smooth spring easing
        const roundedFrame = Math.round(currentFrameRef.current);
        const clampedFrame = Math.min(Math.max(roundedFrame, 0), totalFrames - 1);
        drawFrame(clampedFrame);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [totalFrames, drawFrame]);

  // Scroll listener tracking the parent sticky scroll container
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      // Find the pinned scroll container (closest section or parent with height)
      const section = el.closest('section') || el.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;

      if (scrollableHeight <= 0) return;

      // Calculate progress from 0.0 to 1.0 based on how far the pinned section has scrolled
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      targetFrameRef.current = progress * (totalFrames - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalFrames]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const current = Math.min(Math.max(Math.round(currentFrameRef.current), 0), totalFrames - 1);
      drawFrame(current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, totalFrames]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* HTML5 Crystal Clear Canvas Surface */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: isReady ? 1 : 0.6 }}
      />

      {/* Subtle bottom fade transition into next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f0fdf4] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f0fdf4]/50 to-transparent pointer-events-none" />
    </div>
  );
}
