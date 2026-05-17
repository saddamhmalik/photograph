<?php

namespace App\Support;

class HomepageSections
{
    public static function defaults(): array
    {
        return [
            'hero' => [
                'primary_cta' => 'View Portfolio',
                'secondary_cta' => 'Book a Session',
            ],
            'featured' => [
                'label' => 'Portfolio',
                'title' => 'Featured Stories',
            ],
            'about' => [
                'label' => 'About',
                'enabled' => true,
            ],
            'services' => [
                'label' => 'Services',
                'title' => 'What We Create',
            ],
            'testimonials' => [
                'label' => 'Kind Words',
                'title' => 'Client Love',
            ],
            'cta' => [
                'title' => "Let's Create Something Timeless",
                'subtitle' => 'Your story deserves to be told with artistry, emotion, and cinematic beauty.',
                'primary_button' => 'Start Your Journey',
                'secondary_button' => 'WhatsApp Us',
            ],
        ];
    }

    public static function merge(?array $stored): array
    {
        return array_replace_recursive(self::defaults(), $stored ?? []);
    }
}
