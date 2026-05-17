<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inquiry\StoreInquiryRequest;
use App\Services\InquiryService;
use App\Services\PublicSiteService;
use Illuminate\Http\JsonResponse;

class InquiryController extends Controller
{
    public function __construct(
        private readonly PublicSiteService $publicSiteService,
        private readonly InquiryService $inquiryService
    ) {}

    public function store(StoreInquiryRequest $request): JsonResponse
    {
        $photographer = $this->publicSiteService->getPhotographer();
        $inquiry = $this->inquiryService->submit($photographer, $request->validated());

        return response()->json([
            'message' => 'Thank you! We will get back to you soon.',
            'inquiry' => ['uuid' => $inquiry->uuid],
        ], 201);
    }
}
