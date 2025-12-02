<?php

namespace App\Services;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Builder;

class BestSellerService
{
    /**
     * Apply best seller query scope to product query builder
     * This ensures consistent "best seller" logic across the entire application
     *
     * @param Builder $query The product query builder
     * @return Builder
     */
    public static function applyBestSellerScope(Builder $query): Builder
    {
        return $query->withCount(['orderItems as total_sold' => function ($q) {
            $q->join('orders', 'order_items.order_id', '=', 'orders.id')
              ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
              ->select(\DB::raw('COALESCE(SUM(order_items.quantity), 0)'));
        }])->orderByDesc('total_sold');
    }

    /**
     * Add best seller count to query without sorting
     * Useful when you need the count but want to sort by other criteria
     *
     * @param Builder $query The product query builder
     * @return Builder
     */
    public static function withBestSellerCount(Builder $query): Builder
    {
        return $query->withCount(['orderItems as total_sold' => function ($q) {
            $q->join('orders', 'order_items.order_id', '=', 'orders.id')
              ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
              ->select(\DB::raw('COALESCE(SUM(order_items.quantity), 0)'));
        }]);
    }
}
