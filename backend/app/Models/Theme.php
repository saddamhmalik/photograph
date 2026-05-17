<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Theme extends Model
{
    use HasUuid;

    protected $fillable = ['name', 'slug', 'palette', 'typography', 'is_premium', 'is_active'];

    protected function casts(): array
    {
        return [
            'palette' => 'array',
            'typography' => 'array',
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function photographers(): HasMany
    {
        return $this->hasMany(Photographer::class);
    }
}
