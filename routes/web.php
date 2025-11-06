<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public routes (accessible to guests and authenticated users)
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// Product reviews (authenticated users only)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/products/{product}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])->name('products.reviews.store');
});

// Cart routes accessible to both guests and authenticated users
Route::get('/cart/summary', [App\Http\Controllers\CartController::class, 'summary'])->name('cart.summary');
Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add.public');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/support', function () {
    return Inertia::render('support');
})->name('support');

// Customer routes (authenticated only)
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    Route::get('/cart', [App\Http\Controllers\CartController::class, 'index'])->name('cart');
    Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart', [App\Http\Controllers\CartController::class, 'clear'])->name('cart.clear');

    // Checkout and Order Placement
    Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/orders', [CheckoutController::class, 'store'])->name('orders.store');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::get('/orders/{order}/thank-you', [OrderController::class, 'thankYou'])->name('orders.thank-you');
    Route::get('/wishlist', function () {
        return Inertia::render('wishlist');
    })->name('wishlist');

    // Address management
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::put('/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('addresses.set-default');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    // Redirect dashboard to admin statistics
    Route::get('dashboard', function () {
        return redirect()->route('admin.statistics');
    })->name('dashboard');

    // Admin management routes
    Route::prefix('admin')->group(function () {
        Route::get('/statistics', function () {
            return Inertia::render('admin/statistics');
        })->name('admin.statistics');

        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('admin.orders');
        Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('admin.orders.show');
        Route::delete('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'destroy'])->name('admin.orders.destroy');
        Route::post('/orders/{id}/restore', [App\Http\Controllers\Admin\OrderController::class, 'restore'])->name('admin.orders.restore');
        Route::patch('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
        Route::get('/orders/{id}/export', [App\Http\Controllers\Admin\OrderController::class, 'export'])->name('admin.orders.export');

        Route::get('/customers', [App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('admin.customers');
        Route::get('/customers/{id}', [App\Http\Controllers\Admin\CustomerController::class, 'show'])->name('admin.customers.show');

        Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index'])->name('admin.products');
        Route::get('/products/{id}', [App\Http\Controllers\Admin\ProductController::class, 'show'])->name('admin.products.show');
        Route::delete('/products/{id}', [App\Http\Controllers\Admin\ProductController::class, 'destroy'])->name('admin.products.destroy');
        Route::post('/products/{id}/restore', [App\Http\Controllers\Admin\ProductController::class, 'restore'])->name('admin.products.restore');

        Route::get('/artists', [App\Http\Controllers\Admin\ArtistController::class, 'index'])->name('admin.artists');
        Route::get('/artists/{id}', [App\Http\Controllers\Admin\ArtistController::class, 'show'])->name('admin.artists.show');
        Route::delete('/artists/{id}', [App\Http\Controllers\Admin\ArtistController::class, 'destroy'])->name('admin.artists.destroy');
        Route::post('/artists/{id}/restore', [App\Http\Controllers\Admin\ArtistController::class, 'restore'])->name('admin.artists.restore');

        Route::get('/vouchers', function () {
            return Inertia::render('admin/vouchers');
        })->name('admin.vouchers');

        Route::get('/vouchers/create', function () {
            return Inertia::render('admin/vouchers/create');
        })->name('admin.vouchers.create');

        Route::get('/vouchers/{voucher}/edit', function () {
            // Mock data - thực tế sẽ load voucher từ database
            return Inertia::render('admin/vouchers/edit');
        })->name('admin.vouchers.edit');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
