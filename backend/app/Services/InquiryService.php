<?php

namespace App\Services;

use App\Models\Inquiry;
use App\Models\Photographer;

class InquiryService
{
    public function __construct(
        private readonly AnalyticsService $analyticsService
    ) {}

    public function submit(Photographer $photographer, array $data): Inquiry
    {
        $inquiry = Inquiry::create([
            'photographer_id' => $photographer->id,
            'type' => $data['type'] ?? 'contact',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'event_type' => $data['event_type'] ?? null,
            'event_date' => $data['event_date'] ?? null,
            'location' => $data['location'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => $data['source'] ?? 'website',
        ]);

        $this->analyticsService->track($photographer, 'inquiry_submitted', 'inquiry', $inquiry->id);

        return $inquiry;
    }
}
