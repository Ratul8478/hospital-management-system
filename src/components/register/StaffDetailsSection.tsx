"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface StaffDetailsSectionProps {
  staffRole: 'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant';
  setStaffRole: (val: 'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant') => void;
}

export default function StaffDetailsSection({
  staffRole,
  setStaffRole,
}: StaffDetailsSectionProps) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm">
        <Users className="w-4 h-4" />
        <span>Hospital Operations Staff Designation</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Operational Role / Department *
        </label>
        <select
          value={staffRole}
          onChange={(e) =>
            setStaffRole(
              e.target.value as 'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant'
            )
          }
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
        >
          <option value="receptionist">Front Desk Receptionist & Patient Intake</option>
          <option value="pharmacist">Pharmacy Store Manager & Dispenser</option>
          <option value="lab_technician">Diagnostic Pathology & Lab Specialist</option>
          <option value="accountant">Accounts & Billing Officer</option>
        </select>
      </div>
    </div>
  );
}
