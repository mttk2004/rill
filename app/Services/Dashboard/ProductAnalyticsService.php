<?php

namespace App\Services\Dashboard;

use App\Enums\OrderStatus;
use App\Models\Product;
use App\Services\BestSellerService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductAnalyticsService
{
    /**
     * Get top selling products
     * Note: Uses raw query for performance on dashboard, but logic matches BestSellerService
     */
    public function getTopProducts(int $limit = 5): Collection
    {
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.image')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'image' => $item->image,
                    'sales' => (int) $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        return $topProducts;
    }

    /**
     * Get low stock products
     */
    public function getLowStockProducts(int $limit = 5): Collection
    {
        return Product::whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->orWhere(function ($query) {
                $query->where('stock_quantity', '<=', 5)
                    ->whereNull('min_stock_level');
            })
            ->select('id', 'name', 'slug', 'image', 'stock_quantity', 'min_stock_level')
            ->orderBy('stock_quantity')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'stock_quantity' => $product->stock_quantity,
                    'min_stock_level' => $product->min_stock_level ?? 5,
                ];
            });
    }
}
