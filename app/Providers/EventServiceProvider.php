<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * Laravel 12 automatically discovers listeners in app/Listeners directory
     * if they have handle() or __invoke() methods with event type-hints.
     * Manual registration here would cause duplicate listener execution.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Listeners are auto-discovered from app/Listeners directory
        // VoucherCreated event listener is auto-discovered, no manual registration needed
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
