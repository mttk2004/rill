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
class ReviewService
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
            $reviewData = ReviewData::forUpdate($userId, $productId, $orderItem->id, $data);

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
            \Log::info('[REVIEW UPDATE] Starting update', [
                'review_id' => $reviewId,
                'user_id' => $userId,
                'product_id' => $productId,
                'data' => $data,
            ]);

            // Get existing review to find order_item_id
            $existingReview = $this->reviewRepository->find($reviewId);

            \Log::info('[REVIEW UPDATE] Existing review found', [
                'review' => $existingReview ? [
                    'id' => $existingReview->id,
                    'user_id' => $existingReview->user_id,
                    'product_id' => $existingReview->product_id,
                    'order_item_id' => $existingReview->order_item_id,
                ] : null,
            ]);

            if (!$existingReview) {
                \Log::error('[REVIEW UPDATE] Review not found');
                return ServiceResult::error(
                    'Không tìm thấy đánh giá.',
                    ['error_code' => 'REVIEW_NOT_FOUND']
                );
            }

            // Verify ownership (early check)
            \Log::info('[REVIEW UPDATE] Checking ownership', [
                'existing_user_id' => $existingReview->user_id,
                'existing_user_id_type' => gettype($existingReview->user_id),
                'current_user_id' => $userId,
                'current_user_id_type' => gettype($userId),
                'strict_match' => $existingReview->user_id === $userId,
                'loose_match' => $existingReview->user_id == $userId,
            ]);

            // Use loose comparison (==) because DB returns string but Auth::id() might return int
            if ($existingReview->user_id != $userId) {
                \Log::error('[REVIEW UPDATE] Ownership check failed');
                return ServiceResult::error(
                    'Bạn không có quyền chỉnh sửa đánh giá này.',
                    ['error_code' => 'UNAUTHORIZED']
                );
            }            // Use existing order_item_id from review
            $reviewData = ReviewData::forUpdate($userId, $productId, $existingReview->order_item_id, $data);

            // Extract images
            $uploadedImages = $data['images'] ?? null;
            $existingImages = $data['existing_images'] ?? null;

            \Log::info('[REVIEW UPDATE] Executing action', [
                'review_data' => [
                    'user_id' => $reviewData->userId,
                    'product_id' => $reviewData->productId,
                    'rating' => $reviewData->rating,
                    'comment' => $reviewData->comment,
                ],
            ]);

            // Execute action
            $result = $this->updateReviewAction->execute($reviewId, $reviewData, $uploadedImages, $existingImages);

            \Log::info('[REVIEW UPDATE] Action completed', [
                'success' => $result->isSuccess(),
                'message' => $result->message,
            ]);

            return $result;
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
