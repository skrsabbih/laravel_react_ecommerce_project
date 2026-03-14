<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // fillable the table
    protected $fillable = [
        'name',
        'status',
    ];
}
