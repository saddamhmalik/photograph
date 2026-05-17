<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_sections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('photographer_id')->constrained()->cascadeOnDelete();
            $table->string('page', 32)->default('homepage');
            $table->string('type', 32);
            $table->string('title')->nullable();
            $table->json('content')->nullable();
            $table->json('settings')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['photographer_id', 'page', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_sections');
    }
};
