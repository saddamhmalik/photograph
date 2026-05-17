<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('album_media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('album_id')->constrained()->cascadeOnDelete();
            $table->string('type', 16)->default('image');
            $table->string('path');
            $table->string('thumbnail_path')->nullable();
            $table->string('webp_path')->nullable();
            $table->string('blur_hash', 128)->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('mime_type', 64)->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['album_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('album_media');
    }
};
