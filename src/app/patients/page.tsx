"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Users } from 'lucide-react';

function PatientListContent() {
  const { patients, branches, selectedBranchId } = useApp();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search')?.toLowerCase() || '';

  let filtered = selectedBranchId === 'all'
    ? patients
    : patients.filter(p => p.branchId === selectedBranchId);

  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.uhid.toLowerCase().includes(searchQuery) ||
      p.condition.toLowerCase().includes(searchQuery)
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {filtered.map(patient => {
            const branch = branches.find(b => b.id === patient.branchId);
            const isAdmitted = patient.status === 'admitted';
            return (
              <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-sky-700">{patient.uhid}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {branch?.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{patient.name}</td>
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
