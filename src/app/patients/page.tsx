"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Users, Eye, FileText } from 'lucide-react';

function PatientListContent() {
  const { patients, branches, selectedBranchId } = useApp();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search')?.toLowerCase() || '';

  let filtered = selectedBranchId === 'all'
    ? (patients || [])
    : (patients || []).filter(p => p && p.branchId === selectedBranchId);

  if (searchQuery) {
    filtered = filtered.filter(p => {
      if (!p) return false;
      const name = p.name?.toLowerCase() || '';
      const uhid = p.uhid?.toLowerCase() || '';
      const cond = p.condition?.toLowerCase() || '';
      return name.includes(searchQuery) || uhid.includes(searchQuery) || cond.includes(searchQuery);
    });
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white p-10 sm:p-14 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
        <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
          <Users className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Patient Records Found</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          No registered patients exist in this branch yet. When patients register through the portal or are admitted by the hospital reception, their EHR passports will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-extrabold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">UHID</th>
            <th className="px-6 py-4">Hospital Branch</th>
            <th className="px-6 py-4">Patient Name</th>
            <th className="px-6 py-4">Age / Gender</th>
            <th className="px-6 py-4">Blood Group</th>
            <th className="px-6 py-4">Primary Condition</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">EHR Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {filtered.map(patient => {
            const branch = branches.find(b => b.id === patient.branchId);
            const isAdmitted = patient.status === 'admitted';
            return (
              <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-sky-700">
                  <Link href={`/patients/${patient.uhid}`} className="hover:underline flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-500" />
                    <span>{patient.uhid}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {branch?.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  <Link href={`/patients/${patient.uhid}`} className="hover:text-sky-600 transition-colors">
                    {patient.name}
                  </Link>
                </td>
                <td className="px-6 py-4">{patient.age} Yrs / {patient.gender}</td>
                <td className="px-6 py-4 font-bold text-rose-600">{patient.bloodGroup}</td>
                <td className="px-6 py-4">{patient.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                    isAdmitted
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {isAdmitted ? 'INPATIENT (IPD)' : 'OUTPATIENT (OPD)'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/patients/${patient.uhid}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View EHR</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-sky-600" />
            <span>Patients & Electronic Health Records (EHR)</span>
          </h1>
          <p className="text-xs text-slate-500">Universal Health ID (UHID) patient database and admission tracking</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-6 text-xs text-slate-500 font-bold">Loading EHR Patient Records...</div>}>
        <PatientListContent />
      </Suspense>
    </div>
  );
}
