<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabReport extends Model
{
    protected $fillable = [
        'lab_request_id',
        'result_data',
        'report_pdf_path',
        'approved_by',
        'generated_at',
    ];

    protected $casts = [
        'result_data' => 'array',
        'generated_at' => 'datetime',
    ];

    public function labRequest()
    {
        return $this->belongsTo(LabRequest::class);
    }
}
