<?php

namespace App\Repositories\Contracts;

use App\Models\Photographer;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Collection;

interface TestimonialRepositoryInterface
{
    public function listForPhotographer(Photographer $photographer): Collection;

    public function findByUuid(string $uuid): ?Testimonial;

    public function create(array $data): Testimonial;

    public function update(Testimonial $testimonial, array $data): Testimonial;

    public function delete(Testimonial $testimonial): bool;
}
