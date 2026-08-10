<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create hospital_branches table
        Schema::create('hospital_branches', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. MAIN-01, NORTH-02, EAST-03
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 2. Add branch_id to users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->nullOnDelete();
        });

        // 3. Add branch_id to departments
        Schema::table('departments', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 4. Add branch_id to doctors
        Schema::table('doctors', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 5. Add branch_id to patients
        Schema::table('patients', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 6. Add branch_id to appointments
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 7. Add branch_id to beds
        Schema::table('beds', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 8. Add branch_id to invoices
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 9. Add branch_id to accounts_ledger
        Schema::table('accounts_ledger', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 10. Add branch_id to medicines
        Schema::table('medicines', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 11. Add branch_id to lab_requests
        Schema::table('lab_requests', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 12. Add branch_id to franchises
        Schema::table('franchises', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });

        // 13. Add branch_id to audit_logs
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('hospital_branches')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('franchises', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('lab_requests', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('medicines', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('accounts_ledger', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('invoices', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('beds', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('appointments', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('patients', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('doctors', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('departments', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::table('users', function (Blueprint $table) { $table->dropForeign(['branch_id']); $table->dropColumn('branch_id'); });
        Schema::dropIfExists('hospital_branches');
    }
};
