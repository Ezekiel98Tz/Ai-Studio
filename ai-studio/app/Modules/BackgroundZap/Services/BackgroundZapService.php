<?php

namespace App\Modules\BackgroundZap\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class BackgroundZapService
{
    public function removeBackground(string $imagePath): array
    {
        try {
            $contents = null;
            $filename = null;
            if (Str::startsWith($imagePath, ['http://', 'https://'])) {
                $contents = @file_get_contents($imagePath);
                if ($contents === false) {
                    $ch = curl_init($imagePath);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                    $contents = curl_exec($ch);
                    curl_close($ch);
                    if ($contents === false) {
                        return [
                            'status' => 'error',
                            'message' => 'Unable to fetch remote image',
                        ];
                    }
                }
                $ext = pathinfo(parse_url($imagePath, PHP_URL_PATH) ?? 'image.png', PATHINFO_EXTENSION) ?: 'png';
                $filename = 'bgzap_inputs/' . Str::uuid() . '.' . $ext;
                Storage::disk('public')->makeDirectory('bgzap_inputs');
                Storage::disk('public')->put($filename, $contents);
                $localPath = Storage::disk('public')->path($filename);
            } else {
                $localPath = $imagePath;
                if (!file_exists($localPath)) {
                    return [
                        'status' => 'error',
                        'message' => 'Image path not found',
                    ];
                }
            }

            Storage::disk('public')->makeDirectory('backgroundzap_outputs');
            $outPath = 'backgroundzap_outputs/' . (pathinfo($localPath, PATHINFO_FILENAME) ?: Str::uuid()) . '-removed.png';
            $this->processImageToTransparent($localPath, Storage::disk('public')->path($outPath));

            return [
                'status' => 'ok',
                'message' => 'Background removed (simple)',
                'url' => url(Storage::url($outPath)),
                'output_path' => $outPath,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => 'Processing failed',
            ];
        }
    }

    private function processImageToTransparent(string $inputPath, string $outputPath): void
    {
        // 1. Try AI-powered 'rembg' (Python) if installed
        $python = 'python'; // Assumed to be in PATH
        // rembg needs to be run as a module usually: python -m rembg i input output
        // Check if rembg is usable
        $cmd = "$python -m rembg i \"$inputPath\" \"$outputPath\" 2>&1";
        
        exec($cmd, $output, $resultCode);
        
        if ($resultCode === 0 && file_exists($outputPath)) {
             // Success with AI
             return;
        }

        // 2. Fallback to GD (Simple)
        if (!extension_loaded('gd')) {
            @copy($inputPath, $outputPath);
            return;
        }

        $info = getimagesize($inputPath);
        $mime = $info['mime'] ?? '';

        $img = null;
        switch ($mime) {
            case 'image/jpeg': $img = @imagecreatefromjpeg($inputPath); break;
            case 'image/png':  $img = @imagecreatefrompng($inputPath); break;
            case 'image/gif':  $img = @imagecreatefromgif($inputPath); break;
            case 'image/webp': $img = @imagecreatefromwebp($inputPath); break;
            default:
                $data = @file_get_contents($inputPath);
                if ($data) $img = @imagecreatefromstring($data);
        }

        if (!$img) {
            @copy($inputPath, $outputPath);
            return;
        }

        $width = imagesx($img);
        $height = imagesy($img);
        
        // Limit size for performance (max 800px width)
        if ($width > 800) {
            $newWidth = 800;
            $newHeight = intval($height * (800 / $width));
            $resized = imagecreatetruecolor($newWidth, $newHeight);
            imagecopyresampled($resized, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($img);
            $img = $resized;
            $width = $newWidth;
            $height = $newHeight;
        }

        // Create output image
        $newImg = imagecreatetruecolor($width, $height);
        imagesavealpha($newImg, true);
        $transparent = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
        imagefill($newImg, 0, 0, $transparent);

        // Sample top-left pixel as background
        $bgRgb = imagecolorat($img, 0, 0);
        $rBg = ($bgRgb >> 16) & 0xFF;
        $gBg = ($bgRgb >> 8) & 0xFF;
        $bBg = $bgRgb & 0xFF;

        $tolerance = 40;

        for ($x = 0; $x < $width; $x++) {
            for ($y = 0; $y < $height; $y++) {
                $rgb = imagecolorat($img, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;

                $diff = sqrt(pow($r - $rBg, 2) + pow($g - $gBg, 2) + pow($b - $bBg, 2));

                if ($diff > $tolerance) {
                    // Keep pixel
                    $col = imagecolorallocatealpha($newImg, $r, $g, $b, 0);
                    imagesetpixel($newImg, $x, $y, $col);
                }
            }
        }

        imagepng($newImg, $outputPath);
        imagedestroy($img);
        imagedestroy($newImg);
    }

    public function removeBackgroundUploaded(UploadedFile $file): array
    {
        try {
            Storage::disk('public')->makeDirectory('bgzap_inputs');
            $rel = 'bgzap_inputs/' . Str::uuid() . '.' . ($file->getClientOriginalExtension() ?: 'png');
            Storage::disk('public')->put($rel, file_get_contents($file->getRealPath()));
            $localPath = Storage::disk('public')->path($rel);

            Storage::disk('public')->makeDirectory('backgroundzap_outputs');
            $outPath = 'backgroundzap_outputs/' . (pathinfo($localPath, PATHINFO_FILENAME) ?: Str::uuid()) . '-removed.png';
            $this->processImageToTransparent($localPath, Storage::disk('public')->path($outPath));

            return [
                'status' => 'ok',
                'message' => 'Background removed from upload (simple)',
                'url' => url(Storage::url($outPath)),
                'output_path' => $outPath,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => 'Processing failed',
            ];
        }
    }
}
