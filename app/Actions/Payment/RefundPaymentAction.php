<?php

namespace App\Actions\Payment;

use App\Actions\BaseAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Refund Payment Action
 *
 * Single responsibility: Process payment refund with stock restoration.
 */
class RefundPaymentAction extends BaseAction
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Execute payment refund.
     *
     * @param int $paymentId
     * @param float|null $amount
     * @param string|null $reason
     * @param bool $restoreStock
     * @return ServiceResult
     */
    public function execute(
        int $paymentId,
        ?float $amount = null,
        ?string $reason = null,
        bool $restoreStock = true
    ): ServiceResult {
        $payment = Payment::find($paymentId);

        if (!$payment) {
            return $this->error('Payment not found');
        }

        $order = $payment->order;

        if (!$order) {
            return $this->error('Order not found for payment');
        }

        // Validate payment can be refunded
        if (!$this->canBeRefunded($payment)) {
            return $this->error(
                'Payment cannot be refunded',
                ['payment_status' => $payment->payment_status->value]
            );
        }

        // Use full amount if not specified
        $refundAmount = $amount ?? $payment->amount;

        // Validate refund amount
        if ($refundAmount <= 0 || $refundAmount > $payment->amount) {
            return $this->error(
                'Invalid refund amount',
                ['max_amount' => $payment->amount, 'requested' => $refundAmount]
            );
        }

        return $this->transaction(function () use ($payment, $order, $refundAmount, $reason, $restoreStock) {
            // Update payment to refunded
            $payment->update([
                'payment_status' => PaymentStatus::REFUNDED->value,
                'refund_amount' => $refundAmount,
                'refund_reason' => $reason,
                'refunded_at' => now(),
            ]);

            // Update order status if not already cancelled
            if ($order->status !== OrderStatus::CANCELLED) {
                $this->orderRepository->updateStatus($order->id, OrderStatus::CANCELLED->value);
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

            // Log refund
            \Log::info('Payment refunded', [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'refund_amount' => $refundAmount,
                'reason' => $reason,
                'stock_restored' => $restoreStock,
                'refunded_by' => auth()->id(),
            ]);

            return $this->success(
                [
                    'payment' => $payment->fresh(),
                    'order' => $order->fresh(['items']),
                    'refund_amount' => $refundAmount,
                ],
                sprintf('Payment refunded: %s', number_format($refundAmount, 0) . ' ₫')
            );
        });
    }

    /**
     * Check if payment can be refunded.
     *
     * @param Payment $payment
     * @return bool
     */
    protected function canBeRefunded(Payment $payment): bool
    {
        // Can only refund completed or partially refunded payments
        if (!in_array($payment->payment_status, [PaymentStatus::COMPLETED, PaymentStatus::REFUNDED])) {
            return false;
        }

        // If already fully refunded, cannot refund again
        if ($payment->payment_status === PaymentStatus::REFUNDED
            && $payment->refund_amount >= $payment->amount) {
            return false;
        }

        return true;
    }

    /**
     * Partial refund.
     *
     * @param int $paymentId
     * @param float $amount
     * @param string|null $reason
     * @return ServiceResult
     */
    public function partialRefund(int $paymentId, float $amount, ?string $reason = null): ServiceResult
    {
        return $this->execute($paymentId, $amount, $reason, false);
    }
}
