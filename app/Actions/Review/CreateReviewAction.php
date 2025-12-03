<?php

namespace App\Actions\Review;

use App\Actions\BaseAction;
use App\DataObjects\Review\ReviewData;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Create Review Action
 *
 * Handles creating new product reviews with image uploads.
 */
class CreateReviewAction extends BaseAction
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository
    ) {}

    /**
     * Execute create review action.
     *
     * @param ReviewData $data
     * @param array|null $uploadedImages Array of UploadedFile objects
     * @return ServiceResult
     */
    public function execute(ReviewData $data, ?array $uploadedImages = null): ServiceResult
    {
        return DB::transaction(function () use ($data, $uploadedImages) {
            // Check if user can review (has delivered order)
            if (!$this->reviewRepository->canUserReview($data->userId, $data->productId)) {
                return ServiceResult::error(
                    'Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng.',
                    ['error_code' => 'ORDER_NOT_DELIVERED']
                );
            }

            // Check for existing review
            $existingReview = $this->reviewRepository->findUserReview($data->userId, $data->productId);
            if ($existingReview) {
                return ServiceResult::error(
                    'Bạn đã đánh giá sản phẩm này rồi.',
                    ['error_code' => 'REVIEW_ALREADY_EXISTS']
                );
            }

            // Handle image uploads
            $imagePaths = [];
            if ($uploadedImages && is_array($uploadedImages)) {
                foreach ($uploadedImages as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        // Store image to Supabase in 'reviews' folder
                        $path = $image->store('reviews', 'supabase');
                        $imagePaths[] = $path;
                    }
                }
            }

            // Create review
            $reviewArray = $data->toArray();
            $reviewArray['images'] = !empty($imagePaths) ? $imagePaths : null;

            $review = $this->reviewRepository->createReview($reviewArray);

            return ServiceResult::success(
                ['review' => $review],
                'Cảm ơn bạn đã đánh giá sản phẩm!'
            );
        });
    }
}
