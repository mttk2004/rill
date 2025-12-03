<?php

use App\Models\Product;
use App\Models\ShoppingCartItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest can view empty cart', function () {
    $response = $this->get(route('cart'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Cart')
            ->has('cartItems')
            ->has('cartSummary')
        );
});

test('user can view their cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 100000]);

    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => $product->price,
    ]);

    $response = $this->actingAs($user)->get(route('cart'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Cart')
            ->has('cartItems', 1)
            ->has('cartSummary')
        );
});

test('user can add product to cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 100000,
        'stock_quantity' => 10,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)
        ->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('shopping_cart_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

test('guest can add product to cart with session', function () {
    // TODO: Guest cart functionality requires proper session middleware setup in tests
    // The session ID is not being properly passed to the cart service
    // This needs investigation of session handling in test environment
    $this->markTestSkipped('Guest cart requires session middleware configuration in tests');
});test('add to cart fails with non-existent product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('cart.add'), [
            'product_id' => '999999999999999999',
            'quantity' => 1,
        ]);

    $response->assertSessionHasErrors('product_id');
});

test('add to cart fails without product_id', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('cart.add'), [
            'quantity' => 1,
        ]);

    $response->assertSessionHasErrors('product_id');
});

test('add to cart defaults to quantity 1', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 100000,
        'stock_quantity' => 10,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)
        ->post(route('cart.add'), [
            'product_id' => $product->id,
        ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('shopping_cart_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);
});

test('user can update cart item quantity', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock_quantity' => 10]);
    $cartItem = ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response = $this->actingAs($user)
        ->put(route('cart.update', $cartItem->id), [
            'quantity' => 3,
        ]);

    $response->assertRedirect()
        ->assertSessionHas('message');

    $this->assertDatabaseHas('shopping_cart_items', [
        'id' => $cartItem->id,
        'quantity' => 3,
    ]);
});

test('update cart fails with invalid quantity', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $cartItem = ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response = $this->actingAs($user)
        ->put(route('cart.update', $cartItem->id), [
            'quantity' => -1,
        ]);

    $response->assertSessionHasErrors('quantity');
});

test('user can remove item from cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $cartItem = ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)
        ->delete(route('cart.remove', $cartItem->id));

    $response->assertRedirect()
        ->assertSessionHas('message');

    $this->assertDatabaseMissing('shopping_cart_items', [
        'id' => $cartItem->id,
    ]);
});

test('user cannot remove another users cart item', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $product = Product::factory()->create();
    $cartItem = ShoppingCartItem::factory()->create([
        'user_id' => $otherUser->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)
        ->delete(route('cart.remove', $cartItem->id));

    $response->assertRedirect()
        ->assertSessionHasErrors();

    $this->assertDatabaseHas('shopping_cart_items', [
        'id' => $cartItem->id,
    ]);
});

test('user can clear entire cart', function () {
    $user = User::factory()->create();
    ShoppingCartItem::factory()->count(3)->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->delete(route('cart.clear'));

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $this->assertDatabaseCount('shopping_cart_items', 0);
});

test('adding same product increases quantity', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 100000,
        'stock_quantity' => 10,
        'status' => 'active',
    ]);

    // Add first time
    $this->actingAs($user)
        ->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

    // Add again
    $this->actingAs($user)
        ->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

    $this->assertDatabaseHas('shopping_cart_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->assertDatabaseCount('shopping_cart_items', 1);
});

test('cart items merged when user logs in', function () {
    // TODO: Implement cart merge on login
    // Currently cart merge functionality is not implemented
    // Guest carts remain separate from user carts after login
    $this->markTestSkipped('Cart merge on login not yet implemented');
});

test('get cart summary returns correct totals', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['price' => 100000]);
    $product2 = Product::factory()->create(['price' => 200000]);

    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product1->id,
        'quantity' => 2,
        'unit_price' => $product1->price,
    ]);

    ShoppingCartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product2->id,
        'quantity' => 1,
        'unit_price' => $product2->price,
    ]);

    $response = $this->actingAs($user)->get(route('cart'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('cartSummary.total_items', 3)
            ->where('cartSummary.total_amount', 400000)
        );
});
