<?php

namespace App\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

/**
 * Product Query Builder
 *
 * Encapsulates complex product queries with fluent interface.
 * Provides reusable, testable query logic.
 */
class ProductQueryBuilder
{
    protected Builder $query;

    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    /**
     * Filter by search term (name, SKU, description).
     *
     * @param string|null $search
     * @return self
     */
    public function search(?string $search): self
    {
        if (empty($search)) {
            return $this;
        }

        $this->query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('sku', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%");
        });

        return $this;
    }

    /**
     * Filter by status.
     *
     * @param string|null $status
     * @return self
     */
    public function status(?string $status): self
    {
        if ($status) {
            $this->query->where('status', $status);
        }

        return $this;
    }

    /**
     * Filter active products only.
     *
     * @return self
     */
    public function active(): self
    {
        return $this->status('active');
    }

    /**
     * Filter by genre.
     *
     * @param string|null $genre
     * @return self
     */
    public function genre(?string $genre): self
    {
        if ($genre) {
            $this->query->where('genre', $genre);
        }

        return $this;
    }

    /**
     * Filter by label.
     *
     * @param string|null $label
     * @return self
     */
    public function label(?string $label): self
    {
        if ($label) {
            $this->query->where('label', $label);
        }

        return $this;
    }

    /**
     * Filter by artist name.
     *
     * @param string|null $artistName
     * @return self
     */
    public function byArtist(?string $artistName): self
    {
        if ($artistName) {
            $this->query->whereHas('artists', function ($q) use ($artistName) {
                $q->where('name', $artistName);
            });
        }

        return $this;
    }

    /**
     * Filter by artist ID.
     *
     * @param int|null $artistId
     * @return self
     */
    public function byArtistId(?int $artistId): self
    {
        if ($artistId) {
            $this->query->whereHas('artists', function ($q) use ($artistId) {
                $q->where('artists.id', $artistId);
            });
        }

        return $this;
    }

    /**
     * Filter by collection name.
     *
     * @param string|null $collectionName
     * @return self
     */
    public function byCollection(?string $collectionName): self
    {
        if ($collectionName) {
            $this->query->whereHas('collections', function ($q) use ($collectionName) {
                $q->where('name', $collectionName);
            });
        }

        return $this;
    }

    /**
     * Filter by collection ID.
     *
     * @param int|null $collectionId
     * @return self
     */
    public function byCollectionId(?int $collectionId): self
    {
        if ($collectionId) {
            $this->query->whereHas('collections', function ($q) use ($collectionId) {
                $q->where('collections.id', $collectionId);
            });
        }

        return $this;
    }

    /**
     * Filter by price range.
     *
     * @param float|null $minPrice
     * @param float|null $maxPrice
     * @return self
     */
    public function priceRange(?float $minPrice, ?float $maxPrice): self
    {
        if ($minPrice !== null) {
            $this->query->where('price', '>=', $minPrice);
        }

        if ($maxPrice !== null) {
            $this->query->where('price', '<=', $maxPrice);
        }

        return $this;
    }

    /**
     * Filter by stock range.
     *
     * @param int|null $minStock
     * @param int|null $maxStock
     * @return self
     */
    public function stockRange(?int $minStock, ?int $maxStock): self
    {
        if ($minStock !== null) {
            $this->query->where('stock_quantity', '>=', $minStock);
        }

        if ($maxStock !== null) {
            $this->query->where('stock_quantity', '<=', $maxStock);
        }

        return $this;
    }

    /**
     * Filter low stock products.
     *
     * @return self
     */
    public function lowStock(): self
    {
        $this->query->whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->where('stock_quantity', '>', 0);

        return $this;
    }

    /**
     * Filter out of stock products.
     *
     * @return self
     */
    public function outOfStock(): self
    {
        $this->query->where('stock_quantity', 0);

        return $this;
    }

    /**
     * Filter featured products.
     *
     * @param bool|null $isFeatured
     * @return self
     */
    public function featured(?bool $isFeatured = true): self
    {
        if ($isFeatured !== null) {
            $this->query->where('is_featured', $isFeatured);
        }

        return $this;
    }

    /**
     * Sort by field and direction.
     *
     * @param string $field
     * @param string $direction
     * @return self
     */
    public function orderBy(string $field, string $direction = 'asc'): self
    {
        $this->query->orderBy($field, $direction);

        return $this;
    }

    /**
     * Sort by newest first.
     *
     * @return self
     */
    public function newest(): self
    {
        return $this->orderBy('created_at', 'desc');
    }

    /**
     * Sort by oldest first.
     *
     * @return self
     */
    public function oldest(): self
    {
        return $this->orderBy('created_at', 'asc');
    }

    /**
     * Sort by name.
     *
     * @param string $direction
     * @return self
     */
    public function sortByName(string $direction = 'asc'): self
    {
        return $this->orderBy('name', $direction);
    }

    /**
     * Sort by price.
     *
     * @param string $direction
     * @return self
     */
    public function sortByPrice(string $direction = 'asc'): self
    {
        return $this->orderBy('price', $direction);
    }

    /**
     * Sort by best sellers (total sold).
     *
     * @return self
     */
    public function bestSellers(): self
    {
        $this->query->withCount(['orderItems as total_sold' => function ($q) {
            $q->selectRaw('SUM(quantity)');
        }])->orderByDesc('total_sold')->orderBy('id', 'asc');

        return $this;
    }

    /**
     * With relationships.
     *
     * @param array|string $relations
     * @return self
     */
    public function withRelations(array|string $relations): self
    {
        $this->query->with($relations);

        return $this;
    }

    /**
     * Include soft deleted products.
     *
     * @return self
     */
    public function withTrashed(): self
    {
        $this->query->withTrashed();

        return $this;
    }

    /**
     * Get the underlying query builder.
     *
     * @return Builder
     */
    public function getQuery(): Builder
    {
        return $this->query;
    }

    /**
     * Execute and get results.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function get()
    {
        return $this->query->get();
    }

    /**
     * Execute and paginate results.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 15)
    {
        return $this->query->paginate($perPage);
    }

    /**
     * Get first result.
     *
     * @return \App\Models\Product|null
     */
    public function first()
    {
        return $this->query->first();
    }

    /**
     * Count results.
     *
     * @return int
     */
    public function count(): int
    {
        return $this->query->count();
    }
}
