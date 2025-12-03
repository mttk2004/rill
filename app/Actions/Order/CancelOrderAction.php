<?php

namespace App\Actions\Order;

use App\Actions\BaseAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Cancel Order Action
 *
 * Single responsibility: Cancel order and restore product stock.
 */
class CancelOrderAction extends BaseAction
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Execute order cancellation.
     *
     * @param int $orderId
     * @param string|null $reason
     * @param bool $restoreStock
     * @return ServiceResult
     */
    public function execute(int $orderId, ?string $reason = null, bool $restoreStock = true): ServiceResult
    {
        $order = $this->orderRepository->find($orderId);

        if (!$order) {
            return $this->error('Order not found');
        }

        // Validate cancellation is allowed
        if (!$this->canBeCancelled($order)) {
            return $this->error(
                'Order cannot be cancelled at this stage',
                ['current_status' => $order->status->value]
            );
        }

        return $this->transaction(function () use ($order, $reason, $restoreStock) {
            $oldStatus = $order->status;

            // Update order status to cancelled
            $this->orderRepository->updateStatus($order->id, OrderStatus::CANCELLED->value);

            // Update payment status if pending
            if ($order->payment && $order->payment->payment_status === PaymentStatus::PENDING) {
                $order->payment->update([
                    'payment_status' => PaymentStatus::CANCELLED,
                ]);
            }

            // Restore product stock if requested
            if ($restoreStock) {
                foreach ($order->items as $item) {
                    $this->productRepository->increaseStock(
                        $item->product_id,
                        $item->quantity
                    );
                }
            }

            // Create status history
            $order->statusHistories()->create([
                'old_status' => $oldStatus->value,
                'new_status' => OrderStatus::CANCELLED->value,
                'notes' => $reason ?? 'Order cancelled',
                'changed_by' => auth()->id(),
            ]);

            return $this->success(
                $order->fresh(['items', 'payment']),
                'Order cancelled successfully'
            );
        });
    }

    /**
     * Check if order can be cancelled.
     *
     * @param Order $order
     * @return bool
     */
    protected function canBeCancelled(Order $order): bool
    {
        // Cannot cancel if already cancelled or delivered
        if (in_array($order->status, [OrderStatus::CANCELLED, OrderStatus::DELIVERED])) {
            return false;
        }

        // Cannot cancel if already shipping (require admin approval)
        if ($order->status === OrderStatus::SHIPPING && !auth()->user()?->isAdmin()) {
            return false;
        }

        return true;
    }
}
