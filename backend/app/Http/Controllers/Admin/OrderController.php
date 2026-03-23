<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    // admin manage the order
    public function adminOrders()
    {
        try {
            $orders = Order::latest()->get();
            return response()->json([
                'status' => 200,
                'message' => 'Order Fetch Successfully',
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    // admin manage the order details
    public function adminOrderDetails($id)
    {
        $orderDetails = Order::with('orderItems', 'orderItems.product')->find($id);

        if (!$orderDetails) {
            return response()->json([
                'status' => 404,
                'message' => 'Order details not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Details Fetch Successfully',
            'data' => $orderDetails
        ]);
    }

    // update order status and payment status
    public function updateOrderStatus(Request $request, $id)
    {
        $updateOrder = Order::find($id);

        if (!$updateOrder) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found'
            ], 404);
        }

        $request->validate([
            'status' => 'nullable|in:pending,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:paid,not paid',
        ]);

        if ($request->filled('status')) {
            $updateOrder->status = $request->status;
        }

        if ($request->filled('payment_status')) {
            $updateOrder->payment_status = $request->payment_status;
        }
        $updateOrder->save();

        return response()->json([
            'status' => 200,
            'message' => 'Order Status Updated Successfully',
            'data' => $updateOrder
        ]);
    }
}
