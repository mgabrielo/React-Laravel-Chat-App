<?php

namespace App\Providers;

use App\Models\Message;
use App\Observers\MessageObserver;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Message::observe(MessageObserver::class); Alternative Approach for observing models
        Schema::defaultStringLength(191);
    }
}
