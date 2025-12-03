<?php

namespace App\Services;

use App\Actions\Review\CreateReviewAction;
use App\Actions\Review\DeleteReviewAction;
use App\Actions\Review\UpdateReviewAction;
use App\DataObjects\Review\ReviewData;
use App\Models\ProductReview;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Review Service (Refactored)
 *
 * Orchestrates review operations using Clean Architecture patterns.
 */
class ReviewServiceRefactored
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository,
        protected CreateReviewAction $createReviewAction,
        protected UpdateReviewAction $updateReviewAction,
        protected DeleteReviewAction $deleteReviewAction
    ) {}

    /**
     * Check if user can review this product.
     *
     * @param int $userId
     * @param string $productId
     * @return bool
     */
    public function canUserReview(int $userId, string $productId): bool
    {
        return $this->reviewRepository->canUserReview($userId, $productId);
    }

    /**
     * Get user's review for a product.
     *
     * @param int $userId
     * @param string $productId
     * @return ProductReview|null
     */
    public function getUserReview(int $userId, string $productId): ?ProductReview
    {
        return $this->reviewRepository->findUserReview($userId, $productId);
    }

    /**
     * Create a new product review.
     *
     * @param int $userId
     * @param string $productId
     * @param array $data Array with 'rating', 'comment', and optional 'images' keys
     * @return ServiceResult
     */
    public function createReview(int $userId, string $productId, array $data): ServiceResult
    {
        try {
            // Get order item
            $orderItem = $this->reviewRepository->getUserOrderItem($userId, $productId);

            if (!$orderItem) {
                return ServiceResult::error(
                    'Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng.',
                    ['error_code' => 'ORDER_NOT_DELIVERED']
                );
            }

            // Create ReviewData DTO
            $reviewData = ReviewData::fromRequest($userId, $productId, $orderItem->id, $data);

            // Extract uploaded images if any
            $uploadedImages = $data['images'] ?? null;

            // Execute action
            return $this->createReviewAction->execute($reviewData, $uploadedImages);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Update an existing product review.
     *
     * @param int $reviewId
     * @param int $userId
     * @param string $productId
     * @param array $data Array with 'rating', 'comment', optional 'images' and 'existing_images' keys
     * @return ServiceResult
     */
    public function updateReview(int $reviewId, int $userId, string $productId, array $data): ServiceResult
    {
        try {
            // Get order item (needed for DTO but not validation in update)
            $orderItem = $this->reviewRepository->getUserOrderItem($userId, $productId);

            if (!$orderItem) {
                return ServiceResult::error(
                    'Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng.',
                    ['error_code' => 'ORDER_NOT_DELIVERED']
                );
            }

            // Create ReviewData DTO
            $reviewData = ReviewData::forUpdate($userId, $productId, $orderItem->id, $data);

            // Extract images
            $uploadedImages = $data['images'] ?? null;
            $existingImages = $data['existing_images'] ?? null;

            // Execute action
            return $this->updateReviewAction->execute($reviewId, $reviewData, $uploadedImages, $existingImages);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Delete a product review.
     *
     * @param int $reviewId
     * @param int $userId
     * @return ServiceResult
     */
    public function deleteReview(int $reviewId, int $userId): ServiceResult
    {
        return $this->deleteReviewAction->execute($reviewId, $userId);
    }

    /**
     * Get product reviews with pagination.
     *
     * @param string $productId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getProductReviews(string $productId, int $perPage = 15)
    {
        return $this->reviewRepository->getProductReviews($productId, $perPage);
    }
}
