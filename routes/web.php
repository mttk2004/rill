<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public routes (accessible to guests and authenticated users)
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/support', function () {
    return Inertia::render('support');
})->name('support');

// Customer routes (authenticated only)
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    Route::get('/cart', function () {
        return Inertia::render('cart');
    })->name('cart');
    Route::get('/orders', function () {
        return Inertia::render('orders');
    })->name('orders');
    Route::get('/wishlist', function () {
        return Inertia::render('wishlist');
    })->name('wishlist');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin management routes
    Route::prefix('admin')->group(function () {
        Route::get('/statistics', function () {
            return Inertia::render('admin/statistics');
        })->name('admin.statistics');

        Route::get('/orders', function () {
            return Inertia::render('admin/orders');
        })->name('admin.orders');

        Route::get('/customers', function () {
            return Inertia::render('admin/customers');
        })->name('admin.customers');

        Route::get('/products', function () {
            return Inertia::render('admin/products');
        })->name('admin.products');

        Route::get('/artists', function () {
            return Inertia::render('admin/artists');
        })->name('admin.artists');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
