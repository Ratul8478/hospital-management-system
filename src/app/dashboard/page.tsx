"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { userRole } = useApp();

  useEffect(() => {
    switch (userRole) {
      case 'super_admin':
        router.replace('/dashboard/super-admin');
        break;
      case 'branch_admin':
        router.replace('/dashboard/branch-admin');
        break;
      case 'doctor':
        router.replace('/dashboard/doctor');
        break;
      case 'receptionist':
        router.replace('/receptionist');
        break;
      case 'patient':
        router.replace('/dashboard/patient');
        break;
      case 'accountant':
        router.replace('/accounting');
        break;
      case 'pharmacist':
        router.replace('/pharmacy');
        break;
      case 'lab_technician':
        router.replace('/laboratory');
        break;
      case 'franchise_partner':
        router.replace('/franchise');
        break;
      default:
        router.replace('/dashboard/super-admin');
        break;
    }
  }, [userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Medix Clinical Dashboard...</p>
      </div>
    </div>
  );
}