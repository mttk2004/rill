<?php

use App\Http\Controllers\VnpayController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Test Routes - CHỈ DÙNG TRONG DEVELOPMENT
|--------------------------------------------------------------------------
|
| Các routes này dùng để test IPN callback của VNPAY trong môi trường local
| VÌ VNPAY không thể gọi localhost từ server của họ
|
| NHỚ XÓA FILE NÀY TRƯỚC KHI DEPLOY PRODUCTION!
|
*/

// Test IPN - Simulate VNPAY calling our IPN endpoint
Route::get('/test/vnpay/ipn', function () {
    return view('test.vnpay-ipn-simulator');
})->name('test.vnpay.ipn.form');

Route::post('/test/vnpay/simulate-ipn', [VnpayController::class, 'handleIpn'])
    ->name('test.vnpay.simulate');

// Test Email Dashboard
Route::get('/test/email', function () {
    return view('test.email-testing');
})->name('test.email.dashboard');

// Test Email Routes
Route::get('/test/email/welcome', function () {
    $user = \App\Models\User::first();
    if (!$user) {
        return 'No user found. Please create a user first.';
    }

    \Illuminate\Support\Facades\Mail::to($user)->send(new \App\Mail\WelcomeEmail($user));

    return 'Welcome email queued successfully! Email will be sent to: ' . $user->email . '<br><br>Run "php artisan queue:work" to process the job.<br><br><a href="/test/email">← Back to dashboard</a>';
})->name('test.email.welcome');

Route::get('/test/email/order-status', function () {
    $order = \App\Models\Order::with('user', 'items.product')->first();
    if (!$order) {
        return 'No order found. Please create an order first.';
    }

    \Illuminate\Support\Facades\Mail::to($order->user)->send(new \App\Mail\OrderStatusUpdated($order));

    return 'Order status email queued successfully! Email will be sent to: ' . $order->user->email . '<br><br>Run "php artisan queue:work" to process the job.<br><br><a href="/test/email">← Back to dashboard</a>';
})->name('test.email.order');
