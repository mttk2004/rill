<?php

namespace App\Actions\Product;

use App\Actions\BaseAction;
use App\DataObjects\Product\UpdateProductData;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Str;

/**
 * Update Product Action
 *
 * Single responsibility: Update existing product with validation.
 */
class UpdateProductAction extends BaseAction
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Execute product update.
     *
     * @param int $productId
     * @param UpdateProductData $data
     * @return ServiceResult
     */
    public function execute(int $productId, UpdateProductData $data): ServiceResult
    {
        $product = $this->productRepository->find($productId);

        if (!$product) {
            return $this->error('Product not found');
        }

        // Check if any changes provided
        if (!$data->hasChanges()) {
            return $this->error('No changes provided');
        }

        // Validate SKU uniqueness if being updated
        if ($data->sku && $data->sku !== $product->sku) {
            $existingProduct = $this->productRepository->findBySku($data->sku);
            if ($existingProduct && $existingProduct->id !== $product->id) {
                return $this->error('SKU already exists', ['sku' => $data->sku]);
            }
        }

        return $this->transaction(function () use ($product, $data) {
            $updateData = $data->toUpdateArray();

            // Update slug if name is changing
            if (isset($updateData['name'])) {
                $updateData['slug'] = Str::slug($updateData['name']);
            }

            // Update product
            $this->productRepository->update($product->id, $updateData);

            // Update artists if provided
            if ($data->artists !== null) {
                $artistsData = [];
                foreach ($data->artists as $index => $artist) {
                    $artistsData[$artist['artist_id']] = [
                        'role' => $artist['role'] ?? 'performer',
                        'sort_order' => $index,
                    ];
                }
                $product->artists()->sync($artistsData);
            }

            // Update collections if provided
            if ($data->collections !== null) {
                $product->collections()->sync($data->collections);
            }

            return $this->success(
                $product->fresh(['artists', 'collections']),
                'Product updated successfully'
            );
        });
    }
}
