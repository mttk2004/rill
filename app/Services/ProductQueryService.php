<?php

namespace App\Services;

use App\Actions\Product\GetProductDetailDataAction;
use App\Actions\Product\GetProductsWithFiltersAction;
use App\DataObjects\Product\ProductFilterData;
use App\Models\Artist;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Product Query Service
 *
 * Handles all product query operations: search, filters, listings
 * Separated from CRUD operations for better organization
 */
class ProductQueryService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
        protected GetProductsWithFiltersAction $getProductsWithFiltersAction,
        protected GetProductDetailDataAction $getProductDetailDataAction,
    ) {}

    /**
     * Search products with filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function searchProducts(array $filters)
    {
        $filterData = ProductFilterData::fromQueryParams($filters);

        $query = $this->productRepository->newQuery();

        if ($filterData->search) {
            $query->search($filterData->search);
        }

        if ($filterData->status) {
            $query->status($filterData->status);
        }

        if ($filterData->genre) {
            $query->genre($filterData->genre);
        }

        if ($filterData->label) {
            $query->label($filterData->label);
        }

        if ($filterData->artist) {
            $query->byArtist($filterData->artist);
        }

        if ($filterData->collection) {
            $query->byCollection($filterData->collection);
        }

        if ($filterData->hasPriceRange()) {
            $query->priceRange($filterData->minPrice, $filterData->maxPrice);
        }

        if ($filterData->isFeatured !== null) {
            $query->featured($filterData->isFeatured);
        }

        if ($filterData->isActive !== null && $filterData->isActive) {
            $query->active();
        }

        if ($filterData->isLowStock !== null && $filterData->isLowStock) {
            $query->lowStock();
        }

        // Apply sorting
        match ($filterData->sortBy) {
            'name' => $query->sortByName($filterData->sortDirection),
            'price' => $query->sortByPrice($filterData->sortDirection),
            'best_sellers' => $query->bestSellers(),
            'created_at' => $filterData->sortDirection === 'desc' ? $query->newest() : $query->oldest(),
            default => $query->newest(),
        };

        return $query->withRelations(['artists', 'collections'])
            ->paginate($filterData->perPage);
    }

    /**
     * Get active products with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getActiveProducts(array $filters = [])
    {
        $filters['status'] = 'active';
        return $this->searchProducts($filters);
    }

    /**
     * Get featured products.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedProducts(int $limit = 10)
    {
        return $this->productRepository->newQuery()
            ->active()
            ->featured()
            ->withRelations(['artists'])
            ->getQuery()
            ->limit($limit)
            ->get();
    }

    /**
     * Get best selling products.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBestSellers(int $limit = 10)
    {
        return $this->productRepository->newQuery()
            ->active()
            ->bestSellers()
            ->withRelations(['artists'])
            ->getQuery()
            ->limit($limit)
            ->get();
    }

    /**
     * Get new arrivals.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getNewArrivals(int $limit = 10)
    {
        return $this->productRepository->newQuery()
            ->active()
            ->newest()
            ->withRelations(['artists'])
            ->getQuery()
            ->limit($limit)
            ->get();
    }

    /**
     * Get product statistics for admin dashboard.
     *
     * @return array
     */
    public function getProductStats(): array
    {
        return [
            'total' => Product::count(),
            'active' => Product::where('is_active', true)->count(),
            'out_of_stock' => Product::where('stock_quantity', 0)->count(),
            'low_stock' => Product::where('stock_quantity', '>', 0)->where('stock_quantity', '<', 10)->count(),
        ];
    }

    /**
     * Enrich products with sales data (optimized to prevent N+1 queries).
     *
     * Fetches total sold quantity and revenue for multiple products in a single
     * bulk query, then attaches the data to each product model. This prevents
     * N+1 query issues when displaying sales statistics for product listings.
     *
     * @param \Illuminate\Support\Collection $products Collection of Product models to enrich
     * @return void Modifies products in place by adding total_sold and total_revenue attributes
     */
    public function enrichProductsWithSalesData($products): void
    {
        $productIds = $products->pluck('id');

        // Get sales data for all products in one query
        $salesData = DB::table('order_items')
            ->whereIn('product_id', $productIds)
            ->groupBy('product_id')
            ->select([
                'product_id',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(quantity * unit_price) as total_revenue')
            ])
            ->get()
            ->keyBy('product_id');

        // Attach sales data to each product
        foreach ($products as $product) {
            $data = $salesData->get($product->id);
            $product->total_sold = $data ? $data->total_sold : 0;
            $product->total_revenue = $data ? $data->total_revenue : 0;
        }
    }

    /**
     * Get products with filters (for admin).
     *
     * @param array $filters
     * @return ServiceResult
     */
    public function getProducts(array $filters = []): ServiceResult
    {
        try {
            return $this->getProductsWithFiltersAction->execute($filters);
        } catch (\Exception $e) {
            return ServiceResult::error('Không thể lấy danh sách sản phẩm: ' . $e->getMessage());
        }
    }

    /**
     * Get data for product show page.
     *
     * @param Product $product
     * @param User|null $user
     * @return ServiceResult
     */
    public function getDataForShowPage(Product $product, ?User $user): ServiceResult
    {
        return $this->getProductDetailDataAction->execute($product, $user);
    }

    /**
     * Get unique genres from products.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getGenres()
    {
        return Product::select('genre')
            ->distinct()
            ->whereNotNull('genre')
            ->orderBy('genre')
            ->pluck('genre');
    }

    /**
     * Get unique labels from products.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getLabels()
    {
        return Product::select('label')
            ->distinct()
            ->whereNotNull('label')
            ->orderBy('label')
            ->pluck('label');
    }

    /**
     * Get active artists.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveArtists()
    {
        return Artist::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * Get form options (genres, labels, artists) for product create/edit forms.
     *
     * @return array
     */
    public function getFormOptions(): array
    {
        return [
            'genres' => $this->getGenres(),
            'labels' => $this->getLabels(),
            'artists' => $this->getActiveArtists(),
        ];
    }
}
