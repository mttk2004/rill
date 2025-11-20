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

// Test Voucher Debug
Route::get('/test/vouchers/debug', function () {
    $voucherService = app(\App\Services\VoucherService::class);

    // Get all vouchers
    $allVouchers = \App\Models\Voucher::all();

    // Get RILLNEW voucher
    $rillnewVoucher = \App\Models\Voucher::where('code', 'RILLNEW')->first();

    // Get available vouchers (no filter)
    $availableNoFilter = $voucherService->getAvailableVouchers();

    // Get available vouchers with user and order total
    $availableWithUser = $voucherService->getAvailableVouchers(auth()->id(), 100000);

    return response()->json([
        'all_vouchers_count' => $allVouchers->count(),
        'all_vouchers' => $allVouchers->map(fn($v) => [
            'code' => $v->code,
            'name' => $v->name,
            'is_active' => $v->is_active,
            'valid_from' => $v->valid_from->toDateTimeString(),
            'valid_to' => $v->valid_to->toDateTimeString(),
            'usage_limit_per_user' => $v->usage_limit_per_user,
        ]),
        'rillnew_voucher' => $rillnewVoucher ? [
            'code' => $rillnewVoucher->code,
            'name' => $rillnewVoucher->name,
            'is_active' => $rillnewVoucher->is_active,
            'is_valid' => $rillnewVoucher->isValid(),
        ] : null,
        'available_no_filter_count' => $availableNoFilter->count(),
        'available_no_filter' => $availableNoFilter->map(fn($v) => $v->code),
        'available_with_user_count' => $availableWithUser->count(),
        'available_with_user' => $availableWithUser->map(fn($v) => [
            'code' => $v->code,
            'user_usage_count' => $v->user_usage_count ?? 0,
            'usage_limit_per_user' => $v->usage_limit_per_user,
        ]),
        'user_id' => auth()->id(),
        'now' => now()->toDateTimeString(),
    ]);
})->middleware('auth')->name('test.vouchers.debug');
