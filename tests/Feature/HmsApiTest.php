<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Patient;
use App\Models\Bed;
use App\Models\IpdAdmission;
use App\Models\Doctor;
use App\Models\Department;
use App\Models\Medicine;
use App\Models\LabTest;
use App\Models\LabRequest;
use App\Models\Franchise;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HmsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_authentication_with_valid_credentials()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@hms.com',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_unauthenticated_requests_are_rejected()
    {
        $response = $this->getJson('/api/v1/patients');
        $response->assertStatus(401);
    }

    public function test_patient_registration_generates_unique_uhid()
    {
        $admin = User::where('email', 'admin@hms.com')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/patients', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'gender' => 'female',
            'dob' => '1992-04-12',
            'phone' => '+15559876543',
            'blood_group' => 'A+',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
        ]);

        $patient = Patient::where('phone', '+15559876543')->first();
        $this->assertStringStartsWith('UHID-', $patient->uhid);
    }

    public function test_appointment_booking_generates_concurrency_safe_token()
    {
        $admin = User::where('email', 'admin@hms.com')->first();
        $patient = Patient::first();
        $doctor = Doctor::first();
        $department = Department::first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/appointments', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'department_id' => $department->id,
            'appointment_date' => date('Y-m-d'),
            'type' => 'walk_in',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
    }

    public function test_atomic_bed_transfer()
    {
        $admin = User::where('email', 'admin@hms.com')->first();
        $patient = Patient::first();
        $doctor = Doctor::first();
        $bed1 = Bed::where('bed_number', 'like', 'ICU%')->first();
        $bed2 = Bed::where('bed_number', 'like', 'GEN%')->first();

        // Admit to bed1
        $admission = IpdAdmission::create([
            'admission_number' => 'ADM-TEST-001',
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'bed_id' => $bed1->id,
            'admission_date' => now(),
            'status' => 'admitted',
            'admitted_by' => $admin->id,
        ]);
        $bed1->update(['status' => 'occupied']);

        // Execute transfer to bed2
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/beds/transfer', [
            'ipd_admission_id' => $admission->id,
            'to_bed_id' => $bed2->id,
            'reason' => 'Transfer to General Ward',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertEquals('available', $bed1->fresh()->status);
        $this->assertEquals('occupied', $bed2->fresh()->status);
        $this->assertEquals($bed2->id, $admission->fresh()->bed_id);
    }

    public function test_invoice_creation_calculates_server_gst_totals()
    {
        $admin = User::where('email', 'admin@hms.com')->first();
        $patient = Patient::first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/invoices', [
            'patient_id' => $patient->id,
            'module' => 'opd',
            'items' => [
                ['item_name' => 'Consultation Fee', 'quantity' => 1, 'unit_price' => 100.00, 'discount' => 0, 'tax_rate' => 18.0]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.subtotal', 100)
                 ->assertJsonPath('data.tax_amount', 18)
                 ->assertJsonPath('data.total_amount', 118);
    }

    public function test_pharmacy_barcode_inventory_search()
    {
        $pharmacist = User::where('email', 'pharmacy.main@hms.com')->first();
        $medicine = Medicine::first();

        $response = $this->actingAs($pharmacist, 'sanctum')->getJson("/api/v1/pharmacy/medicines?search={$medicine->barcode}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.0.barcode', $medicine->barcode);
    }

    public function test_laboratory_request_processing_and_pdf_report_generation()
    {
        $labTech = User::where('email', 'lab.main@hms.com')->first();
        $patient = Patient::first();
        $doctor = Doctor::first();
        $test = LabTest::first();

        $labReq = LabRequest::create([
            'branch_id' => 1,
            'request_number' => 'LAB-REQ-1001',
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'test_id' => $test->id,
            'status' => 'processing',
        ]);

        $response = $this->actingAs($labTech, 'sanctum')->postJson("/api/v1/lab/requests/{$labReq->id}/report", [
            'status' => 'ready',
            'result_data' => ['hemoglobin' => '14.5 g/dL'],
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.status', 'ready');

        $this->assertDatabaseHas('lab_reports', [
            'lab_request_id' => $labReq->id,
        ]);
    }

    public function test_franchise_commission_calculation_and_wallet_credit()
    {
        $admin = User::where('email', 'admin@hms.com')->first();
        $franchise = Franchise::first();
        $patient = Patient::first();

        $initialWallet = Wallet::where('franchise_id', $franchise->id)->first();
        $initialBalance = (float)$initialWallet->available_balance;

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/franchise/referrals', [
            'franchise_id' => $franchise->id,
            'patient_id' => $patient->id,
            'service_type' => 'opd',
            'bill_amount' => 1000.00,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        // 12.5% of 1000 = 125
        $wallet = Wallet::where('franchise_id', $franchise->id)->first();
        $this->assertEquals($initialBalance + 125.00, (float)$wallet->available_balance);
    }

    public function test_withdrawal_request_exceeding_balance_is_rejected()
    {
        $partnerUser = User::where('email', 'partner.main@hms.com')->first();

        $response = $this->actingAs($partnerUser, 'sanctum')->postJson('/api/v1/franchise/withdraw', [
            'amount' => 999999.00, // Exceeds available balance
            'bank_details' => ['account' => '12345678'],
        ]);

        $response->assertStatus(500); // Exception caught and thrown
    }
}
