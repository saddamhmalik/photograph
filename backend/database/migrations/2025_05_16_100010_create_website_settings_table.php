<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('homepage_sections')->nullable();
            $table->json('branding')->nullable();
            $table->json('typography')->nullable();
            $table->json('seo')->nullable();
            $table->json('contact')->nullable();
            $table->json('integrations')->nullable();
            $table->json('services')->nullable();
            $table->json('instagram_feed')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
