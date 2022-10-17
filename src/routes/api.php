<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\PrivatePostController;
use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\GroupUserController;
use App\Http\Controllers\API\GroupPostController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\WordleController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\GameController;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // ログイン中のユーザー情報を取得
});

// 常時使用可能 ////////////////////////////////////////////
// 認証
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ユーザー情報
Route::get('getuser', [UserController::class, 'getuser']);

// ログイン中のみ使用可能 ///////////////////////////////////
Route::middleware('auth:sanctum')->group(function() {

    // ログアウト
    Route::post('logout', [AuthController::class, 'logout']);

    // フォロー
    Route::post('follow', [FollowController::class, 'follow']);
    Route::post('unfollow', [FollowController::class, 'unfollow']);
    Route::get('ffcheck', [FollowController::class, 'ffcheck']);

    // 投稿
    Route::post('post', [PostController::class, 'post']);
    Route::post('privatepost', [PrivatePostController::class, 'privatePost']);

    // グループ
    Route::get('getgroup', [GroupController::class, 'getGroup']);
    Route::post('creategroup', [GroupController::class, 'createGroup']);
    Route::post('joingroup', [GroupUserController::class, 'joinGroup']);
    Route::post('leavegroup', [GroupUserController::class, 'leaveGroup']);
    Route::post('grouppost', [GroupPostController::class, 'groupPost']);

    // 通知
    Route::get('notifications', [NotificationController::class, 'notifications']);
    Route::get('unreadnotifications', [NotificationController::class, 'unreadNotifications']);
    Route::post('readnotification', [NotificationController::class, 'readNotification']);
    Route::post('readallnotifications', [NotificationController::class, 'readAllNotifications']);
});