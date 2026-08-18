"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  BarChart3,
  Crown,
  User,
  CalendarDays,
  Stethoscope,
  Activity,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  Coins,
  Handshake,
  TrendingUp,
  Users,
  Shield,
  Settings,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
}

interface NavDivision {
  division: string;
  items: NavItem[];
}

const NAV_DIVISIONS: NavDivision[] = [
  {
    division: 'MAIN',
    items: [
      { name: 'Campus Dashboard', href: '/dashboard/super-admin', icon: BarChart3, iconColor: 'text-emerald-300' },
      { name: 'Central Branches Hub', href: '/dashboard/super-admin?tab=branches', icon: Crown, iconColor: 'text-amber-300', badge: '9 Nodes' },
    ],
  },
  {
    division: 'CLINICAL & PATIENTS',
    items: [
      { name: 'Patients (EHR)', href: '/patients', icon: User, iconColor: 'text-teal-300' },
      { name: 'Appointments & Tokens', href: '/appointments', icon: CalendarDays, iconColor: 'text-emerald-300' },
      { name: 'OPD Workspace', href: '/doctors', icon: Stethoscope, iconColor: 'text-mint-300 text-teal-200' },
      { name: 'IPD & Admissions', href: '/beds', icon: Activity, iconColor: 'text-emerald-300' },
      { name: 'Bed Matrix', href: '/beds', icon: BedDouble, iconColor: 'text-rose-300' },
      { name: 'Pharmacy & POS', href: '/pharmacy', icon: Pill, iconColor: 'text-amber-200' },
      { name: 'Laboratory Diagnostic', href: '/laboratory', icon: FlaskConical, iconColor: 'text-cyan-300' },
    ],
  },
  {
    division: 'FINANCE & PARTNERS',
    items: [
      { name: 'Billing & Invoicing', href: '/billing', icon: Receipt, iconColor: 'text-emerald-200' },
      { name: 'Accounts & Ledger', href: '/accounting', icon: Coins, iconColor: 'text-amber-300' },
      { name: 'Franchise / Referrals', href: '/franchise', icon: Handshake, iconColor: 'text-yellow-300' },
      { name: 'Enterprise Reports', href: '/accounting', icon: TrendingUp, iconColor: 'text-teal-300' },
    ],
  },
  {
    division: 'ADMINISTRATION',
    items: [
      { name: 'User Accounts', href: '/admin', icon: Users, iconColor: 'text-emerald-300' },
      { name: 'Roles & Permissions', href: '/admin', icon: Shield, iconColor: 'text-teal-300' },
      { name: 'Hospital Settings', href: '/admin', icon: Settings, iconColor: 'text-emerald-200' },
      { name: 'Audit Trail', href: '/admin', icon: ClipboardList, iconColor: 'text-amber-300' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userRole, selectedBranchId, branches } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const activeBranchObj = selectedBranchId === 'all'
    ? null
    : branches.find(b => b.id === selectedBranchId);

  return (
    <aside
      className={`bg-[#022c22] text-emerald-50 border-r border-[#064e3b] flex flex-col justify-between shrink-0 transition-all duration-200 z-30 shadow-2xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
        
        {/* Brand Logo & Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#064e3b] shrink-0 bg-[#012019]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full border border-emerald-400/40 p-0.5 shadow-md bg-white overflow-hidden flex items-center justify-center shrink-0">
              <Image src="/logo.png" alt="Medix Logo" width={40} height={40} className="h-full w-full rounded-full object-contain" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-black text-base text-white tracking-tight block leading-none">Medix</span>
                <span className="text-[8px] font-black text-emerald-300 tracking-wider uppercase opacity-95 mt-0.5 inline-block">
                  HEALTH GROW INDIA
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-lg border border-[#0a5c46] bg-[#04382c] text-emerald-200 hover:bg-[#046a4e] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Divisions & Nav Items */}
        <div className="p-3 space-y-5 flex-1">
          {NAV_DIVISIONS.map((divisionGroup) => (
            <div key={divisionGroup.division} className="space-y-1">
              
              {/* Category Heading in Tea Green */}
              {!collapsed && (
                <div className="px-3 py-1 text-[10px] font-black text-[#6ee7b7] uppercase tracking-widest">
                  {divisionGroup.division}
                </div>
              )}

              {/* Items in Division */}
              <div className="space-y-0.5">
                {divisionGroup.items.map((item, idx) => {
                  const baseHref = item.href.split('?')[0];
                  const isActive = pathname === baseHref;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${item.name}-${idx}`}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all group ${
                        isActive
                          ? 'bg-[#044e3b] text-emerald-100 shadow-md border-l-3 border-[#10b981] font-black'
                          : 'text-emerald-100/90 hover:bg-[#04382c] hover:text-white'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-400/20 text-amber-300 rounded border border-amber-400/40">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* User Card Footer */}
        {!collapsed && (
          <div className="p-3.5 border-t border-[#064e3b] bg-[#012019] shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0">
                {userRole === 'super_admin' ? 'SA' : userRole === 'branch_admin' ? 'BA' : 'R'}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-xs text-white truncate">
                  {userRole === 'super_admin' ? 'Mr. Ratul (Super Admin)' : activeBranchObj?.adminName || 'Branch Central Admin'}
                </p>
                <p className="text-[10px] font-bold text-emerald-300 capitalize">
                  {userRole.replace('_', ' ')}
                </p>
                <span className="text-[9px] font-extrabold text-emerald-200 bg-[#064e3b] border border-emerald-500/40 px-1.5 py-0.5 rounded inline-block mt-0.5 truncate">
                  {activeBranchObj ? activeBranchObj.code : 'GLOBAL 9-BRANCH NETWORK'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
