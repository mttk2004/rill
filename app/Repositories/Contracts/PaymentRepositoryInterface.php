<?php

namespace App\Repositories\Contracts;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

/**
 * Payment Repository Interface
 *
 * Contract for payment data access operations.
 */
interface PaymentRepositoryInterface
{
    /**
     * Find payment by ID.
     *
     * @param int $id
     * @return Payment|null
     */
    public function findById(int $id): ?Payment;

    /**
     * Find payment by order ID.
     *
     * @param int $orderId
     * @return Payment|null
     */
    public function findByOrderId(int $orderId): ?Payment;

    /**
     * Find payment by transaction reference.
     *
     * @param string $txnRef
     * @return Payment|null
     */
    public function findByTxnRef(string $txnRef): ?Payment;

    /**
     * Create new payment record.
     *
     * @param array $data
     * @return Payment
     */
    public function create(array $data): Payment;

    /**
     * Update payment record.
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * Update payment status.
     *
     * @param int $id
     * @param string $status
     * @return bool
     */
    public function updateStatus(int $id, string $status): bool;

    /**
     * Store payment callback data.
     *
     * @param int $paymentId
     * @param array $callbackData
     * @return bool
     */
    public function storeCallbackData(int $paymentId, array $callbackData): bool;

    /**
     * Get payments by status.
     *
     * @param string $status
     * @return Collection
     */
    public function getByStatus(string $status): Collection;

    /**
     * Get pending payments older than specified minutes.
     *
     * @param int $minutes
     * @return Collection
     */
    public function getPendingPaymentsOlderThan(int $minutes): Collection;
}
