<?php

namespace App\Repositories\Contracts;

use App\Models\Photographer;
use App\Models\WebsiteSetting;

interface WebsiteSettingRepositoryInterface
{
    public function forPhotographer(Photographer $photographer): WebsiteSetting;

    public function update(WebsiteSetting $setting, array $data): WebsiteSetting;
}
