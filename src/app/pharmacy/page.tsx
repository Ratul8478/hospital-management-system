"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { Pill } from 'lucide-react';

export default function PharmacyPage() {
  const { medicines, branches, selectedBranchId } = useApp();

  const filteredMedicines = selectedBranchId === 'all'
    ? medicines
    : medicines.filter(m => m.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Pill className="h-6 w-6 text-emerald-600" />
            <span>Pharmacy Stock & Batch Expiry Control</span>
          </h1>
          <p className="text-xs text-slate-500">Formulation inventory and batch expiry alerts</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
          {filteredMedicines.length} Formulations
        </span>
      </div>

      {filteredMedicines.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Pill className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Pharmacy Inventory Added Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Pharmaceutical stock is currently at 0. Pharmacists and hospital administrators can add formulation batches and inventory units here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMedicines.map(med => {
            const branch = branches.find(b => b.id === med.branchId);
            return (
              <div key={med.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded">
                    {branch?.code}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Exp: {med.expiryDate}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{med.name}</h3>
                  <p className="text-xs text-emerald-600 font-extrabold">{med.category}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Stock</span>
                    <span className="font-black text-slate-900 text-base">{med.stock} units</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Unit Price</span>
                    <span className="font-black text-emerald-600 text-base">₹{med.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
