<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly AnalyticsService $analyticsService) {}

    public function index(Request $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');

        return response()->json([
            'stats' => $this->analyticsService->getDashboardStats($photographer),
        ]);
    }
}
