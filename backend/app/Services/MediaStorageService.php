<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorageService
{
    public function __construct(
        private readonly string $disk = 'r2'
    ) {}

    public function upload(UploadedFile $file, string $directory): array
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid().'.'.$extension;
        $path = trim($directory, '/').'/'.$filename;

        Storage::disk($this->disk)->put($path, $file->get(), 'public');

        return [
            'path' => $path,
            'url' => $this->url($path),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ];
    }

    public function delete(string $path): bool
    {
        return Storage::disk($this->disk)->delete($path);
    }

    public function url(string $path): string
    {
        return Storage::disk($this->disk)->url($path);
    }

}
