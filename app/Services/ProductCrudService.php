<?php

namespace App\Services;

use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\RestoreProductAction;
use App\Actions\Product\UpdateProductAction;
use App\Actions\Product\UpdateProductStockAction;
use App\DataObjects\Product\CreateProductData;
use App\DataObjects\Product\UpdateProductData;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Product CRUD Service
 *
 * Handles product Create, Read, Update, Delete operations
 * Uses Clean Architecture: Actions, Repositories, DTOs
 */
class ProductCrudService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
        protected CreateProductAction $createProductAction,
        protected UpdateProductAction $updateProductAction,
        protected UpdateProductStockAction $updateProductStockAction,
        protected DeleteProductAction $deleteProductAction,
        protected RestoreProductAction $restoreProductAction,
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
