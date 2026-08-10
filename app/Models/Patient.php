<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'uhid',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'phone',
        'email',
        'address',
        'blood_group',
        'emergency_contact',
        'medical_history_notes',
        'created_by',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function ipdAdmissions()
    {
        return $this->hasMany(IpdAdmission::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
