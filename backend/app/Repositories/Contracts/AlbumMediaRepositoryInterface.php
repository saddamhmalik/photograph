<?php

namespace App\Repositories\Contracts;

use App\Models\Album;
use App\Models\AlbumMedia;
use Illuminate\Database\Eloquent\Collection;

interface AlbumMediaRepositoryInterface
{
    public function getForAlbum(Album $album): Collection;

    public function create(array $data): AlbumMedia;

    public function update(AlbumMedia $media, array $data): AlbumMedia;

    public function delete(AlbumMedia $media): bool;

    public function reorder(Album $album, array $orderedUuids): void;
}
