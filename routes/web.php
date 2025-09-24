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

    // Admin management routes will be implemented later
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
