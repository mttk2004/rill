<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Artist;
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
        $perPage = 12; // 12 products per page
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
                $artistQuery->where('slug', $filters['artist']);
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
                ->select('name', 'slug')
                ->orderBy('name')
                ->get()
                ->map(function ($artist) {
                    return [
                        'name' => $artist->name,
                        'slug' => $artist->slug,
                    ];
                })
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
        ];
    }
}
