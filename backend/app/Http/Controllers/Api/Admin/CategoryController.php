<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $categories = $this->categoryService->list($photographer);

        return response()->json([
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $category = $this->categoryService->create($photographer, $request->validated());

        return response()->json(['category' => new CategoryResource($category)], 201);
    }

    public function update(UpdateCategoryRequest $request, string $category): JsonResponse
    {
        $item = $this->findOwned($request, $category);
        $item = $this->categoryService->update($item, $request->validated());

        return response()->json(['category' => new CategoryResource($item)]);
    }

    public function destroy(Request $request, string $category): JsonResponse
    {
        $item = $this->findOwned($request, $category);
        $this->categoryService->delete($item);

        return response()->json(['message' => 'Category deleted.']);
    }

    private function findOwned(Request $request, string $uuid): Category
    {
        $photographer = $request->attributes->get('photographer');
        $item = $this->categoryRepository->findByUuid($uuid);

        if (! $item || $item->photographer_id !== $photographer->id) {
            abort(404, 'Category not found.');
        }

        return $item;
    }
}
