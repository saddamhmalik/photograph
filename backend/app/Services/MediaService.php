<?php

namespace App\Services;

use App\Models\Album;
use App\Models\AlbumMedia;
use App\Models\Photographer;
use App\Repositories\Contracts\AlbumMediaRepositoryInterface;
use Illuminate\Http\UploadedFile;

class MediaService
{
    public function __construct(
        private readonly AlbumMediaRepositoryInterface $mediaRepository,
        private readonly MediaStorageService $mediaStorage,
        private readonly SiteCacheService $siteCache
    ) {}

    public function store(
        Album $album,
        Photographer $photographer,
        UploadedFile $file,
        ?string $altText = null,
        ?string $caption = null
    ): AlbumMedia {
        $upload = $this->mediaStorage->upload(
            $file,
            "photographers/{$photographer->uuid}/albums/{$album->uuid}"
        );

        $type = str_starts_with($upload['mime_type'], 'video/') ? 'video' : 'image';
        $sortOrder = $album->media()->count();

        $media = $this->mediaRepository->create([
            'album_id' => $album->id,
            'type' => $type,
            'path' => $upload['path'],
            'mime_type' => $upload['mime_type'],
            'file_size' => $upload['file_size'],
            'alt_text' => $altText,
            'caption' => $caption,
            'sort_order' => $sortOrder,
            'is_cover' => $sortOrder === 0,
        ]);

        if (! $album->cover_path) {
            $album->update(['cover_path' => $upload['path']]);
        }

        $photographer->increment('storage_used_bytes', $upload['file_size']);
        $this->siteCache->forgetForPhotographer($photographer);

        return $media;
    }

    public function delete(Album $album, AlbumMedia $media, Photographer $photographer): void
    {
        if ($media->path === $album->cover_path) {
            $nextCover = $album->media()
                ->where('id', '!=', $media->id)
                ->where('type', 'image')
                ->orderBy('sort_order')
                ->value('path');
            $album->update(['cover_path' => $nextCover]);
        }

        $this->mediaStorage->delete($media->path);
        if ($media->file_size) {
            $photographer->decrement('storage_used_bytes', $media->file_size);
        }
        $this->mediaRepository->delete($media);
        $this->siteCache->forgetForPhotographer($photographer);
    }

    public function reorder(Album $album, Photographer $photographer, array $order): void
    {
        $this->mediaRepository->reorder($album, $order);
        $this->siteCache->forgetForPhotographer($photographer);
    }
}
