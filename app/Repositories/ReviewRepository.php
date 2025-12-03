<?php

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReviewRepository extends BaseRepository implements ReviewRepositoryInterface
{
    public function __construct(ProductReview $model)
    {
        parent::__construct($model);
    }

    /**
     * Find user's review for a product.
     */
    public function findUserReview(int $userId, string $productId): ?ProductReview
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Check if user can review this product (has delivered order).
     */
    public function canUserReview(int $userId, string $productId): bool
    {
        return Order::where('user_id', $userId)
            ->where('status', OrderStatus::DELIVERED)
            ->whereHas('items', fn($query) => $query->where('product_id', $productId))
            ->exists();
    }

    /**
     * Get user's delivered order item for product.
     */
    public function getUserOrderItem(int $userId, string $productId)
    {
        return OrderItem::whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->where('status', OrderStatus::DELIVERED);
            })
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Create a new review.
     */
    public function createReview(array $data): ProductReview
    {
        return $this->model->create($data);
    }

    /**
     * Update existing review.
     */
    public function updateReview(int $reviewId, array $data): bool
    {
        $review = $this->find($reviewId);

        if (!$review) {
            return false;
        }

        return $review->update($data);
    }

    /**
     * Delete review and its images.
     */
    public function deleteReview(int $reviewId): bool
    {
        $review = $this->find($reviewId);

        if (!$review) {
            return false;
        }

        // Delete associated images
        if (!empty($review->images)) {
            $this->deleteReviewImages($review->images);
        }

        return $review->delete();
    }

    /**
     * Get product reviews with pagination.
     */
    public function getProductReviews(string $productId, int $perPage = 15)
    {
        return $this->model
            ->where('product_id', $productId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Delete review images from storage.
     *
     * @param array $imagePaths
     * @return void
     */
    protected function deleteReviewImages(array $imagePaths): void
    {
        $supabaseUrl = env('SUPABASE_URL');
        $bucket = env('SUPABASE_BUCKET');
        $baseUrl = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/";

        foreach ($imagePaths as $imagePath) {
            try {
                // If it's a full URL, extract the path
                if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
                    if (str_starts_with($imagePath, $baseUrl)) {
                        $path = str_replace($baseUrl, '', $imagePath);
                        Storage::disk('supabase')->delete($path);
                    }
                } else {
                    // If it's already a path, delete directly
                    Storage::disk('supabase')->delete($imagePath);
                }
            } catch (\Exception $e) {
                // Log but don't fail if image deletion fails
                Log::warning("Failed to delete review image: {$imagePath}. Error: " . $e->getMessage());
            }
        }
    }
}
