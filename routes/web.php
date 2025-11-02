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

        Route::get('/orders', function () {
            return Inertia::render('admin/orders');
        })->name('admin.orders');

        Route::get('/orders/{order}', function ($orderId) {
            // Mock data for testing - in real app this would come from database
            $mockOrder = [
                'id' => (int)$orderId,
                'order_number' => "RL-00{$orderId}234",
                'user' => [
                    'id' => 1,
                    'name' => 'Nguyễn Văn A',
                    'email' => 'nguyenvana@example.com',
                    'phone' => '0901234567'
                ],
                'status' => 'delivered',
                'total_amount' => 1540000,
                'subtotal' => 1590000,
                'discount_amount' => 50000,
                'placed_at' => '2024-01-20T10:30:00Z',
                'updated_at' => '2024-01-24T16:30:00Z',
                'notes' => 'Gọi trước khi giao hàng',
                'shipping_address' => [
                    'full_name' => 'Nguyễn Văn A',
                    'phone' => '0901234567',
                    'address_line_1' => '123 Nguyễn Văn A',
                    'ward' => 'Phường Bến Nghé',
                    'district' => 'Quận 1',
                    'city' => 'TP.HCM'
                ],
                'payment' => [
                    'payment_method' => 'cod',
                    'payment_status' => 'completed',
                    'processed_at' => '2024-01-24T16:30:00Z',
                    'amount' => 1540000
                ],
                'items' => [
                    [
                        'id' => 1,
                        'product_id' => 1,
                        'product_name' => 'Rumours',
                        'product_sku' => 'FL-RUM-001',
                        'artist_name' => 'Fleetwood Mac',
                        'quantity' => 1,
                        'unit_price' => 490000,
                        'total_price' => 490000
                    ],
                    [
                        'id' => 2,
                        'product_id' => 2,
                        'product_name' => 'Hotel California',
                        'product_sku' => 'EG-HOT-001',
                        'artist_name' => 'Eagles',
                        'quantity' => 1,
                        'unit_price' => 420000,
                        'total_price' => 420000
                    ],
                    [
                        'id' => 3,
                        'product_id' => 3,
                        'product_name' => 'The Wall',
                        'product_sku' => 'PF-WAL-001',
                        'artist_name' => 'Pink Floyd',
                        'quantity' => 1,
                        'unit_price' => 680000,
                        'total_price' => 680000
                    ]
                ]
            ];

            return Inertia::render('admin/order-detail', [
                'order' => $mockOrder
            ]);
        })->name('admin.orders.show');

        Route::get('/customers', function () {
            return Inertia::render('admin/customers');
        })->name('admin.customers');

        Route::get('/products', function () {
            return Inertia::render('admin/products');
        })->name('admin.products');

        Route::get('/artists', function () {
            return Inertia::render('admin/artists');
        })->name('admin.artists');

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
