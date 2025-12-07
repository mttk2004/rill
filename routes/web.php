<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\VnpayController;
use App\Http\Controllers\Api\ShippingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// VNPAY IPN Handler (phải đặt ngoài middleware auth vì VNPAY server gọi)
Route::post('/vnpay/ipn', [VnpayController::class, 'handleIpn'])->name('vnpay.ipn');

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public routes (accessible to guests and authenticated users)
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])
    ->name('products.show')
    ->withTrashed();

// Product reviews (authenticated users only)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/products/{product}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    Route::delete('/reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])->name('reviews.destroy');
});

// Cart routes accessible to both guests and authenticated users
Route::get('/cart', [App\Http\Controllers\CartController::class, 'index'])->name('cart');
Route::get('/cart/summary', [App\Http\Controllers\CartController::class, 'summary'])->name('cart.summary');
Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add.public');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/support', function () {
    return Inertia::render('Support');
})->name('support');

// VNPAY Return URL - Phải đặt ngoài middleware auth vì VNPAY redirect từ external site
Route::get('/orders/thank-you', [OrderController::class, 'thankYou'])->name('orders.thank-you.vnpay');

// Customer routes (authenticated only)
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    // Note: /cart/add is public route above, accessible to both guests and authenticated users
    Route::put('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart', [App\Http\Controllers\CartController::class, 'clear'])->name('cart.clear');

    // Checkout and Order Placement
    Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/shipping-fee', [ShippingController::class, 'calculate'])->name('checkout.shipping-fee');

    // Voucher API endpoints (using web middleware for session auth)
    Route::get('/api/vouchers/available', [App\Http\Controllers\Api\VoucherController::class, 'available'])->name('api.vouchers.available');
    Route::post('/api/vouchers/validate', [App\Http\Controllers\Api\VoucherController::class, 'validate'])->name('api.vouchers.validate');

    Route::post('/orders', [CheckoutController::class, 'store'])->name('orders.store');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice'])->name('orders.invoice');

    // Thank you page cho COD (có {order})
    // Use orderId string parameter instead of model binding to avoid soft delete scope issues
    Route::get('/orders/{orderId}/thank-you', [OrderController::class, 'thankYou'])->name('orders.thank-you');

    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}/retry-payment', [OrderController::class, 'retryPayment'])->name('orders.retry-payment');

    // Address management
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::put('/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('addresses.set-default');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    // Redirect /dashboard to /admin/dashboard
    Route::get('dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    // Admin management routes
    Route::prefix('admin')->group(function () {
        // Redirect /admin to /admin/dashboard
        Route::get('/', function () {
            return redirect()->route('admin.dashboard');
        });

        Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

        Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('admin.settings');
        Route::post('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('admin.settings.update');

        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('admin.orders');
        Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('admin.orders.show');
        Route::delete('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'destroy'])->name('admin.orders.destroy');
        Route::post('/orders/{id}/restore', [App\Http\Controllers\Admin\OrderController::class, 'restore'])->name('admin.orders.restore');
        Route::patch('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
        Route::get('/orders/{id}/export', [App\Http\Controllers\Admin\OrderController::class, 'export'])->name('admin.orders.export');

        Route::get('/customers', [App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('admin.customers');
        Route::get('/customers/{id}', [App\Http\Controllers\Admin\CustomerController::class, 'show'])->name('admin.customers.show');

        Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index'])->name('admin.products');
        Route::get('/products/create', [App\Http\Controllers\Admin\ProductController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [App\Http\Controllers\Admin\ProductController::class, 'store'])->name('admin.products.store');
        Route::get('/products/{id}', [App\Http\Controllers\Admin\ProductController::class, 'show'])->name('admin.products.show');
        Route::get('/products/{id}/edit', [App\Http\Controllers\Admin\ProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{id}', [App\Http\Controllers\Admin\ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{id}', [App\Http\Controllers\Admin\ProductController::class, 'destroy'])->name('admin.products.destroy');
        Route::post('/products/{id}/restore', [App\Http\Controllers\Admin\ProductController::class, 'restore'])->name('admin.products.restore');

        Route::get('/artists', [App\Http\Controllers\Admin\ArtistController::class, 'index'])->name('admin.artists');
        Route::get('/artists/create', [App\Http\Controllers\Admin\ArtistController::class, 'create'])->name('admin.artists.create');
        Route::post('/artists', [App\Http\Controllers\Admin\ArtistController::class, 'store'])->name('admin.artists.store');
        Route::get('/artists/{id}', [App\Http\Controllers\Admin\ArtistController::class, 'show'])->name('admin.artists.show');
        Route::get('/artists/{id}/edit', [App\Http\Controllers\Admin\ArtistController::class, 'edit'])->name('admin.artists.edit');
        Route::match(['POST', 'PUT'], '/artists/{id}', [App\Http\Controllers\Admin\ArtistController::class, 'update'])->name('admin.artists.update');
        Route::delete('/artists/{id}', [App\Http\Controllers\Admin\ArtistController::class, 'destroy'])->name('admin.artists.destroy');
        Route::post('/artists/{id}/restore', [App\Http\Controllers\Admin\ArtistController::class, 'restore'])->name('admin.artists.restore');

        Route::get('/vouchers', [App\Http\Controllers\Admin\VoucherController::class, 'index'])->name('admin.vouchers');
        Route::get('/vouchers/create', [App\Http\Controllers\Admin\VoucherController::class, 'create'])->name('admin.vouchers.create');
        Route::post('/vouchers', [App\Http\Controllers\Admin\VoucherController::class, 'store'])->name('admin.vouchers.store');
        Route::get('/vouchers/{id}', [App\Http\Controllers\Admin\VoucherController::class, 'show'])->name('admin.vouchers.show');
        Route::get('/vouchers/{id}/edit', [App\Http\Controllers\Admin\VoucherController::class, 'edit'])->name('admin.vouchers.edit');
        Route::put('/vouchers/{id}', [App\Http\Controllers\Admin\VoucherController::class, 'update'])->name('admin.vouchers.update');
        Route::delete('/vouchers/{id}', [App\Http\Controllers\Admin\VoucherController::class, 'destroy'])->name('admin.vouchers.destroy');
        Route::post('/vouchers/{id}/toggle-status', [App\Http\Controllers\Admin\VoucherController::class, 'toggleStatus'])->name('admin.vouchers.toggle-status');

        Route::get('/collections', [App\Http\Controllers\Admin\CollectionController::class, 'index'])->name('admin.collections.index');
        Route::get('/collections/create', [App\Http\Controllers\Admin\CollectionController::class, 'create'])->name('admin.collections.create');
        Route::post('/collections', [App\Http\Controllers\Admin\CollectionController::class, 'store'])->name('admin.collections.store');
        Route::get('/collections/{id}', [App\Http\Controllers\Admin\CollectionController::class, 'show'])->name('admin.collections.show');
        Route::get('/collections/{id}/edit', [App\Http\Controllers\Admin\CollectionController::class, 'edit'])->name('admin.collections.edit');
        Route::put('/collections/{id}', [App\Http\Controllers\Admin\CollectionController::class, 'update'])->name('admin.collections.update');
        Route::delete('/collections/{id}', [App\Http\Controllers\Admin\CollectionController::class, 'destroy'])->name('admin.collections.destroy');
        Route::post('/collections/{id}/toggle-status', [App\Http\Controllers\Admin\CollectionController::class, 'toggleStatus'])->name('admin.collections.toggle-status');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
