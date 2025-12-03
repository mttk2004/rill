<?php

namespace App\Actions\Voucher;

use App\Actions\BaseAction;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Cancel Voucher Usage Action
 *
 * Cancels voucher usage when an order is cancelled.
 */
class CancelVoucherUsageAction extends BaseAction
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * Execute cancel voucher usage action.
     *
     * @param int $orderId
     * @return ServiceResult
     */
    public function execute(int $orderId): ServiceResult
    {
        return DB::transaction(function () use ($orderId) {
            // Get voucher usages for the order
            $voucherUsages = $this->voucherRepository->getOrderUsages($orderId);

            if ($voucherUsages->isEmpty()) {
                return ServiceResult::success(
                    ['cancelled_count' => 0],
                    'No vouchers to cancel'
                );
            }

            // Decrement used count for each voucher
            foreach ($voucherUsages as $usage) {
                $this->voucherRepository->decrementUsedCount($usage->voucher_id);
            }

            // Delete usage records
            $deletedCount = $this->voucherRepository->deleteOrderUsages($orderId);

            return ServiceResult::success(
                ['cancelled_count' => $deletedCount],
                "Đã hủy {$deletedCount} voucher"
            );
        });
    }
}
