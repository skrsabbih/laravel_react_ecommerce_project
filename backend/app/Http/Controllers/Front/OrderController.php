<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\PaymentIntent;
use Stripe\Stripe;

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
                'payment_status' => $request->payment_status  ?? 'not paid',
                'payment_method' => $request->payment_method,
                'status' => $request->status ?? 'pending',
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
                ->where('user_id', Auth::id())
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

    // customer manage the order his dashboard
    public function customerOrders()
    {
        try {
            $user = Auth::user();
            $orders = Order::where('user_id', $user->id) // user_id holo orders table e user er id
                ->latest()
                ->get();
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

    // customer manage the order details by his id
    public function customerOrderDetails($id)
    {
        $user = Auth::user();
        $orderDetails = Order::with('orderItems', 'orderItems.product')
            ->where('user_id', $user->id)
            ->find($id);

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

    // stripe payment gateway added
    public function createPaymentIntent(Request $request)
    {
        try {
            if ($request->amount > 0) {
                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
                $paymentIntent = PaymentIntent::create([
                    'amount' => $request->amount,
                    'currency' => 'usd',
                    'payment_method_types' => ['card'],
                ]);
                $clientSecret = $paymentIntent->client_secret;

                return response()->json([
                    'status' => 200,
                    'clientSecret' => $clientSecret
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Amount must be greater than 0',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // SSLCommerz payment init
    public function sslCommerzInit(CheckoutRequest $request)
    {
        DB::beginTransaction();
        try {
            // first create a transaction id
            $transId = 'TXN-' . time() . '-' . Str::upper(Str::random(6));
            // pending checkout data order table a save tar jonno order create
            $order = Order::create([
                'user_id' => Auth::id(),
                'subtotal' => $request->subtotal,
                'shipping' => $request->shipping,
                'discount' => $request->discount ?? 0,
                'grand_total' => $request->grand_total,
                'payment_status' => 'not paid',
                'payment_method' => 'sslcommerz',
                'status' => 'pending',
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
                'tran_id' => $transId,
            ]);
            // order item create
            foreach ($request->cart as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['product_id'],
                    'order_id' => $order->id,
                    'name' => $item['title'],
                    'size' => $item['size_name'] ?? null,
                    'unit_price' => $item['price'],
                    'price' => $item['price'] * $item['qty'],
                    'qty' => $item['qty'],
                ]);
            }
            // for sslcommez setup initialization data
            $payload = [
                'store_id' => config('services.sslcommerz.store_id'),
                'store_passwd' => config('services.sslcommerz.store_password'),
                'total_amount' => number_format((float) $request->grand_total, 2, '.', ''),
                'currency' => 'BDT',
                'tran_id' => $transId,

                // callback function
                'success_url' => config('services.sslcommerz.success_url'),
                'fail_url' => config('services.sslcommerz.fail_url'),
                'cancel_url' => config('services.sslcommerz.cancel_url'),
                'ipn_url' => config('services.sslcommerz.ipn_url'),

                'cus_name' => $request->name,
                'cus_email' => $request->email,
                'cus_add1' => $request->address,
                'cus_city' => $request->city,
                'cus_state' => $request->state,
                'cus_postcode' => $request->zip,
                'cus_country' => 'Bangladesh',
                'cus_phone' => $request->mobile,

                'shipping_method' => 'Courier',
                'product_name' => 'Ecommerce Order',
                'product_category' => 'General',
                'product_profile' => 'general',

                'num_of_item' => is_array($request->cart) ? count($request->cart) : 1,

                // optional shipping info
                'ship_name' => $request->name,
                'ship_add1' => $request->address,
                'ship_city' => $request->city,
                'ship_state' => $request->state,
                'ship_postcode' => $request->zip,
                'ship_country' => 'Bangladesh',

                // custom values
                'value_a' => Auth::id(),
                'value_b' => 'customer_checkout',
                'value_c' => now()->toDateTimeString(),
                'value_d' => $request->email,
            ];
            // response from sslcommerz init url
            $response = Http::asForm()->post(config('services.sslcommerz.init_url'), $payload);

            if (!$response->successful()) {
                DB::rollBack();
                return response()->json([
                    'status' => 500,
                    'message' => 'Unable to connect to SSLCommerz',
                    'error' => $response->body(),
                ], 500);
            }
            // result
            $result = $response->json();

            if (($result['status'] ?? null) !== 'SUCCESS' || empty($result['GatewayPageURL'])) {
                DB::rollBack();

                return response()->json([
                    'status' => 400,
                    'message' => $result['failedreason'] ?? 'Unable to initialize payment',
                    'data' => $result,
                ], 400);
            }

            // DB commit
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'SSLCommerz session created successfully',
                'gateway_url' => $result['GatewayPageURL'],
                'tran_id' => $transId,
            ]);
        } catch (\Exception $e) {
            // error for sslcommerz
            DB::rollBack();
            Log::error('SSLCommerz Init Error:' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // SSLCommerz success callback
    public function sslCommerzSuccess(Request $request)
    {
        try {
            $validation = $this->validateSslPayment($request);

            if (!$validation['valid']) {
                return redirect(config('services.sslcommerz.frontend_url') . '/checkout?payment=invalid');
            }

            $order = Order::where('tran_id', $request->tran_id)->first();

            if (!$order) {
                return redirect(config('services.sslcommerz.frontend_url') . '/checkout?payment=order_missing');
            }

            // duplicate check
            if ($order->payment_status !== 'paid') {
                $data = $validation['data'];

                $order->update([
                    'payment_status' => 'paid',
                    'val_id' => $request->val_id,
                    'bank_tran_id' => $data['bank_tran_id'] ?? null,
                    'card_type' => $data['card_type'] ?? null,
                    'gateway_response' => json_encode($data),
                ]);
            }
            return redirect(config('services.sslcommerz.frontend_url') . '/order/confirmation/' . $order->id);
        } catch (\Exception $e) {
            Log::error('SSLCommerz Success Error: ' . $e->getMessage());

            return redirect(config('services.sslcommerz.frontend_url') . '/checkout?payment=error');
        }
    }

    // SSLCommerz fail callback
    public function sslCommerzFail(Request $request)
    {
        $order = Order::where('tran_id', $request->tran_id)->first();

        if ($order && $order->payment_status !== 'paid') {
            $order->update([
                'status' => 'failed',
                'gateway_response' => json_encode($request->all()),
            ]);
        }

        return redirect(config('services.sslcommerz.frontend_url') . '/checkout?payment=failed');
    }

    // SSLCommerz cancel callback
    public function sslCommerzCancel(Request $request)
    {
        $order = Order::where('tran_id', $request->tran_id)->first();

        if ($order && $order->payment_status !== 'paid') {
            $order->update([
                'status' => 'cancelled',
                'gateway_response' => json_encode($request->all()),
            ]);
        }

        return redirect(config('services.sslcommerz.frontend_url') . '/checkout?payment=cancelled');
    }

    // SSLCommerz IPN callback
    public function sslCommerzIpn(Request $request)
    {
        try {
            $validation = $this->validateSslPayment($request);

            if (!$validation['valid']) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Invalid IPN',
                ], 400);
            }

            return response()->json([
                'status' => 200,
                'message' => 'IPN received and validated',
            ]);
        } catch (\Exception $e) {
            Log::error('SSLCommerz IPN Error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'IPN processing failed',
            ], 500);
        }
    }

    // validation API call
    private function validateSslPayment(Request $request): array
    {
        $valId = $request->input('val_id');
        $tranId = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        if (!$valId || !$tranId || !$amount || !$currency) {
            return ['valid' => false, 'data' => null];
        }

        $response = Http::get(config('services.sslcommerz.validation_url'), [
            'val_id' => $valId,
            'store_id' => config('services.sslcommerz.store_id'),
            'store_passwd' => config('services.sslcommerz.store_password'),
            'format' => 'json',
        ]);

        if (!$response->successful()) {
            return ['valid' => false, 'data' => null];
        }

        $result = $response->json();

        $isValidStatus = in_array($result['status'] ?? '', ['VALID', 'VALIDATED']);
        $isTranMatched = ($result['tran_id'] ?? '') === $tranId;
        $isAmountMatched = (float) ($result['amount'] ?? 0) == (float) $amount;
        $isCurrencyMatched = ($result['currency_type'] ?? $result['currency'] ?? '') === $currency;

        return [
            'valid' => $isValidStatus && $isTranMatched && $isAmountMatched && $isCurrencyMatched,
            'data' => $result,
        ];
    }
}
