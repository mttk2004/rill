<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Services\Responses\ServiceResponse;

class ReviewService
{
    /**
     * Check if user can review this product.
     * User must have a delivered order containing the product.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function canUserReview(User $user, Product $product): bool
    {
        return Order::where('user_id', $user->id)
            ->where('status', OrderStatus::DELIVERED)
            ->whereHas('items', fn($query) => $query->where('product_id', $product->id))
            ->exists();
    }

    /**
     * Get user's delivered order item for this product.
     *
     * @param User $user
     * @param Product $product
     * @return OrderItem|null
     */
    public function getUserOrderItem(User $user, Product $product): ?OrderItem
    {
        return OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('status', OrderStatus::DELIVERED);
            })
            ->where('product_id', $product->id)
            ->first();
    }

    /**
     * Create or update a product review.
     *
     * @param User $user
     * @param Product $product
     * @param array $data Array with 'rating' and 'comment' keys
     * @return ServiceResponse
     */
    public function createOrUpdateReview(User $user, Product $product, array $data): ServiceResponse
    {
        // Find order item
        $orderItem = $this->getUserOrderItem($user, $product);

        if (!$orderItem) {
            return ServiceResponse::error(
                'Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng.',
                'ORDER_NOT_DELIVERED'
            );
        }

        // Check for existing review
        $existingReview = ProductReview::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existingReview) {
            // Update existing review
            $existingReview->update([
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]);

            return ServiceResponse::success(
                'Đánh giá của bạn đã được cập nhật.',
                ['review' => $existingReview]
            );
        }

        // Create new review
        $review = ProductReview::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'order_item_id' => $orderItem->id,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
        ]);

        return ServiceResponse::success(
            'Cảm ơn bạn đã đánh giá sản phẩm!',
            ['review' => $review]
        );
    }

    /**
     * Get user's existing review for a product.
     *
     * @param User $user
     * @param Product $product
     * @return ProductReview|null
     */
    public function getUserReview(User $user, Product $product): ?ProductReview
    {
        return ProductReview::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();
    }
}
