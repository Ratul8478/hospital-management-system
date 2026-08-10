<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\PatientController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\BedController;
use App\Http\Controllers\Api\V1\BillingController;
use App\Http\Controllers\Api\V1\PharmacyController;
use App\Http\Controllers\Api\V1\LaboratoryController;
use App\Http\Controllers\Api\V1\FranchiseController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\BranchController;

Route::prefix('v1')->group(function () {
    // Public Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Sanctum Authenticated Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Hospital Branch Management
        Route::get('/branches', [BranchController::class, 'index']);
        Route::post('/branches', [BranchController::class, 'store']);
        Route::get('/branches/{id}', [BranchController::class, 'show']);
        Route::put('/branches/{id}', [BranchController::class, 'update']);

        // Dashboard & Analytics
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // Patient Management
        Route::get('/patients', [PatientController::class, 'index']);
        Route::post('/patients', [PatientController::class, 'store']);
        Route::get('/patients/{id}/history', [PatientController::class, 'show']);

        // Appointment Queue & Tokens
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

        // Beds & IPD
        Route::get('/beds/matrix', [BedController::class, 'matrix']);
        Route::post('/beds/transfer', [BedController::class, 'transfer']);

        // Billing & Accounting
        Route::get('/invoices', [BillingController::class, 'index']);
        Route::post('/invoices', [BillingController::class, 'store']);
        Route::post('/invoices/{id}/pay', [BillingController::class, 'postPayment']);

        // Pharmacy
        Route::get('/pharmacy/medicines', [PharmacyController::class, 'medicines']);

        // Laboratory
        Route::get('/lab/requests', [LaboratoryController::class, 'requests']);
        Route::post('/lab/requests/{id}/report', [LaboratoryController::class, 'processReport']);

        // Franchise Ecosystem
        Route::get('/franchise/dashboard', [FranchiseController::class, 'dashboard']);
        Route::post('/franchise/referrals', [FranchiseController::class, 'processReferral']);
        Route::post('/franchise/withdraw', [FranchiseController::class, 'requestWithdrawal']);

        // Super Admin & Branch Admin User Management
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::post('/admin/users', [AdminController::class, 'createUser']);
        Route::post('/admin/hire-branch-admin', [AdminController::class, 'hireBranchAdmin']);
        Route::post('/admin/fire-branch-admin', [AdminController::class, 'fireBranchAdmin']);
        Route::get('/admin/roles', [AdminController::class, 'roles']);
        Route::get('/admin/audit-logs', [AdminController::class, 'auditLogs']);
    });
});
