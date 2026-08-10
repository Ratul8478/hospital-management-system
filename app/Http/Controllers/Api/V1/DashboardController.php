<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Bed;
use App\Models\Invoice;
use App\Models\LabRequest;
use App\Models\Medicine;
use App\Models\HospitalBranch;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $today = date('Y-m-d');

        // Determine branch filter
        $branchId = null;
        if (!$user->hasRole('super_admin')) {
            $branchId = $user->branch_id;
        } elseif ($request->has('branch_id') && $request->branch_id !== 'all') {
            $branchId = $request->branch_id;
        }

        $patientQuery = Patient::query();
        $appointmentQuery = Appointment::query();
        $bedQuery = Bed::query();
        $invoiceQuery = Invoice::query();
        $labQuery = LabRequest::query();
        $medicineQuery = Medicine::query();

        if ($branchId) {
            $patientQuery->where('branch_id', $branchId);
            $appointmentQuery->where('branch_id', $branchId);
            $bedQuery->where('branch_id', $branchId);
            $invoiceQuery->where('branch_id', $branchId);
            $labQuery->where('branch_id', $branchId);
            $medicineQuery->where('branch_id', $branchId);
        }

        $totalPatients = $patientQuery->count();
        $todayAppointments = (clone $appointmentQuery)->whereDate('appointment_date', $today)->count();
        $occupiedBeds = (clone $bedQuery)->where('status', 'occupied')->count();
        $totalBeds = (clone $bedQuery)->count();
        
        $totalRevenue = (clone $invoiceQuery)->where('status', 'posted')->sum('paid_amount');
        $pendingLabReports = (clone $labQuery)->whereIn('status', ['pending_sample', 'collected', 'processing'])->count();
        $lowStockAlerts = (clone $medicineQuery)->whereColumn('stock_quantity', '<=', 'min_stock_level')->count();

        // Recent appointment queue
        $recentAppointments = (clone $appointmentQuery)
            ->with(['patient', 'doctor.user', 'doctor.department', 'branch'])
            ->whereDate('appointment_date', $today)
            ->orderBy('token_number', 'asc')
            ->take(6)
            ->get();

        // Bed breakdown
        $bedMatrix = [
            'icu' => ['total' => (clone $bedQuery)->where('ward_type', 'icu')->count(), 'occupied' => (clone $bedQuery)->where('ward_type', 'icu')->where('status', 'occupied')->count()],
            'general' => ['total' => (clone $bedQuery)->where('ward_type', 'general')->count(), 'occupied' => (clone $bedQuery)->where('ward_type', 'general')->where('status', 'occupied')->count()],
            'private' => ['total' => (clone $bedQuery)->where('ward_type', 'private')->count(), 'occupied' => (clone $bedQuery)->where('ward_type', 'private')->where('status', 'occupied')->count()],
            'deluxe' => ['total' => (clone $bedQuery)->where('ward_type', 'deluxe')->count(), 'occupied' => (clone $bedQuery)->where('ward_type', 'deluxe')->where('status', 'occupied')->count()],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Dashboard analytics loaded.',
            'data' => [
                'active_branch_id' => $branchId,
                'total_branches' => HospitalBranch::count(),
                'kpis' => [
                    'total_patients' => $totalPatients,
                    'today_appointments' => $todayAppointments,
                    'occupied_beds' => $occupiedBeds,
                    'total_beds' => $totalBeds,
                    'bed_occupancy_percentage' => $totalBeds > 0 ? round(($occupiedBeds / $totalBeds) * 100, 1) : 0,
                    'total_revenue' => (float)$totalRevenue,
                    'pending_lab_reports' => $pendingLabReports,
                    'low_stock_alerts' => $lowStockAlerts,
                ],
                'recent_appointments' => $recentAppointments,
                'bed_matrix' => $bedMatrix,
            ],
        ]);
    }
}
