<?php

namespace App\Services;

use App\Models\AnalyticsEvent;
use App\Models\Photographer;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    public function track(Photographer $photographer, string $eventType, ?string $resourceType = null, ?int $resourceId = null, array $metadata = []): void
    {
        AnalyticsEvent::create([
            'photographer_id' => $photographer->id,
            'event_type' => $eventType,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'session_id' => $metadata['session_id'] ?? null,
            'ip_hash' => isset($metadata['ip']) ? hash('sha256', $metadata['ip']) : null,
            'user_agent' => $metadata['user_agent'] ?? null,
            'referrer' => $metadata['referrer'] ?? null,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);

        Cache::forget(SiteCacheService::dashboardStatsKey($photographer->id));
    }

    public function getDashboardStats(Photographer $photographer): array
    {
        return Cache::remember(
            SiteCacheService::dashboardStatsKey($photographer->id),
            300,
            fn () => [
                'total_albums' => $photographer->albums()->count(),
                'total_views' => $photographer->albums()->sum('view_count'),
                'total_inquiries' => $photographer->inquiries()->count(),
                'new_inquiries' => $photographer->inquiries()->where('status', 'new')->count(),
                'storage_used_bytes' => $photographer->storage_used_bytes,
                'storage_limit_bytes' => $photographer->storage_limit_bytes,
                'views_last_30_days' => AnalyticsEvent::query()
                    ->where('photographer_id', $photographer->id)
                    ->where('event_type', 'album_view')
                    ->where('created_at', '>=', now()->subDays(30))
                    ->count(),
            ]
        );
    }
}
