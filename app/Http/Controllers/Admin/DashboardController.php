<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct(
        protected AdminDashboardService $dashboardService
    ) {}

    /**
     * Get date range based on time range string.
     */
    private function getDateRangeFromTimeRange(string $timeRange): array
    {
        $now = Carbon::now();

        return match ($timeRange) {
            'today' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
            'week' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
            'month' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            'year' => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
            default => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
        };
    }

    public function index(Request $request)
    {
        // Calculate date range based on time_range parameter
        $timeRange = $request->get('time_range', 'month');
        [$startDate, $endDate] = $this->getDateRangeFromTimeRange($timeRange);

        // Get comprehensive dashboard overview (filtered by date range)
        $overview = $this->dashboardService->getDashboardOverview($startDate, $endDate);

        // Get analytics data (filtered by date range)
        $topProducts = $this->dashboardService->getTopProducts(5, $startDate, $endDate);
        $topCustomers = $this->dashboardService->getTopCustomers(5, $startDate, $endDate);
        $trendingArtists = $this->dashboardService->getTrendingArtists(5, $startDate, $endDate);
        $dailyRevenue = $this->dashboardService->getDailyRevenue($startDate, $endDate);
        $revenueByPaymentMethod = $this->dashboardService->getRevenueByPaymentMethod($startDate, $endDate);
        $revenueByGenre = $this->dashboardService->getRevenueByGenre($startDate, $endDate);
        $orderStatusDistribution = $this->dashboardService->getOrderStatusDistribution($startDate, $endDate);

        // Get items needing attention
        $productsNeedingAttention = $this->dashboardService->getProductsNeedingAttention();
        $ordersNeedingAttention = $this->dashboardService->getOrdersNeedingAttention();

        // Get recent activities
        $recentActivities = $this->dashboardService->getRecentActivities(24);

        // Get recent orders
        $recentOrders = $this->dashboardService->getRecentOrders(10);

        return Inertia::render('admin/Dashboard', [
            'dashboardStats' => [
                'revenue' => $overview['revenue']['total_revenue'] ?? 0,
                'newOrders' => $overview['orders']['today'] ?? 0,
                'customers' => $overview['users']['total'] ?? 0,
                'lowStock' => $overview['products']['low_stock'] ?? 0,
            ],
            'topProducts' => $topProducts,
            'topCustomers' => $topCustomers,
            'trendingArtists' => $trendingArtists,
            'genreData' => $revenueByGenre,
            'lowStockProducts' => $productsNeedingAttention['low_stock'] ?? [],
            'pendingOrders' => $ordersNeedingAttention['pending'] ?? [],
            'ordersNeedingShipping' => $ordersNeedingAttention['needs_shipping'] ?? [],
            'revenueData' => $dailyRevenue,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'orderStatusDistribution' => $orderStatusDistribution,
            'recentActivities' => $recentActivities,
            'recentOrders' => $recentOrders,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
}
