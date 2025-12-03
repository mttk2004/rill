<?php

namespace App\Actions\Analytics;

use App\Enums\OrderStatus;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Action to calculate daily revenue for a time period
 */
class GetDailyRevenueAction
{
    /**
     * Get daily revenue chart data for last N days
     */
    public function execute(int $days = 30): ServiceResult
    {
        try {
            $revenue = DB::table('orders')
                ->where('placed_at', '>=', now()->subDays($days))
                ->where('status', '!=', OrderStatus::CANCELLED->value)
                ->select(
                    DB::raw('DATE(placed_at) as date'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('COUNT(*) as orders'),
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

            return ServiceResult::success([
                'daily_revenue' => $revenue,
                'days' => $days,
                'total_revenue' => $revenue->sum('revenue'),
                'total_orders' => $revenue->sum('orders'),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error calculating daily revenue: ' . $e->getMessage(),
            );
        }
    }
}
