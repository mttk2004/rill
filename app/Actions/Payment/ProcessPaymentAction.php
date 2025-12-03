<?php

namespace App\Actions\Payment;

use App\Actions\BaseAction;
use App\DataObjects\Payment\PaymentData;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Process Payment Action
 *
 * Single responsibility: Process payment for an order.
 */
class ProcessPaymentAction extends BaseAction
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
    ) {}

    /**
     * Execute payment processing.
     *
     * @param PaymentData $data
     * @return ServiceResult
     */
    public function execute(PaymentData $data): ServiceResult
    {
        $order = $this->orderRepository->find($data->orderId);

        if (!$order) {
            return $this->error('Order not found');
        }

        $payment = $order->payment;

        if (!$payment) {
            return $this->error('Payment record not found for order');
        }

        // Validate payment is not already completed
        if ($payment->payment_status === PaymentStatus::COMPLETED) {
            return $this->error('Payment already completed');
        }

        return $this->transaction(function () use ($payment, $data) {
            // Update payment record
            $payment->update([
                'payment_status' => $data->paymentStatus->value,
                'transaction_id' => $data->transactionId,
                'gateway_response' => $data->vnpayData,
                'amount' => $data->amount,
                'paid_at' => $data->paymentStatus === PaymentStatus::COMPLETED ? now() : null,
            ]);

            // Log payment processing
            \Log::info('Payment processed', [
                'order_id' => $data->orderId,
                'payment_id' => $payment->id,
                'payment_method' => $data->paymentMethod->value,
                'payment_status' => $data->paymentStatus->value,
                'transaction_id' => $data->transactionId,
                'amount' => $data->amount,
            ]);

            return $this->success(
                [
                    'payment' => $payment->fresh(),
                    'order' => $payment->order->fresh(),
                ],
                'Payment processed successfully'
            );
        });
    }

    /**
     * Process successful VNPay payment.
     *
     * @param int $orderId
     * @param array $vnpayResponse
     * @return ServiceResult
     */
    public function processVNPaySuccess(int $orderId, array $vnpayResponse): ServiceResult
    {
        $order = $this->orderRepository->find($orderId);

        if (!$order) {
            return $this->error('Order not found');
        }

        $paymentData = PaymentData::forVNPay(
            orderId: $order->id,
            amount: $order->total_amount,
            transactionId: $vnpayResponse['vnp_TransactionNo'] ?? '',
            vnpayData: $vnpayResponse
        );

        // Update payment status to completed
        $paymentData = new PaymentData(
            orderId: $paymentData->orderId,
            paymentMethod: $paymentData->paymentMethod,
            amount: $paymentData->amount,
            paymentStatus: PaymentStatus::COMPLETED,
            transactionId: $paymentData->transactionId,
            vnpayData: $paymentData->vnpayData,
        );

        return $this->execute($paymentData);
    }

    /**
     * Process failed payment.
     *
     * @param int $orderId
     * @param string $reason
     * @return ServiceResult
     */
    public function processFailed(int $orderId, string $reason): ServiceResult
    {
        $order = $this->orderRepository->find($orderId);

        if (!$order) {
            return $this->error('Order not found');
        }

        return $this->transaction(function () use ($order, $reason) {
            $payment = $order->payment;

            if (!$payment) {
                return $this->error('Payment record not found');
            }

            $payment->update([
                'payment_status' => PaymentStatus::FAILED->value,
                'notes' => $reason,
            ]);

            \Log::warning('Payment failed', [
                'order_id' => $order->id,
                'payment_id' => $payment->id,
                'reason' => $reason,
            ]);

            return $this->success(
                $payment->fresh(),
                'Payment marked as failed'
            );
        });
    }
}
