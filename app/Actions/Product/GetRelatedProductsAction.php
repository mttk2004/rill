<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Support\ServiceResult;

/**
 * Get related products with priority: same artist → same label → same genre → random
 */
class GetRelatedProductsAction
{
    public function execute(Product $product, int $limit = 8): ServiceResult
    {
        $artistIds = $product->artists->pluck('id')->toArray();

        $baseQuery = Product::with([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
            'collections' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('name')
                    ->limit(1);
            }
        ])
            ->active()
            ->where('id', '!=', $product->id);

        $relatedProducts = collect();
        $excludeIds = [$product->id];

        // Priority 1: Products with same artists
        if (!empty($artistIds)) {
            $needed = $limit - $relatedProducts->count();
            $sameArtistProducts = (clone $baseQuery)
                ->whereNotIn('id', $excludeIds)
                ->whereHas('artists', function ($q) use ($artistIds) {
                    $q->whereIn('artists.id', $artistIds);
                })
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $relatedProducts = $relatedProducts->merge($sameArtistProducts);
            $excludeIds = array_merge($excludeIds, $sameArtistProducts->pluck('id')->toArray());
        }

        // Priority 2: Products with same label
        if ($relatedProducts->count() < $limit && $product->label) {
            $needed = $limit - $relatedProducts->count();
            $sameLabelProducts = (clone $baseQuery)
                ->whereNotIn('id', $excludeIds)
                ->where('label', $product->label)
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $relatedProducts = $relatedProducts->merge($sameLabelProducts);
            $excludeIds = array_merge($excludeIds, $sameLabelProducts->pluck('id')->toArray());
        }

        // Priority 3: Products with same genre
        if ($relatedProducts->count() < $limit && $product->genre) {
            $needed = $limit - $relatedProducts->count();
            $sameGenreProducts = (clone $baseQuery)
                ->whereNotIn('id', $excludeIds)
                ->where('genre', $product->genre)
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $relatedProducts = $relatedProducts->merge($sameGenreProducts);
            $excludeIds = array_merge($excludeIds, $sameGenreProducts->pluck('id')->toArray());
        }

        // Priority 4: Random products to fill up to limit
        if ($relatedProducts->count() < $limit) {
            $needed = $limit - $relatedProducts->count();
            $randomProducts = (clone $baseQuery)
                ->whereNotIn('id', $excludeIds)
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $relatedProducts = $relatedProducts->merge($randomProducts);
        }

        // Transform products
        $transformed = $relatedProducts->map(function ($relatedProduct) {
            return $this->transformProduct($relatedProduct);
        })->toArray();

        return ServiceResult::success($transformed);
    }

    protected function transformProduct(Product $product): array
    {
        $firstCollection = $product->collections->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock_quantity' => $product->stock_quantity,
            'genre' => $product->genre,
            'label' => $product->label,
            'image' => $product->image,
            'image_url' => $product->image_url,
            'status' => $product->status,
            'collection' => $firstCollection ? [
                'id' => $firstCollection->id,
                'name' => $firstCollection->name,
                'type' => $firstCollection->type,
            ] : null,
            'artists' => $product->artists->map(function ($artist) {
                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'slug' => $artist->slug,
                    'role' => $artist->pivot->role,
                ];
            })->toArray(),
            'main_artists' => $product->artists
                ->where('pivot.role', 'main')
                ->pluck('name')
                ->toArray(),
            'featured_artists' => $product->artists
                ->where('pivot.role', 'featured')
                ->pluck('name')
                ->toArray(),
            'in_stock' => $product->isInStock(),
            'low_stock' => $product->isLowStock(),
            'reviews_count' => $product->reviews()->count(),
            'average_rating' => round($product->reviews()->avg('rating') ?? 0, 1),
            'total_sold' => $product->total_sold ?? 0,
        ];
    }
}
