<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\PhotographerRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly PhotographerRepositoryInterface $photographerRepository
    ) {}

    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'role' => 'photographer',
            ]);

            $slug = Str::slug($data['business_name'] ?? $data['name']);
            $slug = $this->ensureUniqueSlug($slug);

            $photographer = $this->photographerRepository->create([
                'user_id' => $user->id,
                'business_name' => $data['business_name'] ?? $data['name'],
                'slug' => $slug,
                'city' => $data['city'] ?? null,
                'onboarded_at' => now(),
            ]);

            $photographer->websiteSettings()->create([
                'branding' => [
                    'primary_color' => '#c9a962',
                    'accent_color' => '#1a1a1a',
                ],
                'seo' => [
                    'title' => $photographer->business_name,
                    'description' => 'Premium photography by '.$photographer->business_name,
                ],
            ]);

            $token = $user->createToken('api')->plainTextToken;

            return [
                'user' => $user->load('photographer'),
                'token' => $token,
            ];
        });
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => $user->load('photographer'),
            'token' => $token,
        ];
    }

    private function ensureUniqueSlug(string $slug): string
    {
        $base = $slug;
        $counter = 1;

        while (\App\Models\Photographer::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}
