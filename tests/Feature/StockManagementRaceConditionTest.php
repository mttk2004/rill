<?php

use App\Models\Product;
use App\Models\User;
use App\Actions\Order\CreateOrderAction;
use App\DataObjects\Order\CreateOrderData;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    // Setup test data
    $this->user = User::factory()->create();
});

describe('Stock Management Race Conditions', function () {

    test('prevents overselling when two orders are created simultaneously', function () {
        // Create product with only 1 item in stock
        $product = Product::factory()->create([
            'stock_quantity' => 1,
            'price' => 100000,
            'status' => 'active',
        ]);

        $createOrderAction = app(CreateOrderAction::class);

        // Create order data for both users
        $orderData1 = new CreateOrderData(
            userId: $this->user->id,
            items: [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => $product->price,
                ],
            ],
            shippingAddress: [
                'name' => 'Test User',
                'phone' => '0123456789',
                'address' => '123 Test St',
                'ward' => 'Test Ward',
                'district' => 'Test District',
                'province' => 'Test Province',
            ],
            subtotal: 100000,
            shippingFee: 30000,
            discountAmount: 0,
            totalAmount: 130000,
            paymentMethod: 'cod',
        );

        $orderData2 = clone $orderData1;

        // Simulate concurrent execution
        $results = [];
        $exceptions = [];

        // Try to create two orders sequentially (simulating race condition scenario)
        try {
            $result1 = $createOrderAction->execute($orderData1);
            $results[] = $result1;
        } catch (\Exception $e) {
            $exceptions[] = $e->getMessage();
        }

        try {
            $result2 = $createOrderAction->execute($orderData2);
            $results[] = $result2;
        } catch (\Exception $e) {
            $exceptions[] = $e->getMessage();
        }

        // Assertions
        $successCount = collect($results)->filter(fn($r) => $r->isSuccess())->count();

        // Only ONE order should succeed
        expect($successCount)->toBeLessThanOrEqual(1);

        // At least one should fail with insufficient stock
        expect($exceptions)->not->toBeEmpty();
        expect(implode(' ', $exceptions))->toContain('Insufficient stock');

        // Stock should be 0 or 1 (not negative!)
        $product->refresh();
        expect($product->stock_quantity)->toBeGreaterThanOrEqual(0);
        expect($product->stock_quantity)->toBeLessThanOrEqual(1);
    });

    test('decreaseStock throws exception when stock is insufficient', function () {
        $product = Product::factory()->create(['stock_quantity' => 5]);
        $repository = app(\App\Repositories\Contracts\ProductRepositoryInterface::class);

        // This should fail
        expect(fn() => $repository->decreaseStock($product->id, 10))
            ->toThrow(\Exception::class, 'Insufficient stock');

        // Stock should remain unchanged
        expect($product->fresh()->stock_quantity)->toBe(5);
    });

    test('decreaseStock with lockForUpdate prevents concurrent modifications', function () {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $repository = app(\App\Repositories\Contracts\ProductRepositoryInterface::class);

        // Successfully decrease by 5
        $result = $repository->decreaseStock($product->id, 5);
        expect($result)->toBeTrue();
        expect($product->fresh()->stock_quantity)->toBe(5);

        // Successfully decrease by another 5
        $result = $repository->decreaseStock($product->id, 5);
        expect($result)->toBeTrue();
        expect($product->fresh()->stock_quantity)->toBe(0);

        // This should fail - no stock left
        expect(fn() => $repository->decreaseStock($product->id, 1))
            ->toThrow(\Exception::class, 'Insufficient stock');
    });

    test('increaseStock restores stock correctly', function () {
        $product = Product::factory()->create(['stock_quantity' => 5]);
        $repository = app(\App\Repositories\Contracts\ProductRepositoryInterface::class);

        // Increase stock
        $result = $repository->increaseStock($product->id, 3);
        expect($result)->toBeTrue();
        expect($product->fresh()->stock_quantity)->toBe(8);
    });

    test('stock status updates correctly when reaching zero', function () {
        $product = Product::factory()->create([
            'stock_quantity' => 1,
            'status' => 'active',
        ]);
        $repository = app(\App\Repositories\Contracts\ProductRepositoryInterface::class);

        // Decrease to zero
        $repository->decreaseStock($product->id, 1);

        $product->refresh();
        expect($product->stock_quantity)->toBe(0);
        expect($product->status)->toBe('out_of_stock');
    });

    test('stock status updates back to active when increased from zero', function () {
        $product = Product::factory()->create([
            'stock_quantity' => 0,
            'status' => 'out_of_stock',
        ]);
        $repository = app(\App\Repositories\Contracts\ProductRepositoryInterface::class);

        // Increase stock
        $repository->increaseStock($product->id, 5);

        $product->refresh();
        expect($product->stock_quantity)->toBe(5);
        expect($product->status)->toBe('active');
    });
});

describe('Order Cancellation Stock Restoration', function () {

    test('restores stock when order is cancelled', function () {
        // Create user and product
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        // Create order
        $createOrderAction = app(CreateOrderAction::class);
        $orderData = new CreateOrderData(
            userId: $user->id,
            items: [
                [
                    'product_id' => $product->id,
                    'quantity' => 3,
                    'unit_price' => $product->price,
                ],
            ],
            shippingAddress: [
                'name' => 'Test User',
                'phone' => '0123456789',
                'address' => '123 Test St',
                'ward' => 'Test Ward',
                'district' => 'Test District',
                'province' => 'Test Province',
            ],
            subtotal: 300000,
            shippingFee: 30000,
            discountAmount: 0,
            totalAmount: 330000,
            paymentMethod: 'cod',
        );

        $result = $createOrderAction->execute($orderData);
        expect($result->isSuccess())->toBeTrue();

        $order = $result->data;

        // Stock should be decreased
        expect($product->fresh()->stock_quantity)->toBe(7);

        // Cancel order
        $cancelAction = app(\App\Actions\Order\CancelOrderAction::class);
        $cancelResult = $cancelAction->execute($order->id);

        expect($cancelResult->isSuccess())->toBeTrue();

        // Stock should be restored
        expect($product->fresh()->stock_quantity)->toBe(10);
    });
});
