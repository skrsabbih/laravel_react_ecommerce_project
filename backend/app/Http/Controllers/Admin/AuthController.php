<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

    // admin changes their password
    public function adminDashChangePass(Request $request)
    {
        // validate the current pass and new pass
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:7|confirmed',
        ]);

        // if validator failed
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors(),
            ], 400);
        }

        // user login kina aita first check
        $user = Auth::user();

        // login na kora thakle
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized',
            ], 401);
        }

        // if login is ok but admin or not
        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 403,
                'message' => 'You are not authorized to change admin password',
            ], 403);
        }

        // current password check mane se je ai password dicce aita thik kina
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 422,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        //  new password same as old password hole block
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'status' => 422,
                'message' => 'New password cannot be the same as current password',
            ], 422);
        }

        // then all is ok user tar password hash kore save korbe
        $user->password  = Hash::make($request->new_password);
        $user->save();

        // then password is changed
        return response()->json([
            'status' => 200,
            'message' => 'Password changed successfully',
        ], 200);
    }
}
