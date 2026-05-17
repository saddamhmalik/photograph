<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->constrained()->cascadeOnDelete();
            $table->string('event_type', 64);
            $table->string('resource_type', 32)->nullable();
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->string('session_id', 64)->nullable();
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at');

            $table->index(['photographer_id', 'event_type', 'created_at']);
            $table->index(['photographer_id', 'resource_type', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
