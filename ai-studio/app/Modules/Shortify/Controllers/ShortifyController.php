<?php

namespace App\Modules\Shortify\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shortify\Services\ShortifyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ShortifyController extends Controller
{
    public function generate(Request $request, ShortifyService $service): JsonResponse
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $result = $service->generateFromUploaded($file);
            $payload = $file->getClientOriginalName();
        } else {
            $data = $request->validate([
                'source' => ['required', 'string'],
            ]);
            $result = $service->generateFromVideo($data['source']);
            $payload = $data['source'];
        }

        // Log usage (fallback)
        Log::info('tool_usage', [
            'user_id' => Auth::id(),
            'tool' => 'shortify',
            'payload' => $payload,
            'timestamp' => now()->toIso8601String(),
        ]);

        return response()->json($result);
    }
}
