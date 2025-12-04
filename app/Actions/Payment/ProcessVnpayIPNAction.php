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
            \Log::info('Looking for payment with txnRef', [
                'txn_ref' => $data->txnRef,
                'is_string' => is_string($data->txnRef),
            ]);

            $payment = $this->paymentRepository->findByTxnRef($data->txnRef);

            if (!$payment) {
                \Log::error('Payment not found', [
                    'txn_ref' => $data->txnRef,
                    'all_payments' => \App\Models\Payment::count(),
                ]);

                return $this->error('Payment not found', [
                    'code' => 'PAYMENT_NOT_FOUND',
                    'txn_ref' => $data->txnRef,
                    'order_id' => 'unknown',
                ]);
            }

            // Check if payment already processed (allow retry for failed payments)
            if ($payment->payment_status === PaymentStatus::COMPLETED) {
                \Log::info('Payment already completed, skipping IPN', [
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'current_status' => $payment->payment_status->value,
                ]);
                return $this->success([
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'status' => $payment->payment_status->value,
                ], 'Payment already completed');
            }

            \Log::info('Processing IPN for payment', [
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'current_status' => $payment->payment_status->value,
                'vnp_response_code' => $data->responseCode,
                'is_successful' => $data->isSuccessful(),
            ]);

            // Update payment status
            $newStatus = $data->isSuccessful()
                ? PaymentStatus::COMPLETED->value
                : PaymentStatus::FAILED->value;

            \Log::info('Updating payment status', [
                'payment_id' => $payment->id,
                'old_status' => $payment->payment_status->value,
                'new_status' => $newStatus,
            ]);

            $updateData = [
                'payment_status' => $newStatus,
                'transaction_id' => $data->transactionNo,
                'processed_at' => now(),
            ];

            // Add gateway_response with VNPAY details
            $updateData['gateway_response'] = array_merge($payment->gateway_response ?? [], [
                'vnpay_response_code' => $data->responseCode,
                'vnpay_transaction_no' => $data->transactionNo,
                'vnpay_bank_code' => $data->bankCode,
                'vnpay_pay_date' => $data->payDate,
                'processed_at' => now()->toDateTimeString(),
            ]);

            $this->paymentRepository->update($payment->id, $updateData);

            \Log::info('Payment updated successfully', [
                'payment_id' => $payment->id,
                'new_status' => $newStatus,
            ]);

            // Store callback data
            $this->paymentRepository->storeCallbackData($payment->id, $data->rawData);

            // Update order status if payment successful
            if ($data->isSuccessful()) {
                \Log::info('Updating order status to confirmed', [
                    'order_id' => $payment->order_id,
                ]);
                $this->orderRepository->update($payment->order_id, [
                    'status' => 'confirmed',
                ]);
            }

            \Log::info('IPN processing completed', [
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'final_status' => $newStatus,
            ]);

            return $this->success([
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'status' => $newStatus,
                'transaction_no' => $data->transactionNo,
            ], 'IPN processed successfully');
        });
    }
}
