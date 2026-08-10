<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HmsRole extends Model
{
    protected $fillable = ['name', 'display_name', 'description'];

    public function permissions()
    {
        return $this->belongsToMany(HmsPermission::class, 'hms_role_permissions', 'role_id', 'permission_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'hms_user_roles', 'role_id', 'user_id');
    }
}
