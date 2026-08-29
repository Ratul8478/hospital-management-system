"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Appointment } from '@/lib/data';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function AppointmentsPage() {
  const { appointments, doctors, branches, selectedBranchId, addAppointment, updateAppointmentStatus } = useApp();
  
  const [viewMode, setViewMode] = useState<'list' | 'token_queue'>('token_queue');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  // New appointment form state
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');
  const [doctorId, setDoctorId] = useState<number>(doctors[0]?.id || 1);
  const [appType, setAppType] = useState<Appointment['type']>('OPD');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [appTime, setAppTime] = useState('10:00 AM');

  // Filter appointments with defensive null safety
  const filteredApps = (appointments || []).filter(app => {
    if (!app) return false;
    if (selectedBranchId !== 'all' && app.branchId !== selectedBranchId) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const ptName = app.patientName?.toLowerCase() || '';
      const ptUhid = app.uhid?.toLowerCase() || '';
      const docName = app.doctorName?.toLowerCase() || '';
      return ptName.includes(q) || ptUhid.includes(q) || docName.includes(q);
    }
    return true;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !uhid) return;
    const selectedDoc = (doctors || []).find(d => d.id === Number(doctorId)) || doctors[0];
    addAppointment({
      branchId: selectedDoc?.branchId || 1,
      patientName,
      uhid,
      doctorName: selectedDoc?.name || 'Dr. Assigned',
      department: selectedDoc?.specialty || 'General OPD',
      appointmentDate: appDate,
      appointmentTime: appTime,
      type: appType,
      status: 'Scheduled',
    });
    setPatientName('');
    setUhid('');
    setShowBookModal(false);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'In Consultation':
        return <span className="px-2.5 py-1 text-xs font-bold bg-sky-100 text-sky-800 rounded-full flex items-center gap-1 border border-sky-300"><Play className="h-3 w-3 fill-sky-600" /> In Consultation</span>;
      case 'Waiting':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1 border border-amber-300"><Clock className="h-3 w-3" /> Waiting in Queue</span>;
      case 'Scheduled':
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full flex items-center gap-1 border border-slate-300"><Calendar className="h-3 w-3" /> Scheduled</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 border border-emerald-300"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-full flex items-center gap-1 border border-rose-300"><XCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-black bg-sky-100 text-sky-800 rounded-md uppercase tracking-wider">
              PRD Section 10 — Token Queue System
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Appointments & OPD Token Management</h1>
          <p className="text-sm font-medium text-slate-500">
            Real-time daily token queue generation, status transitions & doctor consultations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('token_queue')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'token_queue' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Token Queue
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Appointments
            </button>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Now In Consultation</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {appointments.filter(a => a.status === 'In Consultation').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waiting Tokens</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {appointments.filter(a => a.status === 'Waiting').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Today</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {appointments.filter(a => a.status === 'Completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scheduled</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{appointments.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient, UHID, Doctor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Waiting">Waiting</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Queue View */}
      {filteredApps.length === 0 ? (
        <div className="bg-white p-10 sm:p-14 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Appointments in Queue</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            There are currently no active appointments or live consultation tokens in the queue. You can schedule a new appointment using the button above.
          </p>
        </div>
      ) : viewMode === 'token_queue' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map(app => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
                app.status === 'In Consultation'
                  ? 'border-sky-500 ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl">
                  TOKEN #{app.tokenNumber}
                </span>
                {getStatusBadge(app.status)}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{app.patientName}</h3>
                <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">{app.uhid}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="font-bold text-slate-800">{app.doctorName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{app.department}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{app.appointmentDate} at {app.appointmentTime}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {app.status === 'Waiting' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'In Consultation')}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" /> Call into Consultation
                  </button>
                )}
                {app.status === 'In Consultation' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Consultation Complete
                  </button>
                )}
                {app.status === 'Scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'Waiting')}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Clock className="h-4 w-4" /> Patient Arrived (Queue)
                  </button>
                )}
                {app.status === 'Completed' && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-full text-center">
                    Consultation Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-5 py-3.5">Token #</th>
                  <th className="px-5 py-3.5">Patient / UHID</th>
                  <th className="px-5 py-3.5">Doctor & Dept</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-black text-sky-700">#{app.tokenNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-900">{app.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{app.uhid}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{app.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{app.department}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {app.appointmentDate} <br /><span className="text-[11px] text-slate-400">{app.appointmentTime}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                        {app.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => updateAppointmentStatus(app.id, app.status === 'Waiting' ? 'In Consultation' : 'Completed')}
                        className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-lg transition-colors"
                      >
                        Advance Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">New OPD Appointment & Token</h2>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleBook} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Smith"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">UHID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UHID-B1-20260811-0099"
                  value={uhid}
                  onChange={e => setUhid(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={doctorId}
                  onChange={e => setDoctorId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                >
                  {(doctors || []).map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialty} (₹{d.fee})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={appDate}
                    onChange={e => setAppDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Type</label>
                  <select
                    value={appType}
                    onChange={e => setAppType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="OPD">OPD</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20"
                >
                  Generate Token & Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
