<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('beds', function (Blueprint $table) {
            $table->id();
            $table->string('bed_number', 20)->unique();
            $table->enum('ward_type', ['icu', 'general', 'private', 'deluxe']);
            $table->decimal('daily_charge', 10, 2);
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->string('floor_room')->nullable();
            $table->timestamps();
        });

        Schema::create('ipd_admissions', function (Blueprint $table) {
            $table->id();
            $table->string('admission_number', 30)->unique();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
            $table->foreignId('bed_id')->constrained('beds')->onDelete('restrict');
            $table->dateTime('admission_date');
            $table->dateTime('discharge_date')->nullable();
            $table->text('admitting_diagnosis')->nullable();
            $table->enum('status', ['admitted', 'discharged', 'transferred'])->default('admitted');
            $table->foreignId('admitted_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('bed_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ipd_admission_id')->constrained('ipd_admissions')->onDelete('cascade');
            $table->foreignId('from_bed_id')->constrained('beds')->onDelete('restrict');
            $table->foreignId('to_bed_id')->constrained('beds')->onDelete('restrict');
            $table->dateTime('transferred_at');
            $table->string('reason');
            $table->foreignId('transferred_by_user_id')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bed_transfers');
        Schema::dropIfExists('ipd_admissions');
        Schema::dropIfExists('beds');
    }
};
