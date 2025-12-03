<?php

namespace App\Actions\Voucher;

use App\Actions\BaseAction;
use App\Repositories\Contracts\VoucherRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Validate Voucher Action
 *
 * Validates if a voucher can be used for an order.
 */
class ValidateVoucherAction extends BaseAction
{
    public function __construct(
        protected VoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * Execute validate voucher action.
     *
     * @param string $code
     * @param float $orderTotal
     * @param int|null $userId
     * @return ServiceResult
     */
    public function execute(string $code, float $orderTotal, ?int $userId = null): ServiceResult
    {
        // Find voucher by code
        $voucher = $this->voucherRepository->findByCode($code);

        if (!$voucher) {
            return ServiceResult::error(
                'Mã voucher không tồn tại',
                ['error_code' => 'VOUCHER_NOT_FOUND']
            );
        }

        // Validate voucher
        $validation = $this->voucherRepository->validateVoucher($voucher, $orderTotal, $userId);

        if (!$validation['valid']) {
            return ServiceResult::error(
                $validation['error'],
                ['error_code' => $validation['error_code']]
            );
        }

        return ServiceResult::success(
            [
                'voucher' => $voucher,
                'discount_amount' => $validation['discount_amount'],
            ],
            'Mã voucher hợp lệ'
        );
    }
}
