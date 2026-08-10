<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Franchise extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'user_id',
        'partner_code',
        'name',
        'company_name',
        'phone',
        'email',
        'commission_type',
        'commission_rate',
        'status',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function referrals()
    {
        return $this->hasMany(Referral::class);
    }
}
