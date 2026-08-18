"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Users,
  KeyRound,
  FileCode,
  Settings,
  Activity,
  Search,
  Check,
  Lock,
  Globe,
  Clock,
  UserCheck,
  Terminal,
} from 'lucide-react';

export default function SystemAdminPage() {
  const { auditLogs, branches, branchAdmins, fireAdmin, updateBranchAdminStatus, reassignBranchAdmin } = useApp();
  const [activeSection, setActiveSection] = useState<'branch_admins' | 'audit_logs' | 'rbac' | 'users' | 'settings'>('branch_admins');
  const [searchAudit, setSearchAudit] = useState('');
  const [searchAdminQuery, setSearchAdminQuery] = useState('');

  // Filtering audit logs
  const filteredLogs = auditLogs.filter(log => {
    if (!searchAudit) return true;
    const q = searchAudit.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.ipAddress.includes(q)
    );
  });

  // Filtering Branch Central Admins
  const filteredAdmins = branchAdmins.filter(ba => {
    if (!searchAdminQuery) return true;
    const q = searchAdminQuery.toLowerCase();
    return (
      ba.name.toLowerCase().includes(q) ||
      ba.email.toLowerCase().includes(q) ||
      ba.branchCode.toLowerCase().includes(q) ||
      ba.branchName.toLowerCase().includes(q)
    );
  });

  const PERMISSIONS_MATRIX = [
    { module: 'Patients', view: true, create: true, update: true, delete: false },
    { module: 'Appointments', view: true, create: true, update: true, delete: true },
    { module: 'IPD & Bed Transfers', view: true, create: true, update: true, delete: false },
    { module: 'Billing & Payments', view: true, create: true, update: true, delete: false },
    { module: 'Pharmacy Inventory', view: true, create: true, update: true, delete: false },
    { module: 'Lab Diagnostics', view: true, create: true, update: true, delete: false },
    { module: 'Franchise Wallet', view: true, create: true, update: true, delete: false },
    { module: 'Audit Logs', view: true, create: false, update: false, delete: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-black bg-indigo-100 text-indigo-800 rounded-md uppercase tracking-wider">
              Super Admin Core Control & Audit
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Super Admin Central Control & Branch Supervision</h1>
          <p className="text-sm font-medium text-slate-500">
            Supervise all Branch Central Admins across 9 hospital branches, inspect access scopes & audit immutable logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-extrabold text-slate-700 font-mono">SUPER ADMIN ACTIVE • 9 BRANCHES SUPERVISED</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('branch_admins')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'branch_admins' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="h-4 w-4" /> Branch Central Admins ({branchAdmins.length})
        </button>

        <button
          onClick={() => setActiveSection('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'audit_logs' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="h-4 w-4" /> Production Audit Logs
        </button>

        <button
          onClick={() => setActiveSection('rbac')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'rbac' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> RBAC & Granular Permissions
        </button>

        <button
          onClick={() => setActiveSection('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'users' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" /> System Users & Staff
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'settings' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="h-4 w-4" /> Global ERP Configuration
        </button>
      </div>

      {/* Branch Central Admins Section */}
      {activeSection === 'branch_admins' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-sky-600" /> Super Admin Supervision: Branch Central Admins Matrix
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Super Admin can audit, check credentials, reassign, activate or deactivate any of the 9 Branch Central Admins.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search admin name, branch code, email..."
                value={searchAdminQuery}
                onChange={e => setSearchAdminQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">Supervised Branches</span>
              <p className="text-2xl font-black text-slate-900">{branches.length} Active Nodes</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-700">Active Central Admins</span>
              <p className="text-2xl font-black text-emerald-900">{branchAdmins.filter(a => a.status === 'active').length} Admins On Duty</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-700">Vacant / Suspended</span>
              <p className="text-2xl font-black text-amber-900">{branchAdmins.filter(a => a.status !== 'active').length} Positions</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-4 py-3">Branch Code</th>
                  <th className="px-4 py-3">Central Admin Name</th>
                  <th className="px-4 py-3">Email & Contact</th>
                  <th className="px-4 py-3">Supervised Branch</th>
                  <th className="px-4 py-3">Assigned Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAdmins.map(admin => {
                  const isActive = admin.status === 'active';
                  return (
                    <tr key={admin.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-sky-700">
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded">
                          {admin.branchCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-extrabold text-slate-900 text-sm">{admin.name}</div>
                        <div className="text-[10px] font-bold text-slate-500">{admin.roleTitle}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-800 text-xs">{admin.email}</div>
                        <div className="text-[10px] text-slate-400">{admin.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">{admin.branchName}</td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{admin.assignedDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {isActive ? '● ACTIVE' : '⚠️ VACANT / SUSPENDED'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {isActive ? (
                          <button
                            onClick={() => fireAdmin(admin.branchId)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            Deactivate / Fire
                          </button>
                        ) : (
                          <button
                            onClick={() => updateBranchAdminStatus(admin.id, 'active')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Audit Logs Section */}
      {activeSection === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-sky-600" /> Immutable Production Audit Trail
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Every critical transaction, bed transfer, billing post & permission change is logged.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search action, user, IP..."
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User / Role</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Action Executed</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Metadata / Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] font-bold text-sky-700">{log.role}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-slate-600 font-sans max-w-xs truncate">{log.metadata}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RBAC Section */}
      {activeSection === 'rbac' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> Server-Side Granular RBAC Matrix
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Permissions are enforced on Laravel API endpoints via Policies & Middleware.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-5 py-3.5">Module Capability</th>
                  <th className="px-5 py-3.5 text-center">View (READ)</th>
                  <th className="px-5 py-3.5 text-center">Create (WRITE)</th>
                  <th className="px-5 py-3.5 text-center">Update (EDIT)</th>
                  <th className="px-5 py-3.5 text-center">Delete (ADMIN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {PERMISSIONS_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-extrabold text-slate-900">{item.module}</td>
                    <td className="px-5 py-3.5 text-center">
                      {item.view ? <Check className="h-4 w-4 text-emerald-600 inline" /> : <Lock className="h-4 w-4 text-slate-300 inline" />}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {item.create ? <Check className="h-4 w-4 text-emerald-600 inline" /> : <Lock className="h-4 w-4 text-slate-300 inline" />}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {item.update ? <Check className="h-4 w-4 text-emerald-600 inline" /> : <Lock className="h-4 w-4 text-slate-300 inline" />}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {item.delete ? <Check className="h-4 w-4 text-emerald-600 inline" /> : <Lock className="h-4 w-4 text-slate-300 inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="h-5 w-5 text-sky-600" /> Active System Users & Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900">Mr. Ratul</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Super Admin</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">admin@medix.com</p>
              <p className="text-[11px] font-bold text-emerald-600">Full System Scope</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900">Dr. Jonathan Hayes</span>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Doctor</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">dr.hayes@medix.com</p>
              <p className="text-[11px] font-bold text-sky-600">Cardiology OPD Scope</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900">Arthur Pendelton</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Branch Admin</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">admin.main@medix.com</p>
              <p className="text-[11px] font-bold text-amber-700">Central Branch Scope</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="h-5 w-5 text-slate-700" /> Production System Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital Enterprise Title</label>
                <input type="text" readOnly value="Medix ERP — Multi-Branch Healthcare" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">UHID Format Pattern</label>
                <input type="text" readOnly value="UHID-YYYYMMDD-XXXX" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Default Tax / GST Rate (%)</label>
                <input type="text" readOnly value="18% Fixed Precision Decimal" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">API Authentication Protocol</label>
                <input type="text" readOnly value="Laravel Sanctum Stateful Bearer Tokens" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sky-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
