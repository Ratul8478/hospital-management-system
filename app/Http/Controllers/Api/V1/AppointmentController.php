<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with(['patient', 'doctor.user', 'doctor.department', 'branch']);

        // Branch Scoping
        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('appointment_date', $request->date);
        } else {
            $query->whereDate('appointment_date', date('Y-m-d'));
        }

        if ($request->filled('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('token_number', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Appointment list loaded.',
            'data' => $appointments,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'branch_id' => 'nullable|exists:hospital_branches,id',
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'department_id' => 'nullable|exists:departments,id',
            'appointment_date' => 'required|date',
            'slot_time' => 'nullable|string',
            'type' => 'nullable|string',
            'reason_for_visit' => 'nullable|string',
        ]);

        $doctor = Doctor::findOrFail($validated['doctor_id']);
        $targetBranchId = $user->hasRole('super_admin')
            ? ($validated['branch_id'] ?? $doctor->branch_id ?? 1)
            : $user->branch_id;

        $appointment = DB::transaction(function () use ($validated, $user, $targetBranchId, $doctor, $request) {
            $date = $validated['appointment_date'];

            // Concurrency-safe lock on last token number for doctor/branch
            $lastToken = Appointment::where('branch_id', $targetBranchId)
                ->where('doctor_id', $doctor->id)
                ->whereDate('appointment_date', $date)
                ->lockForUpdate()
                ->max('token_number');

            $tokenNumber = ($lastToken ?? 0) + 1;
            $appointmentNum = sprintf('APT-B%d-%s-%04d', $targetBranchId, str_replace('-', '', $date), rand(1000, 9999));

            $apt = Appointment::create(array_merge($validated, [
                'branch_id' => $targetBranchId,
                'department_id' => $validated['department_id'] ?? $doctor->department_id,
                'appointment_number' => $appointmentNum,
                'token_number' => $tokenNumber,
                'status' => 'scheduled',
            ]));

            AuditLog::create([
                'branch_id' => $targetBranchId,
                'user_id' => $user?->id,
                'module' => 'appointments',
                'action' => 'appointment_booked',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['appointment_id' => $apt->id, 'token' => $tokenNumber],
            ]);

            return $apt->load(['patient', 'doctor.user', 'doctor.department', 'branch']);
        });

        return response()->json([
            'success' => true,
            'message' => "Appointment booked successfully! Daily Token #: {$appointment->token_number}",
            'data' => $appointment,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $request->validate([
            'status' => 'required|in:scheduled,waiting,in_consultation,completed,cancelled,no_show',
        ]);

        $query = Appointment::query();
        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        }

        $appointment = $query->findOrFail($id);
        $appointment->update(['status' => $request->status]);

        AuditLog::create([
            'branch_id' => $appointment->branch_id,
            'user_id' => $user?->id,
            'module' => 'appointments',
            'action' => 'status_updated',
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => ['appointment_id' => $appointment->id, 'status' => $request->status],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Appointment status updated to {$request->status}.",
            'data' => $appointment->load(['patient', 'doctor.user']),
        ]);
    }
}
