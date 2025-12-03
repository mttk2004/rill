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
            // Create voucher usage record
            $voucherUsage = $this->voucherRepository->createUsage($data->toArray());

            // Increment voucher used count
            $this->voucherRepository->incrementUsedCount($data->voucherId);

            return ServiceResult::success(
                ['voucher_usage' => $voucherUsage],
                'Voucher đã được áp dụng'
            );
        });
    }
}
