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
  ChevronDown,
  Activity,
  X,
  Heart,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Search,
  FileCheck2,
  Pill,
  ShieldCheck,
  Stethoscope,
  Building2,
  QrCode,
  Thermometer,
  Zap,
  Sparkles,
  Download,
  Share2,
  UserCheck,
  Sliders,
  HelpCircle,
  LogOut,
  ArrowRight,
  ChevronRight,
  Filter,
  Play,
  UserPlus,
  DollarSign,
  User,
  CalendarDays,
  FileSpreadsheet,
  Moon,
  Footprints,
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
  const { patients, doctors, branches, selectedBranchId } = useApp();
  
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
  const [activeToken, setActiveToken] = useState(12);

  // Modals state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isNewApptModalOpen, setIsNewApptModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedPatientModal, setSelectedPatientModal] = useState<any | null>(null);

  // Consultation Form State
  const [consultDiagnosis, setConsultDiagnosis] = useState("");
  const [consultMedication, setConsultMedication] = useState("");
  const [consultSuccessMessage, setConsultSuccessMessage] = useState("");

  // New Appt Form State
  const [newPtName, setNewPtName] = useState("");
  const [newPtTime, setNewPtTime] = useState("11:30 AM");
  const [newPtType, setNewPtType] = useState("Post-Op Review");
  const [newPtMsg, setNewPtMsg] = useState("");

  const targetBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  // Names
  const doctorName = useMemo(() => {
    if (registeredName.trim()) {
      return registeredName.startsWith("Dr.") ? registeredName : `Dr. ${registeredName}`;
    }
    return "Dr. Sarah Williams";
  }, [registeredName]);

  const patientName = useMemo(() => {
    if (registeredName.trim()) {
      return registeredName.replace(/^Dr\.\s*/i, "");
    }
    return "Alex";
  }, [registeredName]);

  // Doctor Token Patients List
  const [tokenPatients, setTokenPatients] = useState([
    { token: 10, name: "Robert Harrison", uhid: "UHID-20260812-0040", time: "09:30 AM", status: "Completed", type: "Cardiology Consult" },
    { token: 11, name: "Elena Jenkins", uhid: "UHID-20260812-0041", time: "10:00 AM", status: "Completed", type: "ECG Review" },
    { token: 12, name: "John Anderson", uhid: "UHID-20260812-0042", time: "10:30 AM", status: "In Progress", type: "Post-Op Review" },
    { token: 13, name: "Sarah Miller", uhid: "UHID-20260812-0043", time: "11:00 AM", status: "Pending", type: "Follow-up" },
    { token: 14, name: "David Wilson", uhid: "UHID-20260812-0044", time: "11:30 AM", status: "Pending", type: "Routine Checkup" },
    { token: 15, name: "Michael Brown", uhid: "UHID-20260812-0045", time: "02:00 PM", status: "Pending", type: "Lipid Profile Consult" },
  ]);

  const currentTokenPatient = useMemo(() => {
    return tokenPatients.find(p => p.token === activeToken) || tokenPatients[2];
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
    setConsultSuccessMessage(`Consultation completed for ${currentTokenPatient.name}! Prescriptions & Notes saved.`);
    setTimeout(() => {
      setConsultSuccessMessage("");
      setIsConsultModalOpen(false);
      setIsRxModalOpen(false);
      // Mark token completed
      setTokenPatients(prev =>
        prev.map(p => p.token === activeToken ? { ...p, status: "Completed" } : p)
      );
      if (activeToken < 15) setActiveToken(activeToken + 1);
    }, 1500);
  };

  // Handle New Appt Save
  const handleSaveNewAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtName.trim()) return;

    const nextToken = tokenPatients.length + 10;
    const newEntry = {
      token: nextToken,
      name: newPtName,
      uhid: `UHID-20260812-00${nextToken}`,
      time: newPtTime,
      status: "Pending",
      type: newPtType,
    };

    setTokenPatients([...tokenPatients, newEntry]);
    setNewPtMsg(`Appointment scheduled for ${newPtName} (Token #${nextToken})!`);
    setTimeout(() => {
      setNewPtMsg("");
      setIsNewApptModalOpen(false);
      setNewPtName("");
    }, 1500);
  };

  // ═══════════ PATIENT DASHBOARD VIEW ═══════════
  if (role === "patient") {
    return (
      <div className="fixed inset-0 z-50 bg-[#eef3f9] overflow-y-auto font-sans flex text-slate-800">
        <aside className="w-64 bg-[#f4f7fb] border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0 min-h-screen">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-14 w-14 rounded-full bg-white border-2 border-blue-500/20 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <Image src="/images/logo.png" alt="Medix Logo" width={56} height={56} className="h-full w-full object-cover rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#1d5bbd] tracking-tight leading-none">Medix</h1>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Premium Care</p>
              </div>
            </Link>

            <nav className="space-y-1 text-xs font-bold text-slate-600">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-[#dce8f5] text-[#1d5bbd] border-l-4 border-[#1d5bbd] flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-[#1d5bbd]" /> Dashboard
              </button>
            </nav>
          </div>
          <div className="space-y-2 pt-6 border-t border-slate-200/70 text-xs font-semibold text-slate-500">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors">
              <LogOut className="h-4 w-4 text-rose-500" /> Logout
            </Link>
          </div>
        </aside>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-[#e3effc] via-[#ebf4fd] to-white/90 rounded-3xl p-8 border border-sky-100 shadow-sm space-y-3">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              ● Status: Optimal
            </span>
            <h2 className="text-3xl font-black text-[#1e3a8a]">Good morning, {patientName}.</h2>
            <p className="text-xs text-slate-600 font-medium">Your vitals are stable, and you&apos;re making excellent progress on your wellness goals.</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ DOCTOR DASHBOARD VIEW (Matching Provided Screenshot 100%) ═══════════
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto font-sans flex text-slate-800">
      
      {/* ═══════════ LEFT SIDEBAR NAVIGATION (Purple Theme) ═══════════ */}
      <aside className="w-64 bg-[#50377e] text-white p-5 flex flex-col justify-between shrink-0 min-h-screen shadow-xl">
        <div className="space-y-5">
          
          {/* Doctor Header Profile */}
          <div className="flex items-center gap-3 pb-2 border-b border-purple-400/20">
            <div className="h-12 w-12 rounded-full bg-white border-2 border-purple-300/40 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/images/logo.png"
                alt="Doctor Profile"
                width={48}
                height={48}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-white tracking-tight truncate leading-tight">
                {doctorName}
              </h1>
              <p className="text-[11px] font-medium text-purple-200 truncate mt-0.5">
                Cardiology Specialist
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
              { id: "earnings", label: "Earnings", icon: DollarSign },
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
            className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-white/10 rounded-xl transition-colors text-left"
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
          <h1 className="text-xl font-black text-slate-900">Doctor Dashboard</h1>

          {/* Search Box */}
          <div className="relative w-72 sm:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, appointments, reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
            />
          </div>

          {/* Right User Controls */}
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center border border-white shadow-xs">
              SW
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
                  <span className="bg-white/20 px-3 py-1 rounded-md uppercase tracking-wider">CARDIOLOGY</span>
                  <span className="bg-white/20 px-3 py-1 rounded-md flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Oct 26, 2023
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-md flex items-center gap-1 text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Good morning, {doctorName}.
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-2xl">
                  Here&apos;s your clinical overview for today. You have a full schedule focusing on post-operative reviews.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsConsultModalOpen(true)}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Play className="h-4 w-4 text-[#0077b6] fill-[#0077b6]" />
                    <span>Start Consultation</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("todays_appts")}
                    className="border border-white/40 hover:bg-white/10 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>View Schedule</span>
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
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      📈 +12%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Today&apos;s Appts</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">24</p>
                  </div>
                </div>

                {/* Card 2: Patients Seen */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">vs yesterday</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Patients Seen</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      18 <span className="text-xs font-bold text-emerald-600 ml-1">+5 today</span>
                    </p>
                  </div>
                </div>

                {/* Card 3: Pending Reports */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Pending Reports</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      05 <span className="text-xs font-bold text-blue-600 ml-1">3 ready</span>
                    </p>
                  </div>
                </div>

                {/* Card 4: Follow-ups */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Follow-ups</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      08 <span className="text-xs font-bold text-rose-600 ml-1">2 due today</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* CURRENT & QUEUE SECTION */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Current & Queue</h3>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Live Queue
                  </span>
                </div>

                {/* Active Token Patient Card */}
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

                {/* Tokens Row */}
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
                        <span>#{p.token}</span>
                      </button>
                    );
                  })}
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-semibold text-xs">
                    +8 more
                  </span>
                </div>
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
                                  : "bg-slate-100 text-slate-600"
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
                                {p.status === "In Progress" ? "Consult" : "Call Patient"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT 1 COLUMN: QUICK ACTIONS GRID & PENDING REPORTS WIDGET */}
                <div className="space-y-6">
                  
                  {/* Quick Actions 4 Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsRxModalOpen(true)}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">New Rx</span>
                    </button>

                    <button
                      onClick={() => {
                        const inputEl = document.querySelector("header input") as HTMLInputElement;
                        if (inputEl) inputEl.focus();
                      }}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Search</span>
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
                      onClick={() => setActiveTab("todays_appts")}
                      className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:border-[#00a8cc] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Schedule</span>
                    </button>
                  </div>

                  {/* Pending Reports Widget */}
                  <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
                    <div className="bg-[#f4f3f8] px-5 py-3 border-b border-slate-200/60">
                      <h4 className="text-xs font-extrabold text-[#50377e]">Pending Reports</h4>
                    </div>
                    
                    <div className="p-4 space-y-3 text-xs">
                      {/* Report 1 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">CBC & Lipid Profile</p>
                            <p className="text-[10px] text-slate-400 font-medium">Michael Brown • 09:00 AM</p>
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>

                      {/* Report 2 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Chest X-Ray</p>
                            <p className="text-[10px] text-slate-400 font-medium">Sarah Miller • 11:00 AM</p>
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                      </div>

                      {/* Report 3 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">ECG Report</p>
                            <p className="text-[10px] text-slate-400 font-medium">David Wilson • 02:30 PM</p>
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      </div>
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
                  className="px-4 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  + Add Appointment
                </button>
              </div>

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
                            className="px-3.5 py-1.5 bg-[#00a8cc] hover:bg-cyan-600 text-white font-bold rounded-xl text-[10px]"
                          >
                            Open Consultation
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PATIENTS TAB */}
          {activeTab === "patients" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-slate-900">Patient Directory & Clinical History</h2>
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
            </div>
          )}

          {/* 4. PRESCRIPTIONS TAB */}
          {activeTab === "prescriptions" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">E-Prescription Management</h2>
                <button
                  onClick={() => setIsRxModalOpen(true)}
                  className="px-4 py-2 bg-[#00a8cc] text-white font-bold rounded-xl hover:bg-cyan-600"
                >
                  + Issue New Prescription
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { pt: "John Anderson", rx: "Lisinopril 10mg (OD), Aspirin 75mg (OD)", date: "Today 10:30 AM" },
                  { pt: "Elena Jenkins", rx: "Paracetamol 500mg (TDS), Cetirizine 10mg (OD)", date: "Today 10:00 AM" },
                  { pt: "Robert Harrison", rx: "Atorvastatin 20mg (HS)", date: "Today 09:30 AM" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.pt}</p>
                      <p className="text-slate-600 mt-1">Rx: {item.rx}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
                    </div>
                    <button className="px-3.5 py-1.5 bg-[#50377e] text-white font-bold rounded-xl hover:bg-purple-900">
                      Print Prescription
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MEDICAL REPORTS TAB */}
          {activeTab === "medical_reports" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Medical & Diagnostic Reports</h2>
              <div className="space-y-3">
                {[
                  { title: "CBC & Lipid Profile • Michael Brown", status: "Ready", date: "Today 09:00 AM" },
                  { title: "Chest X-Ray • Sarah Miller", status: "Pending", date: "Today 11:00 AM" },
                  { title: "ECG Report • David Wilson", status: "Ready", date: "Today 02:30 PM" },
                ].map((rep, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{rep.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rep.date}</p>
                    </div>
                    <button className="px-4 py-2 bg-[#00a8cc] text-white font-bold rounded-xl hover:bg-cyan-600">
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ADMISSIONS TAB */}
          {activeTab === "admissions" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Inpatient Admissions & Bed Allocation</h2>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Active Inpatients under Dr. Sarah Williams</p>
                <p className="text-slate-600">• Room 302-A: Robert Harrison (Post-Op Recovery)</p>
                <p className="text-slate-600">• Room 405-B: James Wilson (Cardiac Observation)</p>
              </div>
            </div>
          )}

          {/* 7. FOLLOW-UPS TAB */}
          {activeTab === "followups" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Follow-up Patient Tracker</h2>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">8 Follow-ups Due Today</p>
                <p className="text-slate-600">• Token #12 John Anderson — Post-Op Cardiology Review</p>
                <p className="text-slate-600">• Token #13 Sarah Miller — Blood Pressure Check</p>
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
                  <p className="text-2xl font-black text-slate-900">$2,700</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <p className="font-bold text-sky-800">This Week</p>
                  <p className="text-2xl font-black text-slate-900">$13,500</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="font-bold text-indigo-800">This Month</p>
                  <p className="text-2xl font-black text-slate-900">$54,000</p>
                </div>
              </div>
            </div>
          )}

          {/* 9. PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Doctor Profile & Medical License</h2>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-slate-700">Doctor Name: <strong>{doctorName}</strong></p>
                <p className="text-slate-700">Specialty: <strong>Cardiology Specialist</strong></p>
                <p className="text-slate-700">License ID: <strong className="font-mono">MD-CARD-2026-873091</strong></p>
                <p className="text-slate-700">Assigned Branch: <strong>{targetBranch.name}</strong></p>
              </div>
            </div>
          )}

          {/* 10. LEAVE MANAGEMENT TAB */}
          {activeTab === "leave_mgmt" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900">Doctor Leave & Duty Roster</h2>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Duty Roster Status: On Active Shift</p>
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
                  <p className="font-bold text-slate-900">Consultation Fee</p>
                  <p className="text-slate-600">Fee per patient: <strong>$150 USD</strong></p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">Facility Assignment</p>
                  <p className="text-slate-600">Branch: <strong>{targetBranch.name}</strong></p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═══════════ START CONSULTATION MODAL ═══════════ */}
      {(isConsultModalOpen || isRxModalOpen) && (
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
                className="p-1 text-slate-400 hover:text-slate-700"
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
                    placeholder="e.g. Post-Op Cardiac Recovery, Normal BP..."
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
                    placeholder="e.g. Lisinopril 10mg (OD Morning), Aspirin 75mg (OD)..."
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
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold shadow-md"
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
              <button onClick={() => setIsNewApptModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
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
                    <option>10:30 AM</option>
                    <option>11:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>02:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Consultation Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Post-Op Review, Cardiology Follow-up..."
                    value={newPtType}
                    onChange={(e) => setNewPtType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewApptModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00a8cc] hover:bg-cyan-600 text-white rounded-xl font-bold shadow-md"
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
