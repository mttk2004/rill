<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Services\ContentValidationService;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\post;

test('authenticated user can create review for purchased product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    // Create completed order with the product
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Great product!',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('product_reviews', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Great product!',
    ]);
});

test('user cannot create review without purchasing product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Great product!',
    ]);

    $response->assertForbidden();
});

test('guest cannot create review', function () {
    $product = Product::factory()->create(['status' => 'active']);

    $response = post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Great product!',
    ]);

    $response->assertRedirect(route('login'));
});

test('review requires rating', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'comment' => 'Great product!',
    ]);

    $response->assertSessionHasErrors('rating');
});

test('review requires comment', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
    ]);

    $response->assertSessionHasErrors('comment');
});

test('rating must be between 1 and 5', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 6,
        'comment' => 'Test comment',
    ]);

    $response->assertSessionHasErrors('rating');
});

test('user can update their existing review', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    // Create initial review
    ProductReview::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'rating' => 3,
        'comment' => 'Original comment',
    ]);

    // Update review
    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Updated comment',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('product_reviews', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Updated comment',
    ]);

    // Should still have only one review
    expect(ProductReview::where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->count())->toBe(1);
});

test('review rejects inappropriate content', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    // Mock ContentValidationService to return false
    $this->mock(ContentValidationService::class)
        ->shouldReceive('isClean')
        ->andReturn(false);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Inappropriate content',
    ]);

    $response->assertSessionHasErrors('comment');
});

test('user can delete their own review', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);
    $review = ProductReview::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->delete(route('reviews.destroy', $review));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('product_reviews', [
        'id' => $review->id,
    ]);
});

test('user cannot delete another users review', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);
    $review = ProductReview::factory()->create([
        'user_id' => $otherUser->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->delete(route('reviews.destroy', $review));

    $response->assertRedirect()
        ->assertSessionHas('error');

    $this->assertDatabaseHas('product_reviews', [
        'id' => $review->id,
    ]);
});

test('guest cannot delete review', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);
    $review = ProductReview::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = delete(route('reviews.destroy', $review));

    $response->assertRedirect(route('login'));

    $this->assertDatabaseHas('product_reviews', [
        'id' => $review->id,
    ]);
});

test('comment must have minimum length', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Ok', // Too short
    ]);

    $response->assertSessionHasErrors('comment');
});

test('review updates product rating statistics', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'status' => 'active',
        'rating_avg' => 0,
        'rating_count' => 0,
    ]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    actingAs($user)->post(route('reviews.store', $product), [
        'rating' => 5,
        'comment' => 'Excellent product!',
    ]);

    $product->refresh();
    expect($product->rating_count)->toBeGreaterThan(0);
});
