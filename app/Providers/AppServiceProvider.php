<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Snowflake;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('snowflake', function () {
            return new Snowflake();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
