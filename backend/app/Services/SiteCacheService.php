<?php

namespace App\Services;

use App\Models\Photographer;
use Illuminate\Support\Facades\Cache;

class SiteCacheService
{
    public static function publicSiteKey(int $photographerId): string
    {
        return "photographer:{$photographerId}:public_site";
    }

    public static function portfolioVersionKey(int $photographerId): string
    {
        return "photographer:{$photographerId}:portfolio_version";
    }

    public static function portfolioKey(int $photographerId, ?string $category = null): string
    {
        $version = (int) Cache::get(self::portfolioVersionKey($photographerId), 1);
        $suffix = $category ? md5(strtolower($category)) : 'all';

        return "photographer:{$photographerId}:portfolio:v{$version}:{$suffix}";
    }

    public static function dashboardStatsKey(int $photographerId): string
    {
        return "photographer:{$photographerId}:dashboard_stats";
    }

    public function forgetForPhotographer(Photographer $photographer): void
    {
        Cache::forget(self::publicSiteKey($photographer->id));
        Cache::forget(self::dashboardStatsKey($photographer->id));
        $this->bumpPortfolioVersion($photographer);
    }

    private function bumpPortfolioVersion(Photographer $photographer): void
    {
        $key = self::portfolioVersionKey($photographer->id);
        $version = (int) Cache::get($key, 1);
        Cache::forever($key, $version + 1);
    }
}
