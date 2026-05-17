<?php

namespace App\Repositories\Eloquent;

use App\Models\Album;
use App\Models\AlbumMedia;
use App\Repositories\Contracts\AlbumMediaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AlbumMediaRepository implements AlbumMediaRepositoryInterface
{
    public function getForAlbum(Album $album): Collection
    {
        return AlbumMedia::query()
            ->where('album_id', $album->id)
            ->orderBy('sort_order')
            ->get();
    }

    public function create(array $data): AlbumMedia
    {
        return AlbumMedia::create($data);
    }

    public function update(AlbumMedia $media, array $data): AlbumMedia
    {
        $media->update($data);

        return $media->fresh();
    }

    public function delete(AlbumMedia $media): bool
    {
        return (bool) $media->delete();
    }

    public function reorder(Album $album, array $orderedUuids): void
    {
        foreach ($orderedUuids as $index => $uuid) {
            AlbumMedia::query()
                ->where('album_id', $album->id)
                ->where('uuid', $uuid)
                ->update(['sort_order' => $index]);
        }
    }
}
