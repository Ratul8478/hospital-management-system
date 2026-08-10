<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use App\Models\IpdAdmission;
use App\Models\BedTransfer;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class BedController extends Controller
{
    public function matrix(Request $request)
    {
        $user = $request->user();
        $query = Bed::with(['branch', 'admissions' => function ($q) {
            $q->where('status', 'admitted')->with('patient');
        }]);

        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        $beds = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Bed matrix loaded.',
            'data' => $beds,
        ]);
    }

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'ipd_admission_id' => 'required|exists:ipd_admissions,id',
            'to_bed_id' => 'required|exists:beds,id',
            'reason' => 'required|string|max:255',
        ]);

        $user = $request->user();

        DB::transaction(function () use ($validated, $user, $request) {
            $admission = IpdAdmission::lockForUpdate()->findOrFail($validated['ipd_admission_id']);
            
            if ($admission->status !== 'admitted') {
                throw new Exception("Patient admission is not active.");
            }

            $oldBed = Bed::lockForUpdate()->findOrFail($admission->bed_id);
            $newBed = Bed::lockForUpdate()->findOrFail($validated['to_bed_id']);

            if ($newBed->status !== 'available') {
                throw new Exception("Destination bed {$newBed->bed_number} is not available.");
            }

            // Execute atomic transfer
            $oldBed->update(['status' => 'available']);
            $newBed->update(['status' => 'occupied']);
            $admission->update(['bed_id' => $newBed->id]);

            BedTransfer::create([
                'ipd_admission_id' => $admission->id,
                'from_bed_id' => $oldBed->id,
                'to_bed_id' => $newBed->id,
                'transferred_at' => now(),
                'reason' => $validated['reason'],
                'transferred_by_user_id' => $user->id,
            ]);

            AuditLog::create([
                'branch_id' => $newBed->branch_id,
                'user_id' => $user->id,
                'module' => 'beds',
                'action' => 'bed_transfer',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => [
                    'admission_id' => $admission->id,
                    'from' => $oldBed->bed_number,
                    'to' => $newBed->bed_number,
                ],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Bed transfer executed transactionally and logged.',
        ]);
    }
}
