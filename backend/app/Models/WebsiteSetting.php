<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteSetting extends Model
{
    protected $fillable = [
        'photographer_id', 'homepage_sections', 'branding', 'typography',
        'seo', 'contact', 'integrations', 'services', 'instagram_feed',
    ];

    protected function casts(): array
    {
        return [
            'homepage_sections' => 'array',
            'branding' => 'array',
            'typography' => 'array',
            'seo' => 'array',
            'contact' => 'array',
            'integrations' => 'array',
            'services' => 'array',
            'instagram_feed' => 'array',
        ];
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(Photographer::class);
    }
}
