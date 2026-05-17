<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('photographer_id')->constrained()->cascadeOnDelete();
            $table->string('type', 32)->default('contact');
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('event_type')->nullable();
            $table->date('event_date')->nullable();
            $table->string('location')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 32)->default('new');
            $table->string('source', 64)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['photographer_id', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
