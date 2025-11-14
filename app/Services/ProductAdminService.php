<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductAdminService
{
    /**
     * Build query with filters for product listing.
     *
     * Constructs an Eloquent query for admin product listings with comprehensive
     * filtering options including search, status, genre, featured flag, and stock levels.
     * Includes soft-deleted products for admin visibility.
     *
     * @param array $filters Associative array with keys: search, status, genre, featured, stock, sort
     * @return Builder Configured Eloquent query builder ready for pagination
     */
    public function buildProductQuery(array $filters): Builder
    {
        $query = Product::query()->withTrashed();

        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $genre = $filters['genre'] ?? null;
        $featured = $filters['featured'] ?? null;
        $stock = $filters['stock'] ?? null;
        $sort = $filters['sort'] ?? 'newest';

        // Search
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('genre', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%")
                  ->orWhereHas('artists', function ($artistQuery) use ($search) {
                      $artistQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($status === 'active') {
            $query->where('status', 'active');
        } elseif ($status === 'inactive') {
            $query->where('status', 'inactive');
        } elseif ($status === 'out_of_stock') {
            $query->where('status', 'out_of_stock');
        }

        // Genre filter
        if ($genre && $genre !== 'all-genres') {
            $query->where('genre', $genre);
        }

        // Featured filter
        if ($featured === 'yes') {
            $query->where('is_featured', true);
        } elseif ($featured === 'no') {
            $query->where('is_featured', false);
        }

        // Stock filter
        if ($stock === 'low_stock') {
            $query->whereColumn('stock_quantity', '<=', 'min_stock_level')
                  ->where('stock_quantity', '>', 0);
        } elseif ($stock === 'out_of_stock') {
            $query->where('stock_quantity', 0);
        } elseif ($stock === 'in_stock') {
            $query->whereColumn('stock_quantity', '>', 'min_stock_level');
        }

        // Sorting
        $this->applySorting($query, $sort);

        return $query;
    }

    /**
     * Apply sorting to query.
     *
     * Supports multiple sorting options: newest, oldest, name_asc, name_desc,
     * price_asc, price_desc, stock_asc, stock_desc, and featured.
     *
     * @param Builder $query The query builder to apply sorting to
     * @param string $sort Sort key (newest, oldest, name_asc, etc.)
     * @return void
     */
    protected function applySorting(Builder $query, string $sort): void
    {
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'stock_asc':
                $query->orderBy('stock_quantity', 'asc');
                break;
            case 'stock_desc':
                $query->orderBy('stock_quantity', 'desc');
                break;
            case 'sold_desc':
                $query->withCount('orderItems')
                      ->orderBy('order_items_count', 'desc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }
    }

    /**
     * Get product statistics for admin dashboard.
     *
     * Calculates aggregate statistics for products including total count,
     * active products, out of stock, low stock, and featured products.
     *
     * @return array Associative array with keys: total, active, out_of_stock, low_stock, featured
     */
    public function getProductStats(): array
    {
        return [
            'total' => Product::count(),
            'active' => Product::where('status', 'active')->count(),
            'out_of_stock' => Product::where('status', 'out_of_stock')
                ->orWhere('stock_quantity', 0)
                ->count(),
            'low_stock' => Product::whereColumn('stock_quantity', '<=', 'min_stock_level')
                ->where('stock_quantity', '>', 0)
                ->count(),
            'featured' => Product::where('is_featured', true)->count(),
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
}
