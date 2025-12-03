<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use App\QueryBuilders\ProductQueryBuilder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Product Repository Interface
 *
 * Defines the contract for product data access operations.
 */
interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find a product by slug.
     *
     * @param string $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product;

    /**
     * Find a product by SKU.
     *
     * @param string $sku
     * @return Product|null
     */
    public function findBySku(string $sku): ?Product;

    /**
     * Get all active products.
     *
     * @return Collection
     */
    public function getActive(): Collection;

    /**
     * Get products with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchProducts(array $filters): LengthAwarePaginator;

    /**
     * Get best-selling products.
     *
     * @param int $limit
     * @return Collection
     */
    public function getBestSellers(int $limit = 10): Collection;

    /**
     * Get featured products.
     *
     * @param int $limit
     * @return Collection
     */
    public function getFeatured(int $limit = 10): Collection;

    /**
     * Get new products (last 30 days).
     *
     * @param int $limit
     * @return Collection
     */
    public function getNewProducts(int $limit = 10): Collection;

    /**
     * Get low stock products.
     *
     * @param int|null $threshold
     * @return Collection
     */
    public function getLowStock(?int $threshold = null): Collection;

    /**
     * Update product stock quantity.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function updateStock(int $productId, int $quantity): bool;

    /**
     * Decrease product stock.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function decreaseStock(int $productId, int $quantity): bool;

    /**
     * Increase product stock.
     *
     * @param int $productId
     * @param int $quantity
     * @return bool
     */
    public function increaseStock(int $productId, int $quantity): bool;

    /**
     * Get products by genre.
     *
     * @param string $genre
     * @return Collection
     */
    public function getByGenre(string $genre): Collection;

    /**
     * Get products by label.
     *
     * @param string $label
     * @return Collection
     */
    public function getByLabel(string $label): Collection;

    /**
     * Get products by artist.
     *
     * @param int $artistId
     * @return Collection
     */
    public function getByArtist(int $artistId): Collection;

    /**
     * Get products by collection.
     *
     * @param int $collectionId
     * @return Collection
     */
    public function getByCollection(int $collectionId): Collection;

    /**
     * Get product statistics.
     *
     * @return array
     */
    public function getStats(): array;

    /**
     * Get query builder for complex queries.
     *
     * @return ProductQueryBuilder
     */
    public function newQuery(): ProductQueryBuilder;
}
