"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Stethoscope,
  Calendar,
  Users,
  FileText,
  Activity,
  Award,
  DollarSign,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  FileCheck,
  Building2,
  Phone,
  ShieldCheck,
  Lock,
  LogOut,
  Sparkles,
  ArrowLeft,
  Bell,
  RefreshCw,
  QrCode,
  Download,
  Wifi,
  Battery,
  Layers,
  MapPin,
  TrendingUp,
  CreditCard,
  Check
} from 'lucide-react';

export default function AndroidDoctorSimulator() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<'login' | 'home' | 'appointments' | 'patients' | 'patient_detail' | 'prescription' | 'reports' | 'admissions' | 'earnings' | 'profile' | 'leave'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [dutyStatus, setDutyStatus] = useState<'AVAILABLE' | 'IN_CONSULT' | 'OFF_DUTY'>('AVAILABLE');
  
  // Active selection state
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('Hypertension Stage 2 with Angina symptoms');
  const [rxMedicines, setRxMedicines] = useState([
    { id: 1, name: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: 'Twice Daily (1-0-1)', duration: '30 Days', instructions: 'After meals' },
    { id: 2, name: 'Metformin 500mg', dosage: '1 Tablet', frequency: 'Once Daily (1-0-0)', duration: '30 Days', instructions: 'Before breakfast' },
  ]);
  const [rxSuccess, setRxSuccess] = useState(false);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Conference Leave');
  const [leaveReason, setLeaveReason] = useState('National Cardiology Summit 2026');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Time state for status bar
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const doctorData = {
    name: 'Dr. Robert Sullivan',
    specialty: 'Cardiology & Heart Care',
    hospital: 'Medix Central Multispecialty (Mumbai)',
    uhid: 'DOC-B1-7890',
    experience: '18+ Years',
    rating: '4.9 ★ (142 reviews)',
    fee: '₹ 800',
    todayConsults: 18,
    queueCount: 6,
    completedCount: 12,
    pendingReports: 3,
    earningsToday: '₹ 14,400',
    earningsMonth: '₹ 1,84,500'
  };

  const appointments = [
    { id: 1, token: 'TK-101', patient: 'Rahul Sharma', age: 45, gender: 'Male', uhid: 'UHID-B1-2026-901', time: '10:00 AM', status: 'waiting', condition: 'Chest tightness, BP 142/92' },
    { id: 2, token: 'TK-102', patient: 'Pooja Verma', age: 38, gender: 'Female', uhid: 'UHID-B1-2026-902', time: '10:15 AM', status: 'in_progress', condition: 'Follow-up ECG & Holter Review' },
    { id: 3, token: 'TK-103', patient: 'Amit Trivedi', age: 52, gender: 'Male', uhid: 'UHID-B1-2026-903', time: '10:30 AM', status: 'waiting', condition: 'Post-CABG Stent Evaluation' },
    { id: 4, token: 'TK-104', patient: 'Priyanka Sen', age: 29, gender: 'Female', uhid: 'UHID-B1-2026-904', time: '09:30 AM', status: 'completed', condition: 'Arrhythmia Palpitation check' },
    { id: 5, token: 'TK-105', patient: 'Vikram Malhotra', age: 61, gender: 'Male', uhid: 'UHID-B1-2026-905', time: '09:15 AM', status: 'completed', condition: 'Hyperlipidemia Medication Refill' },
  ];

  const patientsList = [
    { id: 1, name: 'Rahul Sharma', uhid: 'UHID-B1-2026-901', age: 45, gender: 'Male', blood: 'O+', phone: '+91 98201 12345', condition: 'Hypertension Stage 2', status: 'OPD Active' },
    { id: 2, name: 'Pooja Verma', uhid: 'UHID-B1-2026-902', age: 38, gender: 'Female', blood: 'B+', phone: '+91 98201 54321', condition: 'Post-Op Knee Rehab', status: 'Admitted (ICU-04)' },
    { id: 3, name: 'Amit Trivedi', uhid: 'UHID-B1-2026-903', age: 52, gender: 'Male', blood: 'A+', phone: '+91 98201 98765', condition: 'Coronary Artery Disease', status: 'OPD Active' },
    { id: 4, name: 'Priyanka Sen', uhid: 'UHID-B1-2026-904', age: 29, gender: 'Female', blood: 'AB+', phone: '+91 98201 67890', condition: 'Maternal Telehealth', status: 'Discharged' },
  ];

  const reportsList = [
    { id: 1, test: 'Comprehensive Lipid Profile & HbA1c', patient: 'Rahul Sharma', uhid: 'UHID-B1-2026-901', date: 'Today, 09:30 AM', status: 'READY', critical: false },
    { id: 2, test: 'High-Sensitivity Troponin-I & ECG', patient: 'Pooja Verma', uhid: 'UHID-B1-2026-902', date: 'Today, 09:00 AM', status: 'READY', critical: true },
    { id: 3, test: '2D Echocardiography with Doppler', patient: 'Amit Trivedi', uhid: 'UHID-B1-2026-903', date: 'Today, 10:15 AM', status: 'PROCESSING', critical: false },
  ];

  const admissionsList = [
    { id: 1, patient: 'Pooja Verma', uhid: 'UHID-B1-2026-902', ward: 'ICU WING', bed: 'ICU-BED-04', daily: '₹ 8,500', admDate: '14 Aug 2026', status: 'ICU Care', notes: 'Continuous telemetry. Vitals stable.' },
    { id: 2, patient: 'Suresh Raina', uhid: 'UHID-B1-2026-802', ward: 'DELUXE SUITE', bed: 'DLX-201', daily: '₹ 5,000', admDate: '15 Aug 2026', status: 'Post-Op Recovery', notes: 'Physical therapy round completed.' },
    { id: 3, patient: 'Kiran Patel', uhid: 'UHID-B1-2026-803', ward: 'GENERAL WARD', bed: 'GEN-108', daily: '₹ 1,500', admDate: '13 Aug 2026', status: 'Under Observation', notes: 'IV antibiotics cycle 3 of 5.' },
  ];

  const filteredAppointments = activeTab === 'all'
    ? appointments
    : appointments.filter(a => a.status === activeTab);

  const addMedicineRow = () => {
    setRxMedicines([
      ...rxMedicines,
      { id: Date.now(), name: 'Atorvastatin 20mg', dosage: '1 Tablet', frequency: 'Once at Bedtime (0-0-1)', duration: '30 Days', instructions: 'After dinner' }
    ]);
  };

  const removeMedicineRow = (id: number) => {
    setRxMedicines(rxMedicines.filter(m => m.id !== id));
  };

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRxSuccess(true);
    setTimeout(() => {
      setRxSuccess(false);
      setCurrentScreen('appointments');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-emerald-400 selection:text-emerald-950">
      
      {/* TOP DESKTOP CONTROLLER BAR */}
      <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#044e3b] border border-emerald-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Medix Doctor Native Android App</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                v1.0.0 (Kotlin / Compose)
              </span>
            </h1>
            <p className="text-xs text-emerald-200/80">
              Live Android companion connected to Shared REST API (`/api/v1/*`)
            </p>
          </div>
        </div>

        {/* Quick Screen Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'home' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentScreen('appointments')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'appointments' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Queue
          </button>
          <button
            onClick={() => setCurrentScreen('prescription')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'prescription' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Rx Pad
          </button>
          <button
            onClick={() => setCurrentScreen('patients')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'patients' || currentScreen === 'patient_detail' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Patients
          </button>
          <button
            onClick={() => setCurrentScreen('reports')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'reports' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Reports
          </button>
          <button
            onClick={() => setCurrentScreen('admissions')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'admissions' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            IPD
          </button>
          <button
            onClick={() => setCurrentScreen('earnings')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'earnings' ? 'bg-emerald-400 text-emerald-950 font-black shadow' : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900'}`}
          >
            Earnings
          </button>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black flex items-center gap-1 transition-all"
          >
            Web Portal <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ANDROID PHONE SHELL CONTAINER */}
      <div className="relative w-full max-w-[390px] h-[820px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-emerald-500/40 ring-12 ring-slate-900/60 flex flex-col justify-between overflow-hidden">
        
        {/* HARDWARE SPEAKER / CAMERA NOTCH */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* ANDROID DEVICE SCREEN CANVAS */}
        <div className="w-full h-full bg-[#F5F8FB] text-slate-900 rounded-[38px] overflow-hidden flex flex-col justify-between relative shadow-inner">
          
          {/* ANDROID SYSTEM STATUS BAR */}
          <div className="pt-3 px-6 pb-2 bg-[#123B5D] text-white flex items-center justify-between text-xs font-semibold z-40">
            <span>{timeStr}</span>
            <div className="flex items-center gap-2 text-[11px]">
              <Wifi className="w-3.5 h-3.5" />
              <span>5G</span>
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* SCREEN CONTENT AREA (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            
            {/* 1. HOME SCREEN */}
            {currentScreen === 'home' && (
              <div className="space-y-4 pb-20 animate-in fade-in">
                {/* Doctor Shift Top Header */}
                <div className="bg-[#123B5D] text-white p-5 pt-2 rounded-b-3xl shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-lg">
                        DR
                      </div>
                      <div>
                        <h2 className="font-black text-base leading-snug">{doctorData.name}</h2>
                        <p className="text-[11px] text-emerald-200">{doctorData.specialty}</p>
                      </div>
                    </div>

                    <button className="p-2 rounded-xl bg-white/10 text-white relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                    </button>
                  </div>

                  {/* Duty Status Switcher */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 border border-emerald-400/30 text-xs">
                    <span className="text-slate-300 text-[11px] font-bold">Duty Status:</span>
                    <div className="flex gap-1">
                      {(['AVAILABLE', 'IN_CONSULT', 'OFF_DUTY'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setDutyStatus(st)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                            dutyStatus === st
                              ? st === 'AVAILABLE' ? 'bg-emerald-500 text-white' : st === 'IN_CONSULT' ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'
                              : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 space-y-4">
                  
                  {/* LIVE ACTIVE TOKEN CALLER CARD */}
                  <div className="p-4 rounded-3xl bg-white border-2 border-[#1E6FD9] shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#1E6FD9] bg-blue-50 px-2.5 py-0.5 rounded-full">
                        CURRENT OPD QUEUE TOKEN
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">Wait: ~4 Mins</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-black text-slate-900 tracking-tight">TK-101</span>
                        <h4 className="font-bold text-sm text-slate-800 mt-0.5">Rahul Sharma (45y / M)</h4>
                        <p className="text-[11px] text-slate-500">UHID-B1-2026-901 • Chest tightness</p>
                      </div>
                      
                      <button
                        onClick={() => setCurrentScreen('prescription')}
                        className="px-4 py-2.5 rounded-xl bg-[#1E6FD9] hover:bg-blue-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5" /> Start Consult
                      </button>
                    </div>
                  </div>

                  {/* KPI STATS TILES */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Today&apos;s Consults</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-slate-900">{doctorData.todayConsults}</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">12 Done</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Today&apos;s Revenue</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-[#159A67]">{doctorData.earningsToday}</span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">Net</span>
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACTION TILES */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Quick Actions</span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setCurrentScreen('appointments')}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover:border-[#1E6FD9] transition-all cursor-pointer"
                      >
                        <Calendar className="w-5 h-5 text-[#1E6FD9]" />
                        <span className="text-[10px] font-bold text-slate-800">Queue</span>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('prescription')}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover:border-[#159A67] transition-all cursor-pointer"
                      >
                        <FileText className="w-5 h-5 text-[#159A67]" />
                        <span className="text-[10px] font-bold text-slate-800">New Rx</span>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('reports')}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover:border-purple-600 transition-all cursor-pointer"
                      >
                        <Activity className="w-5 h-5 text-purple-600" />
                        <span className="text-[10px] font-bold text-slate-800">Reports</span>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('admissions')}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover:border-rose-600 transition-all cursor-pointer"
                      >
                        <Building2 className="w-5 h-5 text-rose-600" />
                        <span className="text-[10px] font-bold text-slate-800">IPD Wards</span>
                      </button>
                    </div>
                  </div>

                  {/* UPCOMING APPOINTMENTS LIST */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Today&apos;s Appointments</span>
                      <button onClick={() => setCurrentScreen('appointments')} className="text-xs text-[#1E6FD9] font-bold">View All</button>
                    </div>

                    <div className="space-y-2">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E6FD9] font-black text-xs flex items-center justify-center shrink-0">
                              {apt.token}
                            </span>
                            <div>
                              <h5 className="font-black text-xs text-slate-900">{apt.patient}</h5>
                              <p className="text-[10px] text-slate-500">{apt.age}y / {apt.gender} • {apt.time}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            apt.status === 'waiting' ? 'bg-amber-100 text-amber-900' : apt.status === 'in_progress' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {apt.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 2. APPOINTMENTS QUEUE SCREEN */}
            {currentScreen === 'appointments' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">OPD Queue & Appointments</h2>
                    <p className="text-[11px] text-slate-500">Live tokens scheduled for today</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-blue-50 text-[#1E6FD9]">
                    {appointments.length} Total
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
                  {(['all', 'waiting', 'in_progress', 'completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-black capitalize transition-all ${
                        activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Appointments List */}
                <div className="space-y-2.5">
                  {filteredAppointments.map((apt) => (
                    <div key={apt.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-[#1E6FD9] bg-blue-50 px-2 py-0.5 rounded-md">
                          {apt.token}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">{apt.time}</span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900">{apt.patient}</h4>
                        <p className="text-xs text-slate-600">{apt.age} Years • {apt.gender} • {apt.uhid}</p>
                        <p className="text-[11px] text-slate-500 italic mt-1">&ldquo;{apt.condition}&rdquo;</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedPatientId(apt.id);
                            setCurrentScreen('patient_detail');
                          }}
                          className="text-xs text-[#1E6FD9] font-bold"
                        >
                          View EHR History
                        </button>
                        <button
                          onClick={() => setCurrentScreen('prescription')}
                          className="px-3 py-1 rounded-lg bg-[#159A67] text-white font-bold text-xs shadow-xs"
                        >
                          Open Rx Pad
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. DIGITAL PRESCRIPTION PAD */}
            {currentScreen === 'prescription' && (
              <form onSubmit={handlePrescriptionSubmit} className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Digital Prescription Pad</h2>
                    <p className="text-[11px] text-slate-500">Direct sync to Hospital Pharmacy POS</p>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    NABH CERTIFIED
                  </span>
                </div>

                {/* Patient Header Card */}
                <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-1">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase">PATIENT PROFILE</span>
                  <h4 className="font-black text-sm">Rahul Sharma (45y / Male)</h4>
                  <p className="text-[11px] text-slate-300">UHID-B1-2026-901 • Blood: O+ • Phone: +91 98201 12345</p>
                </div>

                {/* Diagnosis Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    required
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-[#1E6FD9]"
                  />
                </div>

                {/* Multi-item Medicine Pad */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Prescribed Medicines ({rxMedicines.length})</label>
                    <button
                      type="button"
                      onClick={addMedicineRow}
                      className="text-xs text-[#1E6FD9] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Drug
                    </button>
                  </div>

                  <div className="space-y-2">
                    {rxMedicines.map((med) => (
                      <div key={med.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-slate-900">{med.name}</span>
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(med.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                          <span className="bg-slate-50 p-1 rounded">Dosage: {med.dosage}</span>
                          <span className="bg-slate-50 p-1 rounded">Duration: {med.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Freq: {med.frequency} • {med.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Stamp Stamp */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold">256-bit Digital Signature Attached (Dr. Robert Sullivan)</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#159A67] hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" /> Issue & Sync E-Prescription
                </button>

                {rxSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500 text-white text-center text-xs font-bold animate-in fade-in">
                    ✓ Prescription successfully issued & dispatched!
                  </div>
                )}
              </form>
            )}

            {/* 4. PATIENTS DIRECTORY */}
            {currentScreen === 'patients' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Patient Directory</h2>
                    <p className="text-[11px] text-slate-500">Universal Health ID (UHID) Index</p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Name, UHID, or Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-2">
                  {patientsList.map((pt) => (
                    <div
                      key={pt.id}
                      onClick={() => {
                        setSelectedPatientId(pt.id);
                        setCurrentScreen('patient_detail');
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 hover:border-[#1E6FD9] transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs text-slate-900">{pt.name}</h4>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {pt.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{pt.uhid} • Blood: {pt.blood} • {pt.phone}</p>
                      <p className="text-xs text-[#1E6FD9] font-bold">{pt.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PATIENT DETAIL / EHR TIMELINE */}
            {currentScreen === 'patient_detail' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <button
                  onClick={() => setCurrentScreen('patients')}
                  className="text-xs text-[#1E6FD9] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
                </button>

                {/* Patient Passport */}
                <div className="p-4 rounded-3xl bg-[#123B5D] text-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-300 uppercase">UHID-B1-2026-901</span>
                      <h3 className="font-black text-base">Rahul Sharma</h3>
                      <p className="text-xs text-slate-300">45 Yrs • Male • Blood: O+</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                      Active OPD
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">BP</span>
                      <span className="font-black">138/88</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pulse</span>
                      <span className="font-black">74 bpm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">SpO2</span>
                      <span className="font-black">98%</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Timeline Events */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Clinical Timeline</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold">14 Aug 2026 • OPD Consult</span>
                      <h5 className="font-black text-xs text-slate-900">Cardiology Review - Dr. Robert Sullivan</h5>
                      <p className="text-[11px] text-slate-600">Prescribed Amlodipine 5mg. Advised 2D Echo.</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold">10 Aug 2026 • Diagnostic Lab</span>
                      <h5 className="font-black text-xs text-slate-900">Lipid Profile & HbA1c</h5>
                      <p className="text-[11px] text-slate-600">Total Cholesterol: 195 mg/dL, HbA1c: 6.4%.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('prescription')}
                  className="w-full py-3 rounded-xl bg-[#1E6FD9] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Write New Prescription
                </button>
              </div>
            )}

            {/* 6. REPORTS SCREEN */}
            {currentScreen === 'reports' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Diagnostic Reports</h2>
                    <p className="text-[11px] text-slate-500">Pathology & Radiology Queue</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {reportsList.map((rep) => (
                    <div key={rep.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${rep.status === 'READY' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                          {rep.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{rep.date}</span>
                      </div>

                      <div>
                        <h4 className="font-black text-xs text-slate-900">{rep.test}</h4>
                        <p className="text-[11px] text-slate-500">{rep.patient} • {rep.uhid}</p>
                      </div>

                      {rep.critical && (
                        <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> CRITICAL BIOMARKER ELEVATED
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E6FD9]">
                        <span>View Clinical Findings</span>
                        <Download className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. ADMISSIONS / IPD */}
            {currentScreen === 'admissions' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div>
                  <h2 className="text-base font-black text-slate-900">Inpatient (IPD) Rounds</h2>
                  <p className="text-[11px] text-slate-500">Admitted beds & clinical telemetry</p>
                </div>

                <div className="space-y-2.5">
                  {admissionsList.map((adm) => (
                    <div key={adm.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                          {adm.bed}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{adm.ward}</span>
                      </div>

                      <div>
                        <h4 className="font-black text-xs text-slate-900">{adm.patient}</h4>
                        <p className="text-[11px] text-slate-500">{adm.uhid} • Admitted: {adm.admDate}</p>
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">{adm.notes}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[10px]">Tariff: {adm.daily}/day</span>
                        <button className="px-2.5 py-1 rounded bg-[#1E6FD9] text-white text-[10px] font-bold">
                          Add Round Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. EARNINGS */}
            {currentScreen === 'earnings' && (
              <div className="p-4 space-y-4 pb-20 animate-in fade-in">
                <div>
                  <h2 className="text-base font-black text-slate-900">Doctor Revenue Analytics</h2>
                  <p className="text-[11px] text-slate-500">OPD & Telehealth consultation breakdown</p>
                </div>

                <div className="p-4 rounded-3xl bg-[#159A67] text-white space-y-2 shadow-lg">
                  <span className="text-[10px] text-emerald-100 font-bold uppercase">THIS MONTH NET EARNINGS</span>
                  <h3 className="text-3xl font-black">{doctorData.earningsMonth}</h3>
                  <p className="text-xs text-emerald-100">Next settlement date: 01 Sept 2026</p>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between p-3 bg-white rounded-2xl border border-slate-200">
                    <span>OPD Consultations (142)</span>
                    <span className="font-black text-slate-900">₹ 1,13,600</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-2xl border border-slate-200">
                    <span>HD Telehealth Sessions (48)</span>
                    <span className="font-black text-slate-900">₹ 38,400</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-2xl border border-slate-200">
                    <span>IPD Ward Rounds (32)</span>
                    <span className="font-black text-slate-900">₹ 32,500</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ANDROID BOTTOM NAVIGATION BAR */}
          <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === 'home' ? 'text-[#1E6FD9] font-black' : 'text-slate-400'}`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[9px]">Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen('appointments')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === 'appointments' ? 'text-[#1E6FD9] font-black' : 'text-slate-400'}`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[9px]">Queue</span>
            </button>

            <button
              onClick={() => setCurrentScreen('prescription')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === 'prescription' ? 'text-[#159A67] font-black' : 'text-slate-400'}`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[9px]">Rx Pad</span>
            </button>

            <button
              onClick={() => setCurrentScreen('patients')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === 'patients' || currentScreen === 'patient_detail' ? 'text-[#1E6FD9] font-black' : 'text-slate-400'}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px]">Patients</span>
            </button>

            <button
              onClick={() => setCurrentScreen('reports')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === 'reports' ? 'text-purple-600 font-black' : 'text-slate-400'}`}
            >
              <FileCheck className="w-5 h-5" />
              <span className="text-[9px]">Reports</span>
            </button>
          </div>

          {/* ANDROID SYSTEM BOTTOM GESTURE PILL */}
          <div className="h-4 bg-white flex items-center justify-center pb-1">
            <div className="w-32 h-1 bg-slate-400/60 rounded-full"></div>
          </div>

        </div>

      </div>

      {/* BOTTOM RUN INSTRUCTIONS */}
      <div className="mt-6 text-center text-xs text-emerald-300/80 max-w-lg space-y-1">
        <p className="font-bold text-white">
          To run natively on Android Phone / Emulator:
        </p>
        <p className="font-mono text-[11px] bg-slate-900/80 p-2 rounded-xl border border-emerald-500/30">
          cd android-doctor && ./gradlew assembleDebug
        </p>
      </div>

    </div>
  );
}
