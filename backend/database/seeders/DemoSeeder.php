<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Category;
use App\Models\Photographer;
use App\Models\Testimonial;
use App\Models\Theme;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::create([
            'name' => 'Cinematic Dark',
            'slug' => 'cinematic-dark',
            'palette' => [
                'background' => '#0a0a0a',
                'foreground' => '#f5f0e8',
                'primary' => '#c9a962',
                'accent' => '#1a1a1a',
            ],
            'typography' => [
                'heading' => 'Cormorant Garamond',
                'body' => 'Inter',
            ],
        ]);

        $user = User::create([
            'name' => 'Rahul Sharma',
            'email' => 'demo@lenscraft.in',
            'password' => Hash::make('password123'),
            'phone' => '+919876543210',
            'role' => 'photographer',
        ]);

        $photographer = Photographer::create([
            'user_id' => $user->id,
            'theme_id' => $theme->id,
            'business_name' => 'LensCraft Studios',
            'slug' => 'lenscraft',
            'tagline' => 'Stories woven in light & emotion',
            'bio' => 'Award-winning wedding and lifestyle photographer based in Jammu, capturing timeless moments across India.',
            'hero_image_path' => 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=85',
            'hero_video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-4172-large.mp4',
            'whatsapp_number' => '919876543210',
            'city' => 'Jammu',
            'state' => 'Jammu and Kashmir',
            'country' => 'India',
            'social_links' => [
                'instagram' => 'https://instagram.com/lenscraft',
                'youtube' => 'https://youtube.com/@lenscraft',
            ],
            'onboarded_at' => now(),
        ]);

        WebsiteSetting::create([
            'photographer_id' => $photographer->id,
            'branding' => [
                'primary_color' => '#c9a962',
                'accent_color' => '#1a1a1a',
            ],
            'seo' => [
                'title' => 'LensCraft Studios | Premium Wedding Photography',
                'description' => 'Cinematic wedding photography in Jammu, Kashmir, Delhi & across India.',
                'keywords' => 'wedding photographer, jammu, cinematic photography',
            ],
            'services' => [
                ['name' => 'Wedding Photography', 'description' => 'Full-day cinematic coverage'],
                ['name' => 'Pre-Wedding Shoots', 'description' => 'Destination & studio sessions'],
                ['name' => 'Portrait Sessions', 'description' => 'Editorial & lifestyle portraits'],
            ],
            'contact' => [
                'email' => 'hello@lenscraft.in',
                'phone' => '+91 98765 43210',
                'address' => 'Gandhi Nagar, Jammu, Jammu and Kashmir 180004',
                'map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.82!3d19.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
            ],
            'homepage_sections' => \App\Support\HomepageSections::defaults(),
        ]);

        $wedding = Category::create([
            'photographer_id' => $photographer->id,
            'name' => 'Weddings',
            'slug' => 'weddings',
        ]);

        $portrait = Category::create([
            'photographer_id' => $photographer->id,
            'name' => 'Portraits',
            'slug' => 'portraits',
            'sort_order' => 1,
        ]);

        $birthday = Category::create([
            'photographer_id' => $photographer->id,
            'name' => 'Birthdays',
            'slug' => 'birthdays',
            'sort_order' => 2,
        ]);

        $albums = [
            ['title' => 'Arjun Weds Anjani', 'slug' => 'arjun-weds-anjani', 'category_id' => $wedding->id, 'location' => 'Udaipur', 'is_featured' => true],
            ['title' => "Pooja's Birthday", 'slug' => 'poojas-birthday', 'category_id' => $birthday->id, 'location' => 'Mumbai', 'is_featured' => true],
            ['title' => 'Kashmir Pre Wedding Shoot', 'slug' => 'kashmir-pre-wedding-shoot', 'category_id' => $wedding->id, 'location' => 'Srinagar', 'is_featured' => true],
            ['title' => 'Royal Jaipur Wedding', 'slug' => 'royal-jaipur-wedding', 'category_id' => $wedding->id, 'location' => 'Jaipur', 'is_featured' => false],
        ];

        $covers = [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af8348b69?w=1200&q=80',
        ];

        foreach ($albums as $i => $data) {
            Album::create(array_merge($data, [
                'photographer_id' => $photographer->id,
                'description' => 'A cinematic collection of precious moments.',
                'cover_path' => $covers[$i],
                'layout' => 'masonry',
                'is_public' => true,
                'share_token' => Str::random(32),
                'published_at' => now(),
                'sort_order' => $i,
            ]));
        }

        Testimonial::create([
            'photographer_id' => $photographer->id,
            'client_name' => 'Anjani & Arjun',
            'event_type' => 'Wedding',
            'content' => 'Rahul captured our Udaipur wedding like a Bollywood dream. Every frame tells our story.',
            'rating' => 5,
            'is_featured' => true,
            'sort_order' => 0,
        ]);

        Testimonial::create([
            'photographer_id' => $photographer->id,
            'client_name' => 'Pooja Mehta',
            'event_type' => 'Birthday',
            'content' => 'The most beautiful birthday portraits. Elegant, emotional, and absolutely stunning.',
            'rating' => 5,
            'is_featured' => true,
            'sort_order' => 1,
        ]);
    }
}
