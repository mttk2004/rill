<?php

namespace App\Services\Dashboard;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Support\Collection;

class OrderAnalyticsService
{
    /**
     * Get pending orders
     */
    public function getPendingOrders(int $limit = 5): Collection
    {
        return Order::where('status', OrderStatus::PENDING)
            ->orderByDesc('placed_at')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->placed_at->toISOString(),
                    'shipping_address' => [
                        'full_name' => $order->shipping_address['full_name'] ?? 'N/A',
                    ],
                ];
            });
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return Order::with(['user', 'items.product', 'payment'])
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
    }
}
