<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use App\Models\Photographer;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function listForPhotographer(Photographer $photographer): Collection;

    public function findByUuid(string $uuid): ?Category;

    public function findByUuidForPhotographer(Photographer $photographer, string $uuid): ?Category;

    public function create(array $data): Category;

    public function update(Category $category, array $data): Category;

    public function delete(Category $category): bool;
}
