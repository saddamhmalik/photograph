<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumMediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'type' => $this->type,
            'path' => $this->path,
            'thumbnail_path' => $this->thumbnail_path,
            'webp_path' => $this->webp_path,
            'blur_hash' => $this->blur_hash,
            'width' => $this->width,
            'height' => $this->height,
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'sort_order' => $this->sort_order,
            'is_cover' => $this->is_cover,
        ];
    }
}
