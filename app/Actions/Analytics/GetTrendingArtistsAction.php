<?php

namespace App\Actions\Analytics;

use App\Enums\OrderStatus;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Action to get trending artists by sales volume
 */
class GetTrendingArtistsAction
{
    /**
     * Get trending artists by sales volume
     */
    public function execute(int $limit = 5): ServiceResult
    {
        try {
            $artists = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('artist_product', 'products.id', '=', 'artist_product.product_id')
                ->join('artists', 'artist_product.artist_id', '=', 'artists.id')
                ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
                ->select(
                    'artists.id',
                    'artists.name',
                    'artists.country',
                    'artists.image',
                    DB::raw('SUM(order_items.quantity) as total_sales'),
                )
                ->groupBy('artists.id', 'artists.name', 'artists.country', 'artists.image')
                ->orderByDesc('total_sales')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'country' => $item->country,
                        'image' => $item->image,
                        'total_sales' => (int) $item->total_sales,
                    ];
                });

            return ServiceResult::success([
                'artists' => $artists,
                'count' => $artists->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting trending artists: ' . $e->getMessage(),
            );
        }
    }
}
