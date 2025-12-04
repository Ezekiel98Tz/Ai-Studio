<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    public function dbHealth(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'status' => 'ok',
                'driver' => DB::connection()->getDriverName(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'DB connection failed',
            ], 500);
        }
    }
}

