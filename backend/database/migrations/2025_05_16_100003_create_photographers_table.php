<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('theme_id')->nullable()->constrained()->nullOnDelete();
            $table->string('business_name');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('bio')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('hero_video_url')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('custom_domain')->nullable()->unique();
            $table->string('whatsapp_number', 20)->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->default('India');
            $table->json('social_links')->nullable();
            $table->unsignedBigInteger('storage_used_bytes')->default(0);
            $table->unsignedBigInteger('storage_limit_bytes')->default(10737418240);
            $table->boolean('is_active')->default(true);
            $table->timestamp('onboarded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['slug', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographers');
    }
};
