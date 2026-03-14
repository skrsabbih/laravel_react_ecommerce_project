<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TempImage extends Model
{
    // fillble the table
    protected $fillable = [
        'name',
    ];

    protected $appends = ['image_url'];
    public function getImageUrlAttribute()
    {
        if ($this->name) {
            return asset('uploads/temp/thumb/' . $this->name);
        }
        return null;
    }
}
