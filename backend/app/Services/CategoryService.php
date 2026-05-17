<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Photographer;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly SiteCacheService $siteCache
    ) {}

    public function list(Photographer $photographer): Collection
    {
        return $this->categoryRepository->listForPhotographer($photographer);
    }

    public function create(Photographer $photographer, array $data): Category
    {
        $slug = $this->ensureUniqueSlug($photographer, $data['slug'] ?? Str::slug($data['name']));

        $category = $this->categoryRepository->create([
            'photographer_id' => $photographer->id,
            'name' => $data['name'],
            'slug' => $slug,
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($photographer),
        ]);

        $this->siteCache->forgetForPhotographer($photographer);

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if (isset($data['slug'])) {
            $data['slug'] = $this->ensureUniqueSlug(
                $category->photographer,
                $data['slug'],
                $category->id
            );
        }

        $updated = $this->categoryRepository->update($category, $data);
        $this->siteCache->forgetForPhotographer($category->photographer);

        return $updated;
    }

    public function delete(Category $category): bool
    {
        $photographer = $category->photographer;
        $deleted = $this->categoryRepository->delete($category);
        $this->siteCache->forgetForPhotographer($photographer);

        return $deleted;
    }

    public function resolveCategoryId(Photographer $photographer, ?string $categoryUuid): ?int
    {
        if ($categoryUuid === null || $categoryUuid === '') {
            return null;
        }

        $category = $this->categoryRepository->findByUuidForPhotographer($photographer, $categoryUuid);

        if (! $category) {
            throw ValidationException::withMessages([
                'category_uuid' => ['Selected category was not found.'],
            ]);
        }

        return $category->id;
    }

    private function nextSortOrder(Photographer $photographer): int
    {
        $max = $photographer->categories()->max('sort_order');

        return ($max ?? -1) + 1;
    }

    private function ensureUniqueSlug(Photographer $photographer, string $slug, ?int $excludeId = null): string
    {
        $base = $slug;
        $counter = 1;

        while (
            Category::where('photographer_id', $photographer->id)
                ->where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}
