<?php

namespace App\Actions\Analytics;

use App\Enums\OrderStatus;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Action to get pending orders
 */
class GetPendingOrdersAction
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
    ) {}

    /**
     * Get pending orders
     */
    public function execute(int $limit = 5): ServiceResult
    {
        try {
            $orders = $this->orderRepository->getByStatus(OrderStatus::PENDING->value)
                ->take($limit);

            $data = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->placed_at->toISOString(),
                    'shipping_address' => [
                        'full_name' => $order->shipping_address['full_name'] ?? 'N/A',
                    ],
                ];
            });

            return ServiceResult::success([
                'orders' => $data,
                'count' => $data->count(),
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error getting pending orders: ' . $e->getMessage(),
            );
        }
    }
}
