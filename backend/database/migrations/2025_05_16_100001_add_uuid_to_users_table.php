<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('role', 32)->default('photographer')->after('phone');
        });

        \Illuminate\Support\Facades\DB::table('users')->whereNull('uuid')->orderBy('id')->each(function ($user) {
            \Illuminate\Support\Facades\DB::table('users')
                ->where('id', $user->id)
                ->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'phone', 'role']);
        });
    }
};
