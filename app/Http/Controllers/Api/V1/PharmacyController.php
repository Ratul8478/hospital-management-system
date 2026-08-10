<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    public function medicines(Request $request)
    {
        $user = $request->user();
        $query = Medicine::with(['batches', 'branch']);

        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('barcode', $s)
                  ->orWhere('name', 'like', "%{$s}%")
                  ->orWhere('generic_name', 'like', "%{$s}%");
            });
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('stock_quantity', '<=', 'min_stock_level');
        }

        $medicines = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Pharmacy inventory loaded.',
            'data' => $medicines->items(),
            'meta' => [
                'current_page' => $medicines->currentPage(),
                'last_page' => $medicines->lastPage(),
                'total' => $medicines->total(),
            ],
        ]);
    }
}
