<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingChargeRequest;
use App\Models\ShippingCharge;

// use Illuminate\Http\Request;

class ShippingController extends Controller
{


    // shipping charges list
    public function shippingChargesFetch()
    {
        $shippingCharges = ShippingCharge::first();
        return response()->json([
            'status' => 200,
            'message' => 'Shipping charges fetched successfully',
            'data' => $shippingCharges
        ]);
    }

    // shipping charges create
    public function shippingChargesUpdate(ShippingChargeRequest $request)
    {
        $shippingCharge = ShippingCharge::first();

        if ($shippingCharge == null) {
            $shippingCharge = ShippingCharge::create([
                'shipping_charge' => $request->shipping_charge
            ]);
        } else {
            $shippingCharge->update([
                'shipping_charge' => $request->shipping_charge
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Shipping charge added successfully',
            'data' => $shippingCharge
        ]);
    }
}
