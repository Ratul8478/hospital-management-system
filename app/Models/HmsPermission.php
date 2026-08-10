<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HmsPermission extends Model
{
    protected $fillable = ['name', 'module', 'description'];

    public function roles()
    {
        return $this->belongsToMany(HmsRole::class, 'hms_role_permissions', 'permission_id', 'role_id');
    }
}
