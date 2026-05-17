<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_path' => $this->cover_path,
            'cover_thumbnail_path' => $this->cover_thumbnail_path,
            'event_date' => $this->event_date?->toDateString(),
            'location' => $this->location,
            'layout' => $this->layout,
            'is_featured' => $this->is_featured,
            'is_public' => $this->is_public,
            'is_password_protected' => $this->is_password_protected,
            'view_count' => $this->view_count,
            'category' => $this->whenLoaded('category', fn () => [
                'uuid' => $this->category?->uuid,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'media' => AlbumMediaResource::collection($this->whenLoaded('media')),
            'media_count' => $this->when(isset($this->media_count), $this->media_count),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
