<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\ShippingCharge;
// use Illuminate\Http\Request;

class ShippingController extends Controller
{
    // get the shipping charge
    public function getShippingCharge()
    {
        $shippingCharge = ShippingCharge::first();

        return response()->json([
            'status' => 200,
            'message' => 'Shipping charge fetched successfully',
            'data' => $shippingCharge
        ]);
    }
}
