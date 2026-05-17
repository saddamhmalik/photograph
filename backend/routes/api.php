<?php

use App\Http\Controllers\Api\Admin\AlbumController as AdminAlbumController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\SiteContentController;
use App\Http\Controllers\Api\Admin\TestimonialController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::prefix('public')->group(function () {
        Route::get('/', [PublicSiteController::class, 'show']);
        Route::get('/portfolio', [PublicSiteController::class, 'portfolio']);
        Route::get('/categories', [PublicSiteController::class, 'categories']);
        Route::get('/albums/{albumSlug}', [PublicSiteController::class, 'album']);
        Route::post('/inquiries', [InquiryController::class, 'store']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::middleware('photographer')->prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index']);
            Route::get('/site', [SiteContentController::class, 'show']);
            Route::put('/site/profile', [SiteContentController::class, 'updateProfile']);
            Route::put('/site/homepage', [SiteContentController::class, 'updateHomepage']);
            Route::apiResource('testimonials', TestimonialController::class)->except(['show']);
            Route::apiResource('categories', CategoryController::class)->except(['show']);
            Route::apiResource('albums', AdminAlbumController::class);
            Route::post('/albums/{albumUuid}/media', [MediaController::class, 'store']);
            Route::post('/albums/{albumUuid}/media/reorder', [MediaController::class, 'reorder']);
            Route::delete('/albums/{albumUuid}/media/{mediaUuid}', [MediaController::class, 'destroy']);
        });
    });
});
