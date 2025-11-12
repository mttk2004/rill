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
