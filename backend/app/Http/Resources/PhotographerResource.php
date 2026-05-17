<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhotographerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'business_name' => $this->business_name,
            'tagline' => $this->tagline,
            'bio' => $this->bio,
            'logo_path' => $this->logo_path,
            'hero_video_url' => $this->hero_video_url,
            'hero_image_path' => $this->hero_image_path,
            'whatsapp_number' => $this->whatsapp_number,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'social_links' => $this->social_links,
        ];
    }
}
