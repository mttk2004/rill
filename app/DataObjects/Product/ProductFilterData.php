<?php

namespace App\DataObjects\Product;

use App\DataObjects\BaseData;

/**
 * Product Filter Data Transfer Object
 *
 * Encapsulates filter parameters for product queries.
 */
readonly class ProductFilterData extends BaseData
{
    public function __construct(
        public ?string $search = null,
        public ?string $genre = null,
        public ?string $label = null,
        public ?string $artist = null,
        public ?string $collection = null,
        public ?string $status = null,
        public ?float $minPrice = null,
        public ?float $maxPrice = null,
        public ?int $minStock = null,
        public ?int $maxStock = null,
        public ?bool $isFeatured = null,
        public ?bool $isActive = null,
        public ?bool $isLowStock = null,
        public string $sortBy = 'created_at',
        public string $sortDirection = 'desc',
        public int $perPage = 15,
    ) {}

    /**
     * Check if any filter is applied.
     *
     * @return bool
     */
    public function hasFilters(): bool
    {
        return $this->search !== null
            || $this->genre !== null
            || $this->label !== null
            || $this->artist !== null
            || $this->collection !== null
            || $this->status !== null
            || $this->minPrice !== null
            || $this->maxPrice !== null
            || $this->minStock !== null
            || $this->maxStock !== null
            || $this->isFeatured !== null
            || $this->isActive !== null
            || $this->isLowStock !== null;
    }

    /**
     * Check if price range filter is applied.
     *
     * @return bool
     */
    public function hasPriceRange(): bool
    {
        return $this->minPrice !== null || $this->maxPrice !== null;
    }

    /**
     * Check if stock range filter is applied.
     *
     * @return bool
     */
    public function hasStockRange(): bool
    {
        return $this->minStock !== null || $this->maxStock !== null;
    }

    /**
     * Get active filters count.
     *
     * @return int
     */
    public function getActiveFiltersCount(): int
    {
        $count = 0;

        if ($this->search) $count++;
        if ($this->genre) $count++;
        if ($this->label) $count++;
        if ($this->artist) $count++;
        if ($this->collection) $count++;
        if ($this->status) $count++;
        if ($this->hasPriceRange()) $count++;
        if ($this->hasStockRange()) $count++;
        if ($this->isFeatured !== null) $count++;
        if ($this->isActive !== null) $count++;
        if ($this->isLowStock !== null) $count++;

        return $count;
    }

    /**
     * Create from request query parameters.
     *
     * @param array $params
     * @return static
     */
    public static function fromQueryParams(array $params): static
    {
        return new static(
            search: $params['search'] ?? null,
            genre: $params['genre'] ?? null,
            label: $params['label'] ?? null,
            artist: $params['artist'] ?? null,
            collection: $params['collection'] ?? null,
            status: $params['status'] ?? null,
            minPrice: isset($params['min_price']) ? (float) $params['min_price'] : null,
            maxPrice: isset($params['max_price']) ? (float) $params['max_price'] : null,
            minStock: isset($params['min_stock']) ? (int) $params['min_stock'] : null,
            maxStock: isset($params['max_stock']) ? (int) $params['max_stock'] : null,
            isFeatured: isset($params['is_featured']) ? filter_var($params['is_featured'], FILTER_VALIDATE_BOOLEAN) : null,
            isActive: isset($params['is_active']) ? filter_var($params['is_active'], FILTER_VALIDATE_BOOLEAN) : null,
            isLowStock: isset($params['is_low_stock']) ? filter_var($params['is_low_stock'], FILTER_VALIDATE_BOOLEAN) : null,
            sortBy: $params['sort_by'] ?? 'created_at',
            sortDirection: $params['sort_direction'] ?? 'desc',
            perPage: $params['per_page'] ?? 15,
        );
    }
}
