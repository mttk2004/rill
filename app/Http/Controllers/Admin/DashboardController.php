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

    public function index(Request $request)
    {
        $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
        $endDate = Carbon::parse($request->get('end_date', now()->endOfMonth()));

        // Get comprehensive dashboard overview
        $overview = $this->dashboardService->getDashboardOverview();

        // Get analytics data
        $topProducts = $this->dashboardService->getTopProducts(5);
        $topCustomers = $this->dashboardService->getTopCustomers(5);
        $dailyRevenue = $this->dashboardService->getDailyRevenue(30);
        $revenueByPaymentMethod = $this->dashboardService->getRevenueByPaymentMethod();
        $revenueByGenre = $this->dashboardService->getRevenueByGenre();
        $orderStatusDistribution = $this->dashboardService->getOrderStatusDistribution();

        // Get items needing attention
        $productsNeedingAttention = $this->dashboardService->getProductsNeedingAttention();
        $ordersNeedingAttention = $this->dashboardService->getOrdersNeedingAttention();

        // Get recent activities
        $recentActivities = $this->dashboardService->getRecentActivities(24);

        \Log::info('Admin Dashboard Data', [
            'has_topProducts' => !empty($topProducts),
            'has_topCustomers' => !empty($topCustomers),
            'has_dailyRevenue' => !empty($dailyRevenue),
            'overview_keys' => array_keys($overview),
        ]);

        return Inertia::render('admin/Dashboard', [
            'dashboardStats' => [
                'revenue' => $overview['revenue']['total_revenue'] ?? 0,
                'newOrders' => $overview['orders']['today'] ?? 0,
                'customers' => $overview['users']['total'] ?? 0,
                'lowStock' => $overview['products']['low_stock'] ?? 0,
            ],
            'topProducts' => $topProducts,
            'topCustomers' => $topCustomers,
            'genreData' => $revenueByGenre,
            'lowStockProducts' => $productsNeedingAttention['low_stock'] ?? [],
            'pendingOrders' => $ordersNeedingAttention['pending'] ?? [],
            'ordersNeedingShipping' => $ordersNeedingAttention['needs_shipping'] ?? [],
            'revenueData' => $dailyRevenue,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'orderStatusDistribution' => $orderStatusDistribution,
            'recentActivities' => $recentActivities,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
}
