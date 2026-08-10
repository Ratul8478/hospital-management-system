<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IpdAdmission extends Model
{
    protected $fillable = [
        'admission_number',
        'patient_id',
        'doctor_id',
        'bed_id',
        'admission_date',
        'discharge_date',
        'admitting_diagnosis',
        'status',
        'admitted_by',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function bed()
    {
        return $this->belongsTo(Bed::class);
    }

    public function transfers()
    {
        return $this->hasMany(BedTransfer::class);
    }
}
