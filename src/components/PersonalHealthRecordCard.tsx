"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Plus,
  Bell,
  Activity,
  X,
  Clock,
  CheckCircle2,
  Search,
  FileCheck2,
  Pill,
  Stethoscope,
  HelpCircle,
  LogOut,
  ArrowRight,
  UserPlus,
  User,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

type PersonalHealthRecordCardProps = {
  role: "patient" | "doctor";
  registeredName?: string;
  registeredPhone?: string;
};

export function PersonalHealthRecordCard({
  role,
  registeredName = "",
  registeredPhone = "",
}: PersonalHealthRecordCardProps) {
  const { patients, doctors, branches, appointments, addAppointment, selectedBranchId } = useApp();
  
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "todays_appts"
    | "patients"
    | "prescriptions"
    | "medical_reports"
    | "admissions"
    | "followups"
    | "earnings"
    | "profile"
    | "leave_mgmt"
    | "settings"
  >("dashboard");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeToken, setActiveToken] = useState<number | null>(null);

  // Modals state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isNewApptModalOpen, setIsNewApptModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  // Consultation Form State
  const [consultDiagnosis, setConsultDiagnosis] = useState("");
  const [consultMedication, setConsultMedication] = useState("");
  const [consultSuccessMessage, setConsultSuccessMessage] = useState("");

  // New Appt Form State
  const [newPtName, setNewPtName] = useState("");
  const [newPtTime, setNewPtTime] = useState("10:30 AM");
  const [newPtType, setNewPtType] = useState("General OPD Consult");
  const [newPtMsg, setNewPtMsg] = useState("");

  // Doctor Local Token Queue & Prescriptions (Clean Zero-State Initial)
  const [tokenPatients, setTokenPatients] = useState<Array<{
    token: number;
    name: string;
    uhid: string;
    time: string;
    status: string;
    type: string;
  }>>([]);

  const [prescriptionsList, setPrescriptionsList] = useState<Array<{
    id: number;
    pt: string;
    uhid: string;
    rx: string;
    diagnosis: string;
    date: string;
  }>>([]);

  const targetBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || branches[0] || { name: 'ARIYAN HOSPITAL HQ', code: 'ARIYAN-HQ' };
  }, [branches, selectedBranchId]);

  // Doctor details from store / props
  const doctorName = useMemo(() => {
    if (registeredName.trim()) {
      return registeredName.startsWith("Dr.") ? registeredName : `Dr. ${registeredName}`;
    }
    return doctors[0]?.name || "Dr . Jiarul Haque";
  }, [registeredName, doctors]);

  const doctorSpecialty = useMemo(() => {
    return doctors[0]?.specialty || "General & Cardiology Medicine";
  }, [doctors]);

  const doctorFee = useMemo(() => {
    return doctors[0]?.fee || 800;
  }, [doctors]);

  const patientName = useMemo(() => {
    if (registeredName.trim()) {
      return registeredName.replace(/^Dr\.\s*/i, "");
    }
    return "Patient";
  }, [registeredName]);

  const currentTokenPatient = useMemo(() => {
    if (tokenPatients.length === 0) return null;
    return tokenPatients.find(p => p.token === activeToken) || tokenPatients[0];
  }, [tokenPatients, activeToken]);

  // Filtered Appointments
  const filteredAppts = useMemo(() => {
    if (!searchTerm.trim()) return tokenPatients;
    return tokenPatients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tokenPatients, searchTerm]);

  // Handle consultation save
  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTokenPatient) return;

    const completedPatient = currentTokenPatient;
    const newRx = {
      id: Date.now(),
      pt: completedPatient.name,
      uhid: completedPatient.uhid,
      rx: consultMedication,
      diagnosis: consultDiagnosis,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setPrescriptionsList(prev => [newRx, ...prev]);
    setConsultSuccessMessage(`Consultation completed for ${completedPatient.name}! Prescriptions & Notes saved.`);

    setTimeout(() => {
      setConsultSuccessMessage("");
      setIsConsultModalOpen(false);
      setIsRxModalOpen(false);
      setConsultDiagnosis("");
      setConsultMedication("");

      // Mark token completed
      setTokenPatients(prev =>
        prev.map(p => p.token === completedPatient.token ? { ...p, status: "Completed" } : p)
      );
    }, 1200);
  };

  // Handle New Appt Save
  const handleSaveNewAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtName.trim()) return;

    const nextToken = tokenPatients.length + 1;
    const generatedUhid = `UHID-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(nextToken).padStart(4, '0')}`;
    
    const newEntry = {
      token: nextToken,
      name: newPtName,
      uhid: generatedUhid,
      time: newPtTime,
      status: "Waiting",
      type: newPtType,
    };

    setTokenPatients(prev => [...prev, newEntry]);
    if (!activeToken) setActiveToken(nextToken);

    setNewPtMsg(`Appointment scheduled for ${newPtName} (Token #${nextToken})!`);
    setTimeout(() => {
      setNewPtMsg("");
      setIsNewApptModalOpen(false);
      setNewPtName("");
    }, 1200);
  };

  // ═══════════ PATIENT DASHBOARD VIEW (Redirects to full Patient Portal) ═══════════
  if (role === "patient") {
    return (
      <div className="fixed inset-0 z-50 bg-[#eef3f9] overflow-y-auto font-sans flex text-slate-800">
        <aside className="w-64 bg-[#046a4e] text-white p-5 flex flex-col justify-between shrink-0 min-h-screen">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-full bg-white p-1 flex items-center justify-center shadow-md shrink-0">
                <Image src="/logo.png" alt="Medix Logo" width={48} height={48} className="h-full w-full object-contain rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">Medix</h1>
                <p className="text-[10px] font-semibold text-emerald-200 mt-0.5">Patient Care Portal</p>
              </div>
            </Link>

            <nav className="space-y-1 text-xs font-bold text-emerald-100">
              <Link href="/dashboard/patient" className="w-full text-left px-4 py-3 rounded-xl bg-emerald-800 text-white flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-emerald-300" /> My Health Passport
              </Link>
              <Link href="/appointments" className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-800/60 text-emerald-100 flex items-center gap-3">
                <Calendar className="h-4 w-4 text-emerald-300" /> My Appointments
              </Link>
              <Link href="/pharmacy" className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-800/60 text-emerald-100 flex items-center gap-3">
                <Pill className="h-4 w-4 text-emerald-300" /> Prescriptions
              </Link>
            </nav>
          </div>
          <div className="space-y-2 pt-6 border-t border-emerald-700 text-xs font-semibold text-emerald-200">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-800 text-white rounded-xl transition-colors">
              <LogOut className="h-4 w-4 text-rose-300" /> Sign Out
            </Link>
          </div>
        </aside>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-[#046a4e] via-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-sm space-y-3">
            <span className="bg-emerald-500/20 text-emerald-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-400/30">
              ● Status: Verified Active Patient
            </span>
            <h2 className="text-3xl font-black text-white">Welcome back, {patientName}.</h2>
            <p className="text-xs text-emerald-100 font-medium">Your personal health records, OPD appointment bookings, and e-prescriptions are securely managed here.</p>
            <div className="pt-3">
              <Link href="/dashboard/patient" className="inline-flex items-center gap-2 bg-emerald-400 text-emerald-950 px-6 py-2.5 rounded-full font-black text-xs shadow-md hover:bg-emerald-300 transition-all">
                Open Full Patient EHR Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ DOCTOR DASHBOARD VIEW (Clean Zero-State Data Binding) ═══════════
  const completedCount = tokenPatients.filter(p => p.status === 'Completed').length;
  const todayEarnings = completedCount * doctorFee;
  const todayDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto font-sans flex text-slate-800">
      
      {/* ═══════════ LEFT SIDEBAR NAVIGATION (Purple Theme) ═══════════ */}
      <aside className="w-64 bg-[#50377e] text-white p-5 flex flex-col justify-between shrink-0 min-h-screen shadow-xl">
        <div className="space-y-5">
          
          {/* Doctor Header Profile */}
          <div className="flex items-center gap-3 pb-2 border-b border-purple-400/20">
            <div className="h-12 w-12 rounded-full bg-white border-2 border-purple-300/40 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="Doctor Profile"
                width={48}
                height={48}
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-white tracking-tight truncate leading-tight">
                {doctorName}
              </h1>
              <p className="text-[11px] font-medium text-purple-200 truncate mt-0.5">
                {doctorSpecialty}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setIsNewApptModalOpen(true)}
            className="w-full bg-[#00a8cc] hover:bg-cyan-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "todays_appts", label: "Today's Appointments", icon: Calendar },
              { id: "patients", label: "Patients", icon: Users },
              { id: "prescriptions", label: "Prescriptions", icon: Pill },
              { id: "medical_reports", label: "Medical Reports", icon: FileText },
              { id: "admissions", label: "Admissions", icon: Stethoscope },
              { id: "followups", label: "Follow-ups", icon: CheckCircle2 },
              { id: "earnings", label: "Earnings", icon: IndianRupee },
              { id: "profile", label: "Profile", icon: User },
              { id: "leave_mgmt", label: "Leave Management", icon: CalendarDays },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? "bg-white/20 text-white font-black shadow-inner"
                      : "text-purple-100/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-300" : "text-purple-200"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-1 pt-4 border-t border-purple-400/20 text-xs font-bold text-purple-200">
          <button
            onClick={() => setActiveTab("settings")}
            className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
          >
            <Settings className="h-4 w-4 text-purple-200" />
            <span>Settings</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-rose-500/20 text-rose-200 rounded-xl transition-colors text-left"
          >
            <LogOut className="h-4 w-4 text-rose-300" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT CANVAS ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* Top Header Bar */}
        <header className="bg-white py-4 px-6 sm:px-8 flex items-center justify-between gap-4 border-b border-slate-200 shadow-xs">
          <h1 className="text-xl font-black text-slate-900">Doctor OPD Workspace</h1>

          {/* Search Box */}
          <div className="relative w-72 sm:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, tokens, prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
            />
          </div>

          {/* Right User Controls */}
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center border border-white shadow-xs">
              {doctorName.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'DR'}
            </div>
          </div>
        </header>

        {/* ═══════════ TAB VIEW CONTROLLER ═══════════ */}
        <main className="p-4 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* HERO GREETING BANNER */}
              <div className="bg-gradient-to-r from-[#1746a2] via-[#0077b6] to-[#00b4d8] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                  <span className="bg-white/20 px-3 py-1 rounded-md uppercase tracking-wider">{doctorSpecialty}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-md flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {todayDateStr}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-md flex items-center gap-1 text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> OPD Active
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Good morning, {doctorName}.
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-2xl">
                  {targetBranch.name} • Registered OPD Chamber. When patients arrive and tokens are assigned, you can conduct digital consultations and generate instant e-prescriptions.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (currentTokenPatient) {
                        setIsConsultModalOpen(true);
                      } else {
                        setIsNewApptModalOpen(true);
                      }
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Activity className="h-4 w-4 text-[#0077b6]" />
                    <span>{currentTokenPatient ? "Start Consultation" : "+ New Patient Token"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("todays_appts")}
                    className="border border-white/40 hover:bg-white/10 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>View OPD Queue</span>
                  </button>
                </div>
              </div>

              {/* 4 STAT CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Card 1: Today's Appts */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Today&apos;s Appts</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{tokenPatients.length}</p>
                  </div>
                </div>

                {/* Card 2: Patients Seen */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Completed</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Patients Seen</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {completedCount} <span className="text-xs font-bold text-emerald-600 ml-1">consulted</span>
                    </p>
                  </div>
                </div>

                {/* Card 3: Prescriptions Issued */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Pill className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">E-Rx</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Prescriptions</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {prescriptionsList.length} <span className="text-xs font-bold text-purple-600 ml-1">issued</span>
                    </p>
                  </div>
                </div>

                {/* Card 4: Today's OPD Fees */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">₹{doctorFee}/pt</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Consultation Revenue</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      ₹{todayEarnings.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

              </div>

              {/* CURRENT & QUEUE SECTION */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Current & Queue</h3>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Queue
                  </span>
                </div>

                {currentTokenPatient ? (
                  <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-[#00a8cc] border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full border-2 border-[#00a8cc] bg-cyan-50 text-[#00a8cc] font-black text-lg flex items-center justify-center shrink-0">
                        #{currentTokenPatient.token}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{currentTokenPatient.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {currentTokenPatient.uhid} • {currentTokenPatient.time} • {currentTokenPatient.type}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsConsultModalOpen(true)}
                      className="bg-[#00a8cc] hover:bg-cyan-600 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Start Consultation</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <Clock className="h-8 w-8 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No Active Patients in OPD Queue</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      There are currently no patients waiting in the consultation queue for {doctorName}. Click below to schedule a new patient appointment.
                    </p>
                    <button
                      onClick={() => setIsNewApptModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00a8cc] text-white rounded-xl font-bold text-xs shadow-xs hover:bg-cyan-600 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Schedule OPD Appointment
                    </button>
                  </div>
                )}

                {/* Tokens Row */}
                {tokenPatients.length > 0 && (
                  <div className="flex items-center gap-2.5 flex-wrap pt-1 text-xs font-bold">
                    {tokenPatients.map((p) => {
                      const isCurrent = p.token === activeToken;
                      const isDone = p.status === "Completed";
                      return (
                        <button
                          key={p.token}
                          onClick={() => setActiveToken(p.token)}
                          className={`px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? "bg-[#00a8cc] text-white border-[#00a8cc] shadow-xs"
                              : isDone
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-white text-slate-700 border-slate-200 hover:border-[#00a8cc]"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : isCurrent ? (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span>#{p.token} {p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* BOTTOM SECTION: 2 COLUMNS (Today's Appointments & Right Quick Widgets) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT 2 COLUMNS: TODAY'S APPOINTMENTS TABLE */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">Today&apos;s Appointments</h3>
                    <button
                      onClick={() => setActiveTab("todays_appts")}
                      className="text-xs font-bold text-[#00a8cc] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {filteredAppts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                      No appointments scheduled yet for today.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px]">
                          <tr>
                            <th className="p-3.5">PATIENT</th>
                            <th className="p-3.5">TIME / TOKEN</th>
                            <th className="p-3.5">STATUS</th>
                            <th className="p-3.5">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredAppts.map((p) => (
                            <tr key={p.token} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 font-bold text-slate-900 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {p.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{p.uhid}</p>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <p className="font-bold text-slate-900">{p.time}</p>
                                <p className="text-[10px] font-bold text-[#00a8cc]">Token #{p.token}</p>
                              </td>
                              <td className="p-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  p.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : p.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <button
                                  onClick={() => {
                                    setActiveToken(p.token);
                                    setIsConsultModalOpen(true);
                                  }}
                                  className="px-3.5 py-1.5 bg-[#00a8cc] hover:bg-cyan-600 text-white font-bold rounded-xl text-[10px] shadow-xs cursor-pointer"
                                >
                                  {p.status === "Completed" ? "View Rx" : "Consult"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* RIGHT 1 COLUMN: QUICK ACTIONS GRID & PENDING REPORTS WIDGET */}
                <div className="space-y-6">
                  
                  {/* Quick Actions 4 Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsNewApptModalOpen(true)}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">+ New Appt</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("prescriptions")}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">E-Rx History</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("medical_reports")}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Reports</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("earnings")}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IndianRupee className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Revenue</span>
                    </button>
                  </div>

                  {/* Doctor Info Widget */}
                  <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
                    <div className="bg-[#f4f3f8] px-5 py-3 border-b border-slate-200/60">
                      <h4 className="text-xs font-extrabold text-[#50377e]">OPD Chamber Info</h4>
                    </div>
                    
                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-slate-700">Doctor: <strong>{doctorName}</strong></p>
                      <p className="text-slate-700">Specialty: <strong>{doctorSpecialty}</strong></p>
                      <p className="text-slate-700">Hospital: <strong>{targetBranch.name}</strong></p>
                      <p className="text-slate-700">Fee: <strong className="text-emerald-700">₹{doctorFee} per visit</strong></p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* 2. TODAY'S APPOINTMENTS TAB */}
          {activeTab === "todays_appts" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Today&apos;s OPD Appointments & Token Queue</h2>
                <button
                  onClick={() => setIsNewApptModalOpen(true)}
                  className="px-4 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                >
                  + Add Appointment
                </button>
              </div>

              {tokenPatients.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Calendar className="h-8 w-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">No OPD Appointments Queued</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are no patient appointments scheduled under your OPD today. Click &quot;+ Add Appointment&quot; to queue a patient.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px]">
                      <tr>
                        <th className="p-3.5">TOKEN</th>
                        <th className="p-3.5">TIME</th>
                        <th className="p-3.5">PATIENT</th>
                        <th className="p-3.5">CONSULT TYPE</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {tokenPatients.map((p) => (
                        <tr key={p.token} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-[#00a8cc]">#{p.token}</td>
                          <td className="p-3.5 font-bold text-slate-900">{p.time}</td>
                          <td className="p-3.5 font-bold text-slate-900">{p.name} ({p.uhid})</td>
                          <td className="p-3.5 text-slate-600">{p.type}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => {
                                setActiveToken(p.token);
                                setIsConsultModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-[#00a8cc] hover:bg-cyan-600 text-white font-bold rounded-xl text-[10px] cursor-pointer"
                            >
                              {p.status === "Completed" ? "View Rx" : "Open Consultation"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. PATIENTS TAB */}
          {activeTab === "patients" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-slate-900">Patient Directory & Clinical History</h2>
              {patients.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Users className="h-8 w-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">No Patients Registered Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When patients register at the reception desk or portal, their longitudinal electronic health records (EHR) will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px]">
                      <tr>
                        <th className="p-3.5">UHID</th>
                        <th className="p-3.5">PATIENT NAME</th>
                        <th className="p-3.5">AGE / GENDER</th>
                        <th className="p-3.5">BLOOD GROUP</th>
                        <th className="p-3.5">CONTACT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {patients.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-blue-600">{p.uhid}</td>
                          <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                          <td className="p-3.5">{p.age} yrs / {p.gender}</td>
                          <td className="p-3.5 font-bold text-rose-600">{p.bloodGroup}</td>
                          <td className="p-3.5 font-mono">{p.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. PRESCRIPTIONS TAB */}
          {activeTab === "prescriptions" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">E-Prescription Management</h2>
                <button
                  onClick={() => {
                    if (currentTokenPatient) {
                      setIsRxModalOpen(true);
                    } else {
                      setIsNewApptModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#00a8cc] text-white font-bold rounded-xl hover:bg-cyan-600 cursor-pointer"
                >
                  + Issue New Prescription
                </button>
              </div>

              {prescriptionsList.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Pill className="h-8 w-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">No Prescriptions Issued Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you consult a patient and submit medication orders, digitized e-prescriptions with hospital stamps will be stored here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {prescriptionsList.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.pt} <span className="text-xs font-normal text-slate-500 font-mono">({item.uhid})</span></p>
                        <p className="text-slate-700 mt-1 font-medium"><span className="font-bold text-purple-900">Rx:</span> {item.rx}</p>
                        {item.diagnosis && <p className="text-xs text-slate-500 mt-0.5"><span className="font-bold">Diagnosis:</span> {item.diagnosis}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">{item.date} • Prescribed by {doctorName}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[10px]">
                        ✓ Dispensed to Pharmacy
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. MEDICAL REPORTS TAB */}
          {activeTab === "medical_reports" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Medical & Diagnostic Reports</h2>
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Diagnostic Lab Reports Pending</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When pathology or radiology investigations are ordered for patients under your care, the certified lab results will appear here.
                </p>
              </div>
            </div>
          )}

          {/* 6. ADMISSIONS TAB */}
          {activeTab === "admissions" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Inpatient Admissions & Bed Allocation</h2>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-center">
                <Stethoscope className="h-8 w-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Active IPD Inpatients</h3>
                <p className="text-slate-500 max-w-sm mx-auto">All inpatient beds under {targetBranch.name} are sanitized and ready for admissions when required.</p>
              </div>
            </div>
          )}

          {/* 7. FOLLOW-UPS TAB */}
          {activeTab === "followups" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Follow-up Patient Tracker</h2>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-center">
                <CheckCircle2 className="h-8 w-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Follow-ups Due Today</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Scheduled post-treatment review visits will automatically appear here on their target dates.</p>
              </div>
            </div>
          )}

          {/* 8. EARNINGS TAB */}
          {activeTab === "earnings" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Consultation Earnings & Revenue Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-emerald-800">Today&apos;s Consult Fees</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹{todayEarnings.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-emerald-700 mt-1">{completedCount} consultation(s) completed</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <p className="font-bold text-sky-800">Doctor Rate</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹{doctorFee.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-sky-700 mt-1">Per patient consultation</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="font-bold text-indigo-800">Settlement Status</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">Active</p>
                  <p className="text-[10px] text-indigo-700 mt-1">Direct hospital branch payroll</p>
                </div>
              </div>
            </div>
          )}

          {/* 9. PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Doctor Profile & Medical License</h2>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 font-medium">Doctor Name</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{doctorName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Clinical Specialty</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{doctorSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Assigned Facility</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{targetBranch.name} ({targetBranch.code})</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Consultation Fee</p>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">₹{doctorFee} INR</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. LEAVE MANAGEMENT TAB */}
          {activeTab === "leave_mgmt" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Doctor Leave & Duty Roster</h2>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Duty Roster Status: On Active Shift</p>
                <p className="text-slate-600">Branch Location: <strong>{targetBranch.name}</strong></p>
                <p className="text-slate-600">Available Annual Leaves: <strong>14 Days Remaining</strong></p>
              </div>
            </div>
          )}

          {/* 11. SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Doctor Account & OPD Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">Consultation Rate</p>
                  <p className="text-slate-600">Standard OPD Fee: <strong>₹{doctorFee} INR</strong></p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">Facility Assignment</p>
                  <p className="text-slate-600">Primary Branch: <strong>{targetBranch.name}</strong></p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═══════════ START CONSULTATION MODAL ═══════════ */}
      {(isConsultModalOpen || isRxModalOpen) && currentTokenPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#00a8cc] text-white font-black text-xs flex items-center justify-center shadow-xs">
                  #{currentTokenPatient.token}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentTokenPatient.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{currentTokenPatient.uhid} • {currentTokenPatient.type}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsConsultModalOpen(false);
                  setIsRxModalOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {consultSuccessMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-xs text-center">
                {consultSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleSaveConsultation} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Clinical Diagnosis & Symptoms</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mild Hypertension, Routine Health Review..."
                    value={consultDiagnosis}
                    onChange={(e) => setConsultDiagnosis(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">E-Prescription & Dosage Schedule</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Paracetamol 650mg (1-0-1 after food), Multivitamin (0-1-0)..."
                    value={consultMedication}
                    onChange={(e) => setConsultMedication(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsConsultModalOpen(false);
                      setIsRxModalOpen(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                  >
                    Complete Consultation & Issue Rx
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ NEW APPOINTMENT MODAL ═══════════ */}
      {isNewApptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#00a8cc]" /> Schedule New OPD Appointment
              </h3>
              <button onClick={() => setIsNewApptModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {newPtMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-xs text-center">
                {newPtMsg}
              </div>
            ) : (
              <form onSubmit={handleSaveNewAppt} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full name..."
                    value={newPtName}
                    onChange={(e) => setNewPtName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                  <select
                    value={newPtTime}
                    onChange={(e) => setNewPtTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  >
                    <option>10:00 AM</option>
                    <option>10:30 AM</option>
                    <option>11:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>02:30 PM</option>
                    <option>03:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Consultation Type</label>
                  <input
                    type="text"
                    placeholder="e.g. General OPD, Cardiology Review..."
                    value={newPtType}
                    onChange={(e) => setNewPtType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewApptModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
