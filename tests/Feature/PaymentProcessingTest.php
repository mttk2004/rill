<?php

use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use App\Services\PaymentService;

describe('COD Payment', function () {

    test('creates COD payment successfully', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total_amount' => 150000,
        ]);

        $service = app(PaymentService::class);
        $result = $service->createPayment($order->id, 'cod');

        expect($result->isSuccess())->toBeTrue();

        $payment = $order->fresh()->payment;
        expect($payment)->not->toBeNull();
        expect($payment->payment_method)->toBe('cod');
        expect($payment->payment_status)->toBe(PaymentStatus::PENDING);
        expect($payment->amount)->toBe(150000.0);
    });

    test('COD payment marked as paid on delivery', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cod',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 150000,
        ]);

        $service = app(PaymentService::class);
        $result = $service->markPaymentAsPaid($payment->id);

        expect($result->isSuccess())->toBeTrue();
        expect($payment->fresh()->payment_status)->toBe(PaymentStatus::PAID);
        expect($payment->fresh()->paid_at)->not->toBeNull();
    });
});

describe('VNPAY Payment', function () {

    test('creates VNPAY payment URL', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total_amount' => 200000,
        ]);

        $service = app(PaymentService::class);
        $result = $service->createVNPayPayment($order->id, 'http://localhost/payment/callback');

        expect($result->isSuccess())->toBeTrue();
        expect($result->data)->toContain('vnpay');
        expect($result->data)->toContain('vnp_TxnRef');

        $payment = $order->fresh()->payment;
        expect($payment->payment_method)->toBe('vnpay');
        expect($payment->payment_status)->toBe(PaymentStatus::PENDING);
    });

    test('handles VNPAY success callback', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 200000,
            'transaction_id' => 'TEST123456',
        ]);

        $callbackData = [
            'vnp_TxnRef' => $order->id,
            'vnp_Amount' => 20000000, // VNPAY amount is in xu (x100)
            'vnp_ResponseCode' => '00', // Success code
            'vnp_TransactionNo' => 'VNPAY123',
        ];

        $service = app(PaymentService::class);
        $result = $service->handleVNPayCallback($callbackData);

        expect($result->isSuccess())->toBeTrue();

        $payment->refresh();
        expect($payment->payment_status)->toBe(PaymentStatus::PAID);
        expect($payment->paid_at)->not->toBeNull();
    });

    test('handles VNPAY failure callback', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 200000,
        ]);

        $callbackData = [
            'vnp_TxnRef' => $order->id,
            'vnp_Amount' => 20000000,
            'vnp_ResponseCode' => '24', // Cancelled by user
        ];

        $service = app(PaymentService::class);
        $result = $service->handleVNPayCallback($callbackData);

        $payment->refresh();
        expect($payment->payment_status)->toBe(PaymentStatus::FAILED);
    });

    test('prevents double payment processing', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PAID, // Already paid
            'amount' => 200000,
            'paid_at' => now(),
        ]);

        $service = app(PaymentService::class);
        $result = $service->markPaymentAsPaid($payment->id);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('already paid');
    });
});

describe('Payment Refunds', function () {

    test('can refund paid payment', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PAID,
            'amount' => 200000,
            'paid_at' => now()->subHours(2),
        ]);

        $service = app(PaymentService::class);
        $result = $service->refundPayment($payment->id);

        expect($result->isSuccess())->toBeTrue();

        $payment->refresh();
        expect($payment->payment_status)->toBe(PaymentStatus::REFUNDED);
        expect($payment->refunded_at)->not->toBeNull();
    });

    test('cannot refund unpaid payment', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 200000,
        ]);

        $service = app(PaymentService::class);
        $result = $service->refundPayment($payment->id);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not paid');
    });

    test('cannot refund already refunded payment', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::REFUNDED,
            'amount' => 200000,
            'refunded_at' => now()->subHours(1),
        ]);

        $service = app(PaymentService::class);
        $result = $service->refundPayment($payment->id);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('already refunded');
    });
});

describe('Payment Validation', function () {

    test('validates payment amount matches order total', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total_amount' => 150000,
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cod',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 150000, // Matches order total
        ]);

        expect($payment->amount)->toBe($order->total_amount);
    });

    test('detects payment amount mismatch', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total_amount' => 150000,
        ]);

        $service = app(PaymentService::class);

        // Try to create payment with wrong amount
        $result = $service->createPaymentWithAmount($order->id, 'cod', 100000);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('amount mismatch');
    });
});
