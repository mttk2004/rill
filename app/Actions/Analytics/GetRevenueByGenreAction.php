<?php

namespace App\Actions\Analytics;

use App\Enums\OrderStatus;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Action to get revenue breakdown by genre
 */
class GetRevenueByGenreAction
{
    /**
     * Get revenue by genre (top 9 + others)
     */
    public function execute(): ServiceResult
    {
        try {
            $allGenres = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
                ->whereNotNull('products.genre')
                ->select(
                    'products.genre',
                    DB::raw('SUM(order_items.total_price) as total_revenue'),
                )
                ->groupBy('products.genre')
                ->orderByDesc('total_revenue')
                ->get();

            // Take top 9 genres
            $topGenres = $allGenres->take(9)->map(function ($item) {
                return [
                    'name' => ucfirst($item->genre),
                    'value' => (float) $item->total_revenue,
                ];
            });

            // Sum remaining genres as "Khác"
            $othersRevenue = $allGenres->skip(9)->sum('total_revenue');
            if ($othersRevenue > 0) {
                $topGenres->push([
                    'name' => 'Khác',
                    'value' => (float) $othersRevenue,
                ]);
            }

            return ServiceResult::success([
                'genres' => $topGenres,
                'total_genres' => $allGenres->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error calculating revenue by genre: ' . $e->getMessage(),
            );
        }
    }
}
