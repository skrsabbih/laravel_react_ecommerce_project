<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    // store the temp image
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $image = $request->file('image');

        // unique name generate
        $imageName = time() . '.' . $image->extension();

        // save the image
        $image->move(public_path('uploads/temp'), $imageName);

        // save to db
        $tempImage = TempImage::create([
            'name' => $imageName,
        ]);

        // create new image instance (800 x 600) for thumbnail
        $manager = new ImageManager(Driver::class);
        // read the image
        $img = $manager->read(public_path('uploads/temp/' . $imageName));
        $img->coverDown(400, 450);
        // save the image
        $img->save(public_path('uploads/temp/thumb/' . $imageName));
        return response()->json([
            'status' => 201,
            'message' => 'Image Uploaded Successfully',
            'data' => $tempImage
        ]);
    }
}
