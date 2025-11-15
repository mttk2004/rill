<?php

use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Services\ShippingService;

beforeEach(function () {
    $this->seed(\Database\Seeders\UserSeeder::class);
    $this->seed(\Database\Seeders\CategorySeeder::class);
    $this->seed(\Database\Seeders\ArtistSeeder::class);
    $this->seed(\Database\Seeders\ProductSeeder::class);
    $this->seed(\Database\Seeders\ShippingAddressSeeder::class);
});

test('authenticated user can calculate shipping fee', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $product = Product::first();
    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    $address = ShippingAddress::where('user_id', $user->id)
        ->whereNotNull('ward_id')
        ->where('ward_id', '!=', '')
        ->first();

    expect($address)->not->toBeNull();

    $response = $this->postJson('/checkout/shipping-fee', [
        'address_id' => $address->id,
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['shipping_fee', 'is_free_shipping', 'cart_total', 'total_amount']);

    $data = $response->json();
    expect($data['shipping_fee'])->toBeInt()->toBeGreaterThanOrEqual(0);
});

test('free shipping for orders over 1 million VND', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $product = Product::first();
    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => 400000,
    ]);

    $address = ShippingAddress::where('user_id', $user->id)
        ->whereNotNull('ward_id')
        ->where('ward_id', '!=', '')
        ->first();

    $response = $this->postJson('/checkout/shipping-fee', [
        'address_id' => $address->id,
    ]);

    $response->assertOk()->assertJson(['shipping_fee' => 0, 'is_free_shipping' => true]);
});

test('empty cart returns zero fee', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $address = ShippingAddress::where('user_id', $user->id)->first();

    $response = $this->postJson('/checkout/shipping-fee', ['address_id' => $address->id]);

    $response->assertOk()->assertJson(['shipping_fee' => 0, 'cart_total' => 0]);
});

test('missing ward_id returns fallback fee', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $product = Product::first();
    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    $address = ShippingAddress::create([
        'user_id' => $user->id,
        'full_name' => 'Test',
        'phone' => '0123456789',
        'address_line_1' => 'Test',
        'province' => 'Test',
        'province_id' => 201,
        'district' => 'Test',
        'district_id' => 1442,
        'ward' => 'Test',
        'ward_id' => '',
        'is_default' => false,
    ]);

    $response = $this->postJson('/checkout/shipping-fee', ['address_id' => $address->id]);

    $response->assertOk()->assertJson(['shipping_fee' => 50000]);
});

test('shipping service estimates 1kg for all orders', function () {
    $service = app(ShippingService::class);

    expect($service->estimateWeight(0))->toBe(1000);
    expect($service->estimateWeight(1))->toBe(1000);
    expect($service->estimateWeight(10))->toBe(1000);
});

test('requires authentication', function () {
    $address = ShippingAddress::first();
    $response = $this->postJson('/checkout/shipping-fee', ['address_id' => $address->id]);
    $response->assertUnauthorized();
});

test('validates address_id parameter', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $this->postJson('/checkout/shipping-fee', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['address_id']);

    $this->postJson('/checkout/shipping-fee', ['address_id' => '999999999'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['address_id']);
});

test('order includes calculated shipping fee', function () {
    $user = User::where('email', 'nguyenvananh@gmail.com')->first();
    $this->actingAs($user);

    $product = Product::first();
    ShoppingCartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 200000,
    ]);

    $address = ShippingAddress::where('user_id', $user->id)
        ->whereNotNull('ward_id')
        ->where('ward_id', '!=', '')
        ->first();

    $this->post('/orders', [
        'shipping_address_id' => $address->id,
        'payment_method' => 'cod',
    ])->assertRedirect();

    $order = $user->orders()->latest()->first();
    expect($order)->not->toBeNull();
    expect($order->shipping_fee)->toBeInt()->toBeGreaterThanOrEqual(0);
    expect($order->total_amount)->toBe($order->subtotal + $order->shipping_fee - $order->discount_amount);
});
