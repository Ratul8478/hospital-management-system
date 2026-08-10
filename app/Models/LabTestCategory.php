<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTestCategory extends Model
{
    protected $fillable = ['name', 'description'];

    public function tests()
    {
        return $this->hasMany(LabTest::class, 'category_id');
    }
}
