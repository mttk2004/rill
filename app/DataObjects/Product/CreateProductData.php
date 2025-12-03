<?php

namespace App\DataObjects\Product;

use App\DataObjects\BaseData;

/**
 * Create Product Data Transfer Object
 *
 * Encapsulates data required for creating a new product.
 */
readonly class CreateProductData extends BaseData
{
    public function __construct(
        public string $name,
        public string $sku,
        public float $price,
        public int $stockQuantity,
        public string $status,
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
        public bool $isFeatured = false,
    ) {}

    /**
     * Validate SKU uniqueness is required at service layer.
     *
     * @return bool
     */
    public function hasValidSku(): bool
    {
        return !empty($this->sku) && strlen($this->sku) >= 3;
    }

    /**
     * Validate price is positive.
     *
     * @return bool
     */
    public function hasValidPrice(): bool
    {
        return $this->price > 0;
    }

    /**
     * Validate stock quantity is non-negative.
     *
     * @return bool
     */
    public function hasValidStock(): bool
    {
        return $this->stockQuantity >= 0;
    }

    /**
     * Get artists count.
     *
     * @return int
     */
    public function getArtistsCount(): int
    {
        return $this->artists ? count($this->artists) : 0;
    }

    /**
     * Get collections count.
     *
     * @return int
     */
    public function getCollectionsCount(): int
    {
        return $this->collections ? count($this->collections) : 0;
    }
}
