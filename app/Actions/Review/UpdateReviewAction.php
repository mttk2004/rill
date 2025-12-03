<?php

namespace App\Actions\Review;

use App\Actions\BaseAction;
use App\DataObjects\Review\ReviewData;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Update Review Action
 *
 * Handles updating existing product reviews with image management.
 */
class UpdateReviewAction extends BaseAction
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository
    ) {}

    /**
     * Execute update review action.
     *
     * @param int $reviewId
     * @param ReviewData $data
     * @param array|null $uploadedImages New uploaded images
     * @param array|null $existingImages URLs of existing images to keep
     * @return ServiceResult
     */
    public function execute(
        int $reviewId,
        ReviewData $data,
        ?array $uploadedImages = null,
        ?array $existingImages = null
    ): ServiceResult {
        return DB::transaction(function () use ($reviewId, $data, $uploadedImages, $existingImages) {
            // Get existing review
            $review = $this->reviewRepository->find($reviewId);

            if (!$review) {
                return ServiceResult::error(
                    'Không tìm thấy đánh giá.',
                    ['error_code' => 'REVIEW_NOT_FOUND']
                );
            }

            // Verify ownership
            if ($review->user_id !== $data->userId) {
                return ServiceResult::error(
                    'Bạn không có quyền chỉnh sửa đánh giá này.',
                    ['error_code' => 'UNAUTHORIZED']
                );
            }

            // Process image paths
            $imagePaths = [];

            // Keep existing images that user wants to preserve
            if ($existingImages && is_array($existingImages)) {
                $supabaseUrl = env('SUPABASE_URL');
                $bucket = env('SUPABASE_BUCKET');
                $baseUrl = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/";

                foreach ($existingImages as $url) {
                    // Extract path from URL
                    if (str_starts_with($url, $baseUrl)) {
                        $path = str_replace($baseUrl, '', $url);
                        $imagePaths[] = $path;
                    }
                }
            }

            // Delete images that are being removed
            if (!empty($review->images)) {
                $keptPaths = $imagePaths;
                $oldPaths = $review->images;

                $pathsToDelete = array_diff($oldPaths, $keptPaths);

                foreach ($pathsToDelete as $path) {
                    try {
                        Storage::disk('supabase')->delete($path);
                    } catch (\Exception $e) {
                        Log::warning("Failed to delete review image: {$path}. Error: " . $e->getMessage());
                    }
                }
            }

            // Add new uploaded images
            if ($uploadedImages && is_array($uploadedImages)) {
                foreach ($uploadedImages as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $path = $image->store('reviews', 'supabase');
                        $imagePaths[] = $path;
                    }
                }
            }

            // Update review
            $updateData = [
                'rating' => $data->rating,
                'comment' => $data->comment,
                'images' => !empty($imagePaths) ? $imagePaths : null,
            ];

            $this->reviewRepository->updateReview($reviewId, $updateData);

            // Refresh review
            $updatedReview = $this->reviewRepository->find($reviewId);

            return ServiceResult::success(
                ['review' => $updatedReview],
                'Đánh giá của bạn đã được cập nhật.'
            );
        });
    }
}
