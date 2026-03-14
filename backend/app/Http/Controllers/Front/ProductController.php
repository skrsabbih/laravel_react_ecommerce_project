<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Product;
// use Illuminate\Http\Request;

class ProductController extends Controller
{
    // this is for latest product
    public function latestProduct()
    {
        $products = Product::latest()
            ->where('status', 1)
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Latest Product Fetched Successfully',
            'data' => $products
        ], 200);
    }
    public function featuredProduct()
    {
        $products = Product::latest()
            ->where('status', 1)
            ->where('is_featured', 'yes')
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Featured Product Fetched Successfully',
            'data' => $products
        ], 200);
    }
}
