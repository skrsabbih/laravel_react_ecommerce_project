<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

// use Illuminate\Http\Request;

class OrderController extends Controller
{
    // store the order and orderitems data in database
    public function saveOrder(CheckoutRequest $request)
    {
        DB::beginTransaction();
        try {
            // order table data create
            $order = Order::create([
                'user_id' => Auth::id(),
                'subtotal' => $request->subtotal,
                'shipping' => $request->shipping,
                'discount' => $request->discount ?? 0,
                'grand_total' => $request->grand_total,
                'payment_status' => 'not paid',
                'status' => 'pending',
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
            ]);

            // order_items table data create
            foreach ($request->cart as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['product_id'],
                    'order_id' => $order->id,
                    'name' => $item['title'],
                    'size' => $item['size_name'] ?? null,
                    'unit_price' => $item['price'], // per item price
                    'price' => $item['price'] * $item['qty'], // total price
                    'qty' => $item['qty'],
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => 201,
                'order_id' => $order->id,
                'message' => 'Order placed successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // order details by order id
    public function orderDetails($id)
    {
        try {
            $order = Order::with('orderItems')
                ->where('id', $id)
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Order not found',
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Order details',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
