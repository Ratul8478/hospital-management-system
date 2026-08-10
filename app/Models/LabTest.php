<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTest extends Model
{
    protected $fillable = [
        'test_code',
        'name',
        'category_id',
        'price',
        'sample_type',
        'normal_range',
    ];

    public function category()
    {
        return $this->belongsTo(LabTestCategory::class, 'category_id');
    }
}
