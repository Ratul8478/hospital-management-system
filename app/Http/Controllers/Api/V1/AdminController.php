<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\HmsRole;
use App\Models\HmsPermission;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $query = User::with(['roles', 'branch', 'doctor.department', 'franchise']);

        if (!$currentUser->hasRole('super_admin')) {
            $query->where('branch_id', $currentUser->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        $users = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Users list loaded.',
            'data' => $users,
        ]);
    }

    public function createUser(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->hasRole('super_admin') && !$currentUser->hasRole('branch_admin')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized user management.'], 403);
        }

        $validated = $request->validate([
            'branch_id' => 'nullable|exists:hospital_branches,id',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'required|exists:hms_roles,name',
        ]);

        // Branch scoping rule
        $targetBranchId = $currentUser->hasRole('super_admin')
            ? ($validated['role'] === 'super_admin' ? null : ($validated['branch_id'] ?? 1))
            : $currentUser->branch_id;

        $user = User::create([
            'branch_id' => $targetBranchId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'account_status' => 'active',
        ]);

        $roleModel = HmsRole::where('name', $validated['role'])->firstOrFail();
        $user->roles()->attach($roleModel->id);

        AuditLog::create([
            'branch_id' => $targetBranchId,
            'user_id' => $currentUser->id,
            'module' => 'admin',
            'action' => 'user_created',
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => ['new_user_id' => $user->id, 'email' => $user->email, 'role' => $validated['role']],
        ]);

        return response()->json([
            'success' => true,
            'message' => "User {$user->name} registered successfully.",
            'data' => $user->load(['roles', 'branch']),
        ], 201);
    }

    public function roles(): JsonResponse
    {
        $roles = HmsRole::with('permissions')->get();
        $permissions = HmsPermission::all();

        return response()->json([
            'success' => true,
            'message' => 'Roles & permissions loaded.',
            'data' => [
                'roles' => $roles,
                'permissions' => $permissions,
            ],
        ]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $query = AuditLog::with(['user', 'branch']);

        if (!$currentUser->hasRole('super_admin')) {
            $query->where('branch_id', $currentUser->branch_id);
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        $logs = $query->orderBy('id', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Audit log entries loaded.',
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function hireBranchAdmin(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->hasRole('super_admin')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized. Only Super Admin can hire branch admins.'], 403);
        }

        $validated = $request->validate([
            'branch_id' => 'required|exists:hospital_branches,id',
            'hire_type' => 'required|in:new,existing',
            'user_id' => 'required_if:hire_type,existing|nullable|exists:users,id',
            'name' => 'required_if:hire_type,new|nullable|string|max:100',
            'email' => 'required_if:hire_type,new|nullable|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required_if:hire_type,new|nullable|string|min:6',
        ]);

        $branchAdminRole = HmsRole::where('name', 'branch_admin')->firstOrFail();

        if ($validated['hire_type'] === 'new') {
            $user = User::create([
                'branch_id' => $validated['branch_id'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'account_status' => 'active',
            ]);
            $user->roles()->syncWithoutDetaching([$branchAdminRole->id]);
        } else {
            $user = User::findOrFail($validated['user_id']);
            $user->update([
                'branch_id' => $validated['branch_id'],
                'account_status' => 'active',
            ]);
            $user->roles()->syncWithoutDetaching([$branchAdminRole->id]);
        }

        AuditLog::create([
            'branch_id' => $validated['branch_id'],
            'user_id' => $currentUser->id,
            'module' => 'admin',
            'action' => 'branch_admin_hired',
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'hired_user_id' => $user->id,
                'email' => $user->email,
                'branch_id' => $validated['branch_id'],
                'hire_type' => $validated['hire_type'],
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Branch Admin {$user->name} hired successfully for branch.",
            'data' => $user->load(['roles', 'branch']),
        ]);
    }

    public function fireBranchAdmin(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->hasRole('super_admin')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized. Only Super Admin can fire branch admins.'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'action' => 'required|in:deactivate,unassign',
        ]);

        $user = User::findOrFail($validated['user_id']);

        if ($validated['action'] === 'deactivate') {
            $user->update(['account_status' => 'suspended']);
        } else {
            $branchAdminRole = HmsRole::where('name', 'branch_admin')->first();
            if ($branchAdminRole) {
                $user->roles()->detach($branchAdminRole->id);
            }
            $user->update(['branch_id' => null]);
        }

        AuditLog::create([
            'branch_id' => $user->branch_id,
            'user_id' => $currentUser->id,
            'module' => 'admin',
            'action' => 'branch_admin_fired',
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'fired_user_id' => $user->id,
                'email' => $user->email,
                'action_taken' => $validated['action'],
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Branch Admin {$user->name} action '{$validated['action']}' completed successfully.",
            'data' => $user->fresh(['roles', 'branch']),
        ]);
    }
}
