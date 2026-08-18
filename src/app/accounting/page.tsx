"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Wallet,
  Building2,
  DollarSign,
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

export default function AccountingPage() {
  const { invoices, branches, selectedBranchId } = useApp();
  const [activeTab, setActiveTab] = useState<'cash_book' | 'bank_book' | 'ledger' | 'expenses' | 'pnl'>('cash_book');

  // Filter invoices for calculations
  const filteredInvoices = invoices.filter(inv => {
    if (selectedBranchId !== 'all' && inv.branchId !== selectedBranchId) return false;
    return true;
  });

  const totalCollected = filteredInvoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? inv.amount : 0), 0);
  const totalPending = filteredInvoices.reduce((acc, inv) => acc + (inv.status === 'pending' ? inv.amount : 0), 0);
  const totalExpenses = 4250.00;
  const netResult = totalCollected - totalExpenses;

  // Mock Ledger Entries
  const ledgerEntries = [
    { id: 1, date: '2026-08-11', type: 'Credit', account: 'OPD Billing', reference: 'INV-B1-20260810-01', debit: 0, credit: 1200.00, balance: 1200.00 },
    { id: 2, date: '2026-08-11', type: 'Debit', account: 'Medical Oxygen Supplies', reference: 'EXP-PO-9912', debit: 850.00, credit: 0, balance: 350.00 },
    { id: 3, date: '2026-08-10', type: 'Credit', account: 'IPD Bed Charge', reference: 'INV-B1-20260810-02', debit: 0, credit: 500.00, balance: 850.00 },
    { id: 4, date: '2026-08-10', type: 'Debit', account: 'Pharmacy Restock', reference: 'EXP-PH-4401', debit: 1400.00, credit: 0, balance: -550.00 },
    { id: 5, date: '2026-08-09', type: 'Credit', account: 'Lab Diagnostics', reference: 'INV-B2-20260810-01', debit: 0, credit: 650.00, balance: 100.00 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-black bg-emerald-100 text-emerald-800 rounded-md uppercase tracking-wider">
              TRD Section 14 — Financial Ledger & Accounting
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Enterprise Hospital Accounting</h1>
          <p className="text-sm font-medium text-slate-500">
            Cash Book, Bank Book, Double-Entry General Ledger & P&L Statement.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading Financial Ledger Export PDF...')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="h-4 w-4" /> Export Ledger (PDF)
        </button>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collections</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Receivables</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Expenses</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operating Surplus</p>
            <p className={`text-2xl font-black mt-0.5 ${netResult >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${netResult.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            <span className="text-xs font-mono font-bold text-slate-500">Closing Cash Balance: $4,850.00</span>
          </div>

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
              <tr>
                <td className="px-4 py-3">2026-08-11</td>
                <td className="px-4 py-3 text-sky-700 font-bold">REC-CS-101</td>
                <td className="px-4 py-3 font-sans">OPD Counter Cash Deposit</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">$1,200.00</td>
                <td className="px-4 py-3 text-right text-slate-400">$0.00</td>
                <td className="px-4 py-3 text-right font-bold">$4,850.00</td>
              </tr>
              <tr>
                <td className="px-4 py-3">2026-08-10</td>
                <td className="px-4 py-3 text-rose-700 font-bold">VOUCH-EX-04</td>
                <td className="px-4 py-3 font-sans">Petty Cash Oxygen Cylinder Refill</td>
                <td className="px-4 py-3 text-right text-slate-400">$0.00</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">$250.00</td>
                <td className="px-4 py-3 text-right font-bold">$3,650.00</td>
              </tr>
            </tbody>
          </table>
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

          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Account Title</th>
                <th className="px-4 py-3">Ref ID</th>
                <th className="px-4 py-3 text-right">Debit ($)</th>
                <th className="px-4 py-3 text-right">Credit ($)</th>
                <th className="px-4 py-3 text-right">Balance ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {ledgerEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{entry.date}</td>
                  <td className="px-4 py-3 font-sans font-bold text-slate-800">{entry.account}</td>
                  <td className="px-4 py-3 text-sky-700">{entry.reference}</td>
                  <td className="px-4 py-3 text-right text-rose-600">{entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">${entry.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <span className="text-slate-600">OPD Consultation Fees</span>
                <span className="font-bold text-slate-900 font-mono">$4,850.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">IPD Room & Nursing Charges</span>
                <span className="font-bold text-slate-900 font-mono">$8,900.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Pharmacy Medication Sales</span>
                <span className="font-bold text-slate-900 font-mono">$3,420.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Laboratory & Diagnostic Tests</span>
                <span className="font-bold text-slate-900 font-mono">$2,100.00</span>
              </div>
              <div className="flex justify-between pt-3 font-extrabold text-sm text-emerald-700 border-t border-slate-200">
                <span>Total Gross Income</span>
                <span className="font-mono">$19,270.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-rose-600" /> Expenses & Operating Costs
            </h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Medical Supplies & Restock</span>
                <span className="font-bold text-slate-900 font-mono">$2,800.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Utilities & Biomedical Maintenance</span>
                <span className="font-bold text-slate-900 font-mono">$1,150.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Franchise Referral Commissions</span>
                <span className="font-bold text-slate-900 font-mono">$300.00</span>
              </div>
              <div className="flex justify-between pt-3 font-extrabold text-sm text-rose-700 border-t border-slate-200">
                <span>Total Operating Expense</span>
                <span className="font-mono">$4,250.00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
