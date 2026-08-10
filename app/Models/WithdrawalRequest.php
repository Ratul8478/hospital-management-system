<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    protected $fillable = [
        'franchise_id',
        'amount',
        'bank_details',
        'status',
        'admin_remarks',
        'processed_at',
    ];

    protected $casts = [
        'bank_details' => 'array',
        'processed_at' => 'datetime',
    ];

    public function franchise()
    {
        return $this->belongsTo(Franchise::class);
    }
}
