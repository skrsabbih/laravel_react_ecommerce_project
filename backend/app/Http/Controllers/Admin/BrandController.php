<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BrandRequest;
use App\Models\Brand;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // all brands are fetched here
        $brands = Brand::latest()->get();
        return response()->json([
            'status' => 200,
            'message' => 'brands data fetched successfully',
            'data' => $brands,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BrandRequest $request)
    {
        // create the brand
        $brand = Brand::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'brand created successfully',
            'data' => $brand,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        // brand details are fetched here by id
        return response()->json([
            'status' => 200,
            'message' => 'brand data fetched successfully',
            'data' => $brand,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BrandRequest $request, Brand $brand)
    {
        // update the brand by id
        $brand->update([
            'name' => $request->name,
            'status' => $request->status ?? 1
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'brand updated successfully',
            'data' => $brand,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        // delete the brand by id
        $brand->delete();

        return response()->json([
            'status' => 200,
            'message' => 'brand deleted successfully',
        ], 200);
    }
}
