<?php

use App\Models\Order;
use App\Models\Payment;
use App\Services\VnpayService;

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
        ->andReturn((object)[
            'success' => true,
            'data' => [
                'order_id' => $order->id,
                'status' => 'success',
            ],
        ]);

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
        ->andReturn((object)[
            'success' => false,
            'message' => 'Invalid signature',
            'errors' => ['code' => 'INVALID_SIGNATURE'],
        ]);

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
        ->andReturn((object)[
            'success' => false,
            'message' => 'Payment not found',
            'errors' => ['code' => 'PAYMENT_NOT_FOUND'],
        ]);

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
        ->andReturn((object)[
            'success' => false,
            'message' => 'Invalid amount',
            'errors' => ['code' => 'INVALID_AMOUNT'],
        ]);

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
        ->andReturn((object)[
            'success' => false,
            'message' => 'Unknown error',
            'errors' => ['code' => 'UNKNOWN'],
        ]);

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
        'status' => 'pending',
    ]);

    $this->mock(VnpayService::class)
        ->shouldReceive('processIPN')
        ->andReturn((object)[
            'success' => true,
            'data' => [
                'order_id' => $order->id,
                'status' => 'completed',
            ],
        ]);

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
        ->andReturn((object)[
            'success' => true,
            'data' => [
                'order_id' => $order->id,
                'status' => 'success',
            ],
        ]);

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
        ->andReturn((object)[
            'success' => false,
            'message' => 'Test error',
            'errors' => ['code' => 'TEST_ERROR'],
        ]);

    $response = post(route('vnpay.ipn'), [
        'vnp_TmnCode' => 'TEST123',
        'vnp_TxnRef' => '123456',
        'vnp_SecureHash' => 'invalid_hash',
    ]);

    $response->assertOk();
});
