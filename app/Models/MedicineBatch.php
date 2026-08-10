<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineBatch extends Model
{
    protected $fillable = [
        'medicine_id',
        'batch_number',
        'expiry_date',
        'quantity',
        'purchase_price',
        'selling_price',
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
