<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    // fillable the order items table
    protected $fillable = [
        'product_id',
        'order_id',
        'name',
        'size',
        'price',
        'unit_price',
        'qty',
    ];

    // relationship with order table
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // relationship with product table
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
