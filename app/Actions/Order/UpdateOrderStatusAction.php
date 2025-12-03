<?php

namespace App\Actions\Order;

use App\Actions\BaseAction;
use App\Enums\OrderStatus;
use App\Mail\OrderStatusUpdated;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Mail;

/**
 * Update Order Status Action
 *
 * Single responsibility: Update order status with validation and notifications.
 */
class UpdateOrderStatusAction extends BaseAction
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
    ) {}

    /**
     * Execute status update.
     *
     * @param int $orderId
     * @param OrderStatus $newStatus
     * @param string|null $notes
     * @return ServiceResult
     */
    public function execute(int $orderId, OrderStatus $newStatus, ?string $notes = null): ServiceResult
    {
        $order = $this->orderRepository->find($orderId);

        if (!$order) {
            return $this->error('Order not found');
        }

        // Validate status transition
        if (!$this->isValidStatusTransition($order->status, $newStatus)) {
            return $this->error(
                "Cannot transition from {$order->status->value} to {$newStatus->value}",
                ['current_status' => $order->status->value, 'new_status' => $newStatus->value]
            );
        }

        return $this->transaction(function () use ($order, $newStatus, $notes) {
            $oldStatus = $order->status;

            // Update order status
            $this->orderRepository->updateStatus($order->id, $newStatus->value);

            // Create status history if notes provided
            if ($notes) {
                $order->statusHistories()->create([
                    'old_status' => $oldStatus->value,
                    'new_status' => $newStatus->value,
                    'notes' => $notes,
                    'changed_by' => auth()->id(),
                ]);
            }

            // Send notification email
            if ($order->user && $order->user->email) {
                try {
                    Mail::to($order->user->email)
                        ->queue(new OrderStatusUpdated($order->fresh()));
                } catch (\Exception $e) {
                    \Log::warning('Failed to send order status email', [
                        'order_id' => $order->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return $this->success(
                $order->fresh(),
                "Order status updated to {$newStatus->value}"
            );
        });
    }

    /**
     * Validate if status transition is allowed.
     *
     * @param OrderStatus $currentStatus
     * @param OrderStatus $newStatus
     * @return bool
     */
    protected function isValidStatusTransition(OrderStatus $currentStatus, OrderStatus $newStatus): bool
    {
        // Same status is not allowed
        if ($currentStatus === $newStatus) {
            return false;
        }

        // Cannot change from cancelled or delivered
        if (in_array($currentStatus, [OrderStatus::CANCELLED, OrderStatus::DELIVERED])) {
            return false;
        }

        // Define allowed transitions
        $allowedTransitions = [
            OrderStatus::PENDING->value => [
                OrderStatus::CONFIRMED->value,
                OrderStatus::CANCELLED->value,
            ],
            OrderStatus::CONFIRMED->value => [
                OrderStatus::PROCESSING->value,
                OrderStatus::CANCELLED->value,
            ],
            OrderStatus::PROCESSING->value => [
                OrderStatus::SHIPPING->value,
                OrderStatus::CANCELLED->value,
            ],
            OrderStatus::SHIPPING->value => [
                OrderStatus::DELIVERED->value,
            ],
        ];

        return in_array(
            $newStatus->value,
            $allowedTransitions[$currentStatus->value] ?? []
        );
    }
}
