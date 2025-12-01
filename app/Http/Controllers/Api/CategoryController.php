<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get menu data for categories dropdown
     */
    public function getMenuData(): JsonResponse
    {
        try {
            // Get unique genres with product counts (limit to prevent performance issues)
            $genres = Product::select('genre')
                ->selectRaw('COUNT(*) as count')
                ->where('status', 'active')
                ->whereNotNull('genre')
                ->where('genre', '!=', '')
                ->groupBy('genre')
                ->orderBy('count', 'desc')
                ->orderBy('genre')
                ->limit(config('pagination.api.default'))
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->genre,
                        'slug' => \Str::slug($item->genre),
                        'count' => (int) $item->count,
                    ];
                });

            // Get unique labels with product counts (limit to prevent performance issues)
            $labels = Product::select('label')
                ->selectRaw('COUNT(*) as count')
                ->where('status', 'active')
                ->whereNotNull('label')
                ->where('label', '!=', '')
                ->groupBy('label')
                ->orderBy('count', 'desc')
                ->orderBy('label')
                ->limit(config('pagination.api.default'))
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->label,
                        'slug' => \Str::slug($item->label),
                        'count' => (int) $item->count,
                    ];
                });

            // Get artists with product counts
            $artists = \DB::table('artist_product')
                ->join('artists', 'artist_product.artist_id', '=', 'artists.id')
                ->join('products', 'artist_product.product_id', '=', 'products.id')
                ->select('artists.name', 'artists.slug')
                ->selectRaw('COUNT(DISTINCT products.id) as count')
                ->where('products.status', 'active')
                ->where('artists.is_active', true)
                ->groupBy('artists.id', 'artists.name', 'artists.slug')
                ->orderBy('count', 'desc')
                ->orderBy('artists.name')
                ->limit(config('pagination.api.default'))
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'count' => (int) $item->count,
                    ];
                });

            // Get active collections with product counts
            $collections = \DB::table('collection_product')
                ->join('collections', 'collection_product.collection_id', '=', 'collections.id')
                ->join('products', 'collection_product.product_id', '=', 'products.id')
                ->select('collections.name', 'collections.slug')
                ->selectRaw('COUNT(DISTINCT products.id) as count')
                ->where('products.status', 'active')
                ->where('collections.is_active', true)
                ->whereNull('collections.deleted_at')
                ->groupBy('collections.id', 'collections.name', 'collections.slug')
                ->orderBy('collections.name')
                ->limit(config('pagination.api.default'))
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'count' => (int) $item->count,
                    ];
                });

            // Get new products count (products from last 30 days)
            $newCount = Product::where('status', 'active')
                ->where('created_at', '>=', now()->subDays(30))
                ->count();

            return response()->json([
                'genres' => $genres,
                'labels' => $labels,
                'artists' => $artists,
                'collections' => $collections,
                'special' => [
                    [
                        'name' => 'Sản phẩm mới',
                        'slug' => 'new',
                        'count' => (int) $newCount,
                    ],
                ],
                'success' => true,
                'timestamp' => now()->toISOString(),
            ])->header('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể tải dữ liệu danh mục',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
