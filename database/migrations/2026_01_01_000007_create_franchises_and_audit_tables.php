<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('franchises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('partner_code', 20)->unique();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('phone', 20);
            $table->string('email');
            $table->enum('commission_type', ['fixed', 'percentage', 'doctor_wise', 'service_wise', 'surgery_wise'])->default('percentage');
            $table->decimal('commission_rate', 10, 2)->default(10.00); // 10% or flat amount
            $table->enum('status', ['active', 'suspended'])->default('active');
            $table->timestamps();
        });

        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('franchise_id')->constrained('franchises')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->enum('service_type', ['opd', 'ipd', 'lab', 'pharmacy']);
            $table->foreignId('invoice_id')->nullable()->constrained('invoices')->onDelete('set null');
            $table->decimal('bill_amount', 12, 2);
            $table->decimal('commission_amount', 12, 2);
            $table->enum('status', ['pending', 'credited', 'rejected'])->default('pending');
            $table->timestamps();
        });

        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('franchise_id')->unique()->constrained('franchises')->onDelete('cascade');
            $table->decimal('available_balance', 12, 2)->default(0.00);
            $table->decimal('pending_balance', 12, 2)->default(0.00);
            $table->decimal('lifetime_earnings', 12, 2)->default(0.00);
            $table->timestamps();
        });

        Schema::create('withdrawal_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('franchise_id')->constrained('franchises')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->json('bank_details');
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
            $table->text('admin_remarks')->nullable();
            $table->dateTime('processed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('module');
            $table->string('action');
            $table->string('request_ip', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('withdrawal_requests');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('referrals');
        Schema::dropIfExists('franchises');
    }
};
