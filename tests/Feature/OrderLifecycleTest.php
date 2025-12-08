
<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Actions\Order\UpdateOrderStatusAction;
use App\Actions\Order\CancelOrderAction;

describe('Order Status Transitions', function () {

    test('allows valid status transition from PENDING to CONFIRMED', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::CONFIRMED);

        expect($result->isSuccess())->toBeTrue();
        expect($order->fresh()->status)->toBe(OrderStatus::CONFIRMED);
    });

    test('allows valid status transition from CONFIRMED to SHIPPED', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::CONFIRMED,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::SHIPPED);

        expect($result->isSuccess())->toBeTrue();
        expect($order->fresh()->status)->toBe(OrderStatus::SHIPPED);
    });    test('allows valid status transition from SHIPPED to DELIVERED', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::DELIVERED);

        expect($result->isSuccess())->toBeTrue();
        expect($order->fresh()->status)->toBe(OrderStatus::DELIVERED);
    });    test('prevents transition from CANCELLED status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::CANCELLED,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::CONFIRMED);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('Cannot transition');
    });

    test('prevents transition from DELIVERED status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::DELIVERED,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::SHIPPED);

        expect($result->isSuccess())->toBeFalse();
    });    test('prevents transition to same status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $action = app(UpdateOrderStatusAction::class);
        $result = $action->execute($order->id, OrderStatus::PENDING);

        expect($result->isSuccess())->toBeFalse();
    });

    test('creates status history when transitioning', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $initialHistoryCount = $order->statusHistories()->count();

        $action = app(UpdateOrderStatusAction::class);
        $action->execute($order->id, OrderStatus::CONFIRMED);

        $newHistoryCount = $order->fresh()->statusHistories()->count();
        expect($newHistoryCount)->toBeGreaterThan($initialHistoryCount);

        $latestHistory = $order->statusHistories()->latest()->first();
        expect($latestHistory->status)->toBe(OrderStatus::CONFIRMED->value);
    });
});

describe('Order Cancellation', function () {

    test('can cancel order in PENDING status', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => 3,
            'unit_price' => $product->price,
            'total_price' => $product->price * 3,
        ]);

        // Manually reduce stock to simulate order creation
        $product->decrement('stock_quantity', 3);
        expect($product->fresh()->stock_quantity)->toBe(7);

        $action = app(CancelOrderAction::class);
        $result = $action->execute($order->id);

        expect($result->isSuccess())->toBeTrue();
        expect($order->fresh()->status)->toBe(OrderStatus::CANCELLED);

        // Stock should be restored
        expect($product->fresh()->stock_quantity)->toBe(10);
    });

    test('can cancel order in CONFIRMED status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::CONFIRMED,
        ]);

        $action = app(CancelOrderAction::class);
        $result = $action->execute($order->id);

        expect($result->isSuccess())->toBeTrue();
        expect($order->fresh()->status)->toBe(OrderStatus::CANCELLED);
    });

    test('cannot cancel order in SHIPPED status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        $action = app(CancelOrderAction::class);
        $result = $action->execute($order->id);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('cannot be cancelled');
    });    test('cannot cancel already cancelled order', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::CANCELLED,
        ]);

        $action = app(CancelOrderAction::class);
        $result = $action->execute($order->id);

        expect($result->isSuccess())->toBeFalse();
    });

    test('updates payment status to FAILED when cancelling', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $order->payment()->create([
            'payment_method' => 'vnpay',
            'payment_status' => PaymentStatus::PENDING,
            'amount' => 100000,
        ]);

        $action = app(CancelOrderAction::class);
        $action->execute($order->id);

        expect($order->fresh()->payment->payment_status)->toBe(PaymentStatus::FAILED);
    });
});

describe('Order Data Integrity', function () {

    test('order items maintain product snapshot', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'name' => 'Original Product Name',
            'sku' => 'ORIG-SKU',
            'price' => 100000,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => 2,
            'unit_price' => $product->price,
            'total_price' => $product->price * 2,
        ]);

        // Change product data
        $product->update([
            'name' => 'Updated Product Name',
            'sku' => 'NEW-SKU',
            'price' => 150000,
        ]);

        // Order item should keep original data
        $orderItem = $order->items()->first();
        expect($orderItem->product_name)->toBe('Original Product Name');
        expect($orderItem->product_sku)->toBe('ORIG-SKU');
        expect($orderItem->unit_price)->toBe(100000.0);
    });

    test('order total calculations are correct', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'subtotal' => 300000,
            'shipping_fee' => 30000,
            'discount_amount' => 50000,
            'total_amount' => 280000, // 300000 + 30000 - 50000
        ]);

        $expectedTotal = $order->subtotal + $order->shipping_fee - $order->discount_amount;
        expect($order->total_amount)->toBe($expectedTotal);
    });
});
