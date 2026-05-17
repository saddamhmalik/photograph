<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('photographer_id')->constrained()->cascadeOnDelete();
            $table->string('plan', 64);
            $table->string('status', 32)->default('trialing');
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->json('features')->nullable();
            $table->string('payment_provider')->nullable();
            $table->string('external_id')->nullable();
            $table->timestamps();

            $table->index(['photographer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
