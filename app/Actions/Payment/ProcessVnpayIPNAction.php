<?php

namespace App\Actions\Payment;

use App\Actions\BaseAction;
use App\DataObjects\Payment\VnpayCallbackData;
use App\Enums\PaymentStatus;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Process Vnpay IPN Action
 *
 * Single responsibility: Process VNPAY Instant Payment Notification (IPN).
 * Updates order and payment status based on payment gateway callback.
 */
class ProcessVnpayIPNAction extends BaseAction
{
    public function __construct(
        protected PaymentRepositoryInterface $paymentRepository,
        protected OrderRepositoryInterface $orderRepository,
        protected VerifyVnpayCallbackAction $verifyCallback,
    ) {}

    /**
     * Execute IPN processing.
     *
     * @param VnpayCallbackData $data
     * @return ServiceResult
     */
    public function execute(VnpayCallbackData $data): ServiceResult
    {
        return DB::transaction(function () use ($data) {
            // Verify callback signature
            $verificationResult = $this->verifyCallback->execute($data);

            if (!$verificationResult->success) {
                return $this->error(
                    'Payment verification failed: ' . $verificationResult->message,
                    $verificationResult->errors
                );
            }

            // Find payment by transaction reference
            $payment = $this->paymentRepository->findByTxnRef($data->txnRef);

            if (!$payment) {
                return $this->error('Payment not found', [
                    'code' => 'PAYMENT_NOT_FOUND',
                    'txn_ref' => $data->txnRef,
                ]);
            }

            // Check if payment already processed
            if ($payment->payment_status !== PaymentStatus::PENDING->value) {
                return $this->success([
                    'payment_id' => $payment->id,
                    'status' => $payment->payment_status,
                ], 'Payment already processed');
            }

            // Update payment status
            $newStatus = $data->isSuccessful()
                ? PaymentStatus::COMPLETED->value
                : PaymentStatus::FAILED->value;

            $this->paymentRepository->update($payment->id, [
                'payment_status' => $newStatus,
                'transaction_id' => $data->transactionNo,
                'paid_at' => $data->isSuccessful() ? now() : null,
                'metadata' => array_merge($payment->metadata ?? [], [
                    'vnpay_response_code' => $data->responseCode,
                    'vnpay_transaction_no' => $data->transactionNo,
                    'vnpay_bank_code' => $data->bankCode,
                    'vnpay_pay_date' => $data->payDate,
                    'processed_at' => now()->toDateTimeString(),
                ]),
            ]);

            // Store callback data
            $this->paymentRepository->storeCallbackData($payment->id, $data->rawData);

            // Update order status if payment successful
            if ($data->isSuccessful()) {
                $this->orderRepository->update($payment->order_id, [
                    'status' => 'confirmed',
                ]);
            }

            return $this->success([
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'status' => $newStatus,
                'transaction_no' => $data->transactionNo,
            ], 'IPN processed successfully');
        });
    }
}
