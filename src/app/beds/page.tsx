"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { BedDouble } from 'lucide-react';

export default function BedsPage() {
  const { beds, branches, selectedBranchId } = useApp();

  const filteredBeds = selectedBranchId === 'all'
    ? beds
    : beds.filter(b => b.branchId === selectedBranchId);

  const totalOccupied = filteredBeds.filter(b => b.status === 'occupied').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BedDouble className="h-6 w-6 text-sky-600" />
            <span>Inpatient Ward & Bed Occupancy Matrix</span>
          </h1>
          <p className="text-xs text-slate-500">Real-time ICU, General, Private, and Deluxe ward bed tracking</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Occupied Rate</span>
          <span className="text-xl font-black text-rose-600">{totalOccupied} / {filteredBeds.length} Beds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredBeds.map(bed => {
          const branch = branches.find(b => b.id === bed.branchId);
          const isOccupied = bed.status === 'occupied';
          return (
            <div key={bed.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded">
                  {branch?.code}
                </span>
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                  isOccupied
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : bed.status === 'maintenance'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {bed.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{bed.bedNumber}</h3>
                <p className="text-xs font-bold text-sky-600">Ward: {bed.wardType.toUpperCase()}</p>
                <p className="text-xs text-slate-500">Daily Charge: <span className="font-bold text-slate-900">${bed.dailyCharge}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                {isOccupied ? (
                  <p><span className="text-slate-400">Patient:</span> <strong className="text-slate-900">{bed.patientName}</strong></p>
                ) : (
                  <p className="text-emerald-600 font-bold">Ready for IPD admission</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
