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
class VoucherService
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
            $voucherData = new VoucherData(
                code: strtoupper(trim($data['code'])),
                name: trim($data['name']),
                type: $data['type'],
                value: (float) $data['value'],
                validFrom: new \DateTime($data['valid_from']),
                validTo: new \DateTime($data['valid_to']),
                minimumAmount: isset($data['minimum_amount']) ? (float) $data['minimum_amount'] : null,
                usageLimit: isset($data['usage_limit']) ? (int) $data['usage_limit'] : null,
                usageLimitPerUser: isset($data['usage_limit_per_user']) ? (int) $data['usage_limit_per_user'] : null,
                description: $data['description'] ?? null,
                isActive: $data['is_active'] ?? true
            );
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
            $voucherData = new VoucherData(
                code: strtoupper(trim($data['code'])),
                name: trim($data['name']),
                type: $data['type'],
                value: (float) $data['value'],
                validFrom: new \DateTime($data['valid_from']),
                validTo: new \DateTime($data['valid_to']),
                minimumAmount: isset($data['minimum_amount']) ? (float) $data['minimum_amount'] : null,
                usageLimit: isset($data['usage_limit']) ? (int) $data['usage_limit'] : null,
                usageLimitPerUser: isset($data['usage_limit_per_user']) ? (int) $data['usage_limit_per_user'] : null,
                description: $data['description'] ?? null,
                isActive: $data['is_active'] ?? true
            );
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

    /**
     * Get filtered vouchers with pagination for admin.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getFilteredVouchers(array $filters)
    {
        $perPage = $filters['per_page'] ?? 10;
        $search = trim($filters['search'] ?? '');
        $status = $filters['status'] ?? 'all';
        $sort = $filters['sort'] ?? 'created_desc';

        $query = \App\Models\Voucher::query();

        // Search
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        $now = now();
        if ($status && $status !== 'all') {
            switch ($status) {
                case 'active':
                    $query->where('is_active', true)
                        ->where('valid_from', '<=', $now)
                        ->where('valid_to', '>=', $now);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'expired':
                    $query->where('valid_to', '<', $now);
                    break;
                case 'upcoming':
                    $query->where('valid_from', '>', $now);
                    break;
                case 'exhausted':
                    $query->whereNotNull('usage_limit')
                        ->whereColumn('used_count', '>=', 'usage_limit');
                    break;
            }
        }

        // Sorting
        switch ($sort) {
            case 'code_asc':
                $query->orderBy('code', 'asc');
                break;
            case 'code_desc':
                $query->orderBy('code', 'desc');
                break;
            case 'value_asc':
                $query->orderBy('value', 'asc');
                break;
            case 'value_desc':
                $query->orderBy('value', 'desc');
                break;
            case 'usage_desc':
                $query->orderBy('used_count', 'desc');
                break;
            case 'valid_from_desc':
                $query->orderBy('valid_from', 'desc');
                break;
            case 'valid_to_asc':
                $query->orderBy('valid_to', 'asc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'created_asc':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->withCount('usages')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get voucher statistics for admin dashboard.
     *
     * @return array
     */
    public function getVoucherStats(): array
    {
        $now = now();

        return \App\Models\Voucher::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 AND valid_from <= ? AND valid_to >= ? THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN valid_to < ? THEN 1 ELSE 0 END) as expired,
                SUM(used_count) as total_used
            ', [$now, $now, $now])
            ->first()
            ->toArray();
    }

    /**
     * Check if voucher can be deleted.
     *
     * @param \App\Models\Voucher $voucher
     * @return string|null Error message if cannot delete
     */
    public function canDeleteVoucher($voucher): ?string
    {
        if ($voucher->used_count > 0) {
            return 'Không thể xóa voucher đã được sử dụng';
        }

        return null;
    }

    /**
     * Toggle voucher active status.
     *
     * @param int $voucherId
     * @return bool
     */
    public function toggleVoucherStatus(int $voucherId): bool
    {
        $voucher = $this->voucherRepository->find($voucherId);

        if (!$voucher) {
            return false;
        }

        $voucher->update([
            'is_active' => !$voucher->is_active,
        ]);

        return true;
    }
}
