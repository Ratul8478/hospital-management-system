"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  BarChart3,
  Crown,
  Building2,
  Share2,
  Key,
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
  Mail,
  UserCheck,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

interface NavDivision {
  division: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const {
    userRole,
    selectedBranchId,
    superAdminProfile,
    branches,
    marketingJoinRequests,
    marketingRepresentatives,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname, setIsMobileSidebarOpen]);

  const directHqCount = marketingJoinRequests.filter(r => r.targetBranchId === 1 && r.status === 'pending_super_admin_approval').length;
  const branchForwardedCount = marketingJoinRequests.filter(r => r.targetBranchId !== 1 && r.status === 'pending_super_admin_approval').length;
  const totalRepsCount = marketingRepresentatives.length;

  const NAV_DIVISIONS: NavDivision[] = useMemo(() => {
    // 1. PATIENT ROLE - STRICTLY PATIENT EHR PORTAL ONLY
    if (userRole === 'patient') {
      return [
        {
          division: 'PATIENT CARE PORTAL',
          items: [
            { name: 'My Care Dashboard', href: '/dashboard/patient', icon: BarChart3, iconColor: 'text-emerald-300' },
            { name: 'My Appointments & Tokens', href: '/appointments', icon: CalendarDays, iconColor: 'text-teal-300' },
            { name: 'Prescriptions & Medicines', href: '/pharmacy', icon: Pill, iconColor: 'text-amber-200' },
            { name: 'Diagnostic Lab Reports', href: '/laboratory', icon: FlaskConical, iconColor: 'text-cyan-300' },
            { name: 'Billing & Receipts', href: '/billing', icon: Receipt, iconColor: 'text-emerald-200' },
          ],
        },
      ];
    }

    // 2. DOCTOR ROLE - CLINICAL OPD SUITE
    if (userRole === 'doctor') {
      return [
        {
          division: 'DOCTOR CLINICAL SUITE',
          items: [
            { name: 'OPD Doctor Desk', href: '/dashboard/doctor', icon: Stethoscope, iconColor: 'text-teal-300' },
            { name: 'Receptionist Desk', href: '/receptionist', icon: Building2, iconColor: 'text-amber-300' },
            { name: 'Appointments Queue', href: '/appointments', icon: CalendarDays, iconColor: 'text-emerald-300' },
            { name: 'Patient Directory (EHR)', href: '/patients', icon: User, iconColor: 'text-sky-300' },
            { name: 'Pharmacy & Prescriptions', href: '/pharmacy', icon: Pill, iconColor: 'text-amber-200' },
            { name: 'Diagnostic Lab Orders', href: '/laboratory', icon: FlaskConical, iconColor: 'text-cyan-300' },
            { name: 'Inpatient Beds', href: '/beds', icon: BedDouble, iconColor: 'text-rose-300' },
          ],
        },
      ];
    }

    // 3. BRANCH ADMIN ROLE - SCOPED TO SINGLE BRANCH
    if (userRole === 'branch_admin') {
      return [
        {
          division: 'BRANCH EXECUTIVE',
          items: [
            { name: 'Branch Command Hub', href: '/dashboard/branch-admin', icon: Building2, iconColor: 'text-emerald-300' },
            { name: 'Marketing Candidates', href: '/dashboard/branch-admin', icon: Share2, iconColor: 'text-purple-300' },
          ],
        },
        {
          division: 'CLINICAL SERVICES',
          items: [
            { name: 'Receptionist Desk', href: '/receptionist', icon: Building2, iconColor: 'text-amber-300', badge: 'Front Desk' },
            { name: 'Patients (EHR)', href: '/patients', icon: User, iconColor: 'text-teal-300' },
            { name: 'Appointments & Tokens', href: '/appointments', icon: CalendarDays, iconColor: 'text-emerald-300' },
            { name: 'OPD Doctors', href: '/doctors', icon: Stethoscope, iconColor: 'text-teal-200' },
            { name: 'IPD & Bed Matrix', href: '/beds', icon: BedDouble, iconColor: 'text-rose-300' },
            { name: 'Pharmacy & POS', href: '/pharmacy', icon: Pill, iconColor: 'text-amber-200' },
            { name: 'Laboratory Diagnostics', href: '/laboratory', icon: FlaskConical, iconColor: 'text-cyan-300' },
          ],
        },
        {
          division: 'BRANCH FINANCE',
          items: [
            { name: 'Billing & Invoicing', href: '/billing', icon: Receipt, iconColor: 'text-emerald-200' },
            { name: 'Accounts & Ledger', href: '/accounting', icon: Coins, iconColor: 'text-amber-300' },
          ],
        },
      ];
    }

    // 4. SUPER ADMIN (Full Master Headquarters Access)
    return [
      {
        division: 'EXECUTIVE COMMAND',
        items: [
          { name: 'Campus Dashboard', href: '/dashboard/super-admin', icon: BarChart3, iconColor: 'text-emerald-300' },
          { name: 'Central Branches Hub', href: '/dashboard/super-admin?tab=branches', icon: Crown, iconColor: 'text-amber-300', badge: `${branches.length} Nodes` },
        ],
      },
      {
        division: 'MARKETING & FIELD FORCE',
        items: [
          {
            name: '👑 HQ Direct Queue',
            href: '/dashboard/super-admin?tab=marketing-hq',
            icon: Crown,
            iconColor: 'text-amber-400',
            badge: directHqCount > 0 ? `${directHqCount} Pending` : undefined,
            badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          },
          {
            name: '🏬 Branch Forwarded',
            href: '/dashboard/super-admin?tab=marketing-branch',
            icon: Building2,
            iconColor: 'text-indigo-300',
            badge: branchForwardedCount > 0 ? `${branchForwardedCount} Wait SA` : undefined,
            badgeColor: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40',
          },
          {
            name: '👥 Marketing Directory',
            href: '/dashboard/super-admin?tab=marketing',
            icon: Share2,
            iconColor: 'text-purple-300',
            badge: `${totalRepsCount} Reps`,
            badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
          },
          {
            name: '💼 Marketing Portal',
            href: '/dashboard/marketing',
            icon: UserCheck,
            iconColor: 'text-teal-300',
          },
        ],
      },
      {
        division: 'CLINICAL & PATIENTS',
        items: [
          { name: 'Receptionist Command Hub', href: '/receptionist', icon: Building2, iconColor: 'text-amber-300', badge: 'Front Desk' },
          { name: 'Patients (EHR)', href: '/patients', icon: User, iconColor: 'text-teal-300' },
          { name: 'Appointments & Tokens', href: '/appointments', icon: CalendarDays, iconColor: 'text-emerald-300' },
          { name: 'OPD Workspace', href: '/doctors', icon: Stethoscope, iconColor: 'text-teal-200' },
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
          { name: 'Admin Requests Queue', href: '/dashboard/super-admin?tab=applications', icon: ClipboardList, iconColor: 'text-amber-300' },
          { name: 'User Accounts', href: '/admin', icon: Users, iconColor: 'text-emerald-300' },
          { name: 'Roles & Permissions', href: '/admin', icon: Shield, iconColor: 'text-teal-300' },
          { name: 'Hospital Settings', href: '/admin', icon: Settings, iconColor: 'text-emerald-200' },
          { name: 'Audit Trail', href: '/admin', icon: ClipboardList, iconColor: 'text-emerald-300' },
        ],
      },
    ];
  }, [userRole, branches.length, directHqCount, branchForwardedCount, totalRepsCount]);

  const activeBranchObj = selectedBranchId === 'all'
    ? null
    : branches.find(b => b.id === selectedBranchId);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-[#022c22] text-emerald-50 border-r border-[#064e3b] transition-all duration-200 z-30 shadow-2xl ${
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

                        {!collapsed && mounted && item.badge && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-black rounded border ${
                            item.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          }`}>
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
          {!collapsed && mounted && (
            <div className="p-3.5 border-t border-[#064e3b] bg-[#012019] shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0">
                  {userRole === 'super_admin' ? 'SA' : userRole === 'branch_admin' ? 'BA' : 'R'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-xs text-white truncate">
                    {userRole === 'super_admin' ? (superAdminProfile?.managerName || 'Anichul Haque') + ' (Super Admin)' : activeBranchObj?.adminName || 'Branch Admin'}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-300 capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                  <span className="text-[9px] font-extrabold text-emerald-200 bg-[#064e3b] border border-emerald-500/40 px-1.5 py-0.5 rounded inline-block mt-0.5 truncate">
                    {activeBranchObj ? activeBranchObj.code : 'ARIYAN HOSPITAL HQ'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#022c22] border-r border-[#064e3b] text-emerald-50 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* Mobile Header with Close Button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-[#064e3b] shrink-0 bg-[#012019]">
              <Link href="/" onClick={() => setIsMobileSidebarOpen(false)} className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full border border-emerald-400/40 p-0.5 shadow-md bg-white overflow-hidden flex items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="Medix Logo" width={40} height={40} className="h-full w-full rounded-full object-contain" />
                </div>
                <div>
                  <span className="font-black text-base text-white tracking-tight block leading-none">Medix</span>
                  <span className="text-[8px] font-black text-emerald-300 tracking-wider uppercase opacity-95 mt-0.5 inline-block">
                    HEALTH GROW INDIA
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg border border-[#0a5c46] bg-[#04382c] text-emerald-200 hover:bg-[#046a4e] hover:text-white transition-colors cursor-pointer"
                aria-label="Close Mobile Sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="p-3 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
              {NAV_DIVISIONS.map((divisionGroup) => (
                <div key={divisionGroup.division} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-black text-[#6ee7b7] uppercase tracking-widest">
                    {divisionGroup.division}
                  </div>
                  <div className="space-y-0.5">
                    {divisionGroup.items.map((item, idx) => {
                      const baseHref = item.href.split('?')[0];
                      const isActive = pathname === baseHref;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={`mobile-${item.name}-${idx}`}
                          href={item.href}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group ${
                            isActive
                              ? 'bg-[#044e3b] text-emerald-100 shadow-md border-l-3 border-[#10b981] font-black'
                              : 'text-emerald-100/90 hover:bg-[#04382c] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 shrink-0 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                            <span className="truncate">{item.name}</span>
                          </div>

                          {mounted && item.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded border ${
                              item.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            }`}>
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

            {/* Mobile User Card Footer */}
            {mounted && (
              <div className="p-3.5 border-t border-[#064e3b] bg-[#012019] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0">
                    {userRole === 'super_admin' ? 'SA' : userRole === 'branch_admin' ? 'BA' : 'R'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-xs text-white truncate">
                      {userRole === 'super_admin' ? (superAdminProfile?.managerName || 'Anichul Haque') + ' (Super Admin)' : activeBranchObj?.adminName || 'Branch Admin'}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-300 capitalize">
                      {userRole.replace('_', ' ')}
                    </p>
                    <span className="text-[9px] font-extrabold text-emerald-200 bg-[#064e3b] border border-emerald-500/40 px-1.5 py-0.5 rounded inline-block mt-0.5 truncate">
                      {activeBranchObj ? activeBranchObj.code : 'ARIYAN HOSPITAL HQ'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
