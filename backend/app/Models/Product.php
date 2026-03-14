<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // fillable the table
    protected $fillable = [
        'title',
        'price',
        'compare_price',
        'description',
        'short_description',
        'image',
        'category_id',
        'brand_id',
        'qty',
        'sku',
        'barcode',
        'status',
        'is_featured'
    ];

    protected $appends = ['image_url'];
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('uploads/products/small/' . $this->image);
        }
        return null;
    }

    // product with many sizes
    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_sizes', 'product_id', 'size_id');
    }

    // product with many images
    public function product_images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
