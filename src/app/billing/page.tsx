"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { Receipt, CheckCircle } from 'lucide-react';

export default function BillingPage() {
  const { invoices, branches, selectedBranchId } = useApp();

  const filteredInvoices = selectedBranchId === 'all'
    ? (invoices || [])
    : (invoices || []).filter(i => i && i.branchId === selectedBranchId);

  const totalCollected = filteredInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-sky-600" />
            <span>Billing & Financial Accounts Ledger</span>
          </h1>
          <p className="text-xs text-slate-500">Patient invoice settlements and revenue distribution</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Ledger Collections</span>
          <span className="text-xl font-black text-emerald-600">₹{totalCollected.toLocaleString()}</span>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-white p-10 sm:p-14 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Receipt className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Invoices Recorded Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            The billing ledger is clean. Generated patient bills, OPD consultation fees, and pharmacy sales will be listed here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Hospital Branch</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Billing Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map(inv => {
                const branch = branches.find(b => b.id === inv.branchId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-sky-700 font-bold">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {branch?.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.patientName}</td>
                    <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                    <td className="px-6 py-4 font-black text-emerald-600">₹{inv.amount.toLocaleString()}.00</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full inline-flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>PAID & SETTLED</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
