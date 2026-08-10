<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'item_name',
        'quantity',
        'unit_price',
        'discount',
        'tax_rate',
        'net_amount',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
