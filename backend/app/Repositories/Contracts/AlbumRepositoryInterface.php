<?php

namespace App\Repositories\Contracts;

use App\Models\Album;
use App\Models\Photographer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface AlbumRepositoryInterface
{
    public function paginateForPhotographer(Photographer $photographer, int $perPage = 15): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?Album;

    public function findBySlug(Photographer $photographer, string $slug): ?Album;

    public function getFeatured(Photographer $photographer, int $limit = 6): Collection;

    public function getPublic(Photographer $photographer, ?string $categorySlug = null): Collection;

    public function getPublicWithMedia(Photographer $photographer, int $mediaPerAlbum = 16): Collection;

    public function create(array $data): Album;

    public function update(Album $album, array $data): Album;

    public function delete(Album $album): bool;

    public function incrementViews(Album $album): void;
}
