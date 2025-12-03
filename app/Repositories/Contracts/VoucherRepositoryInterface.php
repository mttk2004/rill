<?php

namespace App\Repositories\Contracts;

use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Database\Eloquent\Collection;

interface VoucherRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find voucher by code.
     *
     * @param string $code
     * @return Voucher|null
     */
    public function findByCode(string $code): ?Voucher;

    /**
     * Get active and currently valid vouchers.
     *
     * @param int|null $userId
     * @param float|null $orderTotal
     * @return Collection
     */
    public function getAvailableVouchers(?int $userId = null, ?float $orderTotal = null): Collection;

    /**
     * Check if voucher is valid for use.
     *
     * @param Voucher $voucher
     * @param float $orderTotal
     * @param int|null $userId
     * @return array ['valid' => bool, 'error' => string|null, 'discount_amount' => float|null]
     */
    public function validateVoucher(Voucher $voucher, float $orderTotal, ?int $userId = null): array;

    /**
     * Get user's usage count for a voucher.
     *
     * @param int $voucherId
     * @param int $userId
     * @return int
     */
    public function getUserUsageCount(int $voucherId, int $userId): int;

    /**
     * Create voucher usage record.
     *
     * @param array $data
     * @return VoucherUsage
     */
    public function createUsage(array $data): VoucherUsage;

    /**
     * Increment voucher used count.
     *
     * @param int $voucherId
     * @return bool
     */
    public function incrementUsedCount(int $voucherId): bool;

    /**
     * Decrement voucher used count.
     *
     * @param int $voucherId
     * @return bool
     */
    public function decrementUsedCount(int $voucherId): bool;

    /**
     * Get voucher usage statistics.
     *
     * @param int $voucherId
     * @return array
     */
    public function getStatistics(int $voucherId): array;

    /**
     * Get voucher usages for an order.
     *
     * @param int $orderId
     * @return Collection
     */
    public function getOrderUsages(int $orderId): Collection;

    /**
     * Delete voucher usages for an order.
     *
     * @param int $orderId
     * @return int Number of deleted records
     */
    public function deleteOrderUsages(int $orderId): int;
}
