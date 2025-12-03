<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Services\Responses\ServiceResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * @deprecated Use ReviewServiceRefactored instead
 * This service will be removed in a future version
 */
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
     * @param array $data Array with 'rating', 'comment', and optional 'images' keys
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

        // Handle image uploads
        $imagePaths = [];

        // Get existing image paths from URLs (for updates)
        if (isset($data['existing_images']) && is_array($data['existing_images'])) {
            $supabaseUrl = env('SUPABASE_URL');
            $bucket = env('SUPABASE_BUCKET');
            $baseUrl = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/";

            foreach ($data['existing_images'] as $url) {
                // Extract path from URL
                if (str_starts_with($url, $baseUrl)) {
                    $path = str_replace($baseUrl, '', $url);
                    $imagePaths[] = $path;
                }
            }
        }

        // Add new uploaded images
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    // Store image to Supabase in 'reviews' folder
                    // File name will be automatically hashed
                    $path = $image->store('reviews', 'supabase');
                    $imagePaths[] = $path;
                }
            }
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
                'images' => !empty($imagePaths) ? $imagePaths : null,
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
            'images' => !empty($imagePaths) ? $imagePaths : null,
        ]);

        return ServiceResponse::success(
            'Cảm ơn bạn đã đánh giá sản phẩm!',
            ['review' => $review]
        );
    }

    /**
     * Get a user's review for a product.
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

    /**
     * Delete a product review.
     *
     * @param ProductReview $review
     * @return ServiceResponse
     */
    public function deleteReview(ProductReview $review): ServiceResponse
    {
        try {
            // Delete associated images if any
            if (!empty($review->images)) {
                $supabaseUrl = env('SUPABASE_URL');
                $bucket = env('SUPABASE_BUCKET');
                $baseUrl = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/";

                foreach ($review->images as $imagePath) {
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

            // Delete the review (soft delete)
            $review->delete();

            return ServiceResponse::success('Đánh giá của bạn đã được xóa.');
        } catch (\Exception $e) {
            Log::error('Failed to delete review: ' . $e->getMessage());
            return ServiceResponse::error('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
        }
    }
}
