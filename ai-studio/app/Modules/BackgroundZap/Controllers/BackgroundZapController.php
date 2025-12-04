<?php

namespace App\Modules\BackgroundZap\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\BackgroundZap\Services\BackgroundZapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class BackgroundZapController extends Controller
{
    public function removeBackground(Request $request, BackgroundZapService $service): JsonResponse
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $result = $service->removeBackgroundUploaded($file);
            $payload = $file->getClientOriginalName();
        } else {
            $data = $request->validate([
                'image' => ['required', 'string'],
            ]);
            $result = $service->removeBackground($data['image']);
            $payload = $data['image'];
        }

        // Log usage (fallback)
        Log::info('tool_usage', [
            'user_id' => Auth::id(),
            'tool' => 'backgroundzap',
            'payload' => $payload,
            'timestamp' => now()->toIso8601String(),
        ]);

        return response()->json($result);
    }
}
