<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'barcode',
        'name',
        'generic_name',
        'category',
        'unit',
        'purchase_price',
        'selling_price',
        'stock_quantity',
        'min_stock_level',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }

    public function batches()
    {
        return $this->hasMany(MedicineBatch::class);
    }
}
