"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  User,
  Phone,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  TestTube2,
  BedDouble,
  Receipt,
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileDown,
} from 'lucide-react';

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { patients, invoices, labRequests, medicines, beds } = useApp();

  const patientId = Number(params?.id) || 1;
  const patient = patients.find(p => p.id === patientId) || patients[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prescriptions' | 'labs' | 'ipd' | 'billing'>('overview');

  const patientInvoices = invoices.filter(i => i.patientName.toLowerCase().includes(patient.name.toLowerCase()));
  const patientLabs = labRequests.filter(l => l.patientName.toLowerCase().includes(patient.name.toLowerCase()));
  const patientBed = beds.find(b => b.patientName?.toLowerCase().includes(patient.name.toLowerCase()));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Patients Directory
      </button>

      {/* Patient Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-sky-600/20 shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{patient.name}</h1>
                <span className="px-2.5 py-0.5 text-xs font-black bg-sky-100 text-sky-800 rounded-md font-mono">
                  {patient.uhid}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${
                  patient.status === 'admitted' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                <span>{patient.age} Yrs / {patient.gender}</span>
                <span>•</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Blood Group: {patient.bloodGroup}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {patient.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert(`Printing EHR Summary for ${patient.name}...`)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" /> Download EHR Record
            </button>
            <button
              onClick={() => router.push('/appointments')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all"
            >
              Book OPD Appointment
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-100 pt-4 flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'history', label: 'Medical History', icon: FileText },
            { key: 'prescriptions', label: 'Prescriptions', icon: Pill },
            { key: 'labs', label: 'Lab Reports', icon: TestTube2 },
            { key: 'ipd', label: 'IPD Admissions', icon: BedDouble },
            { key: 'billing', label: 'Invoices & Billing', icon: Receipt },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                  isActive ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">Primary Diagnosis & Condition</h3>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <p className="font-bold text-sm text-amber-950">{patient.condition}</p>
              <p className="mt-1 text-amber-800">
                Patient presenting under active supervision. Standard clinical protocol engaged.
              </p>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 pt-2">Vitals & Clinical Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Blood Pressure</span>
                <p className="font-black text-sm text-slate-900 mt-0.5">120/80 mmHg</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Heart Rate</span>
                <p className="font-black text-sm text-slate-900 mt-0.5">74 bpm</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">SpO2</span>
                <p className="font-black text-sm text-emerald-600 mt-0.5">99% Normal</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Body Temp</span>
                <p className="font-black text-sm text-slate-900 mt-0.5">98.6 °F</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">Active Bed Allocation</h3>
            {patientBed ? (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-sky-900 text-sm">{patientBed.bedNumber}</span>
                  <span className="px-2 py-0.5 bg-sky-600 text-white font-bold text-[10px] rounded uppercase">{patientBed.wardType} WARD</span>
                </div>
                <p className="text-slate-600">Daily Charge: ${patientBed.dailyCharge}/day</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium">Patient currently not admitted in IPD ward.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">Invoices & Financial History</h3>
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {patientInvoices.map(inv => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-bold text-sky-700">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-sans text-slate-600">{inv.date}</td>
                  <td className="px-4 py-3 font-black text-slate-900">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 font-sans">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
