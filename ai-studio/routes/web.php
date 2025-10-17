<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ToolsController;
use App\Modules\Transcripta\Controllers\TranscriptaController;
use App\Modules\Shortify\Controllers\ShortifyController;
use App\Modules\BackgroundZap\Controllers\BackgroundZapController;

Route::get('/', function () {
    return view('welcome');
});

// API routes for SPA (prefix /api)
Route::prefix('api')->group(function () {
    // Auth endpoints
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth');

    // Tools registry
    Route::get('/tools', [ToolsController::class, 'index']);

    // Transcripta endpoints
    Route::post('/tools/transcripta/process', [TranscriptaController::class, 'process'])->middleware('auth');
    Route::get('/tools/transcripta/history', [TranscriptaController::class, 'history'])->middleware('auth');

    // Shortify endpoints (stub)
    Route::post('/tools/shortify/generate', [ShortifyController::class, 'generate'])->middleware('auth');

    // BackgroundZap endpoints (stub)
    Route::post('/tools/backgroundzap/remove', [BackgroundZapController::class, 'removeBackground'])->middleware('auth');
});
