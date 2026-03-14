<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    // fillable the table

    protected $fillable = [
        'product_id',
        'image',
    ];

    protected $appends = ['image_url'];
    // apend the images url full for path
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('uploads/products/small/' . $this->image);
        }

        return null;
    }
}
