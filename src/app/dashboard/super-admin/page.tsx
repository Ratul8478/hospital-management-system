"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Crown,
  User,
  CalendarDays,
  Stethoscope,
  Activity,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  Coins,
  Handshake,
  TrendingUp,
  Users,
  Shield,
  Settings,
  ClipboardList,
  Building2,
  DollarSign,
  PlusCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Check,
  Trash2,
  Eye,
  Phone,
  Mail,
  Briefcase,
  ArrowRight,
  UserPlus,
  MapPin,
  Rocket,
  Search,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Sparkles,
  ChevronRight,
  Share2,
  UserCheck
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const {
    branches,
    doctors,
    patients,
    beds,
    medicines,
    labRequests,
    invoices,
    appointments,
    auditLogs,
    adminApplications,
    marketingRepresentatives,
    marketingJoinRequests,
    hireAdmin,
    fireAdmin,
    approveAdminApplication,
    rejectAdminApplication,
    addBranch,
    setSelectedBranchId,
    setUserRole,
  } = useApp();

  // Active Division / Tab
  const [activeTab, setActiveTab] = useState<'branches' | 'campus' | 'clinical' | 'finance' | 'admin' | 'applications' | 'marketing' | 'inspector'>('branches');
  const [inspectedBranchId, setInspectedBranchId] = useState<number>(1);

  // Search & Filter state for Branches Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<'ALL' | 'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPANSION'>('ALL');

  // Admin details modal state
  const [selectedBranchForDetails, setSelectedBranchForDetails] = useState<number | null>(null);

  // Modals state
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showHireAdmin, setShowHireAdmin] = useState(false);
  const [hireBranchId, setHireBranchId] = useState<number | null>(null);

  // Notifications
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Form inputs
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchLoc, setNewBranchLoc] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchHead, setNewBranchHead] = useState('');
  const [newFacilityType, setNewFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center'>('Hospital');
  const [newGovRegNumber, setNewGovRegNumber] = useState('');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Total KPIs across all 9 branches
  const totalRev = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPatients = patients.length;
  const totalBedsOccupied = beds.filter(b => b.status === 'occupied').length;
  const totalBedsCount = beds.length;

  const pendingApplications = adminApplications.filter(a => a.status === 'pending');

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        (b.branchHead && b.branchHead.toLowerCase().includes(q)) ||
        b.adminName.toLowerCase().includes(q);

      const matchesFacility =
        facilityFilter === 'ALL' || b.facilityType === facilityFilter;

      const matchesStatus =
        statusFilter === 'ALL' || (b.badgeStatus || 'ACTIVE') === statusFilter;

      return matchesSearch && matchesFacility && matchesStatus;
    });
  }, [branches, searchQuery, facilityFilter, statusFilter]);

  const handleExportExecutiveReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Branch Code,Name,Location,Status,Branch Head,Admin,Today Revenue,Bed Occupancy,Active Doctors\n" +
        branches
          .map(
            (b) =>
              `"${b.code}","${b.name}","${b.location}","${b.badgeStatus || 'ACTIVE'}","${b.branchHead || 'Dr. Head'}","${b.adminName}","${b.todayRevenueFormatted || '₹ 1,50,000'}","${b.bedOccupancy}","${b.activeConsultants || 20}"`
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Medix_Enterprise_Network_Audit_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setActionAlert({
        type: 'success',
        message: 'Executive 9-Branch Network Audit CSV Report exported successfully!',
      });
      setTimeout(() => setActionAlert(null), 3500);
    }, 800);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode || !newGovRegNumber) return;
    addBranch({
      name: newBranchName,
      code: newBranchCode,
      facilityType: newFacilityType,
      govRegNumber: newGovRegNumber,
      location: newBranchLoc || 'Central Sector',
      address: newBranchAddress || `${newBranchLoc}, Medical Enclave`,
      branchHead: newBranchHead || 'Dr. Assigned Head (Medical Director)',
      adminName: 'Unassigned',
      adminEmail: 'pending@hospital.com',
      badgeStatus: 'ACTIVE',
    });
    setNewBranchName('');
    setNewBranchCode('');
    setNewBranchLoc('');
    setNewBranchAddress('');
    setNewBranchHead('');
    setNewGovRegNumber('');
    setShowAddBranch(false);
    setActionAlert({ type: 'success', message: `Hospital Node ${newBranchCode} onboarded successfully!` });
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleHireAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hireBranchId && adminName && adminEmail) {
      hireAdmin(hireBranchId, adminName, adminEmail, adminPhone || '+91 98000 00000');
      const targetB = branches.find(b => b.id === hireBranchId);
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
      setShowHireAdmin(false);
      setActionAlert({ type: 'success', message: `${adminName} appointed as Branch Central Admin for ${targetB?.code} (${targetB?.name})!` });
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const handleFireAdminAction = (branchId: number) => {
    const targetB = branches.find(b => b.id === branchId);
    const oldAdmin = targetB?.adminName;
    fireAdmin(branchId);
    setActionAlert({
      type: 'error',
      message: `${oldAdmin} has been removed from ${targetB?.code}. Position is now VACANT and dashboard access is revoked.`,
    });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleApproveApplicant = (appId: number) => {
    const app = adminApplications.find(a => a.id === appId);
    if (app) {
      approveAdminApplication(appId);
      setActionAlert({
        type: 'success',
        message: `Approved! ${app.applicantName} is now the active Branch Central Admin for ${app.targetBranchCode} (${app.targetBranchName}).`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const handleRejectApplicant = (appId: number) => {
    const app = adminApplications.find(a => a.id === appId);
    rejectAdminApplication(appId);
    setActionAlert({
      type: 'error',
      message: `Application from ${app?.applicantName} for ${app?.targetBranchCode} has been rejected.`,
    });
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleEnterBranchERP = (branchId: number) => {
    setInspectedBranchId(branchId);
    setActiveTab('inspector');
  };

  const inspectedBranch = branches.find(b => b.id === inspectedBranchId) || branches[0];
  const inspectedDocs = doctors.filter(d => d.branchId === inspectedBranch.id);
  const inspectedPatients = patients.filter(p => p.branchId === inspectedBranch.id);
  const inspectedBeds = beds.filter(b => b.branchId === inspectedBranch.id);
  const inspectedMeds = medicines.filter(m => m.branchId === inspectedBranch.id);
  const inspectedInvoices = invoices.filter(i => i.branchId === inspectedBranch.id);
  const inspectedRev = inspectedInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const detailedBranch = branches.find(b => b.id === selectedBranchForDetails);

  return (
    <div className="space-y-6">
      
      {/* EXECUTIVE COMMAND HEADER (3D TEA GREEN / FOREST LUXURY THEME) */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#044e3b] to-[#064e3b] text-white p-6 sm:p-8 rounded-3xl border border-emerald-600/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden card-3d">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#065f46] border border-emerald-400/50 text-emerald-100 text-xs font-extrabold shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 live-pulse"></span>
            <Crown className="w-4 h-4 text-amber-300" />
            <span>ENTERPRISE SUPER ADMIN CONTROL PANEL • HEALTH GROW INDIA</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Super Admin Enterprise Command Center
          </h1>
          
          <p className="text-xs text-emerald-100/90 font-medium max-w-2xl">
            Supervise all 9 hospital branch nodes, inspect clinical operations, financial ledgers, and appoint Branch Central Admins with isolated scope.
          </p>

          <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-200 font-bold">
            <span className="flex items-center gap-1.5 bg-[#012019]/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Latency: 18ms (Real-time)
            </span>
            <span className="flex items-center gap-1.5 bg-[#012019]/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Activity className="w-3.5 h-3.5 text-emerald-300" /> Network Sync: 100% Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={handleExportExecutiveReport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#064e3b] hover:bg-[#08634d] text-emerald-100 font-black text-xs px-4 py-3 rounded-full border border-emerald-400/40 shadow-md transition-all cursor-pointer hover:scale-105"
          >
            {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Export Audit CSV</span>
          </button>

          <button
            onClick={() => setShowAddBranch(true)}
            className="flex items-center gap-2 bg-[#6ee7b7] hover:bg-[#34d399] text-[#022c22] font-black text-xs px-5 py-3 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 btn-premium-3d"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Onboard New Branch Node</span>
          </button>
        </div>
      </div>

      {/* ACTION ALERT TOAST */}
      {actionAlert && (
        <div className={`p-4 rounded-2xl border text-xs font-black flex items-center justify-between gap-3 shadow-lg animate-in fade-in ${
          actionAlert.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-2.5">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionAlert.message}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DIVISION NAVIGATION TABS (TEA GREEN / FOREST THEME) */}
      <div className="bg-[#022c22] p-2 rounded-2xl shadow-xl border border-[#064e3b] flex items-center gap-2 overflow-x-auto text-xs">
        
        {/* BRANCHES HUB (DEFAULT) */}
        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'branches'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-300" />
          <span>Hospital Branches Directory ({branches.length})</span>
        </button>

        {/* CAMPUS DASHBOARD */}
        <button
          onClick={() => setActiveTab('campus')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'campus'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-300" />
          <span>Campus Dashboard</span>
        </button>

        {/* CLINICAL & PATIENTS */}
        <button
          onClick={() => setActiveTab('clinical')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'clinical'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-teal-300" />
          <span>Clinical & Patients</span>
        </button>

        {/* FINANCE & PARTNERS */}
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'finance'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 text-yellow-300" />
          <span>Finance & Partners</span>
        </button>

        {/* ADMINISTRATION */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'admin'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-300" />
          <span>Administration</span>
        </button>

        {/* APPLICATIONS QUEUE */}
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 relative ${
            activeTab === 'applications'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4 text-emerald-300" />
          <span>Admin Requests Queue</span>
          {pendingApplications.length > 0 && (
            <span className="px-2 py-0.5 text-[9px] font-black bg-amber-400 text-slate-950 rounded-full">
              {pendingApplications.length}
            </span>
          )}
        </button>

        {/* GLOBAL MARKETING & REFERRALS HUB */}
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 relative ${
            activeTab === 'marketing'
              ? 'bg-purple-800 text-white border-b-2 border-purple-400 shadow-md'
              : 'text-purple-300 hover:bg-purple-950/80 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-300" />
          <span>Marketing & Referral Force ({marketingRepresentatives.length})</span>
          {marketingJoinRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="px-2 py-0.5 text-[9px] font-black bg-purple-400 text-slate-950 rounded-full">
              {marketingJoinRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>

        {/* INSPECTOR */}
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'inspector'
              ? 'bg-[#044e3b] text-emerald-100 border-b-2 border-[#10b981] shadow-md'
              : 'text-emerald-200/80 hover:bg-[#033a2d] hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4 text-cyan-300" />
          <span>Live Branch ERP Inspector</span>
        </button>

      </div>

      {/* TAB 1: HOSPITAL BRANCHES DIRECTORY (3D INTERACTIVE CARDS) */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          
          {/* SEARCH & FACILITY FILTER BAR */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200 px-4 py-2.5 rounded-2xl w-full md:w-96 focus-within:border-[#046a4e] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-[#046a4e] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches, campus, doctors, code..."
                className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                {(['ALL', 'Hospital', 'Nursing Home', 'Diagnostic Center'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFacilityFilter(type)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      facilityFilter === type
                        ? 'bg-[#046a4e] text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === 'ALL' ? 'All (9)' : type === 'Hospital' ? '🏥 Hospitals' : type === 'Nursing Home' ? '🏣 Nursing Homes' : '🔬 Diagnostics'}
                  </button>
                ))}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 rounded-xl outline-none"
              >
                <option value="ALL">Status: All</option>
                <option value="ACTIVE">Active Only</option>
                <option value="EXPANSION">Expansion Only</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              Hospital Branches Directory ({filteredBranches.length})
            </h2>
            <span className="text-xs font-black text-emerald-800">
              Showing {filteredBranches.length} of {branches.length} Campuses
            </span>
          </div>

          {/* 3D MULTI-COLUMN DIRECTORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBranches.map((branch, index) => {
              const occupiedBeds = branch.bedOccupiedCount ?? (branch.id === 1 ? 84 : branch.id === 2 ? 58 : branch.id === 3 ? 46 : branch.id === 4 ? 12 : branch.id === 5 ? 0 : 30);
              const totalBeds = branch.bedTotalCount ?? (branch.id === 1 ? 120 : branch.id === 2 ? 75 : branch.id === 3 ? 60 : branch.id === 4 ? 25 : branch.id === 5 ? 100 : 50);
              const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
              const consultants = branch.activeConsultants ?? (branch.id === 1 ? 42 : branch.id === 2 ? 28 : branch.id === 3 ? 22 : branch.id === 4 ? 15 : branch.id === 5 ? 18 : 20);
              const revenueDisplay = branch.todayRevenueFormatted ?? (branch.id === 5 ? '₹ 0' : `₹ ${(branch.revenue || 150000).toLocaleString()}`);
              const isFirstCard = index === 0 && searchQuery === '';

              return (
                <div
                  key={branch.id}
                  className={`bg-white rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 relative shadow-sm card-3d ${
                    isFirstCard
                      ? 'border-2 border-[#046a4e] shadow-md shadow-emerald-900/10'
                      : 'border border-emerald-100 hover:border-emerald-400 hover:shadow-xl'
                  }`}
                >
                  
                  <div className="space-y-4">
                    
                    {/* Top Row: Branch Code Badge & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 text-[11px] font-black rounded-lg bg-emerald-50 text-[#046a4e] border border-emerald-200 tracking-wider">
                        {branch.code}
                      </span>
                      
                      <span className={`px-3 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                        branch.badgeStatus === 'EXPANSION'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {branch.badgeStatus || 'ACTIVE'}
                      </span>
                    </div>

                    {/* Branch Title */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {branch.name}
                      </h3>
                    </div>

                    {/* Location Pin & Campus Details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-rose-700">
                        <MapPin className="w-3.5 h-3.5 shrink-0 fill-rose-600 text-white" />
                        <span className="text-emerald-950">{branch.location}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {branch.address || `${branch.location}, Medical Zone`}
                      </p>
                    </div>

                    {/* Leadership & Admin Details Box */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-xs">
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Branch Head:</span>
                        <span className="col-span-8 font-extrabold text-slate-900 truncate">
                          {branch.branchHead || 'Dr. Medical Director'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Branch Admin:</span>
                        <span className="col-span-8 font-extrabold text-emerald-900 truncate">
                          {branch.adminName}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Admin Email:</span>
                        <span className="col-span-8 text-slate-600 font-mono truncate">
                          {branch.adminEmail}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-4 text-slate-500 font-medium">Admin Phone:</span>
                        <span className="col-span-8 text-slate-700 font-mono font-bold truncate">
                          {branch.adminPhone || '+91 98000 00000'}
                        </span>
                      </div>
                    </div>

                    {/* Operational Metrics Row */}
                    <div className="pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Today&apos;s Revenue</span>
                          <span className="text-sm font-black text-[#046a4e]">{revenueDisplay}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">Active Doctors</span>
                          <span className="text-xs font-black text-slate-900">{consultants} Consultants</span>
                        </div>
                      </div>

                      {/* Bed Occupancy Progress Bar with dynamic fill */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Bed Occupancy</span>
                          <span className="text-slate-800">{occupiedBeds} / {totalBeds} Beds</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions Row: Enter ERP & Admin Details */}
                  <div className="grid grid-cols-12 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleEnterBranchERP(branch.id)}
                      className="col-span-8 py-2.5 px-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow-md shadow-emerald-950/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-premium-3d"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Enter {branch.code} ERP</span>
                    </button>

                    <button
                      onClick={() => setSelectedBranchForDetails(branch.id)}
                      className="col-span-4 py-2.5 px-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs border border-emerald-200 transition-all cursor-pointer text-center"
                    >
                      Admin Details
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CAMPUS DASHBOARD */}
      {activeTab === 'campus' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">MAIN DIVISION</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900 rounded-md">Executive</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Campus & Multi-Branch</h3>
              <p className="text-xs text-slate-500">Enterprise operational monitoring across all {branches.length} campus branches.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <button onClick={() => setActiveTab('branches')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Open Hospital Branches Directory <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">CLINICAL & PATIENTS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">Healthcare</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">EHR, OPD, IPD & Beds</h3>
              <p className="text-xs text-slate-500">{doctors.length} doctors, {appointments.length} appointments, and {medicines.length} pharmacy items.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <button onClick={() => setActiveTab('clinical')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  View Clinical Modules <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">FINANCE & PARTNERS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">Revenue</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Billing, Ledger & Franchise</h3>
              <p className="text-xs text-slate-500">${totalRev.toLocaleString()} collected across {invoices.length} invoices network-wide.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <button onClick={() => setActiveTab('finance')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Explore Financial Hub <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#046a4e] uppercase tracking-widest">ADMINISTRATION</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md">Security</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Users, Roles & Audit</h3>
              <p className="text-xs text-slate-500">Full RBAC role matrix, security parameters, and {auditLogs.length} logged audit events.</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <button onClick={() => setActiveTab('admin')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Access Administration <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Access Matrix */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Super Admin Quick Module Directory</h2>
              <p className="text-xs text-slate-500 font-medium">Direct navigation to all 17 clinical, financial, and administrative workspaces.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Patients (EHR)', href: '/patients', icon: User, color: 'text-purple-600 bg-purple-50', count: `${patients.length} Records` },
                { name: 'Appointments & Tokens', href: '/appointments', icon: CalendarDays, color: 'text-blue-600 bg-blue-50', count: `${appointments.length} Scheduled` },
                { name: 'OPD Workspace', href: '/doctors', icon: Stethoscope, color: 'text-teal-600 bg-teal-50', count: `${doctors.length} Doctors` },
                { name: 'IPD & Admissions', href: '/beds', icon: Activity, color: 'text-indigo-600 bg-indigo-50', count: `${totalBedsOccupied} Admitted` },
                { name: 'Bed Matrix', href: '/beds', icon: BedDouble, color: 'text-rose-600 bg-rose-50', count: `${totalBedsCount} Beds` },
                { name: 'Pharmacy & POS', href: '/pharmacy', icon: Pill, color: 'text-pink-600 bg-pink-50', count: `${medicines.length} Medicines` },
                { name: 'Laboratory Diagnostic', href: '/laboratory', icon: FlaskConical, color: 'text-cyan-600 bg-cyan-50', count: `${labRequests.length} Tests` },
                { name: 'Billing & Invoicing', href: '/billing', icon: Receipt, color: 'text-slate-600 bg-slate-100', count: `${invoices.length} Invoices` },
                { name: 'Accounts & Ledger', href: '/accounting', icon: Coins, color: 'text-amber-600 bg-amber-50', count: `$${totalRev.toLocaleString()}` },
                { name: 'Franchise / Referrals', href: '/franchise', icon: Handshake, color: 'text-yellow-600 bg-yellow-50', count: 'Active Network' },
                { name: 'Enterprise Reports', href: '/accounting', icon: TrendingUp, color: 'text-sky-600 bg-sky-50', count: 'Audit Analytics' },
                { name: 'User Accounts & Roles', href: '/admin', icon: Users, color: 'text-purple-600 bg-purple-50', count: 'RBAC Control' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={idx}
                    href={m.href}
                    className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-white hover:border-[#046a4e] hover:shadow-md transition-all space-y-2 group card-3d"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${m.color} shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500">{m.count}</span>
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#046a4e] transition-colors">{m.name}</h4>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL & PATIENTS */}
      {activeTab === 'clinical' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 2</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical & Patients Workspace</h2>
            <p className="text-xs text-slate-500 font-medium">Manage EHR patients, OPD queue, IPD admissions, beds, pharmacy POS, and lab tests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/patients" className="p-6 rounded-3xl border border-emerald-100 bg-purple-50/40 hover:bg-purple-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <User className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-black text-purple-950">{patients.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Patients (EHR)</h3>
              <p className="text-xs text-slate-600">Electronic Health Records with UHID tracking.</p>
            </Link>

            <Link href="/appointments" className="p-6 rounded-3xl border border-emerald-100 bg-blue-50/40 hover:bg-blue-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-black text-blue-950">{appointments.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Appointments & Tokens</h3>
              <p className="text-xs text-slate-600">OPD scheduling and live token counters.</p>
            </Link>

            <Link href="/doctors" className="p-6 rounded-3xl border border-emerald-100 bg-teal-50/40 hover:bg-teal-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Stethoscope className="w-6 h-6 text-teal-600" />
                <span className="text-xl font-black text-teal-950">{doctors.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">OPD Workspace</h3>
              <p className="text-xs text-slate-600">Doctor consultation roaster and prescriptions.</p>
            </Link>

            <Link href="/beds" className="p-6 rounded-3xl border border-emerald-100 bg-indigo-50/40 hover:bg-indigo-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Activity className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-black text-indigo-950">{totalBedsOccupied}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">IPD & Admissions</h3>
              <p className="text-xs text-slate-600">Inpatient ward management and discharge.</p>
            </Link>

            <Link href="/beds" className="p-6 rounded-3xl border border-emerald-100 bg-rose-50/40 hover:bg-rose-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <BedDouble className="w-6 h-6 text-rose-600" />
                <span className="text-xl font-black text-rose-950">{totalBedsCount}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Bed Matrix</h3>
              <p className="text-xs text-slate-600">ICU, Private, and General ward beds.</p>
            </Link>

            <Link href="/pharmacy" className="p-6 rounded-3xl border border-emerald-100 bg-pink-50/40 hover:bg-pink-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <Pill className="w-6 h-6 text-pink-600" />
                <span className="text-xl font-black text-pink-950">{medicines.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Pharmacy & POS</h3>
              <p className="text-xs text-slate-600">Medicine dispensing and stock control.</p>
            </Link>

            <Link href="/laboratory" className="p-6 rounded-3xl border border-emerald-100 bg-cyan-50/40 hover:bg-cyan-50 transition-all space-y-2 group card-3d">
              <div className="flex items-center justify-between">
                <FlaskConical className="w-6 h-6 text-cyan-600" />
                <span className="text-xl font-black text-cyan-950">{labRequests.length}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Laboratory Diagnostic</h3>
              <p className="text-xs text-slate-600">Pathology tests, biochemistry, and reports.</p>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCE & PARTNERS */}
      {activeTab === 'finance' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 3</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Finance & Partners Hub</h2>
            <p className="text-xs text-slate-500 font-medium">Billing settlements, financial accounts, franchise commissions, and audit reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/billing" className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 hover:bg-white hover:border-[#046a4e] transition-all space-y-2 group card-3d">
              <Receipt className="w-6 h-6 text-slate-700" />
              <h3 className="font-extrabold text-sm text-slate-900">Billing & Invoicing</h3>
              <p className="text-xs text-slate-500">{invoices.length} Settled invoices</p>
            </Link>

            <Link href="/accounting" className="p-6 rounded-3xl border border-emerald-100 bg-amber-50/50 hover:bg-amber-50 transition-all space-y-2 group card-3d">
              <Coins className="w-6 h-6 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Accounts & Ledger</h3>
              <p className="text-xs text-slate-500">${totalRev.toLocaleString()} Balance sheet</p>
            </Link>

            <Link href="/franchise" className="p-6 rounded-3xl border border-emerald-100 bg-yellow-50/50 hover:bg-yellow-50 transition-all space-y-2 group card-3d">
              <Handshake className="w-6 h-6 text-yellow-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Franchise / Referrals</h3>
              <p className="text-xs text-slate-500">Partner revenue sharing model</p>
            </Link>

            <Link href="/accounting" className="p-6 rounded-3xl border border-emerald-100 bg-teal-50/50 hover:bg-teal-50 transition-all space-y-2 group card-3d">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Enterprise Reports</h3>
              <p className="text-xs text-slate-500">Automated financial audits</p>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: ADMINISTRATION */}
      {activeTab === 'admin' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e]">DIVISION 4</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Administration & Security</h2>
            <p className="text-xs text-slate-500 font-medium">User account management, RBAC roles & permissions, hospital configurations, and audit trail.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-purple-50/40 hover:bg-purple-50 transition-all space-y-2 group card-3d">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="font-extrabold text-sm text-slate-900">User Accounts</h3>
              <p className="text-xs text-slate-600">Enterprise user directory</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition-all space-y-2 group card-3d">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Roles & Permissions</h3>
              <p className="text-xs text-slate-600">RBAC security matrix</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-slate-50 hover:bg-slate-100 transition-all space-y-2 group card-3d">
              <Settings className="w-6 h-6 text-slate-700" />
              <h3 className="font-extrabold text-sm text-slate-900">Hospital Settings</h3>
              <p className="text-xs text-slate-600">Multi-branch system parameters</p>
            </Link>

            <Link href="/admin" className="p-6 rounded-3xl border border-emerald-100 bg-amber-50/40 hover:bg-amber-50 transition-all space-y-2 group card-3d">
              <ClipboardList className="w-6 h-6 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Audit Trail</h3>
              <p className="text-xs text-slate-600">{auditLogs.length} Security logs</p>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 6: ADMIN APPLICATIONS QUEUE */}
      {activeTab === 'applications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-4 gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Branch Admin Candidate Requests & Applications</h2>
              <p className="text-xs text-slate-500 font-medium">Review candidates requesting appointment for Branch Central Admin positions. Approve to grant instant dashboard access.</p>
            </div>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full w-fit">
              {pendingApplications.length} Pending Approval
            </span>
          </div>

          {adminApplications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Inbox className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-sm">No incoming applications in queue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminApplications.map(app => (
                <div
                  key={app.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 card-3d ${
                    app.status === 'approved'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : app.status === 'rejected'
                      ? 'bg-rose-50/50 border-rose-200 opacity-75'
                      : 'bg-white border-emerald-100 shadow-sm hover:border-[#046a4e]'
                  }`}
                >
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-black text-slate-900">{app.applicantName}</span>
                      <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#022c22] text-white rounded-md">
                        Applying for: {app.targetBranchCode}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        app.status === 'approved'
                          ? 'bg-emerald-200 text-emerald-900'
                          : app.status === 'rejected'
                          ? 'bg-rose-200 text-rose-900'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-emerald-800">
                      Target Hospital Node: {app.targetBranchName}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {app.experienceYears} Years Exp</span>
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-2xl text-xs text-slate-700 space-y-1 border border-emerald-100">
                      <p className="font-bold text-slate-900">🎓 Credentials & Qualifications: <span className="font-medium text-slate-600">{app.qualifications}</span></p>
                      {app.notes && <p className="text-slate-500 italic">&ldquo;{app.notes}&rdquo;</p>}
                    </div>
                  </div>

                  {/* Actions for Application */}
                  <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveApplicant(app.id)}
                          className="flex-1 lg:flex-none px-5 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 btn-premium-3d"
                        >
                          <Check className="w-4 h-4" /> Approve as Admin
                        </button>
                        <button
                          onClick={() => handleRejectApplicant(app.id)}
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-full transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : app.status === 'approved' ? (
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active Branch Admin</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full">
                        Application Declined
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: GLOBAL MARKETING & REFERRAL FORCE HUB (WITH APPROVER ADMIN AUDIT) */}
      {activeTab === 'marketing' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                MULTI-BRANCH FIELD MARKETING AUDIT & APPROVAL TRACKER
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Hospital Network Marketing & Approver Audit Log
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Audit which individual hospital administrator approved which marketing representative, along with their assigned Reference ID, territory, and referred patient volume.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-950 text-xs font-mono font-bold border border-purple-200">
                Total Marketing Partners: {marketingRepresentatives.length}
              </span>
            </div>
          </div>

          {/* Marketing Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider">Total Field Representatives</span>
              <p className="text-3xl font-black text-purple-950">{marketingRepresentatives.length}</p>
              <span className="text-xs text-purple-700 font-bold">Approved across {branches.length} Branch Nodes</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Total Referred Patients</span>
              <p className="text-3xl font-black text-emerald-950">
                {marketingRepresentatives.reduce((sum, r) => sum + r.referredPatientsCount, 0)}
              </p>
              <span className="text-xs text-emerald-700 font-bold">Generated through Partner Reference Codes</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 card-3d">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Network Referral Commissions</span>
              <p className="text-3xl font-black text-amber-950">
                ₹ {marketingRepresentatives.reduce((sum, r) => sum + r.totalCommissionEarned, 0).toLocaleString()}
              </p>
              <span className="text-xs text-amber-700 font-bold">Disbursed to Field Marketing Agents</span>
            </div>
          </div>

          {/* AUDIT LOG: WHICH INDIVIDUAL HOSPITAL ADMIN APPROVED WHICH MARKETING MAN */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <span>Hospital Admin Approvals & Reference ID Audit Log</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Track individual hospital admins who issued reference IDs to marketing partners.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase bg-purple-50/50">
                    <th className="py-3.5 px-4">Approved By Hospital Admin</th>
                    <th className="py-3.5 px-4">Hospital Facility</th>
                    <th className="py-3.5 px-4">Marketing Representative</th>
                    <th className="py-3.5 px-4">Generated Reference ID</th>
                    <th className="py-3.5 px-4">Assigned Territory</th>
                    <th className="py-3.5 px-4 text-center">Approval Date</th>
                    <th className="py-3.5 px-4 text-center">Referred Patients</th>
                    <th className="py-3.5 px-4 text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {marketingRepresentatives.map((rep) => {
                    const branchObj = branches.find(b => b.id === rep.branchId);
                    const approver = rep.approvedByAdminName || branchObj?.adminName || 'Hospital Admin';
                    return (
                      <tr key={rep.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0 border border-purple-300">
                              ADM
                            </span>
                            <div>
                              <p className="font-extrabold text-purple-950 text-xs">{approver}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{rep.approvedByAdminEmail || branchObj?.adminEmail || 'admin@hospital.com'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-black text-slate-900">{rep.branchCode}</span>
                          <span className="block text-[10px] text-slate-500 truncate max-w-[140px]">{rep.branchName}</span>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-black text-slate-900 text-xs">{rep.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{rep.phone}</p>
                        </td>

                        <td className="py-4 px-4">
                          <span className="bg-purple-100 text-purple-950 font-mono font-black px-2.5 py-1 rounded-lg text-xs border border-purple-300 shadow-2xs">
                            {rep.referenceId}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-slate-700 font-bold">{rep.territory}</span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {rep.approvedDate}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="font-black font-mono text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                            {rep.referredPatientsCount}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <span className="font-black text-emerald-700 text-xs">₹ {rep.totalCommissionEarned.toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 7: LIVE BRANCH CENTRAL DASHBOARD INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                LIVE EMBEDDED BRANCH CENTRAL DASHBOARD
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {inspectedBranch.name} ({inspectedBranch.code})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Admin: <span className="font-bold text-slate-900">{inspectedBranch.adminName}</span> • Govt Reg: <span className="font-mono text-emerald-800">{inspectedBranch.govRegNumber}</span>
              </p>
            </div>

            {/* Quick Branch Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-extrabold text-slate-700">Switch Branch:</label>
              <select
                value={inspectedBranchId}
                onChange={(e) => setInspectedBranchId(Number(e.target.value))}
                className="px-3.5 py-2 bg-emerald-50/50 border border-emerald-200 text-xs font-bold rounded-xl outline-none focus:border-[#046a4e]"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.code} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scoped Branch KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Branch Revenue</span>
              <p className="text-2xl font-black text-emerald-950">${inspectedRev.toLocaleString()}</p>
              <span className="text-[11px] font-bold text-emerald-700">{inspectedInvoices.length} Invoices</span>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-teal-800 uppercase">Branch Patients</span>
              <p className="text-2xl font-black text-teal-950">{inspectedPatients.length}</p>
              <span className="text-[11px] font-bold text-teal-700">Scoped UHID Records</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase">Inpatient Bed Count</span>
              <p className="text-2xl font-black text-amber-950">{inspectedBeds.filter(b => b.status === 'occupied').length} / {inspectedBeds.length}</p>
              <span className="text-[11px] font-bold text-amber-700">Active Wards</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 card-3d">
              <span className="text-[10px] font-extrabold text-[#046a4e] uppercase">Medical Consultants</span>
              <p className="text-2xl font-black text-slate-900">{inspectedDocs.length}</p>
              <span className="text-[11px] font-bold text-emerald-700">Specialists on Duty</span>
            </div>
          </div>

          {/* Detailed Doctors & Pharmacy Lists for this branch */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Scoped Doctors */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#046a4e]" />
                <span>Assigned Medical Staff ({inspectedDocs.length})</span>
              </h3>

              <div className="space-y-2.5">
                {inspectedDocs.map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between card-3d">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-[#046a4e] font-bold">{doc.specialty}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                      ${doc.fee} Consult
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoped Pharmacy */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>Branch Pharmacy Inventory ({inspectedMeds.length})</span>
              </h3>

              <div className="space-y-2.5">
                {inspectedMeds.map(med => (
                  <div key={med.id} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between card-3d">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{med.name}</p>
                      <p className="text-[11px] text-slate-500">{med.category} • Exp: {med.expiryDate}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700">{med.stock} units</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Direct Admin Control for this inspected branch */}
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-black text-sm text-slate-900">Branch Central Administrator Controls</p>
              <p className="text-xs text-slate-600 font-medium">Currently Managed by: <span className="font-bold text-slate-900">{inspectedBranch.adminName}</span> ({inspectedBranch.adminEmail})</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFireAdminAction(inspectedBranch.id)}
                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs rounded-full transition-all cursor-pointer"
              >
                Fire Current Admin
              </button>
              <button
                onClick={() => {
                  setHireBranchId(inspectedBranch.id);
                  setShowHireAdmin(true);
                }}
                className="px-5 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow transition-all cursor-pointer btn-premium-3d"
              >
                Reassign / Hire New Admin
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ADMIN DETAILS MODAL */}
      {selectedBranchForDetails && detailedBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-emerald-200 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-50 text-[#046a4e] rounded-md border border-emerald-200">
                  {detailedBranch.code}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">{detailedBranch.name}</h3>
              </div>
              <button onClick={() => setSelectedBranchForDetails(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <h4 className="font-extrabold text-emerald-950 text-sm">Branch Leadership & Administration</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Medical Director / Head</span>
                    <span className="font-black text-slate-900">{detailedBranch.branchHead || 'Dr. Medical Director'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Branch Central Admin</span>
                    <span className="font-black text-[#046a4e]">{detailedBranch.adminName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Email Address</span>
                    <span className="font-mono text-slate-700">{detailedBranch.adminEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Direct Phone</span>
                    <span className="font-mono text-slate-700">{detailedBranch.adminPhone || '+91 98000 00000'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Official Campus Address</span>
                <p className="text-slate-800 font-medium">{detailedBranch.address || `${detailedBranch.location}, Medical Enclave`}</p>
                {detailedBranch.govRegNumber && (
                  <p className="text-[11px] font-mono font-bold text-emerald-800 pt-1">
                    Govt. Reg: {detailedBranch.govRegNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
              <button
                onClick={() => {
                  setSelectedBranchForDetails(null);
                  handleFireAdminAction(detailedBranch.id);
                }}
                className="flex-1 py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs transition-all cursor-pointer"
              >
                Fire Current Admin
              </button>

              <button
                onClick={() => {
                  const branchId = detailedBranch.id;
                  setSelectedBranchForDetails(null);
                  setHireBranchId(branchId);
                  setShowHireAdmin(true);
                }}
                className="flex-1 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow transition-all cursor-pointer btn-premium-3d"
              >
                Reassign / Hire Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BRANCH MODAL */}
      {showAddBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-emerald-200 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">Onboard New Hospital Branch</h3>
              <button onClick={() => setShowAddBranch(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Facility Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'Hospital', label: 'Hospital', icon: '🏥' },
                    { id: 'Nursing Home', label: 'Nursing Home', icon: '🏣' },
                    { id: 'Diagnostic Center', label: 'Diagnostic', icon: '🔬' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setNewFacilityType(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                        newFacilityType === item.id
                          ? 'border-[#046a4e] bg-emerald-50 text-[#046a4e]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.icon} {item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medix South-West Care Center"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MEDIX-SOUTH-05"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">City / Zone</label>
                  <input
                    type="text"
                    placeholder="Bengaluru (South Campus)"
                    value={newBranchLoc}
                    onChange={(e) => setNewBranchLoc(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Full Campus Address</label>
                <input
                  type="text"
                  placeholder="45, Outer Ring Road, Tech Corridor"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Branch Medical Head</label>
                <input
                  type="text"
                  placeholder="Dr. Suresh Verma (HOD Trauma)"
                  value={newBranchHead}
                  onChange={(e) => setNewBranchHead(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Govt. Certified Registration No. *</label>
                <input
                  type="text"
                  required
                  placeholder="GOVT-REG-2026-005"
                  value={newGovRegNumber}
                  onChange={(e) => setNewGovRegNumber(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Onboard Branch Node
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HIRE ADMIN MODAL */}
      {showHireAdmin && hireBranchId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-emerald-200 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">Appoint Branch Central Admin</h3>
              <button onClick={() => setShowHireAdmin(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHireAdminSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Administrator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Roy"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ananya.roy@medix.local"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98450 33445"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer mt-2 btn-premium-3d"
              >
                Confirm Appointment & Assign Isolated Scope
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
