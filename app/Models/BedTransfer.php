<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BedTransfer extends Model
{
    protected $fillable = [
        'ipd_admission_id',
        'from_bed_id',
        'to_bed_id',
        'transferred_at',
        'reason',
        'transferred_by_user_id',
    ];

    public function admission()
    {
        return $this->belongsTo(IpdAdmission::class, 'ipd_admission_id');
    }

    public function fromBed()
    {
        return $this->belongsTo(Bed::class, 'from_bed_id');
    }

    public function toBed()
    {
        return $this->belongsTo(Bed::class, 'to_bed_id');
    }
}
