<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\TempImageController;
use App\Http\Controllers\Front\ProductController as FrontProductController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
// login route
Route::post('/admin/administration', [AuthController::class, 'authenticate']);
// frontend product route lastest product
Route::get('/latest-products', [FrontProductController::class, 'latestProduct']);
// frontend product route featured product
Route::get('/featured-products', [FrontProductController::class, 'featuredProduct']);
// protected route for admin panel
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('products', ProductController::class);
    Route::post('/temp-images', [TempImageController::class, 'store']);
    Route::post('/update-product-image', [ProductController::class, 'updateProductImage']);
    Route::get('/change-product-default-image', [ProductController::class, 'updateDefaultImage']);
    Route::delete('/delete-product-image', [ProductController::class, 'deleteProductImage']);
});
