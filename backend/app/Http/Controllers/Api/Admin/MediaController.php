<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Models\Album;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(
        private readonly AlbumRepositoryInterface $albumRepository,
        private readonly MediaService $mediaService
    ) {}

    public function store(StoreMediaRequest $request, string $albumUuid): JsonResponse
    {
        $album = $this->findOwnedAlbum($request, $albumUuid);
        $photographer = $request->attributes->get('photographer');
        $uploaded = [];

        $files = $request->file('files') ?? ($request->file('file') ? [$request->file('file')] : []);

        foreach ($files as $file) {
            $media = $this->mediaService->store(
                $album,
                $photographer,
                $file,
                $request->input('alt_text'),
                $request->input('caption')
            );
            $uploaded[] = $media->toArray();
        }

        return response()->json(['media' => $uploaded], 201);
    }

    public function reorder(Request $request, string $albumUuid): JsonResponse
    {
        $request->validate(['order' => ['required', 'array'], 'order.*' => ['uuid']]);

        $album = $this->findOwnedAlbum($request, $albumUuid);
        $photographer = $request->attributes->get('photographer');
        $this->mediaService->reorder($album, $photographer, $request->input('order'));

        return response()->json(['message' => 'Media reordered.']);
    }

    public function destroy(Request $request, string $albumUuid, string $mediaUuid): JsonResponse
    {
        $album = $this->findOwnedAlbum($request, $albumUuid);
        $photographer = $request->attributes->get('photographer');
        $media = $album->media()->where('uuid', $mediaUuid)->firstOrFail();

        $this->mediaService->delete($album, $media, $photographer);

        return response()->json(['message' => 'Media deleted.']);
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
