<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Size;


class SizeController extends Controller
{
    // index for fetching the size
    public function index()
    {
        $sizes = Size::all();
        return response()->json([
            'status' => 200,
            'message' => 'Size Fetched Successfully',
            'data' => $sizes
        ], 200);
    }
}
