<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'request_number',
        'patient_id',
        'doctor_id',
        'test_id',
        'invoice_id',
        'status',
        'sample_collected_at',
        'created_by',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function test()
    {
        return $this->belongsTo(LabTest::class, 'test_id');
    }

    public function labReport()
    {
        return $this->hasOne(LabReport::class);
    }
}
