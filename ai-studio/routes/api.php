<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ToolsController;
use App\Http\Controllers\SystemController;
use App\Modules\Transcripta\Controllers\TranscriptaController;
use App\Modules\Shortify\Controllers\ShortifyController;
use App\Modules\BackgroundZap\Controllers\BackgroundZapController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

require __DIR__.'/auth.php';

// Tools registry and modules
Route::get('/tools', [ToolsController::class, 'index']);
Route::post('/tools/transcripta/process', [TranscriptaController::class, 'process']);
Route::get('/tools/transcripta/history', [TranscriptaController::class, 'history']);
Route::post('/tools/shortify/generate', [ShortifyController::class, 'generate']);
Route::post('/tools/backgroundzap/remove', [BackgroundZapController::class, 'removeBackground']);

// DB health
Route::get('/db-health', [SystemController::class, 'dbHealth']);
