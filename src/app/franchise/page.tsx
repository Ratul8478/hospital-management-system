"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Coins, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FranchisePage() {
  const { branches } = useApp();
  const [walletBalance, setWalletBalance] = useState(1450.00);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt > walletBalance) return;

    setWalletBalance(prev => prev - amt);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawAmount('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-500" />
            <span>Franchise Partner & Royalty Wallet</span>
          </h1>
          <p className="text-xs text-slate-500">Franchise network revenue sharing and wallet payout requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Available Royalty Balance</span>
          <p className="text-4xl font-black text-slate-900">${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-500">Calculated from 5% network gross revenue split across active branches.</p>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-sky-600" />
            <span>Request Royalty Withdrawal</span>
          </h2>

          {withdrawSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Withdrawal request submitted! Funds will be transferred to registered bank account within 24 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Withdrawal Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={walletBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 500.00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payout Destination</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-sky-500">
                    <option>Chase Bank ****4921 (Primary ACH)</option>
                    <option>Bank of America ****8812</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 font-bold text-white text-xs shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-colors"
              >
                Submit Withdrawal Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
