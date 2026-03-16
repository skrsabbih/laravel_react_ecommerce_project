<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    // fetch categories into shop page
    public function getShopCategories()
    {
        $categories = Category::latest()
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Categories Fetched Successfully',
            'data' => $categories
        ]);
    }

    // fetch brands into shop page
    public function getShopBrands()
    {
        $brands = Brand::latest()
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Brands Fetched Successfully',
            'data' => $brands
        ]);
    }

    // fetch product into filter by categories and brand id for shop page
    public function getCatBrShopProduct(Request $request)
    {
        $products = Product::latest()
            ->where('status', 1);


        // filter by product into categories id
        if (!empty($request->category)) {
            // for explode string to array
            $catArray = explode(',', $request->category);
            $products = $products->whereIn('category_id', $catArray);
        }

        // filter by product into brand id
        if (!empty($request->brand)) {
            // for explode string to array
            $brandArray = explode(',', $request->brand);
            $products = $products->whereIn('brand_id', $brandArray);
        }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'message' => 'Products Filter Fetched Successfully',
            'data' => $products
        ]);
    }
}
