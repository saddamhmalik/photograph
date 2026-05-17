<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photographer extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'user_id', 'theme_id', 'business_name', 'slug', 'tagline', 'bio',
        'logo_path', 'hero_video_url', 'hero_image_path', 'custom_domain',
        'whatsapp_number', 'city', 'state', 'country', 'social_links',
        'storage_used_bytes', 'storage_limit_bytes', 'is_active', 'onboarded_at',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'is_active' => 'boolean',
            'onboarded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    public function albums(): HasMany
    {
        return $this->hasMany(Album::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function websiteSettings(): HasOne
    {
        return $this->hasOne(WebsiteSetting::class);
    }

    public function gallerySections(): HasMany
    {
        return $this->hasMany(GallerySection::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function analyticsEvents(): HasMany
    {
        return $this->hasMany(AnalyticsEvent::class);
    }
}
