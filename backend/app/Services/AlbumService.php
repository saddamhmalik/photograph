<?php

namespace App\Services;

use App\Models\Album;
use App\Models\Photographer;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AlbumService
{
    public function __construct(
        private readonly AlbumRepositoryInterface $albumRepository,
        private readonly AnalyticsService $analyticsService,
        private readonly SiteCacheService $siteCache,
        private readonly CategoryService $categoryService
    ) {}

    public function list(Photographer $photographer, int $perPage = 15)
    {
        return $this->albumRepository->paginateForPhotographer($photographer, $perPage);
    }

    public function getPublicAlbum(Photographer $photographer, string $slug, ?string $password = null): Album
    {
        $album = $this->albumRepository->findBySlug($photographer, $slug);

        if (! $album || ! $album->is_public) {
            throw ValidationException::withMessages(['album' => ['Album not found.']]);
        }

        if ($album->is_password_protected) {
            if (! $password || ! Hash::check($password, $album->password_hash)) {
                throw ValidationException::withMessages(['password' => ['Invalid album password.']]);
            }
        }

        $this->albumRepository->incrementViews($album);
        $this->analyticsService->track($photographer, 'album_view', 'album', $album->id);

        return $album;
    }

    public function create(Photographer $photographer, array $data): Album
    {
        $slug = $this->ensureUniqueSlug($photographer, $data['slug'] ?? Str::slug($data['title']));
        $data = $this->applyCategory($photographer, $data);

        $album = $this->albumRepository->create([
            'photographer_id' => $photographer->id,
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'event_date' => $data['event_date'] ?? null,
            'location' => $data['location'] ?? null,
            'layout' => $data['layout'] ?? 'masonry',
            'is_featured' => $data['is_featured'] ?? false,
            'is_public' => $data['is_public'] ?? true,
            'is_password_protected' => $data['is_password_protected'] ?? false,
            'password_hash' => isset($data['password']) ? Hash::make($data['password']) : null,
            'share_token' => Str::random(32),
            'published_at' => ($data['is_public'] ?? true) ? now() : null,
        ]);

        $this->siteCache->forgetForPhotographer($photographer);

        return $album;
    }

    public function update(Album $album, array $data): Album
    {
        $data = $this->applyCategory($album->photographer, $data);

        $removePassword = ! empty($data['remove_password'])
            || (array_key_exists('is_password_protected', $data) && ! $data['is_password_protected']);

        if ($removePassword) {
            $data['is_password_protected'] = false;
            $data['password_hash'] = null;
        }

        unset($data['remove_password']);

        if (isset($data['password']) && $data['password']) {
            $data['password_hash'] = Hash::make($data['password']);
            $data['is_password_protected'] = true;
            unset($data['password']);
        }

        if (isset($data['slug'])) {
            $data['slug'] = $this->ensureUniqueSlug($album->photographer, $data['slug'], $album->id);
        }

        $updated = $this->albumRepository->update($album, $data);
        $this->siteCache->forgetForPhotographer($album->photographer);

        return $updated;
    }

    public function delete(Album $album): bool
    {
        $photographer = $album->photographer;
        $deleted = $this->albumRepository->delete($album);
        $this->siteCache->forgetForPhotographer($photographer);

        return $deleted;
    }

    private function applyCategory(Photographer $photographer, array $data): array
    {
        if (array_key_exists('category_uuid', $data)) {
            $data['category_id'] = $this->categoryService->resolveCategoryId(
                $photographer,
                $data['category_uuid']
            );
            unset($data['category_uuid']);
        }

        return $data;
    }

    private function ensureUniqueSlug(Photographer $photographer, string $slug, ?int $excludeId = null): string
    {
        $base = $slug;
        $counter = 1;

        while (
            Album::where('photographer_id', $photographer->id)
                ->where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}
