<?php

namespace App\Services;

use App\Actions\Payment\ProcessPaymentAction;
use App\DataObjects\Payment\PaymentData;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Support\ServiceResult;

/**
 * Order Payment Service
 *
 * Handles all payment-related operations for orders
 * Separated from order lifecycle and query operations
 */
class OrderPaymentService
{
    public function __construct(
        protected ProcessPaymentAction $processPaymentAction,
        protected VnpayService $vnpayService,
    ) {}

    /**
     * Process successful payment from VNPay.
     *
     * @param Order $order
     * @param array $vnpayData
     * @return ServiceResult
     */
    public function processPaymentSuccess(Order $order, array $vnpayData): ServiceResult
    {
        $paymentData = PaymentData::forVNPay(
            orderId: $order->id,
            amount: (float) $order->total_amount,
            transactionId: $vnpayData['vnp_TransactionNo'] ?? '',
            vnpayData: $vnpayData
        );

        // Update payment to completed
        $paymentData = new PaymentData(
            orderId: $paymentData->orderId,
            paymentMethod: $paymentData->paymentMethod,
            amount: $paymentData->amount,
            paymentStatus: PaymentStatus::COMPLETED,
            transactionId: $paymentData->transactionId,
            vnpayData: $paymentData->vnpayData,
        );

        $result = $this->processPaymentAction->execute($paymentData);

        if ($result->isSuccess()) {
            // Update order status to confirmed
            app(\App\Actions\Order\UpdateOrderStatusAction::class)->execute(
                $order->id,
                OrderStatus::CONFIRMED,
                'Payment completed via VNPay'
            );
        }

        return $result;
    }

    /**
     * Process failed payment from VNPay.
     *
     * @param Order $order
     * @param array $vnpayData
     * @return ServiceResult
     */
    public function processPaymentFailure(Order $order, array $vnpayData): ServiceResult
    {
        return $this->processPaymentAction->processFailed(
            $order->id,
            'Payment failed via VNPay: ' . ($vnpayData['vnp_ResponseCode'] ?? 'Unknown error')
        );
    }

    /**
     * Check if order payment can be retried.
     *
     * @param Order $order
     * @return bool
     */
    public function canRetryPayment(Order $order): bool
    {
        $order->load('payment');

        return $order->payment
            && $order->payment->payment_method === PaymentMethod::VNPAY
            && ($order->payment->payment_status === PaymentStatus::PENDING
                || $order->payment->payment_status === PaymentStatus::FAILED)
            && $order->status === OrderStatus::PENDING;
    }

    /**
     * Get retry payment validation error message.
     *
     * @param Order $order
     * @return string|null
     */
    public function getRetryPaymentError(Order $order): ?string
    {
        $order->load('payment');

        if (!$order->payment) {
            return 'Không tìm thấy thông tin thanh toán.';
        }

        if ($order->payment->payment_method !== PaymentMethod::VNPAY) {
            return 'Chỉ có thể thanh toán lại cho đơn hàng VNPAY.';
        }

        if ($order->payment->payment_status !== PaymentStatus::PENDING
            && $order->payment->payment_status !== PaymentStatus::FAILED) {
            return 'Đơn hàng này đã được thanh toán.';
        }

        if ($order->status !== OrderStatus::PENDING) {
            return 'Chỉ có thể thanh toán lại cho đơn hàng đang chờ xử lý.';
        }

        return null;
      }

    /**
     * Retry VNPay payment for an order.
     *
     * @param Order $order
     * @param mixed $request
     * @return ServiceResult
     */
    public function retryVnpayPayment(Order $order, $request): ServiceResult
    {
        // Validate retry is allowed
        $error = $this->getRetryPaymentError($order);
        if ($error) {
            return ServiceResult::error($error);
        }

        // Generate new payment URL
        $result = $this->vnpayService->createPaymentUrl($order, $request->ip());

        if (!$result->success) {
            return $result; // Return the error from VnpayService
        }

        return $result; // Return success with payment URL in data
    }
}
