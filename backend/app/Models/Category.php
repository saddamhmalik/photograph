<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasUuid;

    protected $fillable = ['photographer_id', 'name', 'slug', 'sort_order'];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }

    public function albums(): HasMany
    {
        return $this->hasMany(Album::class);
    }
}
