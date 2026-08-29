"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { TestTube2 } from 'lucide-react';

export default function LaboratoryPage() {
  const { labRequests, branches, selectedBranchId } = useApp();

  const filteredLabRequests = selectedBranchId === 'all'
    ? (labRequests || [])
    : (labRequests || []).filter(l => l && l.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <TestTube2 className="h-6 w-6 text-sky-600" />
            <span>Laboratory Diagnostics Queue</span>
          </h1>
          <p className="text-xs text-slate-500">Diagnostic test requisitions and report approval workflow</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-sky-100 text-sky-800 rounded-full">
          {filteredLabRequests.length} Diagnostic Requests
        </span>
      </div>

      {filteredLabRequests.length === 0 ? (
        <div className="bg-white p-10 sm:p-14 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <TestTube2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Diagnostic Requests</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            The laboratory queue is currently clear. When clinicians order pathology or radiology tests, they will populate here for lab processing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLabRequests.map(req => {
            const branch = branches.find(b => b.id === req.branchId);
            const isReady = req.status === 'ready';
            return (
              <div key={req.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded">
                      {branch?.code}
                    </span>
                    <span className="text-xs text-sky-700 font-mono font-bold">{req.requestNumber}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                    isReady
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isReady ? 'REPORT READY' : 'PROCESSING'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{req.testName}</h3>
                  <p className="text-xs text-slate-500">Category: <span className="text-slate-900 font-bold">{req.category}</span></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p><span className="text-slate-400">Patient:</span> <strong className="text-slate-900">{req.patientName}</strong></p>
                  <p><span className="text-slate-400">Ordering Physician:</span> {req.doctorName}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
