"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Crown } from 'lucide-react';
import SuperAdminModal from '@/components/SuperAdminModal';

interface ConceptHeaderProps {
  theme?: 'dark' | 'light' | 'cyber' | 'glass' | 'luxury' | 'brutalist' | 'pastels';
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export default function ConceptHeader({ theme = 'dark', activeSection, onNavigate }: ConceptHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  // Header style variations that preserve the mandatory logo, name, and link structure
  const headerStyles = {
    dark: "bg-[#061422]/95 border-b border-emerald-500/20 backdrop-blur-xl text-slate-100",
    light: "bg-white/95 border-b border-slate-200 shadow-xs backdrop-blur-xl text-slate-800",
    cyber: "bg-black/95 border-b border-cyan-500/40 shadow-[0_4px_25px_rgba(6,182,212,0.15)] text-cyan-50",
    glass: "bg-white/10 border-b border-white/20 backdrop-blur-2xl text-white shadow-lg",
    luxury: "bg-[#030712]/95 border-b border-amber-500/30 text-amber-50 shadow-2xl",
    brutalist: "bg-white border-b-4 border-black text-black shadow-[0_4px_0_0_#000]",
    pastels: "bg-[#f0fdf4]/95 border-b border-emerald-200/80 backdrop-blur-md text-emerald-950",
  };

  const navItemStyles = {
    dark: "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10",
    light: "text-slate-700 hover:text-emerald-600 hover:bg-slate-100",
    cyber: "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20",
    glass: "text-slate-200 hover:text-white hover:bg-white/10",
    luxury: "text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10",
    brutalist: "text-black font-extrabold hover:bg-emerald-400 border border-transparent hover:border-black",
    pastels: "text-emerald-900 hover:text-[#046a4e] hover:bg-emerald-100/80",
  };

  const currentHeaderStyle = headerStyles[theme] || headerStyles.dark;
  const currentNavItemStyle = navItemStyles[theme] || navItemStyles.dark;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${currentHeaderStyle}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between">
        
        {/* LOGO IMAGE & LOGO NAME: MEDIX / HEALTH GROW INDIA */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-inner">
              <Image
                src="/logo.png"
                alt="Medix Logo"
                width={44}
                height={44}
                className="h-full w-full object-contain rounded-full"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight leading-none group-hover:opacity-90 transition-opacity">
              Medix
            </span>
            <span className="text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-emerald-800 opacity-90 mt-0.5 whitespace-nowrap">
              HEALTH GROW INDIA
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS: Features, About, Contact */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100/60 border border-emerald-300/60 shadow-xs">
          <a
            href="#features"
            onClick={(e) => handleNavClick('features', e)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer ${currentNavItemStyle}`}
          >
            Features
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick('about', e)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer ${currentNavItemStyle}`}
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick('contact', e)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer ${currentNavItemStyle}`}
          >
            Contact
          </a>
        </nav>

        {/* RIGHT HEADER ACTIONS: Super Admin, Sign In, Registration */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSuperAdminModal(true)}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-500 rounded-full border border-amber-400/80 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all btn-premium-3d"
          >
            <Crown className="w-3.5 h-3.5 text-amber-900" />
            <span>Super Admin</span>
          </button>

          <Link
            href="/login"
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-full transition-all ${currentNavItemStyle}`}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={`px-4 py-2 text-xs sm:text-sm font-black rounded-full transition-all hover:scale-105 ${
              theme === 'pastels'
                ? 'bg-[#046a4e] hover:bg-[#03523c] text-white shadow-md shadow-emerald-950/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
            }`}
          >
            Registration
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-6 py-4 space-y-3 backdrop-blur-2xl shadow-xl transition-all ${
          theme === 'dark' ? 'bg-[#061422]/98 border-emerald-500/20 text-slate-100' :
          theme === 'cyber' ? 'bg-black/98 border-cyan-500/40 text-cyan-50' :
          theme === 'luxury' ? 'bg-[#030712]/98 border-amber-500/30 text-amber-50' :
          theme === 'glass' ? 'bg-slate-950/95 border-white/20 text-white' :
          theme === 'light' ? 'bg-white/98 border-slate-200 text-slate-900' :
          theme === 'brutalist' ? 'bg-white border-black text-black' :
          'bg-[#f0fdf4]/98 border-emerald-200/60 text-emerald-950'
        }`}>
          <a
            href="#features"
            onClick={(e) => handleNavClick('features', e)}
            className={`block py-2 text-sm font-extrabold rounded-lg px-2 ${currentNavItemStyle}`}
          >
            Features
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick('about', e)}
            className={`block py-2 text-sm font-extrabold rounded-lg px-2 ${currentNavItemStyle}`}
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick('contact', e)}
            className={`block py-2 text-sm font-extrabold rounded-lg px-2 ${currentNavItemStyle}`}
          >
            Contact
          </a>
          <div className="pt-3 border-t border-emerald-200/40 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowSuperAdminModal(true);
              }}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-amber-950 text-xs font-black shadow-md border border-amber-400 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-900" />
              <span>Super Admin Portal</span>
            </button>
            <Link
              href="/login"
              className={`w-full text-center py-2.5 rounded-xl border border-emerald-300 text-xs font-bold ${
                theme === 'dark' || theme === 'cyber' || theme === 'luxury'
                  ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                  : 'text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`w-full text-center py-2.5 rounded-xl text-xs font-black shadow-md ${
                theme === 'pastels'
                  ? 'bg-[#046a4e] text-white hover:bg-[#03523c]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500'
              }`}
            >
              Registration
            </Link>
          </div>
        </div>
      )}

      {/* DEDICATED SUPER ADMIN 2FA OTP MODAL */}
      <SuperAdminModal
        isOpen={showSuperAdminModal}
        onClose={() => setShowSuperAdminModal(false)}
      />
    </header>
  );
}
