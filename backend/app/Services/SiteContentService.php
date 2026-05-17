<?php

namespace App\Services;

use App\Models\Photographer;
use App\Repositories\Contracts\PhotographerRepositoryInterface;
use App\Repositories\Contracts\WebsiteSettingRepositoryInterface;
use App\Support\HomepageSections;

class SiteContentService
{
    public function __construct(
        private readonly PhotographerRepositoryInterface $photographerRepository,
        private readonly WebsiteSettingRepositoryInterface $websiteSettingRepository
    ) {}

    public function getAdminContent(Photographer $photographer): array
    {
        $settings = $this->websiteSettingRepository->forPhotographer($photographer);

        return [
            'photographer' => $photographer,
            'settings' => $this->formatSettings($settings),
        ];
    }

    public function updateProfile(Photographer $photographer, array $data): Photographer
    {
        return $this->photographerRepository->update($photographer, $data);
    }

    public function updateHomepage(Photographer $photographer, array $data): array
    {
        $settings = $this->websiteSettingRepository->forPhotographer($photographer);
        $payload = [];

        if (array_key_exists('homepage_sections', $data)) {
            $payload['homepage_sections'] = HomepageSections::merge(
                array_replace_recursive(
                    $settings->homepage_sections ?? [],
                    $data['homepage_sections'] ?? []
                )
            );
        }

        if (array_key_exists('services', $data)) {
            $payload['services'] = $data['services'];
        }

        if (array_key_exists('seo', $data)) {
            $payload['seo'] = array_replace_recursive($settings->seo ?? [], $data['seo']);
        }

        $updated = $this->websiteSettingRepository->update($settings, $payload);

        return $this->formatSettings($updated);
    }

    public function formatSettings($settings): array
    {
        return [
            'branding' => $settings->branding,
            'seo' => $settings->seo,
            'services' => $settings->services ?? [],
            'contact' => $settings->contact,
            'homepage_sections' => HomepageSections::merge($settings->homepage_sections),
        ];
    }
}
