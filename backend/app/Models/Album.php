<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'photographer_id', 'category_id', 'title', 'slug', 'description',
        'cover_path', 'cover_thumbnail_path', 'event_date', 'location', 'layout',
        'is_featured', 'is_public', 'is_password_protected', 'password_hash',
        'share_token', 'sort_order', 'view_count', 'metadata', 'published_at',
    ];

    protected $hidden = ['password_hash'];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'is_featured' => 'boolean',
            'is_public' => 'boolean',
            'is_password_protected' => 'boolean',
            'metadata' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(AlbumMedia::class)->orderBy('sort_order');
    }
}
