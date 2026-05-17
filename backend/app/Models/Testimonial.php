<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasUuid;

    protected $fillable = [
        'photographer_id', 'client_name', 'event_type', 'content', 'rating',
        'avatar_path', 'is_featured', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }
}
