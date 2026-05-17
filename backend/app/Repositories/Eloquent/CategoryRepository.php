<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Models\Photographer;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function listForPhotographer(Photographer $photographer): Collection
    {
        return Category::query()
            ->where('photographer_id', $photographer->id)
            ->withCount('albums')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findByUuid(string $uuid): ?Category
    {
        return Category::query()->where('uuid', $uuid)->first();
    }

    public function findByUuidForPhotographer(Photographer $photographer, string $uuid): ?Category
    {
        return Category::query()
            ->where('photographer_id', $photographer->id)
            ->where('uuid', $uuid)
            ->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(Category $category): bool
    {
        return (bool) $category->delete();
    }
}
