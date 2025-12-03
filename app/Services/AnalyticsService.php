<?php

namespace App\Services;

use App\Actions\Analytics\GetDailyRevenueAction;
use App\Actions\Analytics\GetLowStockProductsAction;
use App\Actions\Analytics\GetPendingOrdersAction;
use App\Actions\Analytics\GetRecentOrdersAction;
use App\Actions\Analytics\GetRevenueByGenreAction;
use App\Actions\Analytics\GetTopProductsAction;
use App\Actions\Analytics\GetTrendingArtistsAction;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Refactored analytics service with Clean Architecture
 * Combines revenue, product, and order analytics
 */
class AnalyticsService
{
    private GetDailyRevenueAction $dailyRevenueAction;
    private GetRevenueByGenreAction $revenueByGenreAction;
    private GetTrendingArtistsAction $trendingArtistsAction;
    private GetTopProductsAction $topProductsAction;
    private GetLowStockProductsAction $lowStockAction;
    private GetPendingOrdersAction $pendingOrdersAction;
    private GetRecentOrdersAction $recentOrdersAction;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
    ) {
        $this->dailyRevenueAction = new GetDailyRevenueAction();
        $this->revenueByGenreAction = new GetRevenueByGenreAction();
        $this->trendingArtistsAction = new GetTrendingArtistsAction();
        $this->topProductsAction = new GetTopProductsAction();
        $this->lowStockAction = new GetLowStockProductsAction();
        $this->pendingOrdersAction = new GetPendingOrdersAction($orderRepository);
        $this->recentOrdersAction = new GetRecentOrdersAction();
    }

    // Revenue Analytics

    /**
     * Get daily revenue for last N days
     */
    public function getDailyRevenue(int $days = 30): ServiceResult
    {
        return $this->dailyRevenueAction->execute($days);
    }

    /**
     * Get revenue breakdown by genre (top 9 + others)
     */
    public function getRevenueByGenre(): ServiceResult
    {
        return $this->revenueByGenreAction->execute();
    }

    /**
     * Get trending artists by sales volume
     */
    public function getTrendingArtists(int $limit = 5): ServiceResult
    {
        return $this->trendingArtistsAction->execute($limit);
    }

    // Product Analytics

    /**
     * Get top selling products
     */
    public function getTopProducts(int $limit = 5): ServiceResult
    {
        return $this->topProductsAction->execute($limit);
    }

    /**
     * Get products with low stock levels
     */
    public function getLowStockProducts(int $limit = 5): ServiceResult
    {
        return $this->lowStockAction->execute($limit);
    }

    // Order Analytics

    /**
     * Get pending orders
     */
    public function getPendingOrders(int $limit = 5): ServiceResult
    {
        return $this->pendingOrdersAction->execute($limit);
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(int $limit = 10): ServiceResult
    {
        return $this->recentOrdersAction->execute($limit);
    }

    /**
     * Get complete dashboard data
     */
    public function getDashboardData(): ServiceResult
    {
        try {
            $dailyRevenue = $this->getDailyRevenue(30);
            $revenueByGenre = $this->getRevenueByGenre();
            $trendingArtists = $this->getTrendingArtists(5);
            $topProducts = $this->getTopProducts(5);
            $lowStockProducts = $this->getLowStockProducts(5);
            $pendingOrders = $this->getPendingOrders(5);
            $recentOrders = $this->getRecentOrders(10);

            return ServiceResult::success([
                'daily_revenue' => $dailyRevenue->data,
                'revenue_by_genre' => $revenueByGenre->data,
                'trending_artists' => $trendingArtists->data,
                'top_products' => $topProducts->data,
                'low_stock_products' => $lowStockProducts->data,
                'pending_orders' => $pendingOrders->data,
                'recent_orders' => $recentOrders->data,
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting dashboard data: ' . $e->getMessage(),
            );
        }
    }
}
