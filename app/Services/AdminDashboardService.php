<?php

namespace App\Services;

use App\QueryBuilders\SalesReportQueryBuilder;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Carbon\Carbon;

/**
 * Admin Dashboard Service
 *
 * Centralizes all dashboard analytics and reporting using Query Builders
 */
class AdminDashboardService
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected ProductRepositoryInterface $productRepository,
        protected UserRepositoryInterface $userRepository,
    ) {}

    /**
     * Get dashboard overview statistics.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getDashboardOverview(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return [
            'orders' => $this->getOrderStats(),
            'products' => $this->getProductStats(),
            'users' => $this->getUserStats(),
            'revenue' => $salesBuilder->getRevenue($startDate, $endDate),
            'customer_stats' => $salesBuilder->getCustomerStats($startDate, $endDate),
        ];
    }

    /**
     * Get order statistics.
     *
     * @return array
     */
    public function getOrderStats(): array
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'total' => $this->orderRepository->count(),
            'pending' => $this->orderRepository->newQuery()->pending()->count(),
            'confirmed' => $this->orderRepository->newQuery()->confirmed()->count(),
            'shipped' => $this->orderRepository->newQuery()->shipped()->count(),
            'delivered' => $this->orderRepository->newQuery()->delivered()->count(),
            'cancelled' => $this->orderRepository->newQuery()->cancelled()->count(),
            'today' => $this->orderRepository->newQuery()->today()->count(),
            'this_week' => $this->orderRepository->newQuery()->dateRange($thisWeek, now())->count(),
            'this_month' => $this->orderRepository->newQuery()->dateRange($thisMonth, now())->count(),
            'needs_shipping' => $this->orderRepository->newQuery()->needsShipping()->count(),
            'average_order_value' => $this->orderRepository->newQuery()->excludeCancelled()->averageOrderValue(),
        ];
    }

    /**
     * Get product statistics.
     *
     * @return array
     */
    public function getProductStats(): array
    {
        return [
            'total' => $this->productRepository->count(),
            'active' => $this->productRepository->newQuery()->active()->count(),
            'low_stock' => $this->productRepository->newQuery()->lowStock()->count(),
            'out_of_stock' => $this->productRepository->newQuery()->outOfStock()->count(),
        ];
    }

    /**
     * Get user statistics.
     *
     * @return array
     */
    public function getUserStats(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'total' => $this->userRepository->count(),
            'verified' => $this->userRepository->newQuery()->verified()->count(),
            'today' => $this->userRepository->newQuery()->registeredAfter($today)->count(),
            'this_month' => $this->userRepository->newQuery()->registeredAfter($thisMonth)->count(),
        ];
    }

    /**
     * Get revenue statistics for a date range.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getRevenueStats(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getRevenue($startDate, $endDate);
    }

    /**
     * Get daily revenue breakdown.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getDailyRevenue(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();
        $startDate = $startDate ?? Carbon::now()->subDays(30);
        $endDate = $endDate ?? Carbon::now();

        return $salesBuilder->getDailyRevenue($startDate, $endDate)
            ->map(fn($item) => (array) $item)
            ->values()
            ->toArray();
    }

    /**
     * Get monthly revenue breakdown.
     *
     * @param int $months
     * @return array
     */
    public function getMonthlyRevenue(int $months = 12): array
    {
        $salesBuilder = new SalesReportQueryBuilder();
        $year = Carbon::now()->year;

        return $salesBuilder->getMonthlyRevenue($year)->values()->toArray();
    }

    /**
     * Get top selling products.
     *
     * @param int $limit
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getTopProducts(int $limit = 5, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getTopProducts($limit, $startDate, $endDate)
            ->map(function ($item) {
                $item = (array) $item;
                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'sku' => $item['sku'],
                    'image' => $item['image'] ?? null,
                    'sales' => (int) $item['total_sold'],
                    'revenue' => (float) $item['total_revenue'],
                    'avg_price' => (float) $item['avg_price'],
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get trending artists by sales.
     *
     * @param int $limit
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getTrendingArtists(int $limit = 5, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getTrendingArtists($limit, $startDate, $endDate)
            ->map(function ($item) {
                $item = (array) $item;
                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'country' => $item['country'] ?? 'N/A',
                    'sales' => (int) $item['total_sold'],
                    'image' => $item['image'] ?? null,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get top customers by total spend.
     *
     * @param int $limit
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getTopCustomers(int $limit = 5, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getTopCustomers($limit, $startDate, $endDate)
            ->map(fn($item) => (array) $item)
            ->values()
            ->toArray();
    }

    /**
     * Get revenue breakdown by payment method.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getRevenueByPaymentMethod(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getRevenueByPaymentMethod($startDate, $endDate)
            ->map(fn($item) => (array) $item)
            ->values()
            ->toArray();
    }

    /**
     * Get revenue breakdown by product genre.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getRevenueByGenre(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getRevenueByGenre($startDate, $endDate)
            ->map(function ($item) {
                $item = (array) $item;
                $revenue = (float) $item['total_revenue'];
                $profit = (float) $item['total_profit'];
                $profitMargin = $revenue > 0 ? ($profit / $revenue) * 100 : 0;

                return [
                    'name' => $item['genre'],
                    'value' => $revenue,
                    'profit' => $profit,
                    'profit_margin' => round($profitMargin, 2),
                ];
            })
            ->values()
            ->toArray();
    }    /**
     * Get order status distribution.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getOrderStatusDistribution(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return $salesBuilder->getOrderStatusDistribution($startDate, $endDate)
            ->map(fn($item) => (array) $item)
            ->values()
            ->toArray();
    }

    /**
     * Get comprehensive sales report.
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getSalesReport(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesBuilder = new SalesReportQueryBuilder();

        return [
            'revenue' => $salesBuilder->getRevenue($startDate, $endDate),
            'top_products' => $salesBuilder->getTopProducts(10)->toArray(),
            'top_customers' => $salesBuilder->getTopCustomers(10)->toArray(),
            'revenue_by_payment_method' => $salesBuilder->getRevenueByPaymentMethod()->toArray(),
            'revenue_by_genre' => $salesBuilder->getRevenueByGenre()->toArray(),
            'order_status_distribution' => $salesBuilder->getOrderStatusDistribution()->toArray(),
            'customer_stats' => $salesBuilder->getCustomerStats(),
        ];
    }

    /**
     * Get products that need attention (low stock, out of stock).
     *
     * @return array
     */
    public function getProductsNeedingAttention(): array
    {
        return [
            'low_stock' => $this->productRepository->newQuery()
                ->lowStock()
                ->withRelations(['artists'])
                ->get()
                ->toArray(),
            'out_of_stock' => $this->productRepository->newQuery()
                ->outOfStock()
                ->withRelations(['artists'])
                ->get()
                ->toArray(),
        ];
    }

    /**
     * Get orders that need attention (pending, needs shipping).
     *
     * @return array
     */
    public function getOrdersNeedingAttention(): array
    {
        return [
            'pending' => $this->orderRepository->newQuery()
                ->pending()
                ->withRelations(['user', 'items.product'])
                ->newest()
                ->getQuery()
                ->limit(10)
                ->get()
                ->toArray(),
            'needs_shipping' => $this->orderRepository->newQuery()
                ->needsShipping()
                ->withRelations(['user', 'items.product'])
                ->newest()
                ->getQuery()
                ->limit(10)
                ->get()
                ->toArray(),
        ];
    }

    /**
     * Get recent activities summary.
     *
     * @param int $hours
     * @return array
     */
    public function getRecentActivities(int $hours = 24): array
    {
        $since = Carbon::now()->subHours($hours);

        return [
            'new_orders' => $this->orderRepository->newQuery()
                ->dateRange($since, now())
                ->count(),
            'new_users' => $this->userRepository->newQuery()
                ->registeredAfter($since)
                ->count(),
            'completed_orders' => $this->orderRepository->newQuery()
                ->delivered()
                ->dateRange($since, now())
                ->count(),
        ];
    }

    /**
     * Get recent orders with customer information.
     *
     * @param int $limit
     * @return array
     */
    public function getRecentOrders(int $limit = 10): array
    {
        return $this->orderRepository->newQuery()
            ->withRelations(['user'])
            ->newest()
            ->getQuery()
            ->take($limit)
            ->get()
            ->map(function ($order) {
                  // Parse shipping_address JSON
                $shippingAddress = is_string($order->shipping_address)
                    ? json_decode($order->shipping_address, true)
                    : $order->shipping_address;

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'shipping_address' => $shippingAddress,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                ];
            })
            ->values()
            ->toArray();
    }
}
