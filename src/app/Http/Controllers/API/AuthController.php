<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
// use Illuminate\Validation\Validator;
// use Validator;

// https://readouble.com/laravel/8.x/ja/sanctum.html

class AuthController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'screen_name'=>'required|max:16|unique:users,screen_name',
            'name'=>'required|max:191',
            'email'=>'required|email|max:191|unique:users,email',
            'password'=>'required|min:8',
            'password_confirmation'=>'required|min:8',
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors'=>$validator->errors(),
            ]);
        } else if($request->password !== $request->password_confirmation) {
            return response()->json([
                'validation_errors'=>[
                    'password_confirmation'=>'パスワード不一致',
                ]
            ]);
        } else {
            $user = User::create([
                'screen_name'=>$request->screen_name,
                'name'=>$request->name,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
            ]);

            $token = $user->createToken($user->email.'_Token')->plainTextToken;

            return response()->json([
                'user'=>[
                    'id'=>$user->id,
                    'screen_name'=>$user->screen_name,
                    'name'=>$user->name,
                    'email'=>$user->email,
                ],
                'token'=>$token,
                'status'=>200,
                'message'=>'Registerd Successfully'
            ]);
        }
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email'=>'required',
            'password'=>'required',
        ]);

        if ($validator->fails()){
            return response()->json([
                'validation_errors'=>$validator->errors(),
            ]);
        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status'=>400,
                    'message'=>'入力情報が不正です',
                ]);
            } 
            else if (null !== $request->bearerToken()) {
                // https://laracasts.com/discuss/channels/laravel/how-to-get-current-access-token-in-sanctum
                return response()->json([
                    'status'=>400,
                    'message'=>'既にログインしています',
                ]);
            } else {
                $token = $user->createToken($user->email.'_Token')->plainTextToken;

                return response()->json([
                    'user'=>[
                        'id'=>$user->id,
                        'screen_name'=>$user->screen_name,
                        'name'=>$user->name,
                        'email'=>$user->email,
                    ],
                    'token'=>$token,
                    'status'=>200,
                    'message'=>'ログインに成功しました。'
                ]);
            }
        }
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'ログアウト成功',
        ]);
    }
}