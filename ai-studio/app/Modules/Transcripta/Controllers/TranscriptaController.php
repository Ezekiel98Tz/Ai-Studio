<?php

namespace App\Modules\Transcripta\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transcript;
use App\Modules\Transcripta\Services\TranscriptaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TranscriptaController extends Controller
{
    public function process(Request $request, TranscriptaService $service): JsonResponse
    {
        Log::info('TranscriptaController::process started', [
            'has_file' => $request->hasFile('file'),
            'content_length' => $request->header('Content-Length'),
            'content_type' => $request->header('Content-Type'),
        ]);

        if ($request->hasFile('file')) {
            $f = $request->file('file');
            Log::info('File details', [
                'original_name' => $f->getClientOriginalName(),
                'mime_type' => $f->getMimeType(),
                'size' => $f->getSize(),
                'error' => $f->getError(),
            ]);
        }

        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $file = $request->file('file');
        $transcriptText = $service->process($file);

        // Store uploaded file locally (for history reference)
        $storedPath = $file->store('transcripta_uploads');

        $transcript = Transcript::create([
            'user_id' => Auth::id(),
            'input_path' => $storedPath,
            'text' => $transcriptText,
        ]);

        // Log usage (fallback)
        Log::info('tool_usage', [
            'user_id' => Auth::id(),
            'tool' => 'transcripta',
            'transcript_id' => $transcript->id,
            'timestamp' => now()->toIso8601String(),
        ]);

        return response()->json([
            'transcript' => $transcript,
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $items = Transcript::where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->limit(25)
            ->get();

        return response()->json(['history' => $items]);
    }
}
