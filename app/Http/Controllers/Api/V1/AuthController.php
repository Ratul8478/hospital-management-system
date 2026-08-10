<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with(['roles.permissions', 'branch'])->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email credentials or password.',
            ], 422);
        }

        if ($user->account_status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is suspended. Please contact system administration.',
            ], 403);
        }

        // Revoke prior tokens and create new Sanctum token
        $user->tokens()->delete();
        $token = $user->createToken('hms_auth_token')->plainTextToken;

        // Resolve roles & permissions
        $roles = $user->roles->pluck('name');
        $permissions = $user->roles->flatMap(fn($r) => $r->permissions)->pluck('name')->unique()->values();

        AuditLog::create([
            'branch_id' => $user->branch_id,
            'user_id' => $user->id,
            'module' => 'auth',
            'action' => 'login',
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => ['email' => $user->email],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'branch_id' => $user->branch_id,
                    'branch' => $user->branch,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'roles' => $roles,
                    'permissions' => $permissions,
                    'doctor_profile' => $user->doctor,
                    'franchise_profile' => $user->franchise,
                ],
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load(['roles.permissions', 'branch', 'doctor.department', 'franchise.wallet']);

        $roles = $user->roles->pluck('name');
        $permissions = $user->roles->flatMap(fn($r) => $r->permissions)->pluck('name')->unique()->values();

        return response()->json([
            'success' => true,
            'message' => 'User profile retrieved.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'branch_id' => $user->branch_id,
                    'branch' => $user->branch,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'roles' => $roles,
                    'permissions' => $permissions,
                    'doctor_profile' => $user->doctor,
                    'franchise_profile' => $user->franchise,
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            AuditLog::create([
                'branch_id' => $user->branch_id,
                'user_id' => $user->id,
                'module' => 'auth',
                'action' => 'logout',
                'request_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => [],
            ]);
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }
}
