<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Product Repository Implementation
 *
 * Handles all product data access operations.
 */
class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    /**
     * ProductRepository constructor.
     *
     * @param Product $model
     */
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Find a product by slug.
     *
     * @param string $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product
    {
        return $this->model
            ->with(['artists', 'reviews.user', 'collections'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Find a product by SKU.
     *
     * @param string $sku
     * @return Product|null
     */
    public function findBySku(string $sku): ?Product
    {
        return $this->model->where('sku', $sku)->first();
    }

    /**
     * Get all active products.
     *
     * @return Collection
     */
    public function getActive(): Collection
    {
        return $this->model->where('status', 'active')->get();
    }

    /**
     * Get products with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchProducts(array $filters): LengthAwarePaginator
    {
        $query = $this->model->query()->where('status', 'active');

        // Search by name, SKU, or description
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('sku', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filter by genre
        if (!empty($filters['genre'])) {
            $query->where('genre', $filters['genre']);
        }

        // Filter by label
        if (!empty($filters['label'])) {
            $query->where('label', $filters['label']);
        }

        // Filter by artist
        if (!empty($filters['artist'])) {
            $query->whereHas('artists', function ($q) use ($filters) {
                $q->where('name', $filters['artist']);
            });
        }

        // Filter by collection
        if (!empty($filters['collection'])) {
            $query->whereHas('collections', function ($q) use ($filters) {
                $q->where('slug', $filters['collection']);
            });
        }

        // Filter by price range
        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'price-asc' => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            'name-asc' => $query->orderBy('name', 'asc'),
            'name-desc' => $query->orderBy('name', 'desc'),
            'oldest' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        // Load relationships
        $query->with(['artists', 'collections']);

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get best-selling products.
     *
     * @param int $limit
     * @return Collection
     */
    public function getBestSellers(int $limit = 10): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->withCount(['orderItems as total_sold' => function ($query) {
                $query->selectRaw('COALESCE(SUM(quantity), 0)');
            }])
            ->orderByDesc('total_sold')
            ->orderBy('id')
            ->limit($limit)
            ->get();
    }

    /**
     * Get featured products.
     *
     * @param int $limit
     * @return Collection
     */
    public function getFeatured(int $limit = 10): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->where('is_featured', true)
            ->limit($limit)
            ->get();
    }

    /**
     * Get new products (last 30 days).
     *
     * @param int $limit
     * @return Collection
     */
    public function getNewProducts(int $limit = 10): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get low stock products.
     *
     * @param int|null $threshold
     * @return Collection
     */
    public function getLowStock(?int $threshold = null): Collection
    {
        $threshold = $threshold ?? 10;

        return $this->model
            ->where('status', 'active')
            ->whereRaw('stock_quantity <= COALESCE(min_stock_level, ?)', [$threshold])
            ->orderBy('stock_quantity', 'asc')
            ->get();
    }

    /**
     * Update product stock quantity.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function updateStock(int $productId, int $quantity): bool
    {
        return $this->model
            ->where('id', $productId)
            ->update(['stock_quantity' => $quantity]);
    }

    /**
     * Decrease product stock.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function decreaseStock(int $productId, int $quantity): bool
    {
        return $this->model
            ->where('id', $productId)
            ->where('stock_quantity', '>=', $quantity)
            ->decrement('stock_quantity', $quantity);
    }

    /**
     * Increase product stock.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function increaseStock(int $productId, int $quantity): bool
    {
        return $this->model
            ->where('id', $productId)
            ->increment('stock_quantity', $quantity);
    }

    /**
     * Get products by genre.
     *
     * @param string $genre
     * @return Collection
     */
    public function getByGenre(string $genre): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->where('genre', $genre)
            ->get();
    }

    /**
     * Get products by label.
     *
     * @param string $label
     * @return Collection
     */
    public function getByLabel(string $label): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->where('label', $label)
            ->get();
    }

    /**
     * Get products by artist.
     *
     * @param int $artistId
     * @return Collection
     */
    public function getByArtist(int $artistId): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->whereHas('artists', function ($q) use ($artistId) {
                $q->where('artists.id', $artistId);
            })
            ->get();
    }

    /**
     * Get products by collection.
     *
     * @param int $collectionId
     * @return Collection
     */
    public function getByCollection(int $collectionId): Collection
    {
        return $this->model
            ->where('status', 'active')
            ->whereHas('collections', function ($q) use ($collectionId) {
                $q->where('collections.id', $collectionId);
            })
            ->get();
    }

    /**
     * Get product statistics.
     *
     * @return array
     */
    public function getStats(): array
    {
        $stats = DB::table('products')
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = "inactive" THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN status = "draft" THEN 1 ELSE 0 END) as draft,
                SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured,
                SUM(CASE WHEN stock_quantity <= COALESCE(min_stock_level, 10) THEN 1 ELSE 0 END) as low_stock
            ')
            ->whereNull('deleted_at')
            ->first();

        return [
            'total' => $stats->total,
            'active' => $stats->active,
            'inactive' => $stats->inactive,
            'draft' => $stats->draft,
            'featured' => $stats->featured,
            'low_stock' => $stats->low_stock,
        ];
    }
}
