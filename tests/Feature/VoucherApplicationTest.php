<?php

use App\Models\User;
use App\Models\Voucher;
use App\Models\Order;
use App\Services\VoucherService;
use Carbon\Carbon;

describe('Voucher Validation', function () {

    test('validates active voucher code', function () {
        $voucher = Voucher::factory()->create([
            'code' => 'SUMMER2024',
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'usage_limit' => 100,
            'used_count' => 0,
        ]);

        $service = app(VoucherService::class);
        $result = $service->validateVoucher('SUMMER2024');

        expect($result->isSuccess())->toBeTrue();
        expect($result->data)->toBe($voucher->id);
    });

    test('rejects expired voucher', function () {
        Voucher::factory()->create([
            'code' => 'EXPIRED',
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(60),
            'end_date' => Carbon::now()->subDays(1),
        ]);

        $service = app(VoucherService::class);
        $result = $service->validateVoucher('EXPIRED');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('expired');
    });

    test('rejects inactive voucher', function () {
        Voucher::factory()->create([
            'code' => 'INACTIVE',
            'status' => 'inactive',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);
        $result = $service->validateVoucher('INACTIVE');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not available');
    });

    test('rejects voucher that has not started yet', function () {
        Voucher::factory()->create([
            'code' => 'FUTURE',
            'status' => 'active',
            'start_date' => Carbon::now()->addDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);
        $result = $service->validateVoucher('FUTURE');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not yet valid');
    });

    test('rejects voucher that reached usage limit', function () {
        Voucher::factory()->create([
            'code' => 'MAXED',
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'usage_limit' => 10,
            'used_count' => 10,
        ]);

        $service = app(VoucherService::class);
        $result = $service->validateVoucher('MAXED');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('limit');
    });

    test('rejects non-existent voucher code', function () {
        $service = app(VoucherService::class);
        $result = $service->validateVoucher('NOTEXIST');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not found');
    });

    test('validates voucher with minimum order amount requirement', function () {
        Voucher::factory()->create([
            'code' => 'MIN100',
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'min_order_amount' => 100000,
        ]);

        $service = app(VoucherService::class);

        // Should fail with order amount below minimum
        $resultFail = $service->validateVoucherForOrder('MIN100', 50000);
        expect($resultFail->isSuccess())->toBeFalse();

        // Should pass with order amount meeting minimum
        $resultPass = $service->validateVoucherForOrder('MIN100', 150000);
        expect($resultPass->isSuccess())->toBeTrue();
    });
});

describe('Voucher Discount Calculation', function () {

    test('calculates percentage discount correctly', function () {
        $voucher = Voucher::factory()->create([
            'code' => 'PERCENT20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);
        $discount = $service->calculateDiscount($voucher, 100000);

        expect($discount)->toBe(20000.0);
    });

    test('calculates fixed amount discount correctly', function () {
        $voucher = Voucher::factory()->create([
            'code' => 'FIXED50K',
            'discount_type' => 'fixed_amount',
            'discount_value' => 50000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);
        $discount = $service->calculateDiscount($voucher, 200000);

        expect($discount)->toBe(50000.0);
    });

    test('respects maximum discount cap for percentage voucher', function () {
        $voucher = Voucher::factory()->create([
            'code' => 'PERCENT50',
            'discount_type' => 'percentage',
            'discount_value' => 50,
            'max_discount_amount' => 100000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);

        // 50% of 500000 = 250000, but should be capped at 100000
        $discount = $service->calculateDiscount($voucher, 500000);
        expect($discount)->toBe(100000.0);
    });

    test('does not allow fixed discount to exceed order amount', function () {
        $voucher = Voucher::factory()->create([
            'code' => 'HUGE',
            'discount_type' => 'fixed_amount',
            'discount_value' => 200000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $service = app(VoucherService::class);

        // Order amount is 100000, discount should not exceed it
        $discount = $service->calculateDiscount($voucher, 100000);
        expect($discount)->toBeLessThanOrEqual(100000);
    });
});

describe('Voucher Application to Order', function () {

    test('applies voucher to order successfully', function () {
        $user = User::factory()->create();
        $voucher = Voucher::factory()->create([
            'code' => 'APPLY20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'usage_limit' => 100,
            'used_count' => 0,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
            'shipping_fee' => 30000,
            'discount_amount' => 0,
            'total_amount' => 130000,
        ]);

        $service = app(VoucherService::class);
        $result = $service->applyVoucherToOrder($order->id, 'APPLY20');

        expect($result->isSuccess())->toBeTrue();

        $order->refresh();
        expect($order->discount_amount)->toBe(20000.0);
        expect($order->total_amount)->toBe(110000.0); // 100000 + 30000 - 20000
        expect($order->voucher_id)->toBe($voucher->id);
    });

    test('increments voucher usage count when applied', function () {
        $user = User::factory()->create();
        $voucher = Voucher::factory()->create([
            'code' => 'COUNT',
            'discount_type' => 'fixed_amount',
            'discount_value' => 10000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'usage_limit' => 100,
            'used_count' => 5,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
            'shipping_fee' => 30000,
            'discount_amount' => 0,
            'total_amount' => 130000,
        ]);

        $service = app(VoucherService::class);
        $service->applyVoucherToOrder($order->id, 'COUNT');

        expect($voucher->fresh()->used_count)->toBe(6);
    });

    test('prevents applying same voucher twice to same order', function () {
        $user = User::factory()->create();
        $voucher = Voucher::factory()->create([
            'code' => 'ONCE',
            'discount_type' => 'fixed_amount',
            'discount_value' => 10000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
            'voucher_id' => $voucher->id,
            'discount_amount' => 10000,
        ]);

        $service = app(VoucherService::class);
        $result = $service->applyVoucherToOrder($order->id, 'ONCE');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('already applied');
    });

    test('removes old voucher when applying new one', function () {
        $user = User::factory()->create();

        $oldVoucher = Voucher::factory()->create([
            'code' => 'OLD',
            'discount_type' => 'fixed_amount',
            'discount_value' => 10000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'used_count' => 1,
        ]);

        $newVoucher = Voucher::factory()->create([
            'code' => 'NEW',
            'discount_type' => 'fixed_amount',
            'discount_value' => 20000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'used_count' => 0,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
            'voucher_id' => $oldVoucher->id,
            'discount_amount' => 10000,
        ]);

        $service = app(VoucherService::class);
        $service->applyVoucherToOrder($order->id, 'NEW');

        $order->refresh();
        expect($order->voucher_id)->toBe($newVoucher->id);
        expect($order->discount_amount)->toBe(20000.0);

        // Old voucher usage count should decrease
        expect($oldVoucher->fresh()->used_count)->toBe(0);
        // New voucher usage count should increase
        expect($newVoucher->fresh()->used_count)->toBe(1);
    });
});

describe('Voucher Per-User Limits', function () {

    test('enforces per-user usage limit', function () {
        $user = User::factory()->create();

        $voucher = Voucher::factory()->create([
            'code' => 'PERUSER',
            'discount_type' => 'fixed_amount',
            'discount_value' => 10000,
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(1),
            'end_date' => Carbon::now()->addDays(30),
            'usage_limit_per_user' => 2,
        ]);

        // User uses voucher first time - should succeed
        $order1 = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
        ]);

        $service = app(VoucherService::class);
        $result1 = $service->applyVoucherToOrder($order1->id, 'PERUSER');
        expect($result1->isSuccess())->toBeTrue();

        // User uses voucher second time - should succeed
        $order2 = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
        ]);

        $result2 = $service->applyVoucherToOrder($order2->id, 'PERUSER');
        expect($result2->isSuccess())->toBeTrue();

        // User tries third time - should fail
        $order3 = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 100000,
        ]);

        $result3 = $service->applyVoucherToOrder($order3->id, 'PERUSER');
        expect($result3->isSuccess())->toBeFalse();
        expect($result3->message)->toContain('limit');
    });
});
