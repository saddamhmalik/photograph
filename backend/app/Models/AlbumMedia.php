<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumMedia extends Model
{
    use HasUuid;

    protected $table = 'album_media';

    protected $fillable = [
        'album_id', 'type', 'path', 'thumbnail_path', 'webp_path', 'blur_hash',
        'width', 'height', 'file_size', 'mime_type', 'duration_seconds',
        'alt_text', 'caption', 'sort_order', 'is_cover', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}
