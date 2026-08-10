<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\HmsRole;
use App\Models\HmsPermission;
use App\Models\HospitalBranch;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Bed;
use App\Models\IpdAdmission;
use App\Models\Medicine;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\AccountsLedger;
use App\Models\LabTestCategory;
use App\Models\LabTest;
use App\Models\LabRequest;
use App\Models\LabReport;
use App\Models\Franchise;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $roles = [
            'super_admin' => 'Super Admin',
            'branch_admin' => 'Branch Central Admin',
            'receptionist' => 'Receptionist',
            'doctor' => 'Doctor',
            'accountant' => 'Accountant',
            'pharmacist' => 'Pharmacist',
            'lab_technician' => 'Laboratory Technician',
            'franchise_partner' => 'Franchise Partner',
        ];

        $roleModels = [];
        foreach ($roles as $key => $displayName) {
            $roleModels[$key] = HmsRole::create([
                'name' => $key,
                'display_name' => $displayName,
                'description' => "Role for $displayName",
            ]);
        }

        // 2. Create Permissions
        $permissions = [
            ['name' => 'branches.view', 'module' => 'admin', 'description' => 'View hospital branches'],
            ['name' => 'branches.manage', 'module' => 'admin', 'description' => 'Manage hospital branches and assign central admins'],
            ['name' => 'patients.view', 'module' => 'patients', 'description' => 'View patient records'],
            ['name' => 'patients.create', 'module' => 'patients', 'description' => 'Register new patients'],
            ['name' => 'patients.update', 'module' => 'patients', 'description' => 'Update patient details'],
            ['name' => 'appointments.view', 'module' => 'appointments', 'description' => 'View appointment list and tokens'],
            ['name' => 'appointments.create', 'module' => 'appointments', 'description' => 'Book new appointments'],
            ['name' => 'appointments.update', 'module' => 'appointments', 'description' => 'Update appointment status'],
            ['name' => 'opd.consultation', 'module' => 'opd', 'description' => 'Perform OPD doctor consultations'],
            ['name' => 'ipd.view', 'module' => 'ipd', 'description' => 'View IPD admissions'],
            ['name' => 'ipd.admit', 'module' => 'ipd', 'description' => 'Admit patient to IPD'],
            ['name' => 'ipd.discharge', 'module' => 'ipd', 'description' => 'Discharge IPD patient'],
            ['name' => 'beds.view', 'module' => 'beds', 'description' => 'View bed status matrix'],
            ['name' => 'beds.allocate', 'module' => 'beds', 'description' => 'Allocate beds'],
            ['name' => 'beds.transfer', 'module' => 'beds', 'description' => 'Execute atomic bed transfers'],
            ['name' => 'billing.view', 'module' => 'billing', 'description' => 'View invoices and receipts'],
            ['name' => 'billing.create', 'module' => 'billing', 'description' => 'Generate invoices'],
            ['name' => 'billing.post', 'module' => 'billing', 'description' => 'Post payments and write to ledger'],
            ['name' => 'accounting.view', 'module' => 'accounting', 'description' => 'View accounting ledgers and reports'],
            ['name' => 'pharmacy.view', 'module' => 'pharmacy', 'description' => 'View medicine inventory'],
            ['name' => 'pharmacy.bill', 'module' => 'pharmacy', 'description' => 'Process pharmacy checkout'],
            ['name' => 'laboratory.view', 'module' => 'laboratory', 'description' => 'View laboratory request queue'],
            ['name' => 'laboratory.report', 'module' => 'laboratory', 'description' => 'Process sample & generate lab PDF'],
            ['name' => 'franchise.view', 'module' => 'franchise', 'description' => 'View referral & wallet analytics'],
            ['name' => 'franchise.manage', 'module' => 'franchise', 'description' => 'Process referrals and commissions'],
            ['name' => 'franchise.withdraw', 'module' => 'franchise', 'description' => 'Request wallet withdrawals'],
            ['name' => 'admin.manage', 'module' => 'admin', 'description' => 'Manage system users, roles, and settings'],
            ['name' => 'audit.view', 'module' => 'admin', 'description' => 'View system audit logs'],
        ];

        $permissionModels = [];
        foreach ($permissions as $p) {
            $permissionModels[$p['name']] = HmsPermission::create($p);
        }

        foreach ($permissionModels as $perm) {
            $roleModels['super_admin']->permissions()->attach($perm->id);
            $roleModels['branch_admin']->permissions()->attach($perm->id);
        }

        foreach (['patients.view', 'patients.create', 'patients.update', 'appointments.view', 'appointments.create', 'appointments.update', 'beds.view', 'billing.view', 'billing.create'] as $pName) {
            $roleModels['receptionist']->permissions()->attach($permissionModels[$pName]->id);
        }
        foreach (['patients.view', 'appointments.view', 'appointments.update', 'opd.consultation', 'ipd.view', 'laboratory.view'] as $pName) {
            $roleModels['doctor']->permissions()->attach($permissionModels[$pName]->id);
        }
        foreach (['billing.view', 'billing.create', 'billing.post', 'accounting.view'] as $pName) {
            $roleModels['accountant']->permissions()->attach($permissionModels[$pName]->id);
        }
        foreach (['pharmacy.view', 'pharmacy.bill', 'billing.create'] as $pName) {
            $roleModels['pharmacist']->permissions()->attach($permissionModels[$pName]->id);
        }
        foreach (['laboratory.view', 'laboratory.report'] as $pName) {
            $roleModels['lab_technician']->permissions()->attach($permissionModels[$pName]->id);
        }
        foreach (['franchise.view', 'franchise.withdraw'] as $pName) {
            $roleModels['franchise_partner']->permissions()->attach($permissionModels[$pName]->id);
        }

        // 3. Create Global Super Admin
        $superAdmin = User::create([
            'branch_id' => null,
            'name' => 'Global Super Admin',
            'email' => 'admin@hms.com',
            'phone' => '+18005550001',
            'password' => Hash::make('Password@123'),
            'account_status' => 'active',
        ]);
        $superAdmin->roles()->attach($roleModels['super_admin']->id);

        // 4. Lab Categories & Tests
        $bloodCat = LabTestCategory::create(['name' => 'Hematology & Blood Tests', 'description' => 'Complete blood counts and serology']);
        $imgCat = LabTestCategory::create(['name' => 'Radiology & Imaging', 'description' => 'X-Ray, Ultrasound, CT Scanning']);
        $neuroCat = LabTestCategory::create(['name' => 'Neurodiagnostics', 'description' => 'EEG, Nerve Conduction, MRI Brain']);

        $testCBC = LabTest::create(['test_code' => 'CBC01', 'name' => 'Complete Blood Count (CBC)', 'category_id' => $bloodCat->id, 'price' => 45.00, 'sample_type' => 'Whole Blood', 'normal_range' => 'WBC: 4.5-11.0 k/uL, RBC: 4.2-5.9 m/uL']);
        $testXRay = LabTest::create(['test_code' => 'XRAY01', 'name' => 'Chest X-Ray PA View', 'category_id' => $imgCat->id, 'price' => 85.00, 'sample_type' => 'Imaging', 'normal_range' => 'Clear lung fields, normal cardiothoracic ratio']);
        $testEEG = LabTest::create(['test_code' => 'EEG01', 'name' => '24-Hour Digital EEG', 'category_id' => $neuroCat->id, 'price' => 220.00, 'sample_type' => 'Electrode Waveform', 'normal_range' => 'Normal alpha rhythm, no epileptiform spikes']);

        // 5. SEED 4 DISTINCT HOSPITAL BRANCHES WITH NON-OVERLAPPING DATA

        $branchesData = [
            [
                'info' => [
                    'code' => 'MAIN-01',
                    'name' => 'Medix City Hospital — Main Central Branch',
                    'address' => '100 Medical Boulevard, Central City',
                    'city' => 'Metropolis',
                    'state' => 'NY',
                    'phone' => '+18005550100',
                    'email' => 'main@medixhospitals.com',
                    'status' => 'active',
                ],
                'admin' => ['name' => 'Arthur Pendelton', 'email' => 'admin.main@medix.com', 'phone' => '+18005551101'],
                'reception' => ['name' => 'Clara Oswald', 'email' => 'reception.main@medix.com', 'phone' => '+18005551102'],
                'accountant' => ['name' => 'Robert Lang', 'email' => 'accountant.main@medix.com', 'phone' => '+18005551103'],
                'pharmacist' => ['name' => 'Emily Watson', 'email' => 'pharmacy.main@medix.com', 'phone' => '+18005551104'],
                'labTech' => ['name' => 'Michael Chang', 'email' => 'lab.main@medix.com', 'phone' => '+18005551105'],
                'partner' => ['name' => 'Apex Healthcare Partners', 'email' => 'partner.main@medix.com', 'phone' => '+18005551106', 'code' => 'FR-MAIN-88', 'company' => 'Apex Central LLC', 'comm' => 15.0],
                'departments' => [
                    [
                        'name' => 'Cardiology & Vascular Medicine',
                        'code' => 'CARD-MAIN',
                        'doctor' => ['name' => 'Dr. Jonathan Hayes', 'email' => 'doctor.hayes@medix.com', 'spec' => 'Cardiologist', 'fee' => 150.00, 'room' => 'OPD-101', 'qual' => 'MD, FACC'],
                    ],
                    [
                        'name' => 'General & Trauma Surgery',
                        'code' => 'SURG-MAIN',
                        'doctor' => ['name' => 'Dr. Sarah Jenkins', 'email' => 'doctor.jenkins@medix.com', 'spec' => 'General Surgeon', 'fee' => 200.00, 'room' => 'OPD-102', 'qual' => 'MS, FRCS'],
                    ],
                ],
                'patients' => [
                    ['first' => 'James', 'last' => 'Wilson', 'gender' => 'male', 'dob' => '1978-04-12', 'phone' => '+155510101', 'email' => 'j.wilson@example.com', 'blood' => 'A+', 'notes' => 'History of hypertensive crisis and angina.'],
                    ['first' => 'Sophia', 'last' => 'Martinez', 'gender' => 'female', 'dob' => '1985-09-24', 'phone' => '+155510102', 'email' => 's.martinez@example.com', 'blood' => 'O+', 'notes' => 'Post-operative laparoscopic cholecystectomy.'],
                ],
                'beds' => [
                    ['num' => 'ICU-MAIN-01', 'type' => 'icu', 'charge' => 500.00, 'floor' => '3rd Floor ICU Ward', 'occupied_by_idx' => 1],
                    ['num' => 'GEN-MAIN-101', 'type' => 'general', 'charge' => 120.00, 'floor' => '1st Floor General', 'occupied_by_idx' => null],
                    ['num' => 'PRIV-MAIN-201', 'type' => 'private', 'charge' => 280.00, 'floor' => '2nd Floor Private Suite', 'occupied_by_idx' => 0],
                ],
                'medicines' => [
                    ['code' => 'MAIN-STATIN-20', 'name' => 'Atorvastatin 20mg', 'generic' => 'Atorvastatin', 'cat' => 'Cardiovascular', 'price' => 18.00, 'stock' => 350, 'min' => 50],
                    ['code' => 'MAIN-AMOX-500', 'name' => 'Amoxicillin 500mg', 'generic' => 'Amoxicillin', 'cat' => 'Antibiotics', 'price' => 12.50, 'stock' => 500, 'min' => 80],
                ],
                'invoices' => [
                    ['amount' => 1250.00, 'mode' => 'cash', 'patient_idx' => 0, 'module' => 'opd', 'item' => 'Cardiology Consultation & ECG'],
                    ['amount' => 450.00, 'mode' => 'card', 'patient_idx' => 1, 'module' => 'ipd', 'item' => 'Surgical Ward Daily Facility Charge'],
                ],
            ],
            [
                'info' => [
                    'code' => 'NORTH-02',
                    'name' => 'Medix Metro Care — North Suburb Branch',
                    'address' => '45 Northway Avenue, Metroville',
                    'city' => 'Metroville',
                    'state' => 'NY',
                    'phone' => '+18005550200',
                    'email' => 'north@medixhospitals.com',
                    'status' => 'active',
                ],
                'admin' => ['name' => 'Elena Rostova', 'email' => 'admin.north@medix.com', 'phone' => '+18005552201'],
                'reception' => ['name' => 'Lucas Miller', 'email' => 'reception.north@medix.com', 'phone' => '+18005552202'],
                'accountant' => ['name' => 'Grace Hopper', 'email' => 'accountant.north@medix.com', 'phone' => '+18005552203'],
                'pharmacist' => ['name' => 'Alan Turing', 'email' => 'pharmacy.north@medix.com', 'phone' => '+18005552204'],
                'labTech' => ['name' => 'Ada Lovelace', 'email' => 'lab.north@medix.com', 'phone' => '+18005552205'],
                'partner' => ['name' => 'Metro Health Network', 'email' => 'partner.north@medix.com', 'phone' => '+18005552206', 'code' => 'FR-NORTH-88', 'company' => 'MetroCare North Inc', 'comm' => 12.5],
                'departments' => [
                    [
                        'name' => 'Pediatric & Adolescent Care',
                        'code' => 'PED-NORTH',
                        'doctor' => ['name' => 'Dr. Maya Lin', 'email' => 'doctor.lin@medix.com', 'spec' => 'Pediatrician', 'fee' => 120.00, 'room' => 'OPD-201', 'qual' => 'MD, FAAP'],
                    ],
                    [
                        'name' => 'Neurology & Brain Sciences',
                        'code' => 'NEURO-NORTH',
                        'doctor' => ['name' => 'Dr. Robert Chen', 'email' => 'doctor.chen@medix.com', 'spec' => 'Neurologist', 'fee' => 180.00, 'room' => 'OPD-202', 'qual' => 'MD, DM Neurology'],
                    ],
                ],
                'patients' => [
                    ['first' => 'Oliver', 'last' => 'Taylor', 'gender' => 'male', 'dob' => '2016-07-19', 'phone' => '+155520201', 'email' => 'o.taylor@example.com', 'blood' => 'AB+', 'notes' => 'High grade fever and viral exanthem.'],
                    ['first' => 'Emma', 'last' => 'Anderson', 'gender' => 'female', 'dob' => '1992-11-03', 'phone' => '+155520202', 'email' => 'e.anderson@example.com', 'blood' => 'O-', 'notes' => 'Intractable migraine with aura.'],
                ],
                'beds' => [
                    ['num' => 'ICU-NORTH-01', 'type' => 'icu', 'charge' => 450.00, 'floor' => '3rd Floor Pediatric ICU', 'occupied_by_idx' => null],
                    ['num' => 'GEN-NORTH-101', 'type' => 'general', 'charge' => 90.00, 'floor' => '1st Floor Pediatrics', 'occupied_by_idx' => 0],
                    ['num' => 'PRIV-NORTH-201', 'type' => 'private', 'charge' => 230.00, 'floor' => '2nd Floor Neuro Ward', 'occupied_by_idx' => 1],
                ],
                'medicines' => [
                    ['code' => 'NORTH-PARA-SYR', 'name' => 'Pediatric Paracetamol Syrup 120mg', 'generic' => 'Acetaminophen', 'cat' => 'Pediatrics', 'price' => 6.50, 'stock' => 400, 'min' => 60],
                    ['code' => 'NORTH-SUMA-50', 'name' => 'Sumatriptan 50mg', 'generic' => 'Sumatriptan', 'cat' => 'Neurology', 'price' => 24.00, 'stock' => 80, 'min' => 25],
                ],
                'invoices' => [
                    ['amount' => 680.00, 'mode' => 'upi', 'patient_idx' => 0, 'module' => 'opd', 'item' => 'Pediatric Consultation & Syrup Prescription'],
                    ['amount' => 320.00, 'mode' => 'cash', 'patient_idx' => 1, 'module' => 'laboratory', 'item' => 'Digital EEG Test Report Fee'],
                ],
            ],
            [
                'info' => [
                    'code' => 'EAST-03',
                    'name' => 'Medix Sunrise Clinic — East Coast Branch',
                    'address' => '88 Sunrise Drive, Eastport',
                    'city' => 'Eastport',
                    'state' => 'NY',
                    'phone' => '+18005550300',
                    'email' => 'east@medixhospitals.com',
                    'status' => 'active',
                ],
                'admin' => ['name' => 'Marcus Vance', 'email' => 'admin.east@medix.com', 'phone' => '+18005553301'],
                'reception' => ['name' => 'Chloe Bennett', 'email' => 'reception.east@medix.com', 'phone' => '+18005553302'],
                'accountant' => ['name' => 'Henry Ford', 'email' => 'accountant.east@medix.com', 'phone' => '+18005553303'],
                'pharmacist' => ['name' => 'Florence Nightingale', 'email' => 'pharmacy.east@medix.com', 'phone' => '+18005553304'],
                'labTech' => ['name' => 'Alexander Fleming', 'email' => 'lab.east@medix.com', 'phone' => '+18005553305'],
                'partner' => ['name' => 'Sunrise Medical Alliance', 'email' => 'partner.east@medix.com', 'phone' => '+18005553306', 'code' => 'FR-EAST-88', 'company' => 'Sunrise Alliance LLC', 'comm' => 10.0],
                'departments' => [
                    [
                        'name' => 'Orthopedics & Joint Surgery',
                        'code' => 'ORTHO-EAST',
                        'doctor' => ['name' => 'Dr. Alistair Thorne', 'email' => 'doctor.thorne@medix.com', 'spec' => 'Orthopedic Surgeon', 'fee' => 190.00, 'room' => 'OPD-301', 'qual' => 'MS Ortho, FAAOS'],
                    ],
                    [
                        'name' => 'Dermatology & Skin Care',
                        'code' => 'DERM-EAST',
                        'doctor' => ['name' => 'Dr. Evelyn Reed', 'email' => 'doctor.reed@medix.com', 'spec' => 'Dermatologist', 'fee' => 130.00, 'room' => 'OPD-302', 'qual' => 'MD Dermatology'],
                    ],
                ],
                'patients' => [
                    ['first' => 'Noah', 'last' => 'Thomas', 'gender' => 'male', 'dob' => '1989-02-14', 'phone' => '+155530301', 'email' => 'n.thomas@example.com', 'blood' => 'A-', 'notes' => 'Right knee ACL sprain and cartilage tear.'],
                    ['first' => 'Isabella', 'last' => 'White', 'gender' => 'female', 'dob' => '1995-05-30', 'phone' => '+155530302', 'email' => 'i.white@example.com', 'blood' => 'B+', 'notes' => 'Severe contact dermatitis flare-up.'],
                ],
                'beds' => [
                    ['num' => 'ICU-EAST-01', 'type' => 'icu', 'charge' => 480.00, 'floor' => '3rd Floor Surgical ICU', 'occupied_by_idx' => null],
                    ['num' => 'GEN-EAST-101', 'type' => 'general', 'charge' => 95.00, 'floor' => '1st Floor Ortho Ward', 'occupied_by_idx' => 0],
                    ['num' => 'PRIV-EAST-201', 'type' => 'private', 'charge' => 240.00, 'floor' => '2nd Floor Private Suite', 'occupied_by_idx' => null],
                ],
                'medicines' => [
                    ['code' => 'EAST-IBU-400', 'name' => 'Ibuprofen 400mg', 'generic' => 'Ibuprofen', 'cat' => 'Analgesics', 'price' => 8.00, 'stock' => 600, 'min' => 100],
                    ['code' => 'EAST-CORT-1', 'name' => 'Hydrocortisone Cream 1%', 'generic' => 'Hydrocortisone', 'cat' => 'Dermatology', 'price' => 15.00, 'stock' => 150, 'min' => 30],
                ],
                'invoices' => [
                    ['amount' => 950.00, 'mode' => 'bank_transfer', 'patient_idx' => 0, 'module' => 'opd', 'item' => 'Orthopedic MRI & Joint Immobilization Brace'],
                ],
            ],
            [
                'info' => [
                    'code' => 'WEST-04',
                    'name' => 'Medix Valley Medical — West Coast Branch',
                    'address' => '500 West Avenue, Westville',
                    'city' => 'Westville',
                    'state' => 'CA',
                    'phone' => '+18005550400',
                    'email' => 'west@medixhospitals.com',
                    'status' => 'active',
                ],
                'admin' => ['name' => 'David Sterling', 'email' => 'admin.west@medix.com', 'phone' => '+18005554401'],
                'reception' => ['name' => 'Samantha Reed', 'email' => 'reception.west@medix.com', 'phone' => '+18005554402'],
                'accountant' => ['name' => 'Charles Babbage', 'email' => 'accountant.west@medix.com', 'phone' => '+18005554403'],
                'pharmacist' => ['name' => 'Rosalind Franklin', 'email' => 'pharmacy.west@medix.com', 'phone' => '+18005554404'],
                'labTech' => ['name' => 'Louis Pasteur', 'email' => 'lab.west@medix.com', 'phone' => '+18005554405'],
                'partner' => ['name' => 'Pacific Crest Health', 'email' => 'partner.west@medix.com', 'phone' => '+18005554406', 'code' => 'FR-WEST-88', 'company' => 'Pacific Crest Medical', 'comm' => 14.0],
                'departments' => [
                    [
                        'name' => 'Emergency Medicine & Trauma Center',
                        'code' => 'EMERG-WEST',
                        'doctor' => ['name' => 'Dr. Carlos Mendez', 'email' => 'doctor.mendez@medix.com', 'spec' => 'Emergency Specialist', 'fee' => 160.00, 'room' => 'ER-101', 'qual' => 'MD Emergency Medicine'],
                    ],
                    [
                        'name' => 'Critical Care & Pulmonology',
                        'code' => 'CRIT-WEST',
                        'doctor' => ['name' => 'Dr. Hannah Abbott', 'email' => 'doctor.abbott@medix.com', 'spec' => 'Intensivist', 'fee' => 210.00, 'room' => 'ICU-301', 'qual' => 'MD Pulmonology, FCCP'],
                    ],
                ],
                'patients' => [
                    ['first' => 'Ethan', 'last' => 'Wright', 'gender' => 'male', 'dob' => '1982-08-05', 'phone' => '+155540401', 'email' => 'e.wright@example.com', 'blood' => 'B-', 'notes' => 'Acute respiratory distress and bronchial asthma.'],
                    ['first' => 'Mia', 'last' => 'Robinson', 'gender' => 'female', 'dob' => '1998-03-17', 'phone' => '+155540402', 'email' => 'm.robinson@example.com', 'blood' => 'AB-', 'notes' => 'Multiple trauma evaluation post vehicle collision.'],
                ],
                'beds' => [
                    ['num' => 'ICU-WEST-01', 'type' => 'icu', 'charge' => 520.00, 'floor' => '3rd Floor Emergency ICU', 'occupied_by_idx' => 0],
                    ['num' => 'GEN-WEST-101', 'type' => 'general', 'charge' => 110.00, 'floor' => '1st Floor ER Observation', 'occupied_by_idx' => null],
                    ['num' => 'PRIV-WEST-201', 'type' => 'private', 'charge' => 260.00, 'floor' => '2nd Floor Trauma Suite', 'occupied_by_idx' => 1],
                ],
                'medicines' => [
                    ['code' => 'WEST-EPI-1', 'name' => 'Epinephrine 1mg Auto-Injector', 'generic' => 'Epinephrine', 'cat' => 'Emergency', 'price' => 45.00, 'stock' => 100, 'min' => 20],
                    ['code' => 'WEST-SALINE-1000', 'name' => 'Normal Saline 0.9% 1000ml', 'generic' => 'Sodium Chloride', 'cat' => 'IV Fluids', 'price' => 12.00, 'stock' => 800, 'min' => 150],
                ],
                'invoices' => [
                    ['amount' => 1850.00, 'mode' => 'card', 'patient_idx' => 0, 'module' => 'ipd', 'item' => 'Emergency Stabilization & Mechanical Ventilation'],
                ],
            ],
        ];

        foreach ($branchesData as $bIndex => $bData) {
            $branch = HospitalBranch::create($bData['info']);

            // Staff & Central Admin
            $bAdmin = User::create(array_merge($bData['admin'], [
                'branch_id' => $branch->id,
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]));
            $bAdmin->roles()->attach($roleModels['branch_admin']->id);

            $reception = User::create(array_merge($bData['reception'], [
                'branch_id' => $branch->id,
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]));
            $reception->roles()->attach($roleModels['receptionist']->id);

            $accountant = User::create(array_merge($bData['accountant'], [
                'branch_id' => $branch->id,
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]));
            $accountant->roles()->attach($roleModels['accountant']->id);

            $pharmacist = User::create(array_merge($bData['pharmacist'], [
                'branch_id' => $branch->id,
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]));
            $pharmacist->roles()->attach($roleModels['pharmacist']->id);

            $labTech = User::create(array_merge($bData['labTech'], [
                'branch_id' => $branch->id,
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]));
            $labTech->roles()->attach($roleModels['lab_technician']->id);

            // Franchise
            $partnerInfo = $bData['partner'];
            $partnerUser = User::create([
                'branch_id' => $branch->id,
                'name' => $partnerInfo['name'],
                'email' => $partnerInfo['email'],
                'phone' => $partnerInfo['phone'],
                'password' => Hash::make('Password@123'),
                'account_status' => 'active',
            ]);
            $partnerUser->roles()->attach($roleModels['franchise_partner']->id);

            $franchise = Franchise::create([
                'branch_id' => $branch->id,
                'user_id' => $partnerUser->id,
                'partner_code' => $partnerInfo['code'],
                'name' => $partnerInfo['name'],
                'company_name' => $partnerInfo['company'],
                'phone' => $partnerInfo['phone'],
                'email' => $partnerInfo['email'],
                'commission_type' => 'percentage',
                'commission_rate' => $partnerInfo['comm'],
                'status' => 'active',
            ]);

            Wallet::create([
                'franchise_id' => $franchise->id,
                'available_balance' => 450.00 * $branch->id,
                'pending_balance' => 150.00,
                'lifetime_earnings' => 1500.00 * $branch->id,
            ]);

            // Doctors & Departments
            $doctorModels = [];
            foreach ($bData['departments'] as $deptData) {
                $docUser = User::create([
                    'branch_id' => $branch->id,
                    'name' => $deptData['doctor']['name'],
                    'email' => $deptData['doctor']['email'],
                    'phone' => "+1800555" . (3000 + $branch->id * 10),
                    'password' => Hash::make('Password@123'),
                    'account_status' => 'active',
                ]);
                $docUser->roles()->attach($roleModels['doctor']->id);

                $dept = Department::create([
                    'branch_id' => $branch->id,
                    'name' => $deptData['name'],
                    'code' => $deptData['code'],
                    'head_name' => $docUser->name,
                    'status' => 'active',
                ]);

                $docModel = Doctor::create([
                    'branch_id' => $branch->id,
                    'user_id' => $docUser->id,
                    'department_id' => $dept->id,
                    'specialization' => $deptData['doctor']['spec'],
                    'consultation_fee' => $deptData['doctor']['fee'],
                    'qualification' => $deptData['doctor']['qual'],
                    'room_number' => $deptData['doctor']['room'],
                    'status' => 'active',
                ]);

                $doctorModels[] = $docModel;
            }

            // Patients
            $patientModels = [];
            foreach ($bData['patients'] as $pIdx => $pData) {
                $uhid = sprintf('UHID-B%d-%s-%04d', $branch->id, date('Ymd'), $pIdx + 1);
                $patient = Patient::create([
                    'branch_id' => $branch->id,
                    'uhid' => $uhid,
                    'first_name' => $pData['first'],
                    'last_name' => $pData['last'],
                    'gender' => $pData['gender'],
                    'dob' => $pData['dob'],
                    'phone' => $pData['phone'],
                    'email' => $pData['email'],
                    'address' => $branch->address,
                    'blood_group' => $pData['blood'],
                    'emergency_contact' => $branch->phone,
                    'medical_history_notes' => $pData['notes'],
                    'created_by' => $reception->id,
                ]);
                $patientModels[] = $patient;

                // Appointment for each patient
                $doc = $doctorModels[$pIdx % count($doctorModels)];
                $aptNum = sprintf('APT-B%d-%s-%04d', $branch->id, date('Ymd'), $pIdx + 101);
                $apt = Appointment::create([
                    'branch_id' => $branch->id,
                    'patient_id' => $patient->id,
                    'doctor_id' => $doc->id,
                    'department_id' => $doc->department_id,
                    'appointment_number' => $aptNum,
                    'appointment_date' => date('Y-m-d'),
                    'slot_time' => sprintf('%02d:00 AM', 9 + $pIdx * 2),
                    'token_number' => $pIdx + 1,
                    'type' => 'opd',
                    'reason_for_visit' => $pData['notes'],
                    'status' => $pIdx === 0 ? 'in_consultation' : 'waiting',
                ]);
            }

            // Beds & Admissions
            foreach ($bData['beds'] as $bedData) {
                $occupiedPatient = null;
                if ($bedData['occupied_by_idx'] !== null && isset($patientModels[$bedData['occupied_by_idx']])) {
                    $occupiedPatient = $patientModels[$bedData['occupied_by_idx']];
                }

                $bed = Bed::create([
                    'branch_id' => $branch->id,
                    'bed_number' => $bedData['num'],
                    'ward_type' => $bedData['type'],
                    'daily_charge' => $bedData['charge'],
                    'floor_room' => $bedData['floor'],
                    'status' => $occupiedPatient ? 'occupied' : 'available',
                ]);

                if ($occupiedPatient) {
                    $admNum = sprintf('IPD-B%d-%s-%04d', $branch->id, date('Ymd'), rand(100, 999));
                    IpdAdmission::create([
                        'admission_number' => $admNum,
                        'patient_id' => $occupiedPatient->id,
                        'doctor_id' => $doctorModels[0]->id,
                        'bed_id' => $bed->id,
                        'admission_date' => now()->subDays(rand(1, 3)),
                        'admitting_diagnosis' => $occupiedPatient->medical_history_notes,
                        'admitted_by' => $reception->id,
                        'status' => 'admitted',
                    ]);
                }
            }

            // Medicines
            foreach ($bData['medicines'] as $medData) {
                Medicine::create([
                    'branch_id' => $branch->id,
                    'barcode' => $medData['code'],
                    'name' => $medData['name'],
                    'generic_name' => $medData['generic'],
                    'category' => $medData['cat'],
                    'unit' => 'unit/box',
                    'purchase_price' => round($medData['price'] * 0.6, 2),
                    'selling_price' => $medData['price'],
                    'stock_quantity' => $medData['stock'],
                    'min_stock_level' => $medData['min'],
                ]);
            }

            // Invoices & Payments
            foreach ($bData['invoices'] as $invIdx => $invData) {
                $invPatient = $patientModels[$invData['patient_idx']];
                $invNum = sprintf('INV-B%d-%s-%04d', $branch->id, date('Ymd'), $invIdx + 501);
                
                $inv = Invoice::create([
                    'branch_id' => $branch->id,
                    'invoice_number' => $invNum,
                    'patient_id' => $invPatient->id,
                    'module' => $invData['module'],
                    'subtotal' => $invData['amount'],
                    'discount_amount' => 0.00,
                    'tax_amount' => 0.00,
                    'total_amount' => $invData['amount'],
                    'paid_amount' => $invData['amount'],
                    'due_amount' => 0.00,
                    'status' => 'posted',
                    'created_by' => $reception->id,
                ]);

                $inv->items()->create([
                    'item_name' => $invData['item'],
                    'quantity' => 1,
                    'unit_price' => $invData['amount'],
                    'discount' => 0.00,
                    'tax_rate' => 0.00,
                    'net_amount' => $invData['amount'],
                ]);

                $payNum = sprintf('PAY-B%d-%s-%04d', $branch->id, date('Ymd'), $invIdx + 701);
                $pay = Payment::create([
                    'payment_number' => $payNum,
                    'invoice_id' => $inv->id,
                    'amount' => $invData['amount'],
                    'payment_mode' => $invData['mode'],
                    'transaction_reference' => 'TXN-' . rand(100000, 999999),
                    'paid_at' => now(),
                    'received_by' => $accountant->id,
                ]);

                AccountsLedger::create([
                    'branch_id' => $branch->id,
                    'transaction_date' => now(),
                    'invoice_id' => $inv->id,
                    'payment_id' => $pay->id,
                    'entry_type' => 'credit',
                    'account_head' => $invData['module'] . '_revenue',
                    'amount' => $invData['amount'],
                    'narration' => "Payment received for invoice {$invNum} via {$invData['mode']}",
                ]);
            }

            // Lab Request
            $testObj = ($bIndex % 2 === 0) ? $testCBC : $testXRay;
            $labReqNum = sprintf('LAB-B%d-%s-%04d', $branch->id, date('Ymd'), $bIndex + 1);
            $labReq = LabRequest::create([
                'branch_id' => $branch->id,
                'request_number' => $labReqNum,
                'patient_id' => $patientModels[0]->id,
                'doctor_id' => $doctorModels[0]->id,
                'test_id' => $testObj->id,
                'status' => 'ready',
            ]);

            LabReport::create([
                'lab_request_id' => $labReq->id,
                'result_data' => ['interpretation' => 'All findings evaluated within target limits for ' . $branch->name],
                'report_pdf_path' => "/reports/lab-report-{$labReqNum}.pdf",
                'approved_by' => $labTech->id,
                'generated_at' => now(),
            ]);
        }
    }
}
