<?php

namespace App\Services;

use App\Models\Photographer;
use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TestimonialService
{
    public function __construct(
        private readonly TestimonialRepositoryInterface $testimonialRepository
    ) {}

    public function list(Photographer $photographer): Collection
    {
        return $this->testimonialRepository->listForPhotographer($photographer);
    }

    public function create(Photographer $photographer, array $data): Testimonial
    {
        return $this->testimonialRepository->create([
            'photographer_id' => $photographer->id,
            'client_name' => $data['client_name'],
            'event_type' => $data['event_type'] ?? null,
            'content' => $data['content'],
            'rating' => $data['rating'] ?? 5,
            'is_featured' => $data['is_featured'] ?? true,
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);
    }

    public function update(Testimonial $testimonial, array $data): Testimonial
    {
        return $this->testimonialRepository->update($testimonial, $data);
    }

    public function delete(Testimonial $testimonial): bool
    {
        return $this->testimonialRepository->delete($testimonial);
    }
}
