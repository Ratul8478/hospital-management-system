<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Franchise;
use App\Models\Referral;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class FranchiseController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $franchise = Franchise::with('wallet')->where('user_id', $user->id)->first();

        if (!$franchise) {
            // Super Admin overview of all franchises
            $franchises = Franchise::with(['wallet', 'referrals'])->get();
            $totalCommission = Referral::where('status', 'credited')->sum('commission_amount');
            $pendingWithdrawals = WithdrawalRequest::where('status', 'pending')->get();

            return response()->json([
                'success' => true,
                'message' => 'Franchise partner overview loaded.',
                'data' => [
                    'franchises' => $franchises,
                    'total_commission_credited' => (float)$totalCommission,
                    'pending_withdrawals' => $pendingWithdrawals,
                ],
            ]);
        }

        $referrals = Referral::with('patient')->where('franchise_id', $franchise->id)->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Franchise partner dashboard loaded.',
            'data' => [
                'franchise' => $franchise,
                'wallet' => $franchise->wallet,
                'referrals' => $referrals,
            ],
        ]);
    }

    public function processReferral(Request $request)
    {
        $validated = $request->validate([
            'franchise_id' => 'required|exists:franchises,id',
            'patient_id' => 'required|exists:patients,id',
            'service_type' => 'required|in:opd,ipd,lab,pharmacy',
            'bill_amount' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $franchise = Franchise::findOrFail($validated['franchise_id']);
            $billAmt = (float)$validated['bill_amount'];

            // Calculate commission based on rule
            $commission = round(($billAmt * ($franchise->commission_rate / 100)), 2);

            $ref = Referral::create([
                'franchise_id' => $franchise->id,
                'patient_id' => $validated['patient_id'],
                'service_type' => $validated['service_type'],
                'bill_amount' => $billAmt,
                'commission_amount' => $commission,
                'status' => 'credited',
            ]);

            // Transactional wallet credit
            $wallet = Wallet::firstOrCreate(
                ['franchise_id' => $franchise->id],
                ['available_balance' => 0.00, 'pending_balance' => 0.00, 'lifetime_earnings' => 0.00]
            );

            $wallet->update([
                'available_balance' => (float)$wallet->available_balance + $commission,
                'lifetime_earnings' => (float)$wallet->lifetime_earnings + $commission,
            ]);

            AuditLog::create([
                'user_id' => $request->user()?->id,
                'module' => 'franchise',
                'action' => 'commission_credited',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['franchise' => $franchise->partner_code, 'commission' => $commission],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Referral processed and commission transactionally credited to wallet.',
        ]);
    }

    public function requestWithdrawal(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10.00',
            'bank_details' => 'required|array',
        ]);

        $user = $request->user();
        $franchise = Franchise::with('wallet')->where('user_id', $user->id)->firstOrFail();

        DB::transaction(function () use ($franchise, $validated, $request) {
            $wallet = Wallet::lockForUpdate()->where('franchise_id', $franchise->id)->firstOrFail();

            if ((float)$validated['amount'] > (float)$wallet->available_balance) {
                throw new Exception("Withdrawal amount (\${$validated['amount']}) cannot exceed eligible available balance (\${$wallet->available_balance}).");
            }

            // Deduct available balance and add to pending balance
            $wallet->update([
                'available_balance' => (float)$wallet->available_balance - (float)$validated['amount'],
                'pending_balance' => (float)$wallet->pending_balance + (float)$validated['amount'],
            ]);

            WithdrawalRequest::create([
                'franchise_id' => $franchise->id,
                'amount' => $validated['amount'],
                'bank_details' => $validated['bank_details'],
                'status' => 'pending',
            ]);

            AuditLog::create([
                'user_id' => $request->user()?->id,
                'module' => 'franchise',
                'action' => 'withdrawal_requested',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['amount' => $validated['amount']],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal request submitted for administrative approval.',
        ]);
    }
}
