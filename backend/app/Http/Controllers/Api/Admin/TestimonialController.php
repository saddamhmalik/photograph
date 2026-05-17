<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Testimonial\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct(
        private readonly TestimonialService $testimonialService,
        private readonly TestimonialRepositoryInterface $testimonialRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');

        return response()->json([
            'testimonials' => $this->testimonialService->list($photographer),
        ]);
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $testimonial = $this->testimonialService->create($photographer, $request->validated());

        return response()->json(['testimonial' => $testimonial], 201);
    }

    public function update(UpdateTestimonialRequest $request, string $testimonial): JsonResponse
    {
        $item = $this->findOwned($request, $testimonial);
        $item = $this->testimonialService->update($item, $request->validated());

        return response()->json(['testimonial' => $item]);
    }

    public function destroy(Request $request, string $testimonial): JsonResponse
    {
        $item = $this->findOwned($request, $testimonial);
        $this->testimonialService->delete($item);

        return response()->json(['message' => 'Testimonial deleted.']);
    }

    private function findOwned(Request $request, string $uuid): Testimonial
    {
        $photographer = $request->attributes->get('photographer');
        $item = $this->testimonialRepository->findByUuid($uuid);

        if (! $item || $item->photographer_id !== $photographer->id) {
            abort(404, 'Testimonial not found.');
        }

        return $item;
    }
}
