<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\TempImageController;
use App\Http\Controllers\Front\AccountController;
use App\Http\Controllers\Front\CategoryController as FrontCategoryController;
use App\Http\Controllers\Front\OrderController;
use App\Http\Controllers\Front\ProductController as FrontProductController;
use App\Http\Controllers\Front\ShopController;
use Illuminate\Support\Facades\Route;


// admin login route
Route::post('/admin/administration', [AuthController::class, 'authenticate']);
// frontend product route lastest product
Route::get('/latest-products', [FrontProductController::class, 'latestProduct']);
// frontend product route featured product
Route::get('/featured-products', [FrontProductController::class, 'featuredProduct']);
// frontend category route for header uses
Route::get('/header-categories', [FrontCategoryController::class, 'headerCategory']);
// frontend category route for footer uses
Route::get('/footer-categories', [FrontCategoryController::class, 'footerCategory']);
// frontend category route for shop page uses
Route::get('/shop-getCategories', [ShopController::class, 'getShopCategories']);
// frontend brand route for shop page uses
Route::get('/shop-getBrands', [ShopController::class, 'getShopBrands']);
// frontend categories, brand with product route for shop page uses
Route::get('/shop-getCatBrProduct', [ShopController::class, 'getCatBrShopProduct']);
// frontend single product route for product page uses
Route::get('/product/{product}', [FrontProductController::class, 'singleProduct']);

// user route registration and login users means (customer)
Route::post('/customer-register', [AccountController::class, 'customerRegister']);
Route::post('/customer-login', [AccountController::class, 'customerLogin']);

// protected route for admin panel
Route::group(['middleware' => ['auth:sanctum', 'checkadminRole']], function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('products', ProductController::class);
    Route::post('/temp-images', [TempImageController::class, 'store']);
    Route::post('/update-product-image', [ProductController::class, 'updateProductImage']);
    Route::get('/change-product-default-image', [ProductController::class, 'updateDefaultImage']);
    Route::delete('/delete-product-image', [ProductController::class, 'deleteProductImage']);
});

// protectd route for customer panel
Route::group(['middleware' => ['auth:sanctum', 'checkcustomerRole']], function () {
    Route::post('/oder-place', [OrderController::class, 'saveOrder']);
    Route::get('/order-details/{id}', [OrderController::class, 'orderDetails']);
});
