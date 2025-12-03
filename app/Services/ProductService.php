<?php

namespace App\Services;

use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\GetProductDetailDataAction;
use App\Actions\Product\GetProductsWithFiltersAction;
use App\Actions\Product\RestoreProductAction;
use App\Actions\Product\UpdateProductAction;
use App\Actions\Product\UpdateProductStockAction;
use App\DataObjects\Product\CreateProductData;
use App\DataObjects\Product\ProductFilterData;
use App\DataObjects\Product\UpdateProductData;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Refactored Product Service
 *
 * Uses Clean Architecture: Actions, Repositories, Query Builders, DTOs
 */
class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
        protected CreateProductAction $createProductAction,
        protected UpdateProductAction $updateProductAction,
        protected UpdateProductStockAction $updateProductStockAction,
        protected DeleteProductAction $deleteProductAction,
        protected RestoreProductAction $restoreProductAction,
        protected GetProductsWithFiltersAction $getProductsWithFiltersAction,
        protected GetProductDetailDataAction $getProductDetailDataAction,
    ) {}

    /**
     * Create new product.
     *
     * @param array $data
     * @return ServiceResult
     */
    public function createProduct(array $data): ServiceResult
    {
        $productData = new CreateProductData(
            name: $data['name'],
            sku: $data['sku'],
            price: $data['price'],
            stockQuantity: $data['stock_quantity'],
            status: $data['status'],
            description: $data['description'] ?? null,
            genre: $data['genre'] ?? null,
            label: $data['label'] ?? null,
            releaseYear: $data['release_year'] ?? null,
            format: $data['format'] ?? null,
            condition: $data['condition'] ?? null,
            image: $data['image'] ?? null,
            minStockLevel: $data['min_stock_level'] ?? 5,
            weight: $data['weight'] ?? null,
            specifications: $data['specifications'] ?? null,
            artists: $data['artists'] ?? null,
            collections: $data['collections'] ?? null,
            isFeatured: $data['is_featured'] ?? false,
        );

        return $this->createProductAction->execute($productData);
    }

    /**
     * Update existing product.
     *
     * @param int $productId
     * @param array $data
     * @return ServiceResult
     */
    public function updateProduct(int $productId, array $data): ServiceResult
    {
        $productData = new UpdateProductData(
            name: $data['name'] ?? null,
            sku: $data['sku'] ?? null,
            price: $data['price'] ?? null,
            stockQuantity: $data['stock_quantity'] ?? null,
            status: $data['status'] ?? null,
            description: $data['description'] ?? null,
            genre: $data['genre'] ?? null,
            label: $data['label'] ?? null,
            releaseYear: $data['release_year'] ?? null,
            format: $data['format'] ?? null,
            condition: $data['condition'] ?? null,
            image: $data['image'] ?? null,
            minStockLevel: $data['min_stock_level'] ?? null,
            weight: $data['weight'] ?? null,
            specifications: $data['specifications'] ?? null,
            artists: $data['artists'] ?? null,
            collections: $data['collections'] ?? null,
            isFeatured: $data['is_featured'] ?? null,
        );

        return $this->updateProductAction->execute($productId, $productData);
    }

    /**
     * Update product stock.
     *
     * @param int $productId
     * @param int $quantity
     * @param string $operation
     * @param string|null $reason
     * @return ServiceResult
     */
    public function updateStock(
        int $productId,
        int $quantity,
        string $operation = 'set',
        ?string $reason = null
    ): ServiceResult {
        return $this->updateProductStockAction->execute($productId, $quantity, $operation, $reason);
    }

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
     * Get active products for public display.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getActiveProducts(array $filters = [])
    {
        return $this->searchProducts(array_merge($filters, ['is_active' => true]));
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
     * Handle product image upload.
     *
     * @param int $productId
     * @param UploadedFile $image
     * @return ServiceResult
     */
    public function uploadImage(int $productId, UploadedFile $image): ServiceResult
    {
        $product = $this->productRepository->find($productId);

        if (!$product) {
            return ServiceResult::error('Product not found');
        }

        // Delete old image if exists
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            try {
                Storage::disk('supabase')->delete($product->image);
            } catch (\Exception $e) {
                \Log::warning('Failed to delete old product image', [
                    'product_id' => $product->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Store new image
        $path = $image->store('products', 'supabase');

        // Update product
        $this->productRepository->update($productId, ['image' => $path]);

        return ServiceResult::success(
            ['image_path' => $path],
            'Image uploaded successfully'
        );
    }

    /**
     * Get product statistics.
     *
     * @return array
     */
    public function getProductStats(): array
    {
        return $this->productRepository->getStats();
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
     * Handle image upload for product.
     *
     * Manages product image uploads to Supabase storage. Deletes the old image
     * if it exists (excluding external URLs), then stores the new image.
     *
     * @param Product $product The product to update image for
     * @param \Illuminate\Http\UploadedFile $imageFile The uploaded image file
     * @return string The storage path of the newly uploaded image
     */
    public function handleImageUpload(Product $product, $imageFile): string
    {
        // Delete old image if exists
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            try {
                Storage::disk('supabase')->delete($product->image);
            } catch (\Exception $e) {
                \Log::warning('Failed to delete old product image', [
                    'product_id' => $product->id,
                    'image_path' => $product->image,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Store new image
        return $imageFile->store('products', 'supabase');
    }

    /**
     * Sync product artists.
     *
     * Manages the many-to-many relationship between products and artists.
     * Handles artist attachment with pivot data (role, sort_order).
     * If artists is null, detaches all artists from the product.
     *
     * @param Product $product The product to sync artists for
     * @param array|null $artists Array of artist data with id, role, sort_order. Null to detach all
     * @return void
     */
    public function syncArtists(Product $product, ?array $artists): void
    {
        if ($artists === null) {
            $product->artists()->detach();
            return;
        }

        $artistsData = [];
        foreach ($artists as $index => $artistData) {
            $artistsData[$artistData['artist_id']] = [
                'role' => $artistData['role'],
                'sort_order' => $index,
            ];
        }

        $product->artists()->sync($artistsData);
    }

    /**
     * Get products with filters, sorting and pagination.
     * Used by frontend product listing page.
     *
     * @param array $filters
     * @return ServiceResult
     */
    public function getProducts(array $filters = []): ServiceResult
    {
        return $this->getProductsWithFiltersAction->execute($filters);
    }

    /**
     * Get all data needed for product detail page.
     * Includes product info, reviews, related products, shipping threshold.
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
     * Get active artists for product form.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveArtists()
    {
        return \App\Models\Artist::select('id', 'name')
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

    /**
     * Delete (soft delete) a product.
     *
     * @param string $productId
     * @return ServiceResult
     */
    public function deleteProduct(string $productId): ServiceResult
    {
        return $this->deleteProductAction->execute($productId);
    }

    /**
     * Restore a soft-deleted product.
     *
     * @param string $productId
     * @return ServiceResult
     */
    public function restoreProduct(string $productId): ServiceResult
    {
        return $this->restoreProductAction->execute($productId);
    }
}
