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
    // this is for featured product
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

    // fetch single product for product page
    public function singleProduct(Product $product)
    {
        $product->load(['sizes', 'product_images']);
        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product Not Found',
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'message' => 'Single Product Fetched Successfully',
            'data' => $product
        ], 200);
    }
}
