<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;

test('authenticated user can create review for delivered product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    // Create a delivered order with this product
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::DELIVERED,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)->post(route('products.reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Great vinyl! Excellent quality and fast shipping.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    expect(ProductReview::where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->exists())->toBeTrue();
});

test('user cannot review product without delivered order', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->post(route('products.reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Trying to review without purchasing.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');

    expect(ProductReview::where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->exists())->toBeFalse();
});

test('review with inappropriate content is rejected', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    // Create a delivered order
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::DELIVERED,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)->post(route('products.reviews.store', $product), [
        'rating' => 1,
        'comment' => 'This is a spam product, total scam!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('comment');

    expect(ProductReview::where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->exists())->toBeFalse();
});

test('user can update existing review', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    // Create a delivered order
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::DELIVERED,
    ]);

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    // Create initial review
    $review = ProductReview::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'order_item_id' => $orderItem->id,
        'rating' => 3,
        'comment' => 'Initial review',
    ]);

    // Update review
    $response = $this->actingAs($user)->post(route('products.reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Updated review - much better after listening more!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $review->refresh();
    expect($review->rating)->toBe(5);
    expect($review->comment)->toBe('Updated review - much better after listening more!');
});

test('guest cannot create review', function () {
    $product = Product::factory()->create();

    $response = $this->post(route('products.reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Guest trying to review.',
    ]);

    $response->assertRedirect(route('login'));
});
