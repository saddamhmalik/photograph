<?php

namespace App\Repositories\Eloquent;

use App\Models\Photographer;
use App\Repositories\Contracts\PhotographerRepositoryInterface;

class PhotographerRepository implements PhotographerRepositoryInterface
{
    public function current(): ?Photographer
    {
        $query = Photographer::query()
            ->where('is_active', true)
            ->with(['websiteSettings', 'theme']);

        if ($id = config('site.photographer_id')) {
            return $query->where('id', $id)->first();
        }

        return $query->orderBy('id')->first();
    }

    public function findByUserId(int $userId): ?Photographer
    {
        return Photographer::query()
            ->where('user_id', $userId)
            ->with(['websiteSettings', 'subscription'])
            ->first();
    }

    public function create(array $data): Photographer
    {
        return Photographer::create($data);
    }

    public function update(Photographer $photographer, array $data): Photographer
    {
        $photographer->update($data);

        return $photographer->fresh();
    }
}
