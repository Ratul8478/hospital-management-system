<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'franchise_id',
        'available_balance',
        'pending_balance',
        'lifetime_earnings',
    ];

    public function franchise()
    {
        return $this->belongsTo(Franchise::class);
    }
}
