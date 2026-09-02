"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Coins, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FranchisePage() {
  const { branches } = useApp();
  
  // Calculate royalty from active branches (e.g. 5% royalty pool)
  const totalBranchRevenue = branches.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const calculatedRoyalty = Math.max(Math.round(totalBranchRevenue * 0.05), 0);

  const [payouts, setPayouts] = useState<Array<{
    id: string;
    amount: number;
    destination: string;
    status: 'Processed' | 'Pending Review' | 'Completed';
    date: string;
  }>>([
    {
      id: 'TXN-ROYALTY-9401',
      amount: 15000,
      destination: 'Registered Bank Account (HDFC Bank)',
      status: 'Completed',
      date: '2026-08-25',
    },
  ]);

  const withdrawnSum = payouts.reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(calculatedRoyalty - withdrawnSum, 0);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Registered Bank Account (IMPS / NEFT)');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt > availableBalance) return;

    const newPayout = {
      id: `TXN-ROYALTY-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amt,
      destination: payoutMethod,
      status: 'Pending Review' as const,
      date: new Date().toISOString().split('T')[0],
    };

    setPayouts(prev => [newPayout, ...prev]);
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
          <p className="text-4xl font-black text-slate-900">₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-500">Calculated from 5% royalty pool across {branches.length} registered hospital branches.</p>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter withdrawal amount..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payout Destination</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-sky-500"
                  >
                    <option>Registered Bank Account (IMPS / NEFT)</option>
                    <option>Direct UPI Settlement</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={availableBalance <= 0}
                className={`px-6 py-2.5 rounded-xl font-bold text-white text-xs shadow-md transition-colors ${availableBalance > 0 ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                Submit Withdrawal Request
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RECENT SETTLEMENT TRANSACTIONS */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">Recent Payout Settlements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                <th className="pb-2">Reference ID</th>
                <th className="pb-2">Destination</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-mono text-slate-900 font-bold">{p.id}</td>
                  <td className="py-2.5">{p.destination}</td>
                  <td className="py-2.5">{p.date}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
