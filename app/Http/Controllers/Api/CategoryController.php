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
                ->limit(20)
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
                ->limit(20)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->label,
                        'slug' => \Str::slug($item->label),
                        'count' => (int) $item->count,
                    ];
                });

            // Get featured products count
            $featuredCount = Product::where('status', 'active')
                ->where('is_featured', true)
                ->count();

            // Get new products count (products from last 30 days)
            $newCount = Product::where('status', 'active')
                ->where('created_at', '>=', now()->subDays(30))
                ->count();

            // Get products on sale count (products with compare_price > price)
            $saleCount = Product::where('status', 'active')
                ->whereNotNull('compare_price')
                ->whereColumn('compare_price', '>', 'price')
                ->count();

            return response()->json([
                'genres' => $genres,
                'labels' => $labels,
                'special' => [
                    [
                        'name' => 'Sản phẩm nổi bật',
                        'slug' => 'featured',
                        'count' => (int) $featuredCount,
                    ],
                    [
                        'name' => 'Sản phẩm mới',
                        'slug' => 'new',
                        'count' => (int) $newCount,
                    ],
                    [
                        'name' => 'Đang giảm giá',
                        'slug' => 'sale',
                        'count' => (int) $saleCount,
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
