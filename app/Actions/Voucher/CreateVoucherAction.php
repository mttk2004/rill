<?php

namespace App\Actions\Voucher;

use App\Actions\BaseAction;
use App\DataObjects\Voucher\VoucherData;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Create Voucher Action
 *
 * Handles creating new vouchers with validation.
 */
class CreateVoucherAction extends BaseAction
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * Execute create voucher action.
     *
     * @param VoucherData $data
     * @return ServiceResult
     */
    public function execute(VoucherData $data): ServiceResult
    {
        // Check if voucher code already exists
        $existingVoucher = $this->voucherRepository->findByCode($data->code);

        if ($existingVoucher) {
            return ServiceResult::error(
                'Mã voucher đã tồn tại',
                ['error_code' => 'VOUCHER_CODE_EXISTS']
            );
        }

        // Create voucher
        $voucher = $this->voucherRepository->create($data->toArray());

        return ServiceResult::success(
            ['voucher' => $voucher],
            'Voucher đã được tạo thành công'
        );
    }
}
