"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { Stethoscope } from 'lucide-react';

export default function DoctorsPage() {
  const { doctors, branches, selectedBranchId } = useApp();

  const filteredDoctors = selectedBranchId === 'all'
    ? doctors
    : doctors.filter(d => d.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-sky-600" />
            <span>Specialist Doctors & OPD Roster</span>
          </h1>
          <p className="text-xs text-slate-500">Consultant availability and OPD consultation fee schedules</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-sky-100 text-sky-800 rounded-full">
          {filteredDoctors.length} Active Specialists
        </span>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Doctors Added Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The doctor roster is currently empty. Doctors registered by administrators or onboarding specialists will automatically appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const branch = branches.find(b => b.id === doc.branchId);
            return (
              <div key={doc.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-sky-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-sky-600/20">
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{doc.name}</h3>
                      <p className="text-xs font-bold text-sky-600">{doc.specialty}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded">
                    {branch?.code}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <div className="flex items-center justify-between">
                    <span>OPD Consultation Fee:</span>
                    <span className="font-extrabold text-slate-900">₹{doc.fee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      doc.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.status === 'busy'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>{doc.status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Direct Line:</span>
                    <span className="font-bold text-slate-700">{doc.contact}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-bold text-xs border border-sky-200 transition-all cursor-pointer">
                  Book Consultation Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
