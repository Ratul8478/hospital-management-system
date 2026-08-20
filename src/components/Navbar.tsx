"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Search, LogOut, Menu, X } from 'lucide-react';

export function Navbar() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toggleMobileSidebar, isMobileSidebarOpen } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/patients?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-40">
      
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0 transition-colors"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Global Search */}
        <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 sm:px-4 py-2 rounded-full w-full max-w-[200px] sm:max-w-xs md:w-80 lg:w-96 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-sky-500/15 transition-all">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search UHID, Patient, Bill..."
            className="bg-transparent text-xs text-slate-800 outline-none w-full font-medium placeholder-slate-400 min-w-0"
          />
          <span className="hidden sm:inline text-[10px] font-extrabold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">⌘K</span>
        </div>
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* System Live Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>System Live • ARIYAN HOSPITAL HQ</span>
        </div>

        {/* Logout */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <span className="hidden xs:inline">Logout</span>
          <LogOut className="h-3.5 w-3.5" />
        </button>

      </div>
    </header>
  );
}

