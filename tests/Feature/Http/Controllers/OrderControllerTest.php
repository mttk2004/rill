<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('guest cannot view orders list', function () {
    $response = get(route('orders.index'));

    $response->assertRedirect(route('login'));
});

test('user can view their orders list', function () {
    $user = User::factory()->create();
    Order::factory()->count(3)->create(['user_id' => $user->id]);

    $response = actingAs($user)->get(route('orders.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Orders')
            ->has('orders')
        );
});

test('user only sees their own orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $userOrder = Order::factory()->create(['user_id' => $user->id]);
    $otherOrder = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = actingAs($user)->get(route('orders.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Orders')
            ->where('orders.data', function ($orders) use ($userOrder, $otherOrder) {
                $orderIds = collect($orders)->pluck('id')->toArray();
                return in_array($userOrder->id, $orderIds)
                    && !in_array($otherOrder->id, $orderIds);
            })
        );
});

test('user can filter orders by status', function () {
    $user = User::factory()->create();
    Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::PENDING->value,
    ]);
    Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::COMPLETED->value,
    ]);

    $response = actingAs($user)->get(route('orders.index', ['status' => OrderStatus::PENDING->value]));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Orders')
            ->where('filters.status', OrderStatus::PENDING->value)
        );
});

test('guest cannot view order details', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = get(route('orders.show', $order));

    $response->assertRedirect(route('login'));
});

test('user can view their order details', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['status' => 'active']);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('OrderDetail')
            ->where('order.id', $order->id)
        );
});

test('user cannot view another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrder = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = actingAs($user)->get(route('orders.show', $otherOrder));

    $response->assertForbidden();
});

test('order details include items with products', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['status' => 'active']);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('OrderDetail')
            ->has('order.items')
        );
});

test('user can view thank you page for their order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = actingAs($user)->get(route('orders.thank-you', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ThankYou')
        );
});

test('user cannot view thank you page for another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrder = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = actingAs($user)->get(route('orders.thank-you', $otherOrder));

    $response->assertStatus(404);
});

test('user can cancel pending order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::PENDING->value,
    ]);

    $response = actingAs($user)->post(route('orders.cancel', $order));

    $response->assertRedirect();
    $order->refresh();
    expect($order->status)->toBe(OrderStatus::CANCELLED->value);
});

test('user cannot cancel completed order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::COMPLETED->value,
    ]);

    $response = actingAs($user)->post(route('orders.cancel', $order));

    $response->assertRedirect()
        ->assertSessionHas('error');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::COMPLETED->value);
});

test('user cannot cancel another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrder = Order::factory()->create([
        'user_id' => $otherUser->id,
        'status' => OrderStatus::PENDING->value,
    ]);

    $response = actingAs($user)->post(route('orders.cancel', $otherOrder));

    $response->assertForbidden();
});

test('orders are paginated', function () {
    $user = User::factory()->create();
    Order::factory()->count(20)->create(['user_id' => $user->id]);

    $response = actingAs($user)->get(route('orders.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Orders')
            ->has('orders.data')
        );
});

test('order details show payment information', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'payment_method' => PaymentMethod::VNPAY->value,
    ]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('OrderDetail')
            ->where('order.payment_method', PaymentMethod::VNPAY->value)
        );
});

test('order details show status history', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('OrderDetail')
            ->has('order.status_histories')
        );
});

test('order details show shipping address', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
    ]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('OrderDetail')
            ->where('order.shipping_address_id', $address->id)
        );
});
