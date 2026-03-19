<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // fetch the products
        $products = Product::latest()
            ->with('product_images')
            ->get();
        return response()->json([
            'status' => 200,
            'message' => 'Products Fetched Successfully',
            'data' => $products
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        // store the product
        $product = Product::create($request->validated());

        // save the product size
        if (!empty($request->sizes)) {
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId
                ]);
            }
        }

        // save the product image
        if (!empty($request->gallery)) {
            // temp images array id
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImageId = TempImage::find($tempImageId);

                // imge extension added
                $extArray = explode('.', $tempImageId->name);
                $ext = end($extArray);
                // better approach for image extension
                // $ext = pathinfo($tempImageId->name, PATHINFO_EXTENSION);

                // image name generate
                $imageName = $product->id . '_' . time() . '.' . $ext;

                // better appoarch for image name generate
                // karon fast img process hole eki loop er moddhe
                // same name image save hoye jabar risk thake tai
                // niche better approach ta sikhe rakhlam
                // $imageName = $product->id . '_' . uniqid() . '.' . $ext;
                $manager = new ImageManager(Driver::class);
                // large Thumbnail
                // read the image path
                $img = $manager->read(public_path('uploads/temp/' . $tempImageId->name));
                $img->scaleDown(1200);
                // save the image path
                $img->save(public_path('uploads/products/large/' . $imageName));

                // Small Thumbnail
                // read the image path
                $img = $manager->read(public_path('uploads/temp/' . $tempImageId->name));
                $img->coverDown(400, 460);
                // save the image path
                $img->save(public_path('uploads/products/small/' . $imageName));

                // first image set to product into product table
                if ($key == 0) {
                    $product->image  = $imageName;
                    $product->save();
                }

                // save the image into product_image table
                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                // delete the temp image
                if (file_exists(public_path('uploads/temp/' . $tempImageId->name))) {
                    unlink(public_path('uploads/temp/' . $tempImageId->name));
                }
                $tempImageId->delete();
            }
        }
        return response()->json([
            'status' => 201,
            'message' => 'Product Created Successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // show the product by id
        $product->load('product_images', 'sizes');
        return response()->json([
            'status' => 200,
            'message' => 'Product Showed Successfully',
            'data' => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        // relaton load
        $product->load('sizes');
        // update the product by id
        $product->update($request->validated());
        // update the product sizes
        // first delete the previous product sizes
        ProductSize::where('product_id', $product->id)->delete();
        // save the new product sizes
        if (!empty($request->sizes)) {
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId
                ]);
            }
        }
        return response()->json([
            'status' => 200,
            'message' => 'Product Updated Successfully',
            'data' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // load the relationship
        $product->load('product_images');

        // delete the product images path
        if ($product->product_images) {
            foreach ($product->product_images as $image) {
                File::delete([
                    public_path('uploads/products/large/' . $image->image),
                    public_path('uploads/products/small/' . $image->image)
                ]);
            }
        }

        // delete the product by id
        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product Deleted Successfully',
        ], 200);
    }

    // save the product for update in product_image table not temp_images table
    public function updateProductImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        // validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $image = $request->file('image');
        // unique name generate
        $imageName = $request->product_id . '-' . time() . '.' . $image->extension();

        $manager = new ImageManager(Driver::class);

        // large Thumbnail
        // read the image path
        $img = $manager->read($image->getPathname());
        $img->scaleDown(1200);
        // save the image path
        $img->save(public_path('uploads/products/large/' . $imageName));

        // Small Thumbnail
        // read the image path
        $img = $manager->read($image->getPathname());
        $img->coverDown(400, 460);
        // save the image path
        $img->save(public_path('uploads/products/small/' . $imageName));

        // save to images into product_images table
        $productImage = ProductImage::create([
            'image' => $imageName,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Image Uploaded Successfully',
            'data' => $productImage
        ]);
    }

    // update the product default images
    public function updateDefaultImage(Request $request)
    {
        $product = Product::find($request->product_id);
        $product->image = $request->image;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product Default Image Updated Successfully',
            'data' => $product
        ], 200);
    }

    // delete the product image when update the product data
    public function deleteProductImage(Request $request)
    {
        // first delete the image from product_images table with product_iamge_id
        $image = ProductImage::find($request->id);
        if (!$image) {
            return response()->json([
                'status' => 404,
                'message' => 'Image Not Found',
            ], 404);
        }

        // delete the large file path and small file path
        File::delete([
            public_path('uploads/products/large/' . $image->image),
            public_path('uploads/products/small/' . $image->image)
        ]);

        $image->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Image Deleted Successfully',
        ], 200);
    }
}
