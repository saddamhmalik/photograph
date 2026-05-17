<?php

namespace App\Http\Requests\Album;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAlbumRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_uuid' => ['nullable', 'uuid'],
            'event_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'layout' => ['nullable', 'in:masonry,grid,slideshow,cinematic'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_public' => ['sometimes', 'boolean'],
            'is_password_protected' => ['sometimes', 'boolean'],
            'remove_password' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:4'],
        ];
    }
}
