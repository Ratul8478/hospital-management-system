<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('barcode', 50)->unique()->index();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->string('category');
            $table->string('unit')->default('tablets');
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->integer('stock_quantity')->default(0);
            $table->integer('min_stock_level')->default(10);
            $table->enum('status', ['active', 'discontinued'])->default('active');
            $table->timestamps();
        });

        Schema::create('medicine_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
            $table->string('batch_number');
            $table->date('expiry_date')->index();
            $table->integer('quantity');
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->timestamps();
        });

        Schema::create('lab_test_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('lab_tests', function (Blueprint $table) {
            $table->id();
            $table->string('test_code', 20)->unique();
            $table->string('name');
            $table->foreignId('category_id')->constrained('lab_test_categories')->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->string('sample_type');
            $table->text('normal_range')->nullable();
            $table->timestamps();
        });

        Schema::create('lab_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number', 30)->unique();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
            $table->foreignId('test_id')->constrained('lab_tests')->onDelete('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained('invoices')->onDelete('set null');
            $table->enum('status', ['pending_sample', 'collected', 'processing', 'ready'])->default('pending_sample');
            $table->timestamps();
        });

        Schema::create('lab_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_request_id')->constrained('lab_requests')->onDelete('cascade');
            $table->json('result_data')->nullable();
            $table->string('report_pdf_path')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->dateTime('generated_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_reports');
        Schema::dropIfExists('lab_requests');
        Schema::dropIfExists('lab_tests');
        Schema::dropIfExists('lab_test_categories');
        Schema::dropIfExists('medicine_batches');
        Schema::dropIfExists('medicines');
    }
};
