<?php

namespace App\Services;

use App\Actions\Voucher\ApplyVoucherAction;
use App\Actions\Voucher\CancelVoucherUsageAction;
use App\Actions\Voucher\CreateVoucherAction;
use App\Actions\Voucher\UpdateVoucherAction;
use App\Actions\Voucher\ValidateVoucherAction;
use App\DataObjects\Voucher\VoucherData;
use App\DataObjects\Voucher\VoucherUsageData;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Database\Eloquent\Collection;

/**
 * Voucher Service (Refactored)
 *
 * Orchestrates voucher operations using Clean Architecture patterns.
 */
class VoucherServiceRefactored
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository,
        protected CreateVoucherAction $createVoucherAction,
        protected UpdateVoucherAction $updateVoucherAction,
        protected ValidateVoucherAction $validateVoucherAction,
        protected ApplyVoucherAction $applyVoucherAction,
        protected CancelVoucherUsageAction $cancelVoucherUsageAction
    ) {}

    /**
     * Validate if a voucher can be used.
     *
     * @param string $code
     * @param float $orderTotal
     * @param int|null $userId
     * @return ServiceResult
     */
    public function validateVoucher(string $code, float $orderTotal, ?int $userId = null): ServiceResult
    {
        return $this->validateVoucherAction->execute($code, $orderTotal, $userId);
    }

    /**
     * Apply voucher to an order.
     *
     * @param int $voucherId
     * @param int $orderId
     * @param int $userId
     * @param float $discountAmount
     * @return ServiceResult
     */
    public function applyVoucher(int $voucherId, int $orderId, int $userId, float $discountAmount): ServiceResult
    {
        try {
            $usageData = new VoucherUsageData($voucherId, $userId, $orderId, $discountAmount);
            return $this->applyVoucherAction->execute($usageData);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Get available vouchers for a user and order total.
     *
     * @param int|null $userId
     * @param float|null $orderTotal
     * @return Collection
     */
    public function getAvailableVouchers(?int $userId = null, ?float $orderTotal = null): Collection
    {
        return $this->voucherRepository->getAvailableVouchers($userId, $orderTotal);
    }

    /**
     * Get voucher usage statistics.
     *
     * @param int $voucherId
     * @return array
     */
    public function getVoucherStatistics(int $voucherId): array
    {
        return $this->voucherRepository->getStatistics($voucherId);
    }

    /**
     * Cancel voucher usage (when order is cancelled).
     *
     * @param int $orderId
     * @return ServiceResult
     */
    public function cancelVoucherUsage(int $orderId): ServiceResult
    {
        return $this->cancelVoucherUsageAction->execute($orderId);
    }

    /**
     * Create a new voucher.
     *
     * @param array $data
     * @return ServiceResult
     */
    public function createVoucher(array $data): ServiceResult
    {
        try {
            $voucherData = VoucherData::fromRequest($data);
            return $this->createVoucherAction->execute($voucherData);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Update an existing voucher.
     *
     * @param int $voucherId
     * @param array $data
     * @return ServiceResult
     */
    public function updateVoucher(int $voucherId, array $data): ServiceResult
    {
        try {
            $voucherData = VoucherData::fromRequest($data);
            return $this->updateVoucherAction->execute($voucherId, $voucherData);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Get a voucher by ID.
     *
     * @param int $voucherId
     * @return \App\Models\Voucher|null
     */
    public function getVoucher(int $voucherId)
    {
        return $this->voucherRepository->find($voucherId);
    }

    /**
     * Get all vouchers with pagination.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllVouchers(int $perPage = 15)
    {
        return $this->voucherRepository->paginate($perPage);
    }

    /**
     * Delete a voucher.
     *
     * @param int $voucherId
     * @return bool
     */
    public function deleteVoucher(int $voucherId): bool
    {
        return $this->voucherRepository->delete($voucherId);
    }
}
