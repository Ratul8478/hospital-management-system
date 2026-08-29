"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Wallet,
  Building2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  CreditCard,
  Landmark,
} from 'lucide-react';

import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function AccountingPage() {
  const { invoices, branches, selectedBranchId, userRole } = useApp();
  const [activeTab, setActiveTab] = useState<'cash_book' | 'bank_book' | 'ledger' | 'expenses' | 'pnl'>('cash_book');

  if (userRole === 'patient') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Hospital Accounts Restricted</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Institutional general ledgers, cash books, and P&L balances are restricted to Hospital Administration. To view your personal billing receipts, please visit the Patient Billing section.
          </p>
          <div className="pt-2">
            <Link
              href="/billing"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#046a4e] hover:bg-[#03543e] text-white rounded-2xl font-bold text-xs shadow-md transition-all"
            >
              View My Personal Invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter invoices for calculations
  const filteredInvoices = (invoices || []).filter(inv => {
    if (!inv) return false;
    if (selectedBranchId !== 'all' && inv.branchId !== selectedBranchId) return false;
    return true;
  });

  const totalCollected = filteredInvoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? (inv.amount || 0) : 0), 0);
  const totalPending = filteredInvoices.reduce((acc, inv) => acc + (inv.status === 'pending' ? (inv.amount || 0) : 0), 0);
  const totalExpenses = 0.00;
  const netResult = totalCollected - totalExpenses;

  // Dynamic Ledger Entries from settled invoices
  const ledgerEntries = filteredInvoices.map(inv => ({
    id: inv.id,
    date: inv.date,
    type: inv.status === 'paid' ? 'Credit' : 'Pending',
    account: `${inv.patientName || 'Patient'} — Invoice Settlement`,
    reference: inv.invoiceNumber || 'INV-SETTLED',
    debit: 0,
    credit: inv.status === 'paid' ? (inv.amount || 0) : 0,
    balance: inv.status === 'paid' ? (inv.amount || 0) : 0,
  }));

  const paidInvoices = filteredInvoices.filter(i => i.status === 'paid');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Landmark className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Hospital Financial Accounts & Ledger</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-branch financial balance sheets, cash books, general ledger & audited reports.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
            <Download className="h-4 w-4" /> Export Balance Sheet
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collections</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">₹{totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Receivables</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Expenses</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operating Surplus</p>
            <p className={`text-2xl font-black mt-0.5 ${netResult >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{netResult.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cash_book')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'cash_book' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="h-4 w-4" /> Cash Book
        </button>

        <button
          onClick={() => setActiveTab('bank_book')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'bank_book' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="h-4 w-4" /> Bank Book
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ledger' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" /> General Ledger
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'expenses' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="h-4 w-4" /> Expenses & Procurement
        </button>

        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'pnl' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Balance Sheet / P&L
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'cash_book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-sky-600" /> Cash Transactions Register
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">Closing Cash Balance: ₹{totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {paidInvoices.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-medium">
              No cash transactions recorded yet. Settled patient receipts will appear here automatically.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Receipt / Voucher</th>
                  <th className="px-4 py-3">Particulars</th>
                  <th className="px-4 py-3 text-right">Cash In</th>
                  <th className="px-4 py-3 text-right">Cash Out</th>
                  <th className="px-4 py-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {paidInvoices.map((inv, idx) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3 text-sky-700 font-bold">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 font-sans">Payment from {inv.patientName}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-bold">₹{inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">₹0.00</td>
                    <td className="px-4 py-3 text-right font-bold">₹{inv.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600" /> Double-Entry General Ledger
            </h3>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
              Audited Records
            </span>
          </div>

          {ledgerEntries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-medium">
              No ledger entries recorded yet. System ledger will generate entries as bills and transactions are created.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Account Title</th>
                  <th className="px-4 py-3">Ref ID</th>
                  <th className="px-4 py-3 text-right">Debit (₹)</th>
                  <th className="px-4 py-3 text-right">Credit (₹)</th>
                  <th className="px-4 py-3 text-right">Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {ledgerEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{entry.date}</td>
                    <td className="px-4 py-3 font-sans font-bold text-slate-800">{entry.account}</td>
                    <td className="px-4 py-3 text-sky-700">{entry.reference}</td>
                    <td className="px-4 py-3 text-right text-rose-600">{entry.debit > 0 ? `₹${entry.debit.toFixed(2)}` : '-'}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{entry.credit > 0 ? `₹${entry.credit.toFixed(2)}` : '-'}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-900">₹{entry.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-rose-600" /> Hospital Operational Expenses & Procurement
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">Total Expenses: ₹{totalExpenses.toFixed(2)}</span>
          </div>

          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            No active expense vouchers logged. Hospital procurement and operational vouchers will appear here.
          </div>
        </div>
      )}

      {activeTab === 'bank_book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-sky-600" /> Bank Book & Digital Settlement Account
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">Bank Balance: ₹{totalCollected.toFixed(2)}</span>
          </div>

          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            Bank account settlements and direct NEFT/UPI transaction receipts will be mirrored here.
          </div>
        </div>
      )}

      {activeTab === 'pnl' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Income & Revenue Breakdown
            </h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Patient Billing Collections</span>
                <span className="font-bold text-slate-900 font-mono">₹{totalCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Outstanding Receivables</span>
                <span className="font-bold text-slate-900 font-mono">₹{totalPending.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 font-extrabold text-sm text-emerald-700 border-t border-slate-200">
                <span>Total Gross Income</span>
                <span className="font-mono">₹{(totalCollected + totalPending).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-rose-600" /> Expenses & Operating Costs
            </h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Operational Expenses</span>
                <span className="font-bold text-slate-900 font-mono">₹{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 font-extrabold text-sm text-rose-700 border-t border-slate-200">
                <span>Total Operating Expense</span>
                <span className="font-mono">₹{totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
