<?php

use App\Enums\OrderStatus;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Services\OrderServiceRefactored;
use Illuminate\Support\Facades\DB;

uses()->group('stock-control');

test('stock is decremented when order is created', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user = User::factory()->create();
    $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => $product->price,
    ]);

    // Act
    $orderService = app(OrderServiceRefactored::class);
    $order = $orderService->createOrderFromCart($user, [
        'shipping_address_id' => $shippingAddress->id,
        'payment_method' => 'cod',
    ]);

    // Assert
    expect($product->fresh()->stock_quantity)->toBe(7);
    expect($order->items)->toHaveCount(1);
    expect($order->items->first()->quantity)->toBe(3);
});

test('order creation fails when insufficient stock', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 2,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user = User::factory()->create();
    $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 5, // More than stock
        'unit_price' => $product->price,
    ]);

    // Act & Assert
    $orderService = app(OrderServiceRefactored::class);

    expect(fn() => $orderService->createOrderFromCart($user, [
        'shipping_address_id' => $shippingAddress->id,
        'payment_method' => 'cod',
    ]))->toThrow(Exception::class, 'không đủ số lượng');

    // Stock should remain unchanged
    expect($product->fresh()->stock_quantity)->toBe(2);
});

test('product status changes to out_of_stock when stock reaches zero', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 3,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user = User::factory()->create();
    $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 3, // Exact stock
        'unit_price' => $product->price,
    ]);

    // Act
    $orderService = app(OrderServiceRefactored::class);
    $orderService->createOrderFromCart($user, [
        'shipping_address_id' => $shippingAddress->id,
        'payment_method' => 'cod',
    ]);

    // Assert
    $product->refresh();
    expect($product->stock_quantity)->toBe(0);
    expect($product->status)->toBe('out_of_stock');
});

test('stock is restored when order is cancelled', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user = User::factory()->create();
    $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 4,
        'unit_price' => $product->price,
    ]);

    $orderService = app(OrderServiceRefactored::class);
    $order = $orderService->createOrderFromCart($user, [
        'shipping_address_id' => $shippingAddress->id,
        'payment_method' => 'cod',
    ]);

    expect($product->fresh()->stock_quantity)->toBe(6);

    // Act
    $orderService->cancelOrder($order);

    // Assert
    expect($product->fresh()->stock_quantity)->toBe(10);
    expect($order->fresh()->status)->toBe(OrderStatus::CANCELLED);
});

test('cancelled order cannot be cancelled again', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user = User::factory()->create();
    $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => $product->price,
    ]);

    $orderService = app(OrderServiceRefactored::class);
    $order = $orderService->createOrderFromCart($user, [
        'shipping_address_id' => $shippingAddress->id,
        'payment_method' => 'cod',
    ]);

    $orderService->cancelOrder($order);

    // Act & Assert
    expect(fn() => $orderService->cancelOrder($order))
        ->toThrow(Exception::class, 'đã hủy');
});

test('concurrent orders cannot oversell', function () {
    // Arrange
    $product = Product::factory()->create([
        'stock_quantity' => 1,
        'status' => 'active',
        'price' => 100000,
    ]);

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $address1 = ShippingAddress::factory()->create(['user_id' => $user1->id]);
    $address2 = ShippingAddress::factory()->create(['user_id' => $user2->id]);

    ShoppingCartItem::create([
        'user_id' => $user1->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    ShoppingCartItem::create([
        'user_id' => $user2->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    // Act - Simulate concurrent requests
    $orderService = app(OrderServiceRefactored::class);
    $success1 = false;
    $success2 = false;

    try {
        DB::transaction(function () use ($orderService, $user1, $address1, &$success1) {
            $orderService->createOrderFromCart($user1, [
                'shipping_address_id' => $address1->id,
                'payment_method' => 'cod',
            ]);
            $success1 = true;
        });
    } catch (Exception $e) {
        // Expected for one of the orders
    }

    try {
        DB::transaction(function () use ($orderService, $user2, $address2, &$success2) {
            $orderService->createOrderFromCart($user2, [
                'shipping_address_id' => $address2->id,
                'payment_method' => 'cod',
            ]);
            $success2 = true;
        });
    } catch (Exception $e) {
        // Expected for one of the orders
    }

    // Assert - Only one order should succeed
    expect($success1 xor $success2)->toBeTrue('Exactly one order should succeed');
    expect($product->fresh()->stock_quantity)->toBe(0);
    expect($success1 && $success2)->toBeFalse('Both orders must not succeed - overselling detected!');
});
