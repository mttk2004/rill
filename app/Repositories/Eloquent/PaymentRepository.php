<?php

namespace App\Repositories\Eloquent;

use App\Models\Payment;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Payment Repository Implementation
 *
 * Handles all payment data access operations.
 */
class PaymentRepository extends BaseRepository implements PaymentRepositoryInterface
{
    public function __construct(Payment $model)
    {
        parent::__construct($model);
    }

    /**
     * Find payment by ID.
     */
    public function findById(int $id): ?Payment
    {
        return $this->model->find($id);
    }

    /**
     * Find payment by order ID.
     */
    public function findByOrderId(int $orderId): ?Payment
    {
        return $this->model->where('order_id', $orderId)->first();
    }

    /**
     * Find payment by transaction reference.
     */
    public function findByTxnRef(string $txnRef): ?Payment
    {
        // vnp_TxnRef is the order_id in VNPAY integration
        // Query by order_id instead of transaction_id (which is set after payment success)
        return $this->model->where('order_id', $txnRef)->first();
    }

    /**
     * Create new payment record.
     */
    public function create(array $data): Payment
    {
        return $this->model->create($data);
    }

    /**
     * Update payment record.
     */
    public function update(int $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Update payment status.
     */
    public function updateStatus(int $id, string $status): bool
    {
        return $this->model->where('id', $id)->update([
            'payment_status' => $status,
            'processed_at' => $status === 'completed' ? now() : null,
        ]);
    }

    /**
     * Store payment callback data.
     */
    public function storeCallbackData(int $paymentId, array $callbackData): bool
    {
        $payment = $this->findById($paymentId);

        if (!$payment) {
            return false;
        }

        $existingGatewayResponse = $payment->gateway_response ?? [];
        $updatedGatewayResponse = array_merge($existingGatewayResponse, [
            'callback_data' => $callbackData,
            'callback_received_at' => now()->toDateTimeString(),
        ]);

        return $this->update($paymentId, ['gateway_response' => $updatedGatewayResponse]);
    }

    /**
     * Get payments by status.
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model->where('payment_status', $status)->get();
    }

    /**
     * Get pending payments older than specified minutes.
     */
    public function getPendingPaymentsOlderThan(int $minutes): Collection
    {
        return $this->model
            ->where('payment_status', 'pending')
            ->where('created_at', '<', now()->subMinutes($minutes))
            ->get();
    }
}
