<?php

namespace App\Actions\Voucher;

use App\Actions\BaseAction;
use App\DataObjects\Voucher\VoucherUsageData;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Apply Voucher Action
 *
 * Applies a voucher to an order and records usage.
 */
class ApplyVoucherAction extends BaseAction
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * Execute apply voucher action.
     *
     * @param VoucherUsageData $data
     * @return ServiceResult
     */
    public function execute(VoucherUsageData $data): ServiceResult
    {
        return DB::transaction(function () use ($data) {
            // CRITICAL: Lock voucher to prevent race condition
            $voucher = \App\Models\Voucher::lockForUpdate()->find($data->voucherId);

            if (!$voucher) {
                return ServiceResult::error('Voucher not found');
            }

            // Re-validate usage limit with locked data
            if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
                return ServiceResult::error(
                    'Mã voucher đã hết lượt sử dụng',
                    ['error_code' => 'VOUCHER_USAGE_LIMIT_REACHED']
                );
            }

            // Create voucher usage record
            $voucherUsage = $this->voucherRepository->createUsage($data->toArray());

            // Increment voucher used count (now safe with lock)
            $this->voucherRepository->incrementUsedCount($data->voucherId);

            return ServiceResult::success(
                ['voucher_usage' => $voucherUsage],
                'Voucher đã được áp dụng'
            );
        });
    }
}
