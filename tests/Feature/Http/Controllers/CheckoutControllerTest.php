<?php

use App\Enums\PaymentMethod;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Services\VnpayService;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('guest cannot access checkout page', function () {
    $response = get(route('checkout.show'));

    $response->assertRedirect(route('login'));
});

test('authenticated user can view checkout page', function () {
    $user = User::factory()->create();
    ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => true,
    ]);
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('checkout.show'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout')
            ->has('cartItems')
            ->has('cartSummary')
            ->has('addresses')
            ->has('defaultShippingAddress')
        );
});

test('checkout redirects if user has no addresses', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('checkout.show'));

    $response->assertRedirect(route('addresses.index'))
        ->assertSessionHas('error');
});

test('checkout redirects if cart is empty', function () {
    $user = User::factory()->create();
    ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => true,
    ]);

    $response = actingAs($user)->get(route('checkout.show'));

    $response->assertRedirect(route('cart'));
});

test('user can place order with COD payment', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => true,
    ]);
    $product = Product::factory()->create([
        'status' => 'active',
        'stock_quantity' => 10,
        'price' => 100000,
    ]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => $product->price,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $address->id,
        'payment_method' => PaymentMethod::COD->value,
        'notes' => 'Test order',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'payment_method' => PaymentMethod::COD->value,
    ]);
});

test('order requires shipping address', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'payment_method' => PaymentMethod::COD->value,
    ]);

    $response->assertSessionHasErrors('shipping_address_id');
});

test('order requires payment method', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $address->id,
    ]);

    $response->assertSessionHasErrors('payment_method');
});

test('order with VNPAY returns payment URL', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create([
        'status' => 'active',
        'stock_quantity' => 10,
        'price' => 100000,
    ]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    // Mock VnpayService
    $this->mock(VnpayService::class)
        ->shouldReceive('createPaymentUrl')
        ->andReturn((object)[
            'success' => true,
            'data' => ['payment_url' => 'https://sandbox.vnpayment.vn/test'],
        ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $address->id,
        'payment_method' => PaymentMethod::VNPAY->value,
    ]);

    $response->assertJson([
        'payment_url' => 'https://sandbox.vnpayment.vn/test',
    ]);
});

test('checkout fails when product out of stock', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create([
        'status' => 'active',
        'stock_quantity' => 0, // Out of stock
        'price' => 100000,
    ]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $address->id,
        'payment_method' => PaymentMethod::COD->value,
    ]);

    $response->assertSessionHasErrors();
});

test('checkout clears cart after successful order', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create([
        'status' => 'active',
        'stock_quantity' => 10,
        'price' => 100000,
    ]);
    $cartItem = ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => $product->price,
    ]);

    actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $address->id,
        'payment_method' => PaymentMethod::COD->value,
    ]);

    $this->assertDatabaseMissing('shopping_cart_items', [
        'id' => $cartItem->id,
    ]);
});

test('checkout validates shipping address belongs to user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherAddress = ShippingAddress::factory()->create(['user_id' => $otherUser->id]);
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), [
        'shipping_address_id' => $otherAddress->id,
        'payment_method' => PaymentMethod::COD->value,
    ]);

    $response->assertSessionHasErrors('shipping_address_id');
});

test('checkout displays default shipping address', function () {
    $user = User::factory()->create();
    $defaultAddress = ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => true,
    ]);
    ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => false,
    ]);
    $product = Product::factory()->create(['status' => 'active', 'stock_quantity' => 10]);
    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('checkout.show'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout')
            ->where('defaultShippingAddress.id', $defaultAddress->id)
        );
});
