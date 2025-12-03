<?php

namespace App\Actions\Product;

use App\Actions\BaseAction;
use App\DataObjects\Product\CreateProductData;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Str;

/**
 * Create Product Action
 *
 * Single responsibility: Create a new product with validation.
 */
class CreateProductAction extends BaseAction
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Execute product creation.
     *
     * @param CreateProductData $data
     * @return ServiceResult
     */
    public function execute(CreateProductData $data): ServiceResult
    {
        // Validate SKU uniqueness
        if (!$data->hasValidSku()) {
            return $this->error('Invalid SKU format');
        }

        $existingProduct = $this->productRepository->findBySku($data->sku);
        if ($existingProduct) {
            return $this->error('SKU already exists', ['sku' => $data->sku]);
        }

        // Validate price and stock
        if (!$data->hasValidPrice()) {
            return $this->error('Price must be greater than 0');
        }

        if (!$data->hasValidStock()) {
            return $this->error('Stock quantity cannot be negative');
        }

        return $this->transaction(function () use ($data) {
            // Create product
            $product = $this->productRepository->create([
                'name' => $data->name,
                'slug' => Str::slug($data->name),
                'sku' => $data->sku,
                'price' => $data->price,
                'stock_quantity' => $data->stockQuantity,
                'status' => $data->status,
                'description' => $data->description,
                'genre' => $data->genre,
                'label' => $data->label,
                'release_year' => $data->releaseYear,
                'format' => $data->format,
                'condition' => $data->condition,
                'image' => $data->image,
                'min_stock_level' => $data->minStockLevel ?? 5,
                'weight' => $data->weight,
                'specifications' => $data->specifications,
                'is_featured' => $data->isFeatured,
            ]);

            // Attach artists if provided
            if ($data->artists) {
                $artistsData = [];
                foreach ($data->artists as $index => $artist) {
                    $artistsData[$artist['artist_id']] = [
                        'role' => $artist['role'] ?? 'performer',
                        'sort_order' => $index,
                    ];
                }
                $product->artists()->sync($artistsData);
            }

            // Attach collections if provided
            if ($data->collections) {
                $product->collections()->sync($data->collections);
            }

            return $this->success(
                $product->fresh(['artists', 'collections']),
                'Product created successfully'
            );
        });
    }
}
