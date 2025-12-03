<?php

namespace App\Actions\Product;

use App\Models\Artist;
use App\Models\Product;
use App\Services\BestSellerService;
use App\Support\ServiceResult;
use Illuminate\Database\Eloquent\Builder;

/**
 * Get products with filters, sorting and pagination
 */
class GetProductsWithFiltersAction
{
    public function execute(array $filters = []): ServiceResult
    {
        $query = Product::with([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
            'collections' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('name')
                    ->limit(1);
            }
        ])->active();

        // Apply filters
        $this->applyFilters($query, $filters);

        // Apply sorting (default to best seller)
        $this->applySorting($query, $filters['sort'] ?? 'default');

        // Get paginated results
        $perPage = config('pagination.products', 24);
        $products = $query->paginate($perPage);

        // Transform products for frontend
        $transformedProducts = $products->map(function ($product) {
            return $this->transformProduct($product);
        })->values()->toArray();

        return ServiceResult::success([
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
        ]);
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        // Search filter
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('sku', 'LIKE', "%{$searchTerm}%")
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

        // Collection filter
        if (!empty($filters['collection'])) {
            $query->whereHas('collections', function ($collectionQuery) use ($filters) {
                $collectionQuery->where('slug', $filters['collection'])
                    ->where('is_active', true);
            });
        }
    }

    protected function applySorting(Builder $query, string $sort): void
    {
        switch ($sort) {
            case 'best_seller':
            case 'default':
                BestSellerService::applyBestSellerScope($query);
                break;
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
        }
    }

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

            'collections' => \DB::table('collections')
                ->select('collections.id', 'collections.name', 'collections.slug')
                ->join('collection_product', 'collections.id', '=', 'collection_product.collection_id')
                ->join('products', 'collection_product.product_id', '=', 'products.id')
                ->where('collections.is_active', true)
                ->where('products.status', 'active')
                ->whereNull('collections.deleted_at')
                ->groupBy('collections.id', 'collections.name', 'collections.slug')
                ->orderBy('collections.name')
                ->get()
                ->toArray(),
        ];
    }

    protected function transformProduct(Product $product): array
    {
        $firstCollection = $product->collections->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock_quantity' => $product->stock_quantity,
            'genre' => $product->genre,
            'label' => $product->label,
            'image' => $product->image,
            'image_url' => $product->image_url,
            'status' => $product->status,
            'collection' => $firstCollection ? [
                'id' => $firstCollection->id,
                'name' => $firstCollection->name,
                'type' => $firstCollection->type,
            ] : null,
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
            'reviews_count' => $product->reviews()->count(),
            'average_rating' => round($product->reviews()->avg('rating') ?? 0, 1),
            'total_sold' => $product->total_sold ?? 0,
        ];
    }
}
