<?php

namespace App\Repositories\Eloquent;

use App\Models\Photographer;
use App\Models\WebsiteSetting;
use App\Repositories\Contracts\WebsiteSettingRepositoryInterface;

class WebsiteSettingRepository implements WebsiteSettingRepositoryInterface
{
    public function forPhotographer(Photographer $photographer): WebsiteSetting
    {
        return WebsiteSetting::query()->firstOrCreate(
            ['photographer_id' => $photographer->id],
            [
                'branding' => ['primary_color' => '#c9a962', 'accent_color' => '#1a1a1a'],
                'seo' => ['title' => $photographer->business_name, 'description' => $photographer->tagline],
            ]
        );
    }

    public function update(WebsiteSetting $setting, array $data): WebsiteSetting
    {
        $setting->update($data);

        return $setting->fresh();
    }
}
