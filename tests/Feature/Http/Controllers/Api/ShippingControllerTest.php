<?php

use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Services\CartService;
use App\Services\SettingService;
use App\Services\ShippingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

test('can calculate shipping fee with valid address', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);

    // Mock CartService
    $mockCartService = Mockery::mock(CartService::class);
    $mockCartService->shouldReceive('getCartSummary')
        ->once()
        ->andReturn([
            'total_amount' => 500000,
            'total_items' => 2,
        ]);

    // Mock ShippingService
    $mockShippingService = Mockery::mock(ShippingService::class);
    $mockShippingService->shouldReceive('estimateWeight')
        ->with(2)
        ->once()
        ->andReturn(1000);

    $mockShippingService->shouldReceive('calculateFee')
        ->once()
        ->andReturn((object)[
            'success' => true,
            'data' => [
                'fee' => 30000,
                'is_free_shipping' => false,
            ],
        ]);

    $mockShippingService->shouldReceive('getFreeShippingThreshold')
        ->once()
        ->andReturn(1000000);

    $this->app->instance(CartService::class, $mockCartService);
    $this->app->instance(ShippingService::class, $mockShippingService);

    $response = $this->postJson(route('api.shipping.calculate'), [
        'address_id' => $address->id,
    ]);

    $response->assertOk()
        ->assertJson([
            'shipping_fee' => 30000,
            'is_free_shipping' => false,
            'cart_total' => 500000,
            'total_amount' => 530000,
        ]);
});

test('calculate shipping fails without address_id', function () {
    $response = $this->postJson(route('api.shipping.calculate'), []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('address_id');
});

test('calculate shipping fails with non-existent address', function () {
    $response = $this->postJson(route('api.shipping.calculate'), [
        'address_id' => 99999,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('address_id');
});

test('returns zero shipping fee for empty cart', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);

    // Mock CartService with empty cart
    $mockCartService = Mockery::mock(CartService::class);
    $mockCartService->shouldReceive('getCartSummary')
        ->once()
        ->andReturn([
            'total_amount' => 0,
            'total_items' => 0,
        ]);

    $this->app->instance(CartService::class, $mockCartService);

    $response = $this->postJson(route('api.shipping.calculate'), [
        'address_id' => $address->id,
    ]);

    $response->assertOk()
        ->assertJson([
            'shipping_fee' => 0,
            'is_free_shipping' => false,
            'cart_total' => 0,
            'total_amount' => 0,
        ]);
});

test('applies free shipping when threshold is met', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);

    // Mock CartService with cart over threshold
    $mockCartService = Mockery::mock(CartService::class);
    $mockCartService->shouldReceive('getCartSummary')
        ->once()
        ->andReturn([
            'total_amount' => 1500000,
            'total_items' => 3,
        ]);

    // Mock ShippingService
    $mockShippingService = Mockery::mock(ShippingService::class);
    $mockShippingService->shouldReceive('estimateWeight')
        ->with(3)
        ->once()
        ->andReturn(1500);

    $mockShippingService->shouldReceive('calculateFee')
        ->once()
        ->andReturn((object)[
            'success' => true,
            'data' => [
                'fee' => 0,
                'is_free_shipping' => true,
            ],
        ]);

    $mockShippingService->shouldReceive('getFreeShippingThreshold')
        ->once()
        ->andReturn(1000000);

    $this->app->instance(CartService::class, $mockCartService);
    $this->app->instance(ShippingService::class, $mockShippingService);

    $response = $this->postJson(route('api.shipping.calculate'), [
        'address_id' => $address->id,
    ]);

    $response->assertOk()
        ->assertJson([
            'shipping_fee' => 0,
            'is_free_shipping' => true,
            'cart_total' => 1500000,
            'total_amount' => 1500000,
        ]);
});
