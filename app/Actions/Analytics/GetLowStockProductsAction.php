<?php

namespace App\Actions\Analytics;

use App\Models\Product;
use App\Support\ServiceResult;

/**
 * Action to get low stock products
 */
class GetLowStockProductsAction
{

    /**
     * Get products with low stock levels
     */
    public function execute(int $limit = 5): ServiceResult
    {
        try {
            $products = Product::query()
                ->where(function ($query) {
                    $query->whereColumn('stock_quantity', '<=', 'min_stock_level')
                        ->orWhere(function ($q) {
                            $q->where('stock_quantity', '<=', 5)
                                ->whereNull('min_stock_level');
                        });
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

            return ServiceResult::success([
                'products' => $products,
                'count' => $products->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting low stock products: ' . $e->getMessage(),
            );
        }
    }
}
