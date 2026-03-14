<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // all categories are fetched here
        $categories = Category::latest()->get();
        return response()->json([
            'status' => 200,
            'message' => 'categories data fetched successfully',
            'data' => $categories,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        // create the category
        $category = Category::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        // category details are fetched here by id
        return response()->json([
            'status' => 200,
            'message' => 'category data fetched successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        // update the category by id
        $category->update([
            'name' => $request->name,
            'status' => $request->status ?? 1
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'category updated successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // delete the category by id
        $category->delete();

        return response()->json([
            'status' => 200,
            'message' => 'category deleted successfully',
        ], 200);
    }
}
