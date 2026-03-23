<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerProfileUpdateRequest;
use App\Http\Requests\FrontLoginRequest;
use App\Http\Requests\FrontRegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    // register method for user (customer)
    public function customerRegister(FrontRegisterRequest $request)
    {
        try {
            // create the registration into users table
            $user  = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'customer'
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'User Registration successful',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // login method for user (customer)
    public function customerLogin(FrontLoginRequest $request)
    {
        try {
            // attemp the registration data
            if (Auth::attempt([
                'email' => $request->email,
                'password' => $request->password
            ])) {
                // find the user id
                $user = Auth::user();

                // customer role checked
                if ($user->role == 'customer') {
                    // token generate
                    $token = $user->createToken('token')->plainTextToken;
                    return response()->json([
                        'status' => 200,
                        'token' => $token,
                        'id' => $user->id,
                        'name' => $user->name,
                        'role' => $user->role,
                        'message' => 'Customer login successfully',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 403,
                        'message' => 'You are not a customer'
                    ], 403);
                }
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Email or Password invalid'
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    // customer profile update function
    public function customerProfile(CustomerProfileUpdateRequest $request)
    {
        try {
            $user = $request->user();
            // if user is not found
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
                'mobile' => $request->mobile
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Your Profile updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // user details for get
    public function getDetais(Request $request)
    {
        // user id
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'User details fetch successfully',
            'data' => $user
        ], 200);
    }
}
