<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('photographer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('cover_path')->nullable();
            $table->string('cover_thumbnail_path')->nullable();
            $table->date('event_date')->nullable();
            $table->string('location')->nullable();
            $table->string('layout', 32)->default('masonry');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_public')->default(true);
            $table->boolean('is_password_protected')->default(false);
            $table->string('password_hash')->nullable();
            $table->string('share_token', 64)->nullable()->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedBigInteger('view_count')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['photographer_id', 'slug']);
            $table->index(['photographer_id', 'is_featured', 'is_public']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
