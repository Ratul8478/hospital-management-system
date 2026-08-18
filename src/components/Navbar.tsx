"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Search, Building2, ShieldCheck, LogOut } from 'lucide-react';

export function Navbar() {
  const { branches, selectedBranchId, setSelectedBranchId, userRole, setUserRole } = useApp();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/patients?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-40">
      
      {/* Global Search */}
      <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-4 py-2 rounded-full w-80 lg:w-96 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-sky-500/15 transition-all">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Global Search (UHID, Patient Name, Invoice #)..."
          className="bg-transparent text-xs text-slate-800 outline-none w-full font-medium placeholder-slate-400"
        />
        <span className="text-[10px] font-extrabold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">⌘K</span>
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-4">
        
        {/* Branch Context Selector */}
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl">
          <span className="text-[11px] font-extrabold text-sky-800 uppercase tracking-wider hidden sm:inline">Active Scope:</span>
          {userRole === 'branch_admin' ? (
            <div className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <span>🔒 Branch Central Scope:</span>
              <span className="underline font-mono font-extrabold">
                {branches.find(b => b.id === selectedBranchId)?.code || 'MAIN-01'}
              </span>
            </div>
          ) : (
            <select
              value={selectedBranchId === 'all' ? 'all' : selectedBranchId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedBranchId(val === 'all' ? 'all' : Number(val));
              }}
              className="bg-white text-xs font-bold text-sky-900 border border-sky-300 rounded-lg px-2.5 py-1 outline-none cursor-pointer"
            >
              <option value="all">🌐 All 9 Hospital Branches (Global)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  🏥 {b.name} ({b.code})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* System Live Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>System Live • v2.0 Multi-Branch (9 Nodes)</span>
        </div>

        {/* Role Switcher */}
        <select
          value={userRole}
          onChange={(e) => {
            const role = e.target.value as any;
            setUserRole(role);
            if (role === 'branch_admin' && selectedBranchId === 'all') {
              setSelectedBranchId(1);
            }
          }}
          className="bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hidden md:block"
        >
          <option value="super_admin">👑 Super Admin (All Branches)</option>
          <option value="branch_admin">🏬 Branch Central Admin</option>
          <option value="receptionist">📋 Receptionist</option>
          <option value="doctor">🩺 Doctor</option>
          <option value="accountant">💰 Accountant</option>
          <option value="pharmacist">💊 Pharmacist</option>
          <option value="lab_technician">🧪 Lab Technician</option>
          <option value="franchise_partner">🤝 Franchise Partner</option>
        </select>


        {/* Logout */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all"
        >
          <span>Logout</span>
          <LogOut className="h-3.5 w-3.5" />
        </button>

      </div>
    </header>
  );
}
