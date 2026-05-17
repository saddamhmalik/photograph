<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Album\StoreAlbumRequest;
use App\Http\Requests\Album\UpdateAlbumRequest;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use App\Services\AlbumService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    public function __construct(
        private readonly AlbumService $albumService,
        private readonly AlbumRepositoryInterface $albumRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $albums = $this->albumService->list($photographer, (int) $request->query('per_page', 15));

        return AlbumResource::collection($albums)->response();
    }

    public function store(StoreAlbumRequest $request): JsonResponse
    {
        $photographer = $request->attributes->get('photographer');
        $album = $this->albumService->create($photographer, $request->validated());

        return response()->json(['album' => new AlbumResource($album)], 201);
    }

    public function show(Request $request, string $album): JsonResponse
    {
        $album = $this->findOwnedAlbum($request, $album);

        return response()->json(['album' => new AlbumResource($album)]);
    }

    public function update(UpdateAlbumRequest $request, string $album): JsonResponse
    {
        $album = $this->findOwnedAlbum($request, $album);
        $album = $this->albumService->update($album, $request->validated());

        return response()->json(['album' => new AlbumResource($album)]);
    }

    public function destroy(Request $request, string $album): JsonResponse
    {
        $album = $this->findOwnedAlbum($request, $album);
        $this->albumService->delete($album);

        return response()->json(['message' => 'Album deleted.']);
    }

    private function findOwnedAlbum(Request $request, string $uuid): Album
    {
        $photographer = $request->attributes->get('photographer');
        $album = $this->albumRepository->findByUuid($uuid);

        if (! $album || $album->photographer_id !== $photographer->id) {
            abort(404, 'Album not found.');
        }

        return $album;
    }
}
