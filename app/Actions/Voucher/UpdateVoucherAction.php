<?php

namespace App\Actions\Voucher;

use App\Actions\BaseAction;
use App\DataObjects\Voucher\VoucherData;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Update Voucher Action
 *
 * Handles updating existing vouchers.
 */
class UpdateVoucherAction extends BaseAction
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * Execute update voucher action.
     *
     * @param int $voucherId
     * @param VoucherData $data
     * @return ServiceResult
     */
    public function execute(int $voucherId, VoucherData $data): ServiceResult
    {
        $voucher = $this->voucherRepository->find($voucherId);

        if (!$voucher) {
            return ServiceResult::error(
                'Voucher không tồn tại',
                ['error_code' => 'VOUCHER_NOT_FOUND']
            );
        }

        // Check if code is being changed and if new code already exists
        if ($data->code !== $voucher->code) {
            $existingVoucher = $this->voucherRepository->findByCode($data->code);

            if ($existingVoucher) {
                return ServiceResult::error(
                    'Mã voucher đã tồn tại',
                    ['error_code' => 'VOUCHER_CODE_EXISTS']
                );
            }
        }

        // Update voucher
        $this->voucherRepository->update($voucherId, $data->toArray());

        // Refresh voucher
        $updatedVoucher = $this->voucherRepository->find($voucherId);

        return ServiceResult::success(
            ['voucher' => $updatedVoucher],
            'Voucher đã được cập nhật'
        );
    }
}
