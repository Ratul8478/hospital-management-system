<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'payment_number',
        'invoice_id',
        'amount',
        'payment_mode',
        'transaction_reference',
        'paid_at',
        'received_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
