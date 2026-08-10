<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Patient::with('branch');

        // Branch Scoping
        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('uhid', 'like', "%{$s}%")
                  ->orWhere('first_name', 'like', "%{$s}%")
                  ->orWhere('last_name', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        $patients = $query->orderBy('id', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Patient directory loaded.',
            'data' => $patients->items(),
            'meta' => [
                'current_page' => $patients->currentPage(),
                'last_page' => $patients->lastPage(),
                'per_page' => $patients->perPage(),
                'total' => $patients->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'branch_id' => 'nullable|exists:hospital_branches,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:male,female,other',
            'dob' => 'required|date',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string|max:10',
            'emergency_contact' => 'nullable|string|max:20',
            'medical_history_notes' => 'nullable|string',
        ]);

        $targetBranchId = $user->hasRole('super_admin')
            ? ($validated['branch_id'] ?? 1)
            : $user->branch_id;

        // Duplicate Warning Check
        $duplicate = Patient::where('branch_id', $targetBranchId)
            ->where('phone', $validated['phone'])
            ->where('first_name', $validated['first_name'])
            ->where('dob', $validated['dob'])
            ->first();

        if ($duplicate && !$request->has('confirm_duplicate')) {
            return response()->json([
                'success' => false,
                'is_duplicate' => true,
                'message' => 'A matching patient with the same name, DOB, and phone already exists in this branch.',
                'data' => $duplicate,
            ], 409);
        }

        $patient = DB::transaction(function () use ($validated, $user, $targetBranchId, $request) {
            $datePrefix = date('Ymd');
            $countToday = Patient::where('branch_id', $targetBranchId)->whereDate('created_at', date('Y-m-d'))->lockForUpdate()->count() + 1;
            $uhid = sprintf('UHID-B%d-%s-%04d', $targetBranchId, $datePrefix, $countToday);

            $newPatient = Patient::create(array_merge($validated, [
                'branch_id' => $targetBranchId,
                'uhid' => $uhid,
                'created_by' => $user?->id,
            ]));

            AuditLog::create([
                'branch_id' => $targetBranchId,
                'user_id' => $user?->id,
                'module' => 'patients',
                'action' => 'patient_created',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['uhid' => $uhid, 'name' => "{$newPatient->first_name} {$newPatient->last_name}"],
            ]);

            return $newPatient;
        });

        return response()->json([
            'success' => true,
            'message' => "Patient registered successfully with UHID: {$patient->uhid}",
            'data' => $patient,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Patient::with([
            'branch',
            'appointments.doctor.user',
            'appointments.department',
            'ipdAdmissions.bed',
            'ipdAdmissions.doctor.user',
            'prescriptions.items',
            'prescriptions.doctor.user',
            'labRequests.test',
            'labRequests.report',
            'invoices.payments',
        ]);

        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        }

        $patient = $query->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Patient history loaded.',
            'data' => $patient,
        ]);
    }
}
