<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = [
        'franchise_id',
        'patient_id',
        'service_type',
        'invoice_id',
        'bill_amount',
        'commission_amount',
        'status',
    ];

    public function franchise()
    {
        return $this->belongsTo(Franchise::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
