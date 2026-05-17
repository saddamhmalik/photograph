<?php

namespace App\Providers;

use App\Repositories\Contracts\AlbumMediaRepositoryInterface;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\PhotographerRepositoryInterface;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use App\Repositories\Contracts\WebsiteSettingRepositoryInterface;
use App\Repositories\Eloquent\AlbumMediaRepository;
use App\Repositories\Eloquent\AlbumRepository;
use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Eloquent\PhotographerRepository;
use App\Repositories\Eloquent\TestimonialRepository;
use App\Repositories\Eloquent\WebsiteSettingRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PhotographerRepositoryInterface::class, PhotographerRepository::class);
        $this->app->bind(AlbumRepositoryInterface::class, AlbumRepository::class);
        $this->app->bind(AlbumMediaRepositoryInterface::class, AlbumMediaRepository::class);
        $this->app->bind(WebsiteSettingRepositoryInterface::class, WebsiteSettingRepository::class);
        $this->app->bind(TestimonialRepositoryInterface::class, TestimonialRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
    }
}
