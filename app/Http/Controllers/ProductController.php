<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected ProductService $productService;
    protected CartService $cartService;

    public function __construct(ProductService $productService, CartService $cartService)
    {
        $this->productService = $productService;
        $this->cartService = $cartService;
    }

    /**
     * Display the products catalog page.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'genre', 'label', 'artist', 'sort', 'page']);

        $result = $this->productService->getProducts($filters);

        return Inertia::render('products', [
            'products' => $result['products'],
            'filters' => $result['filters'],
            'pagination' => $result['pagination'],
            // Pass filter parameters to frontend
            'search' => $filters['search'] ?? null,
            'genre' => $filters['genre'] ?? null,
            'label' => $filters['label'] ?? null,
            'artist' => $filters['artist'] ?? null,
            'sort' => $filters['sort'] ?? null,
            'page' => $filters['page'] ?? 1,
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(Product $product): Response
    {
        $product->load(['artists' => function ($query) {
            $query->orderByPivot('sort_order');
        }]);

        // Get approved reviews
        $reviews = $product->reviews()
            ->where('status', 'approved')
            ->with('user:id,name')
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('d/m/Y'),
                    'user' => [
                        'name' => $review->user->name,
                    ],
                ];
            });

        // Calculate review statistics
        $reviewsCount = $reviews->count();
        $averageRating = $reviewsCount > 0 ? round($reviews->avg('rating'), 1) : 0;

        // Check if the authenticated user can review this product
        $userCanReview = false;
        $userReview = null;

        if (auth()->check()) {
            // Check if user has a delivered order containing this product
            $userCanReview = \App\Models\Order::where('user_id', auth()->id())
                ->where('status', 'delivered')
                ->whereHas('items', function ($query) use ($product) {
                    $query->where('product_id', $product->id);
                })
                ->exists();

            // Get user's existing review if any
            $existingReview = $product->reviews()
                ->where('user_id', auth()->id())
                ->first();

            if ($existingReview) {
                $userReview = [
                    'id' => $existingReview->id,
                    'rating' => $existingReview->rating,
                    'comment' => $existingReview->comment,
                    'status' => $existingReview->status,
                ];
            }
        }

        return Inertia::render('product-detail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'detailed_description' => $product->detailed_description,
                'price' => $product->price,
                'compare_price' => $product->compare_price,
                'stock_quantity' => $product->stock_quantity,
                'genre' => $product->genre,
                'label' => $product->label,
                'image' => $product->image,
                'is_featured' => $product->is_featured,
                'status' => $product->status,
                'artists' => $product->artists->map(function ($artist) {
                    return [
                        'id' => $artist->id,
                        'name' => $artist->name,
                        'slug' => $artist->slug,
                        'role' => $artist->pivot->role,
                        'sort_order' => $artist->pivot->sort_order,
                    ];
                }),
                'main_artists' => $product->artists->where('pivot.role', 'main')->values(),
                'featured_artists' => $product->artists->where('pivot.role', 'featured')->values(),
                'in_stock' => $product->isInStock(),
                'low_stock' => $product->isLowStock(),
                'reviews' => $reviews,
                'reviews_count' => $reviewsCount,
                'average_rating' => $averageRating,
                'user_can_review' => $userCanReview,
                'user_review' => $userReview,
            ],
        ]);
    }
}
