<?php

namespace App\Repositories\Contracts;

use App\Models\ProductReview;
use Illuminate\Database\Eloquent\Collection;

interface ReviewRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find user's review for a product.
     *
     * @param int $userId
     * @param string $productId
     * @return ProductReview|null
     */
    public function findUserReview(int $userId, string $productId): ?ProductReview;

    /**
     * Check if user can review this product (has delivered order).
     *
     * @param int $userId
     * @param string $productId
     * @return bool
     */
    public function canUserReview(int $userId, string $productId): bool;

    /**
     * Get user's delivered order item for product.
     *
     * @param int $userId
     * @param string $productId
     * @return \App\Models\OrderItem|null
     */
    public function getUserOrderItem(int $userId, string $productId);

    /**
     * Create a new review.
     *
     * @param array $data
     * @return ProductReview
     */
    public function createReview(array $data): ProductReview;

    /**
     * Update existing review.
     *
     * @param int $reviewId
     * @param array $data
     * @return bool
     */
    public function updateReview(int $reviewId, array $data): bool;

    /**
     * Delete review and its images.
     *
     * @param int $reviewId
     * @return bool
     */
    public function deleteReview(int $reviewId): bool;

    /**
     * Get product reviews with pagination.
     *
     * @param string $productId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getProductReviews(string $productId, int $perPage = 15);
}
