<?php

namespace App\Repositories\Eloquent;

use App\Models\Album;
use App\Models\Photographer;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AlbumRepository implements AlbumRepositoryInterface
{
    public function paginateForPhotographer(Photographer $photographer, int $perPage = 15): LengthAwarePaginator
    {
        return Album::query()
            ->where('photographer_id', $photographer->id)
            ->with(['category', 'media' => fn ($q) => $q->limit(1)])
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findByUuid(string $uuid): ?Album
    {
        return Album::query()->where('uuid', $uuid)->with(['media', 'category'])->first();
    }

    public function findBySlug(Photographer $photographer, string $slug): ?Album
    {
        return Album::query()
            ->where('photographer_id', $photographer->id)
            ->where('slug', $slug)
            ->with(['media', 'category'])
            ->first();
    }

    public function getFeatured(Photographer $photographer, int $limit = 6): Collection
    {
        return Album::query()
            ->where('photographer_id', $photographer->id)
            ->where('is_featured', true)
            ->where('is_public', true)
            ->with(['category', 'media' => fn ($q) => $q->where('type', 'image')->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
    }

    public function getPublicWithMedia(Photographer $photographer, int $mediaPerAlbum = 16): Collection
    {
        return Album::query()
            ->where('photographer_id', $photographer->id)
            ->where('is_public', true)
            ->with([
                'category',
                'media' => fn ($q) => $q->where('type', 'image')->orderBy('sort_order')->limit($mediaPerAlbum),
            ])
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getPublic(Photographer $photographer, ?string $categorySlug = null): Collection
    {
        $query = Album::query()
            ->where('photographer_id', $photographer->id)
            ->where('is_public', true)
            ->with('category')
            ->orderBy('sort_order');

        if ($categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        return $query->get();
    }

    public function create(array $data): Album
    {
        return Album::create($data);
    }

    public function update(Album $album, array $data): Album
    {
        $album->update($data);

        return $album->fresh();
    }

    public function delete(Album $album): bool
    {
        return (bool) $album->delete();
    }

    public function incrementViews(Album $album): void
    {
        $album->increment('view_count');
    }
}
