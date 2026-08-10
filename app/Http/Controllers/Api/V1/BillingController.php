<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\AccountsLedger;
use App\Models\Patient;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Invoice::with(['patient', 'items', 'payments', 'branch']);

        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        $invoices = $query->orderBy('id', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Invoices loaded.',
            'data' => $invoices->items(),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'branch_id' => 'nullable|exists:hospital_branches,id',
            'patient_id' => 'required|exists:patients,id',
            'module' => 'required|in:opd,ipd,pharmacy,laboratory,package',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'items.*.tax_rate' => 'nullable|numeric|min:0',
        ]);

        $patient = Patient::findOrFail($validated['patient_id']);
        $targetBranchId = $user->hasRole('super_admin')
            ? ($validated['branch_id'] ?? $patient->branch_id ?? 1)
            : $user->branch_id;

        $invoice = DB::transaction(function () use ($validated, $user, $targetBranchId, $request) {
            $subtotal = 0;
            $totalTax = 0;
            $totalDiscount = 0;
            $processedItems = [];

            foreach ($validated['items'] as $item) {
                $qty = (int)$item['quantity'];
                $price = (float)$item['unit_price'];
                $disc = (float)($item['discount'] ?? 0);
                $taxPct = (float)($item['tax_rate'] ?? 0);

                $lineSub = $qty * $price;
                $lineTax = ($lineSub - $disc) * ($taxPct / 100);
                $net = ($lineSub - $disc) + $lineTax;

                $subtotal += $lineSub;
                $totalDiscount += $disc;
                $totalTax += $lineTax;

                $processedItems[] = [
                    'item_name' => $item['item_name'],
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'discount' => $disc,
                    'tax_rate' => $taxPct,
                    'net_amount' => round($net, 2),
                ];
            }

            $totalAmount = round(($subtotal - $totalDiscount) + $totalTax, 2);
            $invoiceNum = sprintf('INV-B%d-%s-%04d', $targetBranchId, date('Ymd'), rand(1000, 9999));

            $inv = Invoice::create([
                'branch_id' => $targetBranchId,
                'invoice_number' => $invoiceNum,
                'patient_id' => $validated['patient_id'],
                'module' => $validated['module'],
                'subtotal' => round($subtotal, 2),
                'discount_amount' => round($totalDiscount, 2),
                'tax_amount' => round($totalTax, 2),
                'total_amount' => $totalAmount,
                'paid_amount' => 0.00,
                'due_amount' => $totalAmount,
                'status' => 'draft',
                'created_by' => $user->id,
            ]);

            foreach ($processedItems as $pi) {
                $inv->items()->create($pi);
            }

            AuditLog::create([
                'branch_id' => $targetBranchId,
                'user_id' => $user->id,
                'module' => 'billing',
                'action' => 'invoice_created',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['invoice_number' => $invoiceNum, 'total' => $totalAmount],
            ]);

            return $inv->load(['patient', 'items', 'branch']);
        });

        return response()->json([
            'success' => true,
            'message' => "Invoice generated successfully with server-calculated total: \${$invoice->total_amount}",
            'data' => $invoice,
        ], 201);
    }

    public function postPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|in:cash,card,upi,bank_transfer',
            'transaction_reference' => 'nullable|string',
        ]);

        $user = $request->user();

        DB::transaction(function () use ($id, $validated, $user, $request) {
            $query = Invoice::query();
            if (!$user->hasRole('super_admin')) {
                $query->where('branch_id', $user->branch_id);
            }

            $invoice = $query->lockForUpdate()->findOrFail($id);

            $payAmount = (float)$validated['amount'];
            if ($payAmount > (float)$invoice->due_amount) {
                throw new \Exception("Payment amount exceeds remaining due amount ({$invoice->due_amount}).");
            }

            $paymentNum = sprintf('PAY-B%d-%s-%04d', $invoice->branch_id, date('Ymd'), rand(1000, 9999));

            $payment = Payment::create([
                'payment_number' => $paymentNum,
                'invoice_id' => $invoice->id,
                'amount' => $payAmount,
                'payment_mode' => $validated['payment_mode'],
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'paid_at' => now(),
                'received_by' => $user->id,
            ]);

            $newPaid = (float)$invoice->paid_amount + $payAmount;
            $newDue = (float)$invoice->total_amount - $newPaid;
            $newStatus = $newDue <= 0 ? 'posted' : 'draft';

            $invoice->update([
                'paid_amount' => round($newPaid, 2),
                'due_amount' => max(0, round($newDue, 2)),
                'status' => $newStatus,
            ]);

            // Sync with Accounts Ledger
            AccountsLedger::create([
                'branch_id' => $invoice->branch_id,
                'transaction_date' => now(),
                'invoice_id' => $invoice->id,
                'payment_id' => $payment->id,
                'entry_type' => 'credit',
                'account_head' => $invoice->module . '_revenue',
                'amount' => $payAmount,
                'narration' => "Payment received for invoice {$invoice->invoice_number} via {$validated['payment_mode']}",
            ]);

            AuditLog::create([
                'branch_id' => $invoice->branch_id,
                'user_id' => $user->id,
                'module' => 'billing',
                'action' => 'payment_posted',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['payment_number' => $paymentNum, 'amount' => $payAmount],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Payment posted and ledger entry recorded.',
        ]);
    }
}
