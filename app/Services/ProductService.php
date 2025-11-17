<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Artist;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    /**
     * Get products with filters and pagination.
     */
    public function getProducts(array $filters = []): array
    {
        $query = Product::with(['artists' => function ($query) {
            $query->orderByPivot('sort_order');
        }])->active(); // Only get active products

        // Apply filters
        $this->applyFilters($query, $filters);

        // Apply sorting
        $this->applySorting($query, $filters['sort'] ?? 'featured');

        // Get paginated results
        $perPage = config('pagination.products');
        $products = $query->paginate($perPage);

        // Transform products for frontend
        $transformedProducts = $products->through(function ($product) {
            return $this->transformProduct($product);
        });

        return [
            'products' => $transformedProducts,
            'filters' => $this->getAvailableFilters(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ];
    }

    /**
     * Apply filters to the product query.
     */
    protected function applyFilters(Builder $query, array $filters): void
    {
        // Search filter
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('genre', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('label', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('artists', function ($artistQuery) use ($searchTerm) {
                      $artistQuery->where('name', 'LIKE', "%{$searchTerm}%");
                  });
            });
        }

        // Genre filter
        if (!empty($filters['genre'])) {
            $query->where('genre', $filters['genre']);
        }

        // Label filter
        if (!empty($filters['label'])) {
            $query->where('label', $filters['label']);
        }

        // Artist filter
        if (!empty($filters['artist'])) {
            $query->whereHas('artists', function ($artistQuery) use ($filters) {
                $artistQuery->where('name', $filters['artist']);
            });
        }
    }

    /**
     * Apply sorting to the product query.
     */
    protected function applySorting(Builder $query, string $sort): void
    {
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('created_at', 'desc');
                break;
        }
    }

    /**
     * Get available filter options.
     */
    protected function getAvailableFilters(): array
    {
        return [
            'genres' => Product::active()
                ->select('genre')
                ->distinct()
                ->orderBy('genre')
                ->pluck('genre')
                ->filter()
                ->values()
                ->toArray(),

            'labels' => Product::active()
                ->select('label')
                ->distinct()
                ->orderBy('label')
                ->pluck('label')
                ->filter()
                ->values()
                ->toArray(),

            'artists' => Artist::active()
                ->whereHas('products', function ($query) {
                    $query->active();
                })
                ->orderBy('name')
                ->pluck('name')
                ->filter()
                ->values()
                ->toArray(),

            'sort_options' => [
                ['value' => 'featured', 'label' => 'Nổi bật'],
                ['value' => 'newest', 'label' => 'Mới nhất'],
                ['value' => 'price_asc', 'label' => 'Giá: Thấp đến cao'],
                ['value' => 'price_desc', 'label' => 'Giá: Cao đến thấp'],
                ['value' => 'name_asc', 'label' => 'Tên: A-Z'],
                ['value' => 'name_desc', 'label' => 'Tên: Z-A'],
            ],
        ];
    }

    /**
     * Transform a product for frontend consumption.
     */
    protected function transformProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'compare_price' => $product->compare_price,
            'stock_quantity' => $product->stock_quantity,
            'genre' => $product->genre,
            'label' => $product->label,
            'image' => $product->image,
            'image_url' => $product->image_url,
            'is_featured' => $product->is_featured,
            'status' => $product->status,
            'artists' => $product->artists->map(function ($artist) {
                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'slug' => $artist->slug,
                    'role' => $artist->pivot->role,
                ];
            })->toArray(),
            'main_artists' => $product->artists
                ->where('pivot.role', 'main')
                ->pluck('name')
                ->toArray(),
            'featured_artists' => $product->artists
                ->where('pivot.role', 'featured')
                ->pluck('name')
                ->toArray(),
            'in_stock' => $product->isInStock(),
            'low_stock' => $product->isLowStock(),
            'discount_percentage' => $product->compare_price && $product->compare_price > $product->price
                ? round((($product->compare_price - $product->price) / $product->compare_price) * 100)
                : null,
            'reviews_count' => $product->reviews()->count(),
            'average_rating' => round($product->reviews()->avg('rating') ?? 0, 1),
        ];
    }

    /**
     * Get related products based on same artist or genre.
     */
    public function getRelatedProducts(Product $product, int $limit = 6): array
    {
        // Get artist IDs from the current product
        $artistIds = $product->artists->pluck('id')->toArray();

        // Build query for related products
        $query = Product::with(['artists' => function ($query) {
            $query->orderByPivot('sort_order');
        }])
            ->active()
            ->where('id', '!=', $product->id);

        // Priority 1: Products with same artists
        $sameArtistProducts = (clone $query)
            ->whereHas('artists', function ($q) use ($artistIds) {
                $q->whereIn('artists.id', $artistIds);
            })
            ->limit($limit)
            ->get();

        $relatedProducts = $sameArtistProducts;

        // If we don't have enough products, add products from same genre
        if ($relatedProducts->count() < $limit && $product->genre) {
            $needed = $limit - $relatedProducts->count();
            $excludeIds = $relatedProducts->pluck('id')->toArray();
            $excludeIds[] = $product->id;

            $sameGenreProducts = (clone $query)
                ->whereNotIn('id', $excludeIds)
                ->where('genre', $product->genre)
                ->limit($needed)
                ->get();

            $relatedProducts = $relatedProducts->merge($sameGenreProducts);
        }

        // Transform products for frontend
        return $relatedProducts->map(function ($relatedProduct) {
            return $this->transformProduct($relatedProduct);
        })->toArray();
    }

    /**
     * Get all data needed for the product detail page.
     */
    public function getDataForShowPage(Product $product, ?User $user): array
    {
        // Load artists relationship
        $product->load(['artists' => function ($query) {
            $query->orderByPivot('sort_order');
        }]);

        // Get all reviews (auto-approved, no status filter needed)
        $reviews = $product->reviews()
            ->with('user:id,name,avatar')
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
                        'avatar_url' => $review->user->avatar_url,
                    ],
                ];
            });

        // Calculate review statistics
        $reviewsCount = $reviews->count();
        $averageRating = $reviewsCount > 0 ? round($reviews->avg('rating'), 1) : 0;

        // Check if the authenticated user can review this product
        $userCanReview = false;
        $userReview = null;

        if ($user) {
            // Use policy to check if user can review this product
            $userCanReview = $user->can('review', $product);

            // Get user's existing review if any
            $existingReview = $product->reviews()
                ->where('user_id', $user->id)
                ->first();

            if ($existingReview) {
                $userReview = [
                    'id' => $existingReview->id,
                    'rating' => $existingReview->rating,
                    'comment' => $existingReview->comment,
                ];
            }
        }

        // Get related products
        $relatedProducts = $this->getRelatedProducts($product);

        // Transform product data for frontend
        return [
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
                'image_url' => $product->image_url,
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
            'relatedProducts' => $relatedProducts,
        ];
    }
}
