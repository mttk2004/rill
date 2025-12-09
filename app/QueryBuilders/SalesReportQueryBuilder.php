<?php

namespace App\QueryBuilders;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Sales Report Query Builder
 *
 * Specialized query builder for sales analytics and reporting.
 */
class SalesReportQueryBuilder
{
    /**
     * Get revenue by date range.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return array
     */
    public function getRevenue(?Carbon $from = null, ?Carbon $to = null): array
    {
        $query = DB::table('orders')
            ->where('status', '!=', 'cancelled');

        if ($from) {
            $query->where('created_at', '>=', $from);
        }

        if ($to) {
            $query->where('created_at', '<=', $to);
        }

        return [
            'total_revenue' => (float) $query->sum('total_amount'),
            'total_orders' => $query->count(),
            'average_order_value' => (float) $query->avg('total_amount'),
            'total_shipping' => (float) $query->sum('shipping_fee'),
            'total_discounts' => (float) $query->sum('discount_amount'),
        ];
    }

    /**
     * Get daily revenue for a period.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @return \Illuminate\Support\Collection
     */
    public function getDailyRevenue(Carbon $from, Carbon $to)
    {
        return DB::table('orders')
            ->leftJoin('order_items', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
            ->select([
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM(orders.total_amount) as revenue'),
                DB::raw('AVG(orders.total_amount) as avg_order_value'),
                DB::raw('SUM((order_items.unit_price - COALESCE(products.cost_price, 0)) * order_items.quantity) as profit'),
            ])
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$from, $to])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
    }

    /**
     * Get monthly revenue for a year.
     *
     * @param int $year
     * @return \Illuminate\Support\Collection
     */
    public function getMonthlyRevenue(int $year)
    {
        return DB::table('orders')
            ->select([
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('AVG(total_amount) as avg_order_value'),
            ])
            ->where('status', '!=', 'cancelled')
            ->whereYear('created_at', $year)
            ->groupBy('year', 'month')
            ->orderBy('month', 'asc')
            ->get();
    }

    /**
     * Get top selling products.
     *
     * @param int $limit
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getTopProducts(int $limit = 10, ?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select([
                'products.id',
                'products.name',
                'products.sku',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue'),
                DB::raw('AVG(order_items.unit_price) as avg_price'),
            ])
            ->whereIn('orders.status', ['confirmed', 'shipped', 'delivered']);

        if ($from) {
            $query->where('orders.created_at', '>=', $from);
        }

        if ($to) {
            $query->where('orders.created_at', '<=', $to);
        }

        return $query->groupBy('products.id', 'products.name', 'products.sku', 'products.image')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();
    }

    /**
     * Get trending artists by sales.
     *
     * @param int $limit
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getTrendingArtists(int $limit = 10, ?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('artist_product', 'products.id', '=', 'artist_product.product_id')
            ->join('artists', 'artist_product.artist_id', '=', 'artists.id')
            ->select([
                'artists.id',
                'artists.name',
                'artists.country',
                'artists.image',
                DB::raw('SUM(order_items.quantity) as total_sold'),
            ])
            ->where('orders.status', '!=', 'cancelled')
            ->where('artist_product.role', '=', 'main');

        if ($from) {
            $query->where('orders.created_at', '>=', $from);
        }

        if ($to) {
            $query->where('orders.created_at', '<=', $to);
        }

        return $query->groupBy('artists.id', 'artists.name', 'artists.country', 'artists.image')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();
    }

    /**
     * Get revenue by payment method.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getRevenueByPaymentMethod(?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('orders')
            ->join('payments', 'orders.id', '=', 'payments.order_id')
            ->select([
                'payments.payment_method',
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM(orders.total_amount) as total_revenue'),
                DB::raw('AVG(orders.total_amount) as avg_order_value'),
            ])
            ->where('orders.status', '!=', 'cancelled');

        if ($from) {
            $query->where('orders.created_at', '>=', $from);
        }

        if ($to) {
            $query->where('orders.created_at', '<=', $to);
        }

        return $query->groupBy('payments.payment_method')
            ->get();
    }

    /**
     * Get revenue by genre.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getRevenueByGenre(?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select([
                'products.genre',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue'),
                DB::raw('SUM((order_items.unit_price - COALESCE(products.cost_price, 0)) * order_items.quantity) as total_profit'),
                DB::raw('COUNT(DISTINCT order_items.order_id) as order_count'),
            ])
            ->where('orders.status', '!=', 'cancelled')
            ->whereNotNull('products.genre');

        if ($from) {
            $query->where('orders.created_at', '>=', $from);
        }

        if ($to) {
            $query->where('orders.created_at', '<=', $to);
        }

        return $query->groupBy('products.genre')
            ->orderByDesc('total_revenue')
            ->get();
    }

    /**
     * Get customer statistics.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return array
     */
    public function getCustomerStats(?Carbon $from = null, ?Carbon $to = null): array
    {
        $query = DB::table('orders')
            ->where('status', '!=', 'cancelled');

        if ($from) {
            $query->where('created_at', '>=', $from);
        }

        if ($to) {
            $query->where('created_at', '<=', $to);
        }

        $totalCustomers = DB::table('orders')
            ->distinct('user_id')
            ->where('status', '!=', 'cancelled')
            ->count('user_id');

        $repeatCustomers = DB::table('orders')
            ->select('user_id', DB::raw('COUNT(*) as order_count'))
            ->where('status', '!=', 'cancelled')
            ->groupBy('user_id')
            ->having('order_count', '>', 1)
            ->count();

        return [
            'total_customers' => $totalCustomers,
            'repeat_customers' => $repeatCustomers,
            'repeat_rate' => $totalCustomers > 0 ? ($repeatCustomers / $totalCustomers) * 100 : 0,
        ];
    }

    /**
     * Get top customers by revenue.
     *
     * @param int $limit
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getTopCustomers(int $limit = 10, ?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select([
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('SUM(orders.total_amount) as total_spent'),
                DB::raw('AVG(orders.total_amount) as avg_order_value'),
            ])
            ->where('orders.status', '!=', 'cancelled');

        if ($from) {
            $query->where('orders.created_at', '>=', $from);
        }

        if ($to) {
            $query->where('orders.created_at', '<=', $to);
        }

        return $query->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_spent')
            ->limit($limit)
            ->get();
    }

    /**
     * Get order status distribution.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return \Illuminate\Support\Collection
     */
    public function getOrderStatusDistribution(?Carbon $from = null, ?Carbon $to = null)
    {
        $query = DB::table('orders')
            ->select([
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total_revenue'),
            ]);

        if ($from) {
            $query->where('created_at', '>=', $from);
        }

        if ($to) {
            $query->where('created_at', '<=', $to);
        }

        return $query->groupBy('status')
            ->orderByDesc('count')
            ->get();
    }
}
