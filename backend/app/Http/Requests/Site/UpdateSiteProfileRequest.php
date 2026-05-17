<?php

namespace App\Http\Requests\Site;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name' => ['sometimes', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string'],
            'hero_image_path' => ['nullable', 'string', 'max:2048'],
            'hero_video_url' => ['nullable', 'string', 'max:2048'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'social_links' => ['nullable', 'array'],
            'social_links.instagram' => ['nullable', 'string', 'max:500'],
            'social_links.youtube' => ['nullable', 'string', 'max:500'],
            'social_links.facebook' => ['nullable', 'string', 'max:500'],
        ];
    }
}
