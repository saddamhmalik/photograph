<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PhotographerResource;
use App\Services\AlbumService;
use App\Services\CategoryService;
use App\Services\PublicSiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicSiteController extends Controller
{
    public function __construct(
        private readonly PublicSiteService $publicSiteService,
        private readonly AlbumService $albumService,
        private readonly CategoryService $categoryService
    ) {}

    public function show(): JsonResponse
    {
        $data = $this->publicSiteService->getSiteData();

        return response()->json([
            'photographer' => new PhotographerResource($data['photographer']),
            'featured_albums' => AlbumResource::collection($data['featured_albums']),
            'gallery_albums' => AlbumResource::collection($data['gallery_albums']),
            'testimonials' => $data['testimonials'],
            'settings' => $data['settings'],
            'gallery_sections' => $data['gallery_sections'],
        ]);
    }

    public function categories(): JsonResponse
    {
        $photographer = $this->publicSiteService->getPhotographer();

        return response()->json([
            'categories' => CategoryResource::collection(
                $this->categoryService->list($photographer)
            ),
        ]);
    }

    public function portfolio(Request $request): JsonResponse
    {
        $photographer = $this->publicSiteService->getPhotographer();
        $albums = $this->publicSiteService->getPortfolio($request->query('category'));

        return response()->json([
            'categories' => CategoryResource::collection(
                $this->categoryService->list($photographer)
            ),
            'albums' => AlbumResource::collection($albums),
        ]);
    }

    public function album(string $albumSlug, Request $request): JsonResponse
    {
        $photographer = $this->publicSiteService->getPhotographer();
        $album = $this->albumService->getPublicAlbum(
            $photographer,
            $albumSlug,
            $request->input('password')
        );

        return response()->json([
            'album' => new AlbumResource($album),
        ]);
    }
}
