<?php

namespace App\Actions\Analytics;

use App\Models\Order;
use App\Support\ServiceResult;

/**
 * Action to get recent orders
 */
class GetRecentOrdersAction
{
    /**
     * Get recent orders with details
     */
    public function execute(int $limit = 10): ServiceResult
    {
        try {
            $orders = Order::with(['user', 'items.product', 'payment'])
                ->orderByDesc('placed_at')
                ->limit($limit)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total_amount' => $order->total_amount,
                        'status' => $order->status->value,
                        'created_at' => $order->placed_at->toISOString(),
                        'shipping_address' => [
                            'full_name' => $order->shipping_address['full_name'] ?? 'N/A',
                        ],
                    ];
                });

            return ServiceResult::success([
                'orders' => $orders,
                'count' => $orders->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting recent orders: ' . $e->getMessage(),
            );
        }
    }
}
