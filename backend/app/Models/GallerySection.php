<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GallerySection extends Model
{
    use HasUuid;

    protected $fillable = [
        'photographer_id', 'page', 'type', 'title', 'content', 'settings',
        'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'settings' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }
}
