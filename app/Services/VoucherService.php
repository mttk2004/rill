<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use App\Services\Responses\ServiceResponse;
use Illuminate\Support\Facades\DB;

/**
 * @deprecated Use VoucherServiceRefactored instead
 * This service will be removed in a future version
 */
class VoucherService
{
    /**
     * Validate if a voucher can be used by a user for a given order total.
     */
    public function validateVoucher(string $code, float $orderTotal, ?int $userId = null): ServiceResponse
    {
        $voucher = Voucher::where('code', $code)->first();

        if (!$voucher) {
            return ServiceResponse::error(
                'Mã voucher không tồn tại',
                'VOUCHER_NOT_FOUND'
            );
        }

        if (!$voucher->is_active) {
            return ServiceResponse::error(
                'Mã voucher không còn hoạt động',
                'VOUCHER_INACTIVE'
            );
        }

        $now = now();
        if ($voucher->valid_from > $now) {
            return ServiceResponse::error(
                'Mã voucher chưa có hiệu lực',
                'VOUCHER_NOT_STARTED'
            );
        }

        if ($voucher->valid_to < $now) {
            return ServiceResponse::error(
                'Mã voucher đã hết hạn',
                'VOUCHER_EXPIRED'
            );
        }

        if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
            return ServiceResponse::error(
                'Mã voucher đã hết lượt sử dụng',
                'VOUCHER_USAGE_LIMIT_REACHED'
            );
        }

        if ($voucher->minimum_amount !== null && $orderTotal < $voucher->minimum_amount) {
            return ServiceResponse::error(
                'Đơn hàng chưa đạt giá trị tối thiểu ' . number_format((float) $voucher->minimum_amount) . '₫',
                'ORDER_TOTAL_TOO_LOW'
            );
        }

        if ($userId && $voucher->usage_limit_per_user !== null) {
            $userUsageCount = VoucherUsage::where('voucher_id', $voucher->id)
                ->where('user_id', $userId)
                ->count();

            if ($userUsageCount >= $voucher->usage_limit_per_user) {
                return ServiceResponse::error(
                    'Bạn đã sử dụng hết lượt cho mã voucher này',
                    'USER_USAGE_LIMIT_REACHED'
                );
            }
        }

        $discountAmount = $voucher->calculateDiscount($orderTotal);

        return ServiceResponse::success(
            'Mã voucher hợp lệ',
            [
                'voucher' => $voucher,
                'discount_amount' => $discountAmount,
            ]
        );
    }

    /**
     * Apply voucher to an order.
     */
    public function applyVoucher(Voucher $voucher, Order $order, User $user): VoucherUsage
    {
        return DB::transaction(function () use ($voucher, $order, $user) {
            // Create voucher usage record
            $voucherUsage = VoucherUsage::create([
                'voucher_id' => $voucher->id,
                'user_id' => $user->id,
                'order_id' => $order->id,
                'discount_amount' => $order->discount_amount,
                'used_at' => now(),
            ]);

            // Increment voucher used count
            $voucher->incrementUsedCount();

            return $voucherUsage;
        });
    }

    /**
     * Get available vouchers for a user and order total.
     */
    public function getAvailableVouchers(?int $userId = null, ?float $orderTotal = null)
    {
        $query = Voucher::active()
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

        // Debug logging
        \Log::info('Voucher Query Debug', [
            'userId' => $userId,
            'orderTotal' => $orderTotal,
            'query' => $query->toSql(),
            'bindings' => $query->getBindings(),
            'now' => now()->toDateTimeString(),
        ]);

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

        \Log::info('Vouchers Found', [
            'count' => $vouchers->count(),
            'vouchers' => $vouchers->toArray(),
        ]);

        return $vouchers;
    }

    /**
     * Get voucher usage statistics.
     */
    public function getVoucherStatistics(int $voucherId): array
    {
        $voucher = Voucher::with(['usages'])->findOrFail($voucherId);

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
     * Cancel voucher usage (when order is cancelled).
     */
    public function cancelVoucherUsage(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $voucherUsages = VoucherUsage::where('order_id', $order->id)->get();

            foreach ($voucherUsages as $usage) {
                // Decrement voucher used count
                $usage->voucher->decrementUsedCount();

                // Delete usage record
                $usage->delete();
            }
        });
    }
}
