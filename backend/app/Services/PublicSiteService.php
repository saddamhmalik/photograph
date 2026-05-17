<?php

namespace App\Services;

use App\Models\Photographer;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use App\Repositories\Contracts\PhotographerRepositoryInterface;
use App\Repositories\Contracts\WebsiteSettingRepositoryInterface;
use App\Support\HomepageSections;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class PublicSiteService
{
    public function __construct(
        private readonly PhotographerRepositoryInterface $photographerRepository,
        private readonly AlbumRepositoryInterface $albumRepository,
        private readonly WebsiteSettingRepositoryInterface $websiteSettingRepository,
        private readonly SiteCacheService $siteCache
    ) {}

    public function getPhotographer(): Photographer
    {
        $photographer = $this->photographerRepository->current();

        if (! $photographer) {
            throw ValidationException::withMessages([
                'site' => ['No photographer configured for this deployment.'],
            ]);
        }

        return $photographer;
    }

    public function getSiteData(): array
    {
        $photographer = $this->getPhotographer();

        return Cache::remember(
            SiteCacheService::publicSiteKey($photographer->id),
            3600,
            fn () => $this->buildSiteData($photographer)
        );
    }

    public function getPortfolio(?string $category = null)
    {
        $photographer = $this->getPhotographer();

        return Cache::remember(
            SiteCacheService::portfolioKey($photographer->id, $category),
            3600,
            fn () => $this->albumRepository->getPublic($photographer, $category)
        );
    }

    private function buildSiteData(Photographer $photographer): array
    {
        $websiteSettings = $this->websiteSettingRepository->forPhotographer($photographer);

        return [
            'photographer' => $photographer,
            'featured_albums' => $this->albumRepository->getFeatured($photographer),
            'gallery_albums' => $this->albumRepository->getPublicWithMedia($photographer),
            'testimonials' => $photographer->testimonials()
                ->where('is_active', true)
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->limit(6)
                ->get(),
            'settings' => [
                'branding' => $websiteSettings->branding,
                'seo' => $websiteSettings->seo,
                'services' => $websiteSettings->services ?? [],
                'contact' => $websiteSettings->contact,
                'homepage_sections' => HomepageSections::merge($websiteSettings->homepage_sections),
            ],
            'gallery_sections' => $photographer->gallerySections()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
        ];
    }
}
