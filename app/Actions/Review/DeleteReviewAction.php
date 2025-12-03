<?php

namespace App\Actions\Review;

use App\Actions\BaseAction;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Delete Review Action
 *
 * Handles deleting product reviews and cleaning up associated images.
 */
class DeleteReviewAction extends BaseAction
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository
    ) {}

    /**
     * Execute delete review action.
     *
     * @param int $reviewId
     * @param int $userId
     * @return ServiceResult
     */
    public function execute(int $reviewId, int $userId): ServiceResult
    {
        return DB::transaction(function () use ($reviewId, $userId) {
            // Get review
            $review = $this->reviewRepository->find($reviewId);

            if (!$review) {
                return ServiceResult::error(
                    'Không tìm thấy đánh giá.',
                    ['error_code' => 'REVIEW_NOT_FOUND']
                );
            }

            // Verify ownership
            if ($review->user_id !== $userId) {
                return ServiceResult::error(
                    'Bạn không có quyền xóa đánh giá này.',
                    ['error_code' => 'UNAUTHORIZED']
                );
            }

            // Delete review (repository handles image cleanup)
            $deleted = $this->reviewRepository->deleteReview($reviewId);

            if (!$deleted) {
                return ServiceResult::error('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
            }

            return ServiceResult::success(
                [],
                'Đánh giá của bạn đã được xóa.'
            );
        });
    }
}
