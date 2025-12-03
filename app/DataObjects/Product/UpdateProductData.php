<?php

namespace App\DataObjects\Product;

use App\DataObjects\BaseData;

/**
 * Update Product Data Transfer Object
 *
 * Encapsulates data for updating an existing product.
 */
readonly class UpdateProductData extends BaseData
{
    public function __construct(
        public ?string $name = null,
        public ?string $sku = null,
        public ?float $price = null,
        public ?int $stockQuantity = null,
        public ?string $status = null,
        public ?string $description = null,
        public ?string $genre = null,
        public ?string $label = null,
        public ?int $releaseYear = null,
        public ?string $format = null,
        public ?string $condition = null,
        public ?string $image = null,
        public ?int $minStockLevel = null,
        public ?int $weight = null,
        public ?array $specifications = null,
        public ?array $artists = null,
        public ?array $collections = null,
        public ?bool $isFeatured = null,
    ) {}

    /**
     * Check if any field has value to update.
     *
     * @return bool
     */
    public function hasChanges(): bool
    {
        $vars = get_object_vars($this);
        foreach ($vars as $value) {
            if ($value !== null) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get only non-null fields for update.
     *
     * @return array
     */
    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }

    /**
     * Check if stock quantity is being updated.
     *
     * @return bool
     */
    public function isUpdatingStock(): bool
    {
        return $this->stockQuantity !== null;
    }

    /**
     * Check if price is being updated.
     *
     * @return bool
     */
    public function isUpdatingPrice(): bool
    {
        return $this->price !== null;
    }
}
