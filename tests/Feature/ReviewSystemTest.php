<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Services\ReviewService;
use App\Enums\OrderStatus;

describe('Review Creation', function () {

    test('user can review purchased product', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::DELIVERED,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => 1,
            'unit_price' => $product->price,
            'total_price' => $product->price,
        ]);

        $service = app(ReviewService::class);
        $result = $service->createReview($user->id, $product->id, 5, 'Great product!');

        expect($result->isSuccess())->toBeTrue();

        $review = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($review)->not->toBeNull();
        expect($review->rating)->toBe(5);
        expect($review->comment)->toBe('Great product!');
        expect($review->is_verified_purchase)->toBeTrue();
    });

    test('review without purchase is not verified', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $service = app(ReviewService::class);
        $result = $service->createReview($user->id, $product->id, 4, 'Nice product');

        expect($result->isSuccess())->toBeTrue();

        $review = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($review->is_verified_purchase)->toBeFalse();
    });

    test('user cannot review same product twice', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'First review',
        ]);

        $service = app(ReviewService::class);
        $result = $service->createReview($user->id, $product->id, 4, 'Second review');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('already reviewed');
    });

    test('rating must be between 1 and 5', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $service = app(ReviewService::class);

        $resultLow = $service->createReview($user->id, $product->id, 0, 'Bad rating');
        expect($resultLow->isSuccess())->toBeFalse();

        $resultHigh = $service->createReview($user->id, $product->id, 6, 'Bad rating');
        expect($resultHigh->isSuccess())->toBeFalse();
    });

    test('review can have optional comment', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $service = app(ReviewService::class);
        $result = $service->createReview($user->id, $product->id, 5, null);

        expect($result->isSuccess())->toBeTrue();

        $review = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($review->comment)->toBeNull();
    });
});

describe('Rating Calculation', function () {

    test('calculates average rating correctly', function () {
        $product = Product::factory()->create(['average_rating' => 0, 'review_count' => 0]);

        Review::factory()->create(['product_id' => $product->id, 'rating' => 5]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 4]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 3]);

        $service = app(ReviewService::class);
        $service->updateProductRatings($product->id);

        $product->refresh();
        expect($product->average_rating)->toBe(4.0);
        expect($product->review_count)->toBe(3);
    });

    test('updates rating when new review added', function () {
        $product = Product::factory()->create([
            'average_rating' => 4.0,
            'review_count' => 2,
        ]);

        Review::factory()->create(['product_id' => $product->id, 'rating' => 5]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 3]);

        Review::factory()->create(['product_id' => $product->id, 'rating' => 5]);

        $service = app(ReviewService::class);
        $service->updateProductRatings($product->id);

        $product->refresh();
        $expectedAvg = (5 + 3 + 5) / 3;
        expect($product->average_rating)->toBe($expectedAvg);
        expect($product->review_count)->toBe(3);
    });

    test('rating becomes zero when all reviews deleted', function () {
        $product = Product::factory()->create([
            'average_rating' => 4.5,
            'review_count' => 5,
        ]);

        Review::where('product_id', $product->id)->delete();

        $service = app(ReviewService::class);
        $service->updateProductRatings($product->id);

        $product->refresh();
        expect($product->average_rating)->toBe(0.0);
        expect($product->review_count)->toBe(0);
    });
});

describe('Review Management', function () {

    test('user can update their own review', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 4,
            'comment' => 'Original comment',
        ]);

        $service = app(ReviewService::class);
        $result = $service->updateReview($review->id, $user->id, 5, 'Updated comment');

        expect($result->isSuccess())->toBeTrue();

        $review->refresh();
        expect($review->rating)->toBe(5);
        expect($review->comment)->toBe('Updated comment');
    });

    test('user cannot update other users review', function () {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $product = Product::factory()->create();

        $review = Review::create([
            'user_id' => $user1->id,
            'product_id' => $product->id,
            'rating' => 4,
            'comment' => 'Original',
        ]);

        $service = app(ReviewService::class);
        $result = $service->updateReview($review->id, $user2->id, 5, 'Hacked');

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not authorized');
    });

    test('user can delete their own review', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create(['review_count' => 1, 'average_rating' => 5.0]);

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Will delete',
        ]);

        $service = app(ReviewService::class);
        $result = $service->deleteReview($review->id, $user->id);

        expect($result->isSuccess())->toBeTrue();
        expect(Review::find($review->id))->toBeNull();
    });

    test('admin can delete any review', function () {
        $user = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 1,
            'comment' => 'Spam review',
        ]);

        $service = app(ReviewService::class);
        $result = $service->deleteReviewAsAdmin($review->id, $admin->id);

        expect($result->isSuccess())->toBeTrue();
        expect(Review::find($review->id))->toBeNull();
    });
});

describe('Review Filtering', function () {

    test('can filter reviews by rating', function () {
        $product = Product::factory()->create();

        Review::factory()->create(['product_id' => $product->id, 'rating' => 5]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 5]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 4]);
        Review::factory()->create(['product_id' => $product->id, 'rating' => 3]);

        $fiveStarReviews = Review::where('product_id', $product->id)
            ->where('rating', 5)
            ->count();

        expect($fiveStarReviews)->toBe(2);
    });

    test('can filter verified purchase reviews', function () {
        $product = Product::factory()->create();

        Review::factory()->create([
            'product_id' => $product->id,
            'is_verified_purchase' => true,
        ]);
        Review::factory()->create([
            'product_id' => $product->id,
            'is_verified_purchase' => true,
        ]);
        Review::factory()->create([
            'product_id' => $product->id,
            'is_verified_purchase' => false,
        ]);

        $verifiedReviews = Review::where('product_id', $product->id)
            ->where('is_verified_purchase', true)
            ->count();

        expect($verifiedReviews)->toBe(2);
    });

    test('shows most recent reviews first', function () {
        $product = Product::factory()->create();

        $oldReview = Review::factory()->create([
            'product_id' => $product->id,
            'created_at' => now()->subDays(10),
        ]);

        $newReview = Review::factory()->create([
            'product_id' => $product->id,
            'created_at' => now(),
        ]);

        $reviews = Review::where('product_id', $product->id)
            ->orderBy('created_at', 'desc')
            ->get();

        expect($reviews->first()->id)->toBe($newReview->id);
    });
});
