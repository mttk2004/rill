<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardStatsService;
use App\Services\Dashboard\ProductAnalyticsService;
use App\Services\Dashboard\OrderAnalyticsService;
use App\Services\Dashboard\RevenueAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardStatsService $statsService,
        protected ProductAnalyticsService $productService,
        protected OrderAnalyticsService $orderService,
        protected RevenueAnalyticsService $revenueService
    ) {}

    public function index(Request $request)
    {
        $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
        $endDate = Carbon::parse($request->get('end_date', now()->endOfMonth()));

        // Get data from services
        $stats = $this->statsService->getStats($startDate, $endDate);
        $topProducts = $this->productService->getTopProducts(5);
        $lowStockProducts = $this->productService->getLowStockProducts(5);
        $pendingOrders = $this->orderService->getPendingOrders(5);
        $recentOrders = $this->orderService->getRecentOrders(config('pagination.admin.recent_items'));
        $dailyRevenue = $this->revenueService->getDailyRevenue(30);
        $genreRevenue = $this->revenueService->getRevenueByGenre();
        $trendingArtists = $this->revenueService->getTrendingArtists(5);

        return Inertia::render('admin/Dashboard', [
            'dashboardStats' => [
                'revenue' => $stats['revenue']['value'],
                'newOrders' => $stats['orders']['value'],
                'customers' => $stats['customers']['value'],
                'lowStock' => $lowStockProducts->count(),
            ],
            'topProducts' => $topProducts,
            'genreData' => $genreRevenue,
            'trendingArtists' => $trendingArtists,
            'lowStockProducts' => $lowStockProducts,
            'pendingOrders' => $pendingOrders,
            'recentOrders' => $recentOrders,
            'revenueData' => $dailyRevenue,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
}
