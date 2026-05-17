<?php

namespace App\Repositories\Eloquent;

use App\Models\Photographer;
use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TestimonialRepository implements TestimonialRepositoryInterface
{
    public function listForPhotographer(Photographer $photographer): Collection
    {
        return Testimonial::query()
            ->where('photographer_id', $photographer->id)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();
    }

    public function findByUuid(string $uuid): ?Testimonial
    {
        return Testimonial::query()->where('uuid', $uuid)->first();
    }

    public function create(array $data): Testimonial
    {
        return Testimonial::create($data);
    }

    public function update(Testimonial $testimonial, array $data): Testimonial
    {
        $testimonial->update($data);

        return $testimonial->fresh();
    }

    public function delete(Testimonial $testimonial): bool
    {
        return (bool) $testimonial->delete();
    }
}
