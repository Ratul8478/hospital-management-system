<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bed extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'bed_number',
        'ward_type',
        'daily_charge',
        'status',
        'floor_room',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }

    public function admissions()
    {
        return $this->hasMany(IpdAdmission::class);
    }
}
