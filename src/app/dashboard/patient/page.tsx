"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/lib/store";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Building2,
  PhoneCall,
  Search,
  Plus,
  User,
  Heart,
  Activity,
  FileText,
  MapPin,
  ShieldCheck,
  Zap,
  Filter,
  Check,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  QrCode,
  Pill,
  Award,
  ChevronRight,
  LogOut
} from "lucide-react";

type DashboardPageProps = {
  searchParams?: Promise<{
    name?: string | string[];
    uhid?: string | string[];
    phone?: string | string[];
  }>;
};

export default function PatientDashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const paramName = typeof resolvedSearchParams?.name === "string" ? resolvedSearchParams.name : "";
  const paramUhid = typeof resolvedSearchParams?.uhid === "string" ? resolvedSearchParams.uhid : "";

  const { doctors, branches, patients, addPatient, selectedBranchId, setSelectedBranchId } = useApp();

  const patientName = paramName || "Patient";
  const patientUhid = paramUhid || "UHID-CARE-PORTAL";

  // Tab State
  const [activeTab, setActiveTab] = useState<"appointments" | "doctors" | "hospitals" | "records">("appointments");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any | null>(null);
  const [bookingBranchId, setBookingBranchId] = useState<number>(typeof selectedBranchId === 'number' ? selectedBranchId : 1);
  const [bookingTime, setBookingTime] = useState("10:30 AM");
  const [bookingDate, setBookingDate] = useState("Today, Aug 14");
  const [bookingReason, setBookingReason] = useState("General Health Checkup & Consultation");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");

  // Patient's Booked Appointments List (Production Real-time Queue)
  const [myAppointments, setMyAppointments] = useState<Array<{
    id: string;
    token: number;
    doctorName: string;
    specialty: string;
    branchName: string;
    branchCode: string;
    date: string;
    time: string;
    status: string;
    type: string;
    fee: string;
  }>>([]);

  // Handle New Booking Submission
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDoc = selectedDoctorForBooking || doctors[0] || { name: 'Dr . Jiarul Haque', specialty: 'General & Cardiology Medicine', fee: 800 };
    const targetBranchObj = branches.find(b => b.id === bookingBranchId) || branches[0];
    const newToken = Math.floor(15 + Math.random() * 20);
    const newApt = {
      id: `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
      token: newToken,
      doctorName: targetDoc.name,
      specialty: targetDoc.specialty,
      branchName: targetBranchObj?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
      branchCode: targetBranchObj?.code || 'ARIYAN-HQ',
      date: bookingDate,
      time: bookingTime,
      status: "Confirmed",
      type: "OPD Consultation",
      fee: `₹${targetDoc.fee || 800}`,
    };

    setMyAppointments(prev => [newApt, ...prev]);
    setBookingSuccessMsg(`Appointment Confirmed! Token #${newToken} generated with ${targetDoc.name}.`);

    setTimeout(() => {
      setBookingSuccessMsg("");
      setIsBookModalOpen(false);
      setActiveTab("appointments");
    }, 1200);
  };

  // Specialties List for filter
  const specialtiesList = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialty)));
    return ["All", ...list];
  }, [doctors]);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  // Filtered Branches
  const filteredBranches = useMemo(() => {
    return branches.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [branches, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">

      {/* TOP PATIENT BAR & BRAND HEADER */}
      <header className="bg-[#046a4e] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-inner">
              <Image
                src="/logo.png"
                alt="Medix Logo"
                width={48}
                height={48}
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block leading-none text-white">Medix</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 block mt-0.5">
                Patient Care Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{patientName}</span>
              <span className="text-[10px] font-mono text-emerald-200">{patientUhid}</span>
            </div>

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>

            <Link
              href="/"
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-full transition-colors"
              title="Sign Out to Homepage"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* WELCOME PATIENT BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>VERIFIED PATIENT EHR • ACTIVE SESSION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {patientName}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium max-w-xl">
              Universal Health ID: <span className="font-mono font-bold text-white bg-emerald-800/60 px-2 py-0.5 rounded">{patientUhid}</span> • Manage your appointments, browse specialist doctors, and explore hospital branch features.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex-1 md:flex-none text-center min-w-[120px]">
              <span className="text-2xl font-black text-emerald-400 block">{myAppointments.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Booked Appts</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex-1 md:flex-none text-center min-w-[120px]">
              <span className="text-2xl font-black text-teal-300 block">{doctors.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Doctors Available</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex-1 md:flex-none text-center min-w-[120px]">
              <span className="text-2xl font-black text-emerald-300 block">{branches.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Hospitals</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION TAB CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-7 z-20 relative">
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "appointments"
                ? "bg-[#046a4e] text-white shadow-md shadow-emerald-900/20"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" /> My Booked Appointments ({myAppointments.length})
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "doctors"
                ? "bg-[#046a4e] text-white shadow-md shadow-emerald-900/20"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Available Doctors ({doctors.length})
          </button>

          <button
            onClick={() => setActiveTab("hospitals")}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "hospitals"
                ? "bg-[#046a4e] text-white shadow-md shadow-emerald-900/20"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4" /> Hospital Network & Features ({branches.length})
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "records"
                ? "bg-[#046a4e] text-white shadow-md shadow-emerald-900/20"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" /> Health Records & UHID
          </button>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        {/* 1. TAB 1: MY BOOKED APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Scheduled Appointments</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  View appointment tokens, consultation times, and hospital locations.
                </p>
              </div>

              <button
                onClick={() => setIsBookModalOpen(true)}
                className="bg-[#046a4e] hover:bg-[#03523c] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
              >
                <Plus className="w-4 h-4" /> Book New Appointment
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No Appointments Booked Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a specialist doctor or hospital branch to schedule your consultation slot.
                </p>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className="px-5 py-2.5 bg-[#046a4e] text-white font-bold text-xs rounded-full shadow"
                >
                  Browse Available Doctors
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myAppointments.map(apt => (
                  <div key={apt.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#046a4e] font-black text-lg flex items-center justify-center border border-emerald-200 shrink-0">
                          #{apt.token}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block">{apt.id}</span>
                          <h3 className="text-base font-black text-slate-900">{apt.doctorName}</h3>
                          <p className="text-xs font-bold text-[#046a4e] mt-0.5">{apt.specialty}</p>
                        </div>
                      </div>

                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-full border border-emerald-300">
                        {apt.status}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-xs font-medium">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Hospital:</span>
                        <span className="font-bold text-slate-900">{apt.branchName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Time:</span>
                        <span className="font-bold text-slate-900">{apt.date} • {apt.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Consult Type:</span>
                        <span className="font-bold text-emerald-700">{apt.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-bold text-slate-700">Fee Paid: <span className="font-extrabold text-emerald-800">{apt.fee}</span></span>
                      <button
                        onClick={() => alert(`Appointment ${apt.id} details downloaded for ${apt.doctorName}`)}
                        className="text-[#046a4e] font-extrabold hover:underline"
                      >
                        Download Token Slip →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TAB 2: AVAILABLE DOCTORS */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Specialist Doctors</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Browse doctors across all hospital branches and book your consultation instantly.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search doctor or specialty..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 text-xs rounded-xl font-medium focus:outline-none focus:border-[#046a4e] w-48 sm:w-64"
                  />
                </div>

                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-[#046a4e]"
                >
                  {specialtiesList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doc => {
                const assignedBranch = branches.find(b => b.id === doc.branchId) || branches[0];
                return (
                  <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                            {doc.name.replace(/^Dr\.\s*/i, '').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                            <p className="text-xs font-bold text-[#046a4e] mt-0.5">{doc.specialty}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          doc.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Hospital Branch:</span>
                          <span className="font-bold text-slate-900">{assignedBranch.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Consult Fee:</span>
                          <span className="font-bold text-emerald-800">₹{doc.fee || 800}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Contact:</span>
                          <span className="font-mono text-slate-700">{doc.contact || '+91 7003831600'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctorForBooking(doc);
                        setBookingBranchId(doc.branchId);
                        setIsBookModalOpen(true);
                      }}
                      className="w-full py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Calendar className="w-4 h-4" /> Book Appointment Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TAB 3: HOSPITAL NETWORK & FEATURES */}
        {activeTab === "hospitals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Medix Hospital Network & Features</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Explore our 9 multi-branch hospital nodes, emergency care centers, and clinical features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map(branch => (
                <div key={branch.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {branch.code}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{branch.name}</h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {branch.location}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                      Active Node
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Facility Type:</span>
                      <span className="font-bold text-slate-900">{branch.facilityType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Govt Reg No:</span>
                      <span className="font-mono text-slate-700">{branch.govRegNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Central Admin:</span>
                      <span className="font-bold text-emerald-800">{branch.adminName}</span>
                    </div>
                  </div>

                  {/* Hospital Key Features */}
                  <div className="space-y-1.5 text-[11px] font-medium text-slate-700">
                    <p className="font-extrabold text-slate-900 text-xs">Hospital Facilities & Features:</p>
                    <div className="grid grid-cols-2 gap-1 text-slate-600">
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> 24x7 Emergency OPD</span>
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> ICU & Operation Theater</span>
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Advanced Diagnostic Lab</span>
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Pharmacy & Medicine Store</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      setBookingBranchId(branch.id);
                      setIsBookModalOpen(true);
                    }}
                    className="w-full py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-extrabold text-xs rounded-full shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Select Hospital & Book Slot →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB 4: HEALTH RECORDS & UHID */}
        {activeTab === "records" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Universal Health Identification (UHID)</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Your official digital healthcare card linked across all 9 Medix hospital nodes.</p>
              </div>

              <button
                onClick={() => alert(`UHID Card Downloaded for ${patientName}`)}
                className="px-5 py-2.5 bg-[#046a4e] text-white font-bold text-xs rounded-full shadow"
              >
                Download Digital UHID Card
              </button>
            </div>

            {/* DIGITAL UHID CARD */}
            <div className="max-w-md mx-auto bg-gradient-to-tr from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-600/40 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white p-0.5">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
                  </div>
                  <span className="font-black text-lg tracking-tight">Medix EHR</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
                  Universal UHID
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Patient Full Name</p>
                <p className="text-xl font-black text-white mt-0.5">{patientName}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">UHID Number</p>
                  <p className="font-mono font-bold text-emerald-300 text-sm">{patientUhid}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Primary Node</p>
                  <p className="font-bold text-white text-xs">MAIN-01</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* APPOINTMENT BOOKING MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Instant OPD Appointment
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Book Doctor Consultation</h2>
            </div>

            {bookingSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Select Doctor</label>
                <select
                  value={selectedDoctorForBooking?.id || doctors[0].id}
                  onChange={e => {
                    const doc = doctors.find(d => d.id === Number(e.target.value));
                    if (doc) {
                      setSelectedDoctorForBooking(doc);
                      setBookingBranchId(doc.branchId);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold outline-none focus:border-[#046a4e]"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      🩺 {d.name} ({d.specialty}) — ${d.fee}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Target Hospital Branch</label>
                <select
                  value={bookingBranchId}
                  onChange={e => setBookingBranchId(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold outline-none focus:border-[#046a4e]"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      🏥 {b.name} ({b.code}) — {b.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-900 mb-1">Appointment Date</label>
                  <input
                    type="text"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-900 mb-1">Preferred Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold outline-none focus:border-[#046a4e]"
                  >
                    <option value="09:30 AM">09:30 AM (Morning)</option>
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="02:15 PM">02:15 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Reason for Visit / Symptoms</label>
                <input
                  type="text"
                  required
                  value={bookingReason}
                  onChange={e => setBookingReason(e.target.value)}
                  placeholder="e.g. Regular Heart Checkup, Chest Pain"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Confirm & Generate Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
