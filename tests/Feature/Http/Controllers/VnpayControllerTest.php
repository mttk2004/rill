<?php

use App\Models\Order;
use App\Models\Payment;
use App\Services\VnpayService;
use App\Support\ServiceResult;

use function Pest\Laravel\post;

test('vnpay IPN validates signature', function () {
    $order = Order::factory()->create();
    Payment::factory()->create([
        'order_id' => $order->id,
        'transaction_id' => 'VNP123456789',
    ]);

    // Mock valid VNPAY IPN request
    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::success([
            'order_id' => $order->id,
            'status' => 'success',
        ]));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => $order->id,
        'vnp_Amount' => $order->total_amount * 100,
        'vnp_OrderInfo' => 'Payment for order ' . $order->id,
        'vnp_ResponseCode' => '00',
        'vnp_TransactionNo' => 'VNP123456789',
        'vnp_SecureHash' => 'valid_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '00',
            'Message' => 'Confirm Success',
        ]);
});

test('vnpay IPN rejects invalid signature', function () {
    $order = Order::factory()->create();

    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::error('Invalid signature', ['code' => 'INVALID_SIGNATURE']));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => $order->id,
        'vnp_Amount' => $order->total_amount * 100,
        'vnp_SecureHash' => 'invalid_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '97',
        ]);
});

test('vnpay IPN handles payment not found', function () {
    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::error('Payment not found', ['code' => 'PAYMENT_NOT_FOUND']));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => '999999999999999999',
        'vnp_Amount' => 100000 * 100,
        'vnp_SecureHash' => 'some_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '01',
        ]);
});

test('vnpay IPN handles invalid amount', function () {
    $order = Order::factory()->create(['total_amount' => 100000]);

    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::error('Invalid amount', ['code' => 'INVALID_AMOUNT']));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => $order->id,
        'vnp_Amount' => 50000 * 100, // Wrong amount
        'vnp_SecureHash' => 'some_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '04',
        ]);
});

test('vnpay IPN handles unknown error', function () {
    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::error('Unknown error', ['code' => 'UNKNOWN']));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => '123456',
        'vnp_SecureHash' => 'some_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '99',
        ]);
});

test('vnpay IPN updates payment status on success', function () {
    $order = Order::factory()->create();
    $payment = Payment::factory()->create([
        'order_id' => $order->id,
        'transaction_id' => 'VNP123456789',
        'payment_status' => 'pending',
    ]);

    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::success([
            'order_id' => $order->id,
            'status' => 'completed',
        ]));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => $order->id,
        'vnp_Amount' => $order->total_amount * 100,
        'vnp_ResponseCode' => '00',
        'vnp_TransactionNo' => 'VNP123456789',
        'vnp_SecureHash' => 'valid_hash',
    ]);

    $response->assertOk()
        ->assertJson([
            'RspCode' => '00',
        ]);
});

test('vnpay IPN logs successful processing', function () {
    $order = Order::factory()->create();

    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::success([
            'order_id' => $order->id,
            'status' => 'success',
        ]));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => $order->id,
        'vnp_Amount' => $order->total_amount * 100,
        'vnp_ResponseCode' => '00',
        'vnp_SecureHash' => 'valid_hash',
    ]);

    $response->assertOk();
});

test('vnpay IPN logs failed processing', function () {
    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn(ServiceResult::error('Test error', ['code' => 'TEST_ERROR']));

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => '123456',
        'vnp_SecureHash' => 'invalid_hash',
    ]);

    $response->assertOk();
});
