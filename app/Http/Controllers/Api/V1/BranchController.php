<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HospitalBranch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Super Admin gets all branches
        if ($user->hasRole('super_admin')) {
            $branches = HospitalBranch::with(['branchAdmins.roles'])
                ->withCount(['users', 'doctors', 'patients', 'beds'])
                ->get();
            return response()->json([
                'success' => true,
                'data' => $branches,
            ]);
        }

        // Branch Users get their assigned branch
        if ($user->branch_id) {
            $branch = HospitalBranch::with(['branchAdmins.roles'])
                ->withCount(['users', 'doctors', 'patients', 'beds'])
                ->find($user->branch_id);
            return response()->json([
                'success' => true,
                'data' => [$branch],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasRole('super_admin')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized. Only Super Admin can create branches.'], 403);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:hospital_branches,code',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $branch = HospitalBranch::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hospital branch created successfully.',
            'data' => $branch->load('branchAdmins'),
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $branch = HospitalBranch::with(['branchAdmins.roles'])
            ->withCount(['users', 'doctors', 'patients', 'beds'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $branch,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasRole('super_admin') && $user->branch_id != $id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized branch modification.'], 403);
        }

        $branch = HospitalBranch::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $branch->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hospital branch updated successfully.',
            'data' => $branch,
        ]);
    }
}
