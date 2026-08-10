<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LabRequest;
use App\Models\LabReport;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
{
    public function requests(Request $request)
    {
        $user = $request->user();
        $query = LabRequest::with(['patient', 'doctor.user', 'test.category', 'labReport', 'branch']);

        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        $requests = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Lab request queue loaded.',
            'data' => $requests,
        ]);
    }

    public function processReport(Request $request, $id)
    {
        $user = $request->user();
        $validated = $request->validate([
            'result_data' => 'required|array',
            'status' => 'required|in:collected,processing,ready',
        ]);

        $query = LabRequest::query();
        if (!$user->hasRole('super_admin')) {
            $query->where('branch_id', $user->branch_id);
        }

        $labReq = $query->findOrFail($id);
        $labReq->update(['status' => $validated['status']]);

        if ($validated['status'] === 'ready') {
            LabReport::updateOrCreate(
                ['lab_request_id' => $labReq->id],
                [
                    'result_data' => $validated['result_data'],
                    'report_pdf_path' => "/reports/lab-report-{$labReq->request_number}.pdf",
                    'approved_by' => $user->id,
                    'generated_at' => now(),
                ]
            );

            AuditLog::create([
                'branch_id' => $labReq->branch_id,
                'user_id' => $user->id,
                'module' => 'laboratory',
                'action' => 'lab_report_generated',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['request_number' => $labReq->request_number],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Laboratory test request updated.',
            'data' => $labReq->load(['patient', 'test', 'labReport']),
        ]);
    }
}
