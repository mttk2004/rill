<?php

namespace App\Services\Dashboard;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;

class DashboardStatsService
{
    /**
     * Get dashboard statistics with comparison to previous period
     */
    public function getStats(Carbon $startDate, Carbon $endDate): array
    {
        // Get previous period for comparison
        $daysDiff = $startDate->diffInDays($endDate);
        $prevStartDate = $startDate->copy()->subDays($daysDiff + 1);
        $prevEndDate = $startDate->copy()->subDay();

        // Current period stats
        $currentRevenue = Order::whereBetween('placed_at', [$startDate, $endDate])
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->sum('total_amount');

        $currentOrders = Order::whereBetween('placed_at', [$startDate, $endDate])
            ->count();

        $currentCustomers = User::whereBetween('created_at', [$startDate, $endDate])
            ->where('role', 'customer')
            ->count();

        $currentProducts = Product::whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Previous period stats
        $prevRevenue = Order::whereBetween('placed_at', [$prevStartDate, $prevEndDate])
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->sum('total_amount');

        $prevOrders = Order::whereBetween('placed_at', [$prevStartDate, $prevEndDate])
            ->count();

        $prevCustomers = User::whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->where('role', 'customer')
            ->count();

        $prevProducts = Product::whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->count();

        // Calculate percentage changes
        $revenueChange = $prevRevenue > 0
            ? round((($currentRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : 0;

        $ordersChange = $prevOrders > 0
            ? round((($currentOrders - $prevOrders) / $prevOrders) * 100, 1)
            : 0;

        $customersChange = $prevCustomers > 0
            ? round((($currentCustomers - $prevCustomers) / $prevCustomers) * 100, 1)
            : 0;

        $productsChange = $prevProducts > 0
            ? round((($currentProducts - $prevProducts) / $prevProducts) * 100, 1)
            : 0;

        return [
            'revenue' => [
                'value' => $currentRevenue,
                'change' => $revenueChange,
                'trend' => $revenueChange >= 0 ? 'up' : 'down',
            ],
            'orders' => [
                'value' => $currentOrders,
                'change' => $ordersChange,
                'trend' => $ordersChange >= 0 ? 'up' : 'down',
            ],
            'customers' => [
                'value' => $currentCustomers,
                'change' => $customersChange,
                'trend' => $customersChange >= 0 ? 'up' : 'down',
            ],
            'products' => [
                'value' => $currentProducts,
                'change' => $productsChange,
                'trend' => $productsChange >= 0 ? 'up' : 'down',
            ],
        ];
    }
}
