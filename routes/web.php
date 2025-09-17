<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Customer routes (including products)
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    Route::get('/products', function () {
        return Inertia::render('products');
    })->name('products');
    
    // Customer profile and orders
    Route::prefix('customer')->name('customer.')->group(function () {
        // Will be implemented later
    });
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
