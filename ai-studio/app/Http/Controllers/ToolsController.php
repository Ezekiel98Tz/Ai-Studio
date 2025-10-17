<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class ToolsController extends Controller
{
    public function index(): JsonResponse
    {
        $tools = config('tools', []);
        return response()->json([
            'tools' => $tools,
        ]);
    }
}