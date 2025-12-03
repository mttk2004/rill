<?php

namespace App\Actions\Analytics;

use App\Enums\OrderStatus;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Action to get top selling products
 */
class GetTopProductsAction
{
    /**
     * Get top selling products by quantity sold
     */
    public function execute(int $limit = 5): ServiceResult
    {
        try {
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
                    DB::raw('SUM(order_items.total_price) as total_revenue'),
                )
                ->groupBy('products.id', 'products.name', 'products.sku', 'products.image')
                ->orderByDesc('total_quantity')
                ->orderBy('products.id')
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

            return ServiceResult::success([
                'products' => $topProducts,
                'count' => $topProducts->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting top products: ' . $e->getMessage(),
            );
        }
    }
}
