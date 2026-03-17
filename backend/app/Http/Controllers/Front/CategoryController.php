<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Category;
// use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // categories index
    public function headerCategory()
    {
        $categories = Category::latest()
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Header Fetch Category Successfully',
            'data' => $categories
        ]);
    }

    // footer category
    public function footerCategory()
    {
        $categories = Category::latest()
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Footer Fetch Category Successfully',
            'data' => $categories
        ]);
    }
}
