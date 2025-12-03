<?php

namespace App\Repositories;

use App\Models\Voucher;
use App\Models\VoucherUsage;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VoucherRepository extends BaseRepository implements VoucherRepositoryInterface
{
    public function __construct(Voucher $model)
    {
        parent::__construct($model);
    }

    /**
     * Find voucher by code.
     */
    public function findByCode(string $code): ?Voucher
    {
        return $this->model->where('code', $code)->first();
    }

    /**
     * Get active and currently valid vouchers.
     */
    public function getAvailableVouchers(?int $userId = null, ?float $orderTotal = null): Collection
    {
        $query = $this->model->active()
            ->currentlyValid()
            ->available();

        if ($orderTotal !== null) {
            $query->where(function ($q) use ($orderTotal) {
                $q->whereNull('minimum_amount')
                    ->orWhere('minimum_amount', '<=', $orderTotal);
            });
        }

        if ($userId !== null) {
            // Add count of user's usages
            $query->withCount(['usages as user_usage_count' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        $vouchers = $query->orderBy('value', 'desc')->get();

        // Filter out vouchers where user has reached their limit
        if ($userId !== null) {
            $vouchers = $vouchers->filter(function ($voucher) {
                // If no per-user limit, include it
                if ($voucher->usage_limit_per_user === null) {
                    return true;
                }
                // Check if user hasn't reached their limit
                return $voucher->user_usage_count < $voucher->usage_limit_per_user;
            })->values();
        }

        return $vouchers;
    }

    /**
     * Check if voucher is valid for use.
     */
    public function validateVoucher(Voucher $voucher, float $orderTotal, ?int $userId = null): array
    {
        if (!$voucher->is_active) {
            return ['valid' => false, 'error' => 'Mã voucher không còn hoạt động', 'error_code' => 'VOUCHER_INACTIVE'];
        }

        $now = now();
        if ($voucher->valid_from > $now) {
            return ['valid' => false, 'error' => 'Mã voucher chưa có hiệu lực', 'error_code' => 'VOUCHER_NOT_STARTED'];
        }

        if ($voucher->valid_to < $now) {
            return ['valid' => false, 'error' => 'Mã voucher đã hết hạn', 'error_code' => 'VOUCHER_EXPIRED'];
        }

        if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
            return ['valid' => false, 'error' => 'Mã voucher đã hết lượt sử dụng', 'error_code' => 'VOUCHER_USAGE_LIMIT_REACHED'];
        }

        if ($voucher->minimum_amount !== null && $orderTotal < $voucher->minimum_amount) {
            return [
                'valid' => false,
                'error' => 'Đơn hàng chưa đạt giá trị tối thiểu ' . number_format((float) $voucher->minimum_amount) . '₫',
                'error_code' => 'ORDER_TOTAL_TOO_LOW'
            ];
        }

        if ($userId && $voucher->usage_limit_per_user !== null) {
            $userUsageCount = $this->getUserUsageCount($voucher->id, $userId);

            if ($userUsageCount >= $voucher->usage_limit_per_user) {
                return [
                    'valid' => false,
                    'error' => 'Bạn đã sử dụng hết lượt cho mã voucher này',
                    'error_code' => 'USER_USAGE_LIMIT_REACHED'
                ];
            }
        }

        $discountAmount = $voucher->calculateDiscount($orderTotal);

        return [
            'valid' => true,
            'error' => null,
            'discount_amount' => $discountAmount
        ];
    }

    /**
     * Get user's usage count for a voucher.
     */
    public function getUserUsageCount(int $voucherId, int $userId): int
    {
        return VoucherUsage::where('voucher_id', $voucherId)
            ->where('user_id', $userId)
            ->count();
    }

    /**
     * Create voucher usage record.
     */
    public function createUsage(array $data): VoucherUsage
    {
        return VoucherUsage::create($data);
    }

    /**
     * Increment voucher used count.
     */
    public function incrementUsedCount(int $voucherId): bool
    {
        $voucher = $this->find($voucherId);
        if (!$voucher) {
            return false;
        }
        return $voucher->increment('used_count');
    }

    /**
     * Decrement voucher used count.
     */
    public function decrementUsedCount(int $voucherId): bool
    {
        $voucher = $this->find($voucherId);
        if (!$voucher) {
            return false;
        }
        return $voucher->decrement('used_count');
    }

    /**
     * Get voucher usage statistics.
     */
    public function getStatistics(int $voucherId): array
    {
        $voucher = $this->model->with(['usages'])->findOrFail($voucherId);

        $totalDiscount = $voucher->usages()->sum('discount_amount');
        $uniqueUsers = $voucher->usages()->distinct('user_id')->count('user_id');
        $averageDiscount = $voucher->used_count > 0 ? $totalDiscount / $voucher->used_count : 0;

        return [
            'total_used' => $voucher->used_count,
            'total_discount_amount' => $totalDiscount,
            'unique_users' => $uniqueUsers,
            'average_discount' => $averageDiscount,
            'usage_rate' => $voucher->usage_limit ? ($voucher->used_count / $voucher->usage_limit) * 100 : null,
        ];
    }

    /**
     * Get voucher usages for an order.
     */
    public function getOrderUsages(int $orderId): Collection
    {
        return VoucherUsage::where('order_id', $orderId)->get();
    }

    /**
     * Delete voucher usages for an order.
     */
    public function deleteOrderUsages(int $orderId): int
    {
        return VoucherUsage::where('order_id', $orderId)->delete();
    }
}
