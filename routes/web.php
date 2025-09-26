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
    Route::get('/orders/{order}', function () {
        // Mock data for testing - in real app this would come from database
        $mockOrder = [
            'id' => 'RL-001234',
            'date' => '2024-01-20',
            'status' => 'delivered',
            'total' => 1670000,
            'delivered_date' => '2024-01-24',
            'payment_method' => 'COD',
            'items' => [
                [
                    'id' => 1,
                    'title' => 'Rumours',
                    'artist_name' => 'Fleetwood Mac',
                    'price' => 490000,
                    'image_url' => null,
                    'quantity' => 1,
                    'sku' => 'FL-RUM-001'
                ],
                [
                    'id' => 2,
                    'title' => 'Hotel California',
                    'artist_name' => 'Eagles',
                    'price' => 420000,
                    'image_url' => null,
                    'quantity' => 1,
                    'sku' => 'EG-HOT-001'
                ],
                [
                    'id' => 3,
                    'title' => 'The Wall',
                    'artist_name' => 'Pink Floyd',
                    'price' => 680000,
                    'image_url' => null,
                    'quantity' => 1,
                    'sku' => 'PF-WAL-001'
                ]
            ],
            'shipping_address' => [
                'name' => 'Nguyễn Văn A',
                'phone' => '0901234567',
                'address' => '123 Nguyễn Văn A, Quận 1, TP.HCM',
                'notes' => 'Gọi trước khi giao hàng'
            ],
            'timeline' => [
                [
                    'status' => 'pending',
                    'date' => '2024-01-20 10:30',
                    'description' => 'Đơn hàng được đặt'
                ],
                [
                    'status' => 'confirmed',
                    'date' => '2024-01-20 14:00',
                    'description' => 'Đơn hàng được xác nhận'
                ],
                [
                    'status' => 'shipped',
                    'date' => '2024-01-22 09:00',
                    'description' => 'Đơn hàng được giao cho đơn vị vận chuyển'
                ],
                [
                    'status' => 'delivered',
                    'date' => '2024-01-24 16:30',
                    'description' => 'Đơn hàng đã được giao thành công'
                ]
            ]
        ];

        return Inertia::render('order-detail', [
            'order' => $mockOrder
        ]);
    })->name('orders.show');
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
