<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Models\User;
use App\Services\SettingService;
use App\Support\ServiceResult;

/**
 * Get product detail page data with reviews, related products, etc.
 */
class GetProductDetailDataAction
{
    public function __construct(
        protected SettingService $settingService,
        protected GetRelatedProductsAction $getRelatedProductsAction,
    ) {}

    public function execute(Product $product, ?User $user): ServiceResult
    {
        // Load relationships
        $product->load([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
            'collections' => function ($query) {
                $query->where('is_active', true)
                    ->orderByPivot('position');
            }
        ]);

        // Load total sold quantity
        $product->loadSum([
            'orderItems as order_items_sum_quantity' => function ($query) {
                $query->whereHas('order', function ($q) {
                    $q->whereIn('status', ['confirmed', 'processing', 'shipped', 'delivered']);
                });
            }
        ], 'quantity');

        \Log::info('Product total_sold calculation', [
            'product_id' => $product->id,
            'product_name' => $product->name,
            'order_items_sum' => $product->order_items_sum_quantity,
            'total_sold_accessor' => $product->total_sold,
        ]);

        // Get shipping threshold from settings
        $shippingThreshold = $this->settingService->get('shipping_free_threshold', 3000000);

        // Get all reviews
        $reviews = $product->reviews()
            ->with('user:id,name,avatar')
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'images' => $review->images,
                    'created_at' => $review->created_at->toISOString(),
                    'updated_at' => $review->updated_at->toISOString(),
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'avatar_url' => $review->user->avatar_url,
                    ],
                ];
            });

        // Calculate review statistics
        $reviewsCount = $reviews->count();
        $averageRating = $reviewsCount > 0 ? round($reviews->avg('rating'), 1) : 0;

        // Check if user can review
        $userCanReview = false;
        $userReview = null;

        if ($user) {
            $userCanReview = $user->can('review', $product);

            $existingReview = $product->reviews()
                ->where('user_id', $user->id)
                ->first();

            if ($existingReview) {
                $userReview = [
                    'id' => $existingReview->id,
                    'rating' => $existingReview->rating,
                    'comment' => $existingReview->comment,
                    'images' => $existingReview->images,
                ];
            }
        }

        // Get related products
        $relatedProductsResult = $this->getRelatedProductsAction->execute($product);
        $relatedProducts = $relatedProductsResult->success ? $relatedProductsResult->data : [];

        // Transform product data
        return ServiceResult::success([
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'detailed_description' => $product->detailed_description,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'genre' => $product->genre,
                'label' => $product->label,
                'image' => $product->image,
                'image_url' => $product->image_url,
                'status' => $product->status,
                'deleted_at' => $product->deleted_at?->toISOString(),
                'artists' => $product->artists->map(function ($artist) {
                    return [
                        'id' => $artist->id,
                        'name' => $artist->name,
                        'slug' => $artist->slug,
                        'image' => $artist->image,
                        'role' => $artist->pivot->role,
                        'sort_order' => $artist->pivot->sort_order,
                    ];
                }),
                'main_artists' => $product->artists->where('pivot.role', 'main')->values(),
                'featured_artists' => $product->artists->where('pivot.role', 'featured')->values(),
                'in_stock' => $product->isInStock(),
                'low_stock' => $product->isLowStock(),
                'total_sold' => $product->total_sold,
                'collection' => $product->collections->first() ? [
                    'id' => $product->collections->first()->id,
                    'name' => $product->collections->first()->name,
                    'type' => $product->collections->first()->type,
                ] : null,
                'user_can_review' => $userCanReview,
                'user_review' => $userReview,
            ],
            'reviews' => $reviews,
            'averageRating' => $averageRating,
            'relatedProducts' => $relatedProducts,
            'shippingThreshold' => $shippingThreshold,
        ]);
    }
}
