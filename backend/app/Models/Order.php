<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // fillable the orders table
    protected $fillable = [
        'user_id',
        'subtotal',
        'shipping',
        'discount',
        'grand_total',
        'payment_status',
        'status',
        'name',
        'email',
        'mobile',
        'address',
        'city',
        'state',
        'zip',
    ];

    // relation with user table
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // relation with order items table
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:d M, Y',
        ];
    }
}
