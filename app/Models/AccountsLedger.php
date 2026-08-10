<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountsLedger extends Model
{
    use HasFactory;

    protected $table = 'accounts_ledger';

    protected $fillable = [
        'branch_id',
        'transaction_date',
        'invoice_id',
        'payment_id',
        'entry_type',
        'account_head',
        'amount',
        'narration',
    ];

    public function branch()
    {
        return $this->belongsTo(HospitalBranch::class, 'branch_id');
    }
}
