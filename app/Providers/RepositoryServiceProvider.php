<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Repository Service Provider
 *
 * Binds repository interfaces to their concrete implementations.
 * This allows for dependency injection and easy swapping of implementations.
 */
class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All repository bindings.
     *
     * Format: [Interface::class => Implementation::class]
     *
     * @var array
     */
    protected array $repositories = [
        \App\Repositories\Contracts\ProductRepositoryInterface::class => \App\Repositories\Eloquent\ProductRepository::class,
        \App\Repositories\Contracts\OrderRepositoryInterface::class => \App\Repositories\Eloquent\OrderRepository::class,
        \App\Repositories\Contracts\UserRepositoryInterface::class => \App\Repositories\Eloquent\UserRepository::class,
        \App\Repositories\Contracts\CartRepositoryInterface::class => \App\Repositories\Eloquent\CartRepository::class,
        \App\Repositories\Contracts\ReviewRepositoryInterface::class => \App\Repositories\Eloquent\ReviewRepository::class,
        \App\Repositories\Contracts\VoucherRepositoryInterface::class => \App\Repositories\Eloquent\VoucherRepository::class,
        \App\Repositories\Contracts\AddressRepositoryInterface::class => \App\Repositories\Eloquent\AddressRepository::class,
        \App\Repositories\Contracts\PaymentRepositoryInterface::class => \App\Repositories\Eloquent\PaymentRepository::class,
    ];    /**
     * Register repository bindings.
     */
    public function register(): void
    {
        foreach ($this->repositories as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
