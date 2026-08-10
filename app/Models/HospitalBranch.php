<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HospitalBranch extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'address',
        'city',
        'state',
        'phone',
        'email',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'branch_id');
    }

    public function branchAdmins()
    {
        return $this->hasMany(User::class, 'branch_id')->whereHas('roles', function ($q) {
            $q->where('name', 'branch_admin');
        });
    }

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'branch_id');
    }

    public function patients()
    {
        return $this->hasMany(Patient::class, 'branch_id');
    }

    public function beds()
    {
        return $this->hasMany(Bed::class, 'branch_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'branch_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'branch_id');
    }

    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'branch_id');
    }

    public function labRequests()
    {
        return $this->hasMany(LabRequest::class, 'branch_id');
    }

    public function franchises()
    {
        return $this->hasMany(Franchise::class, 'branch_id');
    }
}
