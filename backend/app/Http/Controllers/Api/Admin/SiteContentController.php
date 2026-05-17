<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Site\UpdateHomepageRequest;
use App\Http\Requests\Site\UpdateSiteProfileRequest;
use App\Http\Resources\PhotographerResource;
use App\Services\SiteContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    public function __construct(
        private readonly SiteContentService $siteContentService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $content = $this->siteContentService->getAdminContent($photographer);

        return response()->json([
            'photographer' => new PhotographerResource($content['photographer']),
            'settings' => $content['settings'],
        ]);
    }

    public function updateProfile(UpdateSiteProfileRequest $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $photographer = $this->siteContentService->updateProfile(
            $photographer,
            $request->validated()
        );

        return response()->json([
            'photographer' => new PhotographerResource($photographer),
        ]);
    }

    public function updateHomepage(UpdateHomepageRequest $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $settings = $this->siteContentService->updateHomepage(
            $photographer,
            $request->validated()
        );

        return response()->json(['settings' => $settings]);
    }
}
