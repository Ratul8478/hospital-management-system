'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useApp } from '@/lib/store';
import { HospitalService } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Building2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Lock,
  ArrowRight,
  CalendarDays,
  Pill,
  FlaskConical,
  BedDouble,
  HeartPulse,
  Share2,
} from 'lucide-react';

function ServicesPageContent() {
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    userRole,
    setUserRole,
    services,
    addService,
    updateService,
    deleteService,
  } = useApp();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Determine active branch scope
  const activeBranch = useMemo(() => {
    if (selectedBranchId === 'all') return branches[0] || { id: 1, name: 'ARIYAN HOSPITAL MULTISPECIALITY', code: 'ARIYAN-HQ' };
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  // Scoped Services strictly for active branch (Zero foreign demo data)
  const branchServices = useMemo(() => {
    const safeList = Array.isArray(services) ? services : [];
    if (selectedBranchId === 'all') return safeList;
    return safeList.filter(s => s && s.branchId === activeBranch?.id);
  }, [services, selectedBranchId, activeBranch]);

  // Role Permissions Check: Only Receptionist (and Super Admin for HQ) can Add/Edit/Delete
  const isAuthorizedReceptionist = userRole === 'receptionist' || userRole === 'super_admin';

  // Modal & Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<HospitalService | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Emergency & Critical Care');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('Per Consultation');
  const [status, setStatus] = useState<'active' | 'inactive' | '24x7' | 'available' | 'unavailable'>('active');
  const [is24x7, setIs24x7] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);
  const [timing, setTiming] = useState('24x7 All Days');
  const [roomOrFloor, setRoomOrFloor] = useState('Ground Floor, Emergency Block');
  const [contactNumber, setContactNumber] = useState('');

  const handleOpenAdd = () => {
    if (!isAuthorizedReceptionist) return;
    setEditingService(null);
    setName('');
    setCategory('Emergency & Critical Care');
    setDepartment('Critical Care & ICU');
    setDescription('');
    setPrice('');
    setPriceUnit('Per Consultation');
    setStatus('active');
    setIs24x7(true);
    setIsEmergency(false);
    setTiming('24x7 All Days');
    setRoomOrFloor('Ground Floor, Emergency Wing');
    setContactNumber(activeBranch.adminPhone || '+91 91443 76971');
    setShowAddModal(true);
  };

  const handleOpenEdit = (srv: HospitalService) => {
    if (!isAuthorizedReceptionist) return;
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDepartment(srv.department || '');
    setDescription(srv.description || '');
    setPrice(srv.price !== undefined ? srv.price.toString() : '');
    setPriceUnit(srv.priceUnit || 'Per Consultation');
    setStatus(srv.status);
    setIs24x7(srv.is24x7 || srv.status === '24x7');
    setIsEmergency(srv.isEmergency || false);
    setTiming(srv.timing || '24x7 All Days');
    setRoomOrFloor(srv.roomOrFloor || 'Ground Floor');
    setContactNumber(srv.contactNumber || activeBranch.adminPhone || '+91 91443 76971');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorizedReceptionist) {
      showToast('Permission Denied: Only Receptionist can add/update services.', 'error');
      return;
    }

    if (!name.trim()) {
      showToast('Please enter the service name.', 'error');
      return;
    }

    const priceNum = price.trim() ? parseFloat(price) : undefined;
    const finalStatus: HospitalService['status'] = is24x7 ? '24x7' : status;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        category,
        department: department.trim() || undefined,
        description: description.trim(),
        price: priceNum,
        priceUnit,
        status: finalStatus,
        is24x7,
        isEmergency,
        timing: timing.trim(),
        roomOrFloor: roomOrFloor.trim(),
        contactNumber: contactNumber.trim(),
        addedBy: `Receptionist (${activeBranch.name})`,
      });
      showToast(`Service "${name}" updated successfully.`);
    } else {
      addService({
        branchId: activeBranch.id,
        name: name.trim(),
        category,
        department: department.trim() || undefined,
        description: description.trim(),
        price: priceNum,
        priceUnit,
        status: finalStatus,
        is24x7,
        isEmergency,
        timing: timing.trim(),
        roomOrFloor: roomOrFloor.trim(),
        contactNumber: contactNumber.trim(),
        addedBy: `Receptionist (${activeBranch.name})`,
      });
      showToast(`Service "${name}" registered to ${activeBranch.name}.`);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    if (!isAuthorizedReceptionist) {
      showToast('Permission Denied: Only Receptionist can delete services.', 'error');
      return;
    }
    deleteService(id);
    setDeleteConfirmId(null);
    showToast('Service deleted from hospital roster.');
  };

  const handleToggleStatus = (srv: HospitalService) => {
    if (!isAuthorizedReceptionist) return;
    const nextStatus: HospitalService['status'] =
      srv.status === 'active' || srv.status === '24x7' ? 'inactive' : 'active';
    updateService(srv.id, { status: nextStatus });
    showToast(`Service status updated to ${nextStatus.toUpperCase()}`);
  };

  const CATEGORIES_LIST = [
    'all',
    'Emergency & Critical Care',
    'ICU & Inpatient Wards',
    'Diagnostics & Imaging',
    'Pathology & Labs',
    'Specialist OPD Consultations',
    'Surgical Specialties',
    'Maternity & Neonatal',
    'Cardiology Heart Station',
    'Orthopedics & Spine',
    'Pharmacy & Dispensing',
    'Dialysis & Nephrology',
    'Ambulance & Transport',
    'Eye & Dental Care',
  ];

  const filteredServices = useMemo(() => {
    const list = Array.isArray(branchServices) ? branchServices : [];
    return list.filter(s => {
      if (!s) return false;
      const matchCategory = categoryFilter === 'all' || (s.category && s.category.toLowerCase().includes(categoryFilter.toLowerCase()));
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.department && s.department.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [branchServices, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 font-sans">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 border ${
              toastMsg.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toastMsg.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* TOP HERO HEADER */}
      <div className="bg-[#022c22] text-white border-b border-[#064e3b] px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Hospital Clinical & Diagnostic Matrix</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>{activeBranch.name}</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeBranch.code}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/80 font-medium">
                {activeBranch.address || activeBranch.location} • Reg No: {activeBranch.govRegNumber || 'WB.33735581'}
              </p>
            </div>

            {/* Hospital Branch Selector & Role Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#012019] p-3 rounded-2xl border border-emerald-900/60">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Select Hospital Branch:
                </label>
                <select
                  value={selectedBranchId}
                  onChange={e => setSelectedBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 bg-[#022c22] border border-emerald-700 text-white font-black text-xs rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="all">🏬 All Hospital Campuses</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Link to Receptionist Desk */}
              <Link
                href="/receptionist"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shrink-0"
              >
                <Building2 className="w-4 h-4" />
                <span>Receptionist Desk</span>
              </Link>
            </div>
          </div>

          {/* Role Access Banner */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-300 font-bold">Current Logged Role:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-black uppercase text-[11px] border border-white/20">
                {userRole.replace('_', ' ')}
              </span>
            </div>

            {isAuthorizedReceptionist ? (
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorized to Add, Edit, and Delete Services</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-200 font-bold text-xs bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>View-Only Mode • Only Receptionist can add/modify services</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">

        {/* METRIC CHIPS & ACTIONS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Services</p>
              <p className="text-lg font-black text-slate-900">{(branchServices || []).length}</p>
            </div>
            <div className="px-4 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">24x7 Emergency Ready</p>
              <p className="text-lg font-black text-emerald-800">
                {(branchServices || []).filter(s => s && (s.is24x7 || s.status === '24x7')).length}
              </p>
            </div>
            <div className="px-4 py-2.5 bg-rose-50 rounded-2xl border border-rose-200 text-center">
              <p className="text-[10px] font-black text-rose-700 uppercase tracking-wider">Critical & Trauma Units</p>
              <p className="text-lg font-black text-rose-800">
                {(branchServices || []).filter(s => s && (s.isEmergency || (s.category && (s.category.includes('Emergency') || s.category.includes('ICU'))))).length}
              </p>
            </div>
          </div>

          {/* Add Service Button (Authorized Receptionist Only) */}
          {isAuthorizedReceptionist && (
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Hospital Service</span>
            </button>
          )}
        </div>

        {/* SEARCH & CATEGORY FILTER TOOLBAR */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by service name, department, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs font-black text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter:</span>
            </span>
            {CATEGORIES_LIST.slice(0, 8).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#046a4e] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES CARDS OR ZERO-STATE */}
        {(branchServices || []).length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-[#046a4e] flex items-center justify-center mx-auto shadow-inner">
              <Activity className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                No Services Registered for {activeBranch.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This hospital currently has <strong>0 clinical services registered</strong>. No demo or mock services are shown for newly registered facilities.
                {isAuthorizedReceptionist
                  ? ' As the authorized Receptionist, you can register and update the clinical, ICU, surgery, and emergency services for this hospital.'
                  : ' Please contact the hospital front desk receptionist to register services.'}
              </p>
            </div>

            {isAuthorizedReceptionist ? (
              <button
                onClick={handleOpenAdd}
                className="px-6 py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-2xl shadow-xl transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register First Hospital Service</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Service Addition Restricted to Receptionist</span>
              </div>
            )}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
            <p className="text-sm font-bold text-slate-700">No services match your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="text-xs font-black text-[#046a4e] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map(srv => (
              <div
                key={srv.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-base text-slate-900">{srv.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {srv.department ? `Department: ${srv.department}` : srv.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isAuthorizedReceptionist && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(srv)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(srv.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-black">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {srv.category}
                    </span>
                    {(srv.is24x7 || srv.status === '24x7') && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>24x7 ACTIVE</span>
                      </span>
                    )}
                    {srv.isEmergency && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                        🚨 EMERGENCY
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full ${
                        srv.status === 'active' || srv.status === '24x7'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {srv.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {srv.description || 'Clinical specialty and patient care service.'}
                  </p>

                  {/* Operational Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{srv.timing || '24x7 Operational'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{srv.roomOrFloor || 'Ground Floor'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & Contact */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pricing / Fee</span>
                    <p className="font-black text-slate-900 text-sm">
                      {srv.price !== undefined ? (
                        <>₹ {srv.price.toLocaleString('en-IN')} <span className="text-[10px] font-bold text-slate-500">/ {srv.priceUnit || 'Unit'}</span></>
                      ) : (
                        <span className="text-[#046a4e]">Hospital Covered</span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Helpline</span>
                    <p className="font-mono font-bold text-slate-800 text-xs">
                      {srv.contactNumber || activeBranch.adminPhone || '+91 91443 76971'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SERVICE */}
      {/* ========================================================================= */}
      {showAddModal && isAuthorizedReceptionist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl border border-slate-200 shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.name}
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingService ? `Edit Service: ${editingService.name}` : `Register New Hospital Service`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Front desk receptionist portal for hospital capabilities and facilities.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-medium max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {/* Service Name */}
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  Service / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24x7 Emergency ICU & Trauma Care, Digital X-Ray, 2D ECHO"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                />
              </div>

              {/* Category & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none cursor-pointer"
                  >
                    <option value="Emergency & Critical Care">🚨 Emergency & Critical Care</option>
                    <option value="ICU & Inpatient Wards">🛏️ ICU & Inpatient Wards</option>
                    <option value="Diagnostics & Imaging">🩻 Diagnostics & Imaging</option>
                    <option value="Pathology & Labs">🧪 Pathology & Clinical Labs</option>
                    <option value="Specialist OPD Consultations">🩺 Specialist OPD Consultations</option>
                    <option value="Surgical Specialties">🔪 Surgical Specialties & OT</option>
                    <option value="Maternity & Neonatal">👶 Maternity & Child Care</option>
                    <option value="Cardiology Heart Station">❤️ Cardiology & Heart Station</option>
                    <option value="Orthopedics & Spine">🦴 Orthopedics & Spine</option>
                    <option value="Pharmacy & Dispensing">💊 24x7 Pharmacy & POS</option>
                    <option value="Dialysis & Nephrology">💧 Dialysis Unit</option>
                    <option value="Ambulance & Transport">🚑 Ambulance & Medical Transport</option>
                    <option value="Eye & Dental Care">👁️ Eye & Dental Care</option>
                    <option value="General Healthcare">🏥 General Healthcare</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Department / Unit Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Critical Care, Radiology, Cardiology"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Price / Starting Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (Leave blank if subsidized/free)"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Pricing Unit / Basis
                  </label>
                  <select
                    value={priceUnit}
                    onChange={e => setPriceUnit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none cursor-pointer"
                  >
                    <option value="Per Consultation">Per Consultation</option>
                    <option value="Per Test">Per Test</option>
                    <option value="Per Day (Bed / Ward)">Per Day (Bed / Ward)</option>
                    <option value="Per Procedure / Surgery">Per Procedure / Surgery</option>
                    <option value="Starting From">Starting From</option>
                    <option value="Fixed Package">Fixed Package</option>
                    <option value="Free / Subsidized">Free / Subsidized</option>
                  </select>
                </div>
              </div>

              {/* Timing & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Operational Hours / Timing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24x7 All Days, 08:00 AM - 08:00 PM"
                    value={timing}
                    onChange={e => setTiming(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">
                    Room / Floor / Wing Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ground Floor, Block A / 2nd Floor OT"
                    value={roomOrFloor}
                    onChange={e => setRoomOrFloor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                  />
                </div>
              </div>

              {/* Contact Helpline */}
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  Department Helpline Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 91443 76971 / 033-2558-XXXX"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Service Flags</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={is24x7}
                      onChange={e => setIs24x7(e.target.checked)}
                      className="w-4 h-4 rounded text-[#046a4e] focus:ring-[#046a4e] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">24x7 Round-The-Clock</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isEmergency}
                      onChange={e => setIsEmergency(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">🚨 Emergency Priority</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  Service Description & Clinical Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe testing technology, ICU beds, surgeon specialties, patient guidelines..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#046a4e]/20 focus:border-[#046a4e] outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingService ? 'Save Changes' : 'Register Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmId !== null && isAuthorizedReceptionist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Delete Hospital Service?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this service from <strong>{activeBranch.name}</strong>?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-md transition cursor-pointer text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Loading Hospital Services...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
