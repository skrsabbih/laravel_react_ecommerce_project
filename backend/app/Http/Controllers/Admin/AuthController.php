<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // authentiacate for admin methode
    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:7',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            $user = User::find(Auth::user()->id);
            // admin role checked
            if ($user->role == 'admin') {
                // token generated
                $token = $user->createToken('token')->plainTextToken;
                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'id' => $user->id,
                    'name' => $user->name,
                    'message' => 'Admin login successfully',
                ], 200);
            } else {
                return response()->json([
                    'status' => 403,
                    'message' => 'You are not authorized to access admin panel',
                ], 403);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'User email/Password invalid',
            ], 401);
        }
    }
}
