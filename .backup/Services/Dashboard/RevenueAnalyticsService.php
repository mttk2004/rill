<?php

namespace App\Services\Dashboard;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RevenueAnalyticsService
{
    /**
     * Get daily revenue chart data for last N days
     */
    public function getDailyRevenue(int $days = 30): Collection
    {
        return Order::where('placed_at', '>=', now()->subDays($days))
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->select(
                DB::raw('DATE(placed_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'revenue' => (float) $item->revenue,
                    'orders' => (int) $item->orders,
                ];
            });
    }

    /**
     * Get revenue by genre (top 9 + others)
     */
    public function getRevenueByGenre(): Collection
    {
        $allGenres = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->whereNotNull('products.genre')
            ->select(
                'products.genre',
                DB::raw('SUM(order_items.total_price) as total_revenue')
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

        return $topGenres;
    }

    /**
     * Get trending artists by sales volume
     */
    public function getTrendingArtists(int $limit = 5): Collection
    {
        return DB::table('order_items')
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
                DB::raw('SUM(order_items.quantity) as total_sales')
            )
            ->groupBy('artists.id', 'artists.name', 'artists.country', 'artists.image')
            ->orderByDesc('total_sales')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'country' => $item->country ?? 'N/A',
                    'sales' => (int) $item->total_sales,
                    'image' => $item->image,
                ];
            });
    }

    /**
     * Get revenue by payment method
     */
    public function getRevenueByPaymentMethod(Carbon $startDate, Carbon $endDate): Collection
    {
        return Order::join('payments', 'orders.id', '=', 'payments.order_id')
            ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'payments.payment_method',
                DB::raw('SUM(orders.total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('payments.payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method,
                    'total' => (float) $item->total,
                    'count' => (int) $item->count,
                ];
            });
    }
}
