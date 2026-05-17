<?php

namespace App\Http\Requests\Site;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'homepage_sections' => ['sometimes', 'array'],
            'homepage_sections.hero' => ['sometimes', 'array'],
            'homepage_sections.hero.primary_cta' => ['nullable', 'string', 'max:100'],
            'homepage_sections.hero.secondary_cta' => ['nullable', 'string', 'max:100'],
            'homepage_sections.featured' => ['sometimes', 'array'],
            'homepage_sections.featured.label' => ['nullable', 'string', 'max:100'],
            'homepage_sections.featured.title' => ['nullable', 'string', 'max:255'],
            'homepage_sections.about' => ['sometimes', 'array'],
            'homepage_sections.about.label' => ['nullable', 'string', 'max:100'],
            'homepage_sections.about.enabled' => ['sometimes', 'boolean'],
            'homepage_sections.services' => ['sometimes', 'array'],
            'homepage_sections.services.label' => ['nullable', 'string', 'max:100'],
            'homepage_sections.services.title' => ['nullable', 'string', 'max:255'],
            'homepage_sections.testimonials' => ['sometimes', 'array'],
            'homepage_sections.testimonials.label' => ['nullable', 'string', 'max:100'],
            'homepage_sections.testimonials.title' => ['nullable', 'string', 'max:255'],
            'homepage_sections.cta' => ['sometimes', 'array'],
            'homepage_sections.cta.title' => ['nullable', 'string', 'max:255'],
            'homepage_sections.cta.subtitle' => ['nullable', 'string', 'max:500'],
            'homepage_sections.cta.primary_button' => ['nullable', 'string', 'max:100'],
            'homepage_sections.cta.secondary_button' => ['nullable', 'string', 'max:100'],
            'services' => ['sometimes', 'array'],
            'services.*.name' => ['required_with:services', 'string', 'max:255'],
            'services.*.description' => ['nullable', 'string', 'max:500'],
            'seo' => ['sometimes', 'array'],
            'seo.title' => ['nullable', 'string', 'max:255'],
            'seo.description' => ['nullable', 'string', 'max:500'],
            'seo.keywords' => ['nullable', 'string', 'max:500'],
        ];
    }
}
