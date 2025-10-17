<?php

namespace App\Modules\Transcripta\Services;

use Illuminate\Http\UploadedFile;

class TranscriptaService
{
    public function process(UploadedFile $file): string
    {
        // Mock whisper-like processing. Real integration can be queued.
        $filename = $file->getClientOriginalName();
        return "[MOCK TRANSCRIPT] Transcribed content from {$filename}.";
    }
}