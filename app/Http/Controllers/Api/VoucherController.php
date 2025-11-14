<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidateVoucherRequest;
use App\Http\Resources\ApiResource;
use App\Services\VoucherService;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function __construct(
        protected VoucherService $voucherService
    ) {}

    /**
     * Validate a voucher code.
     */
    public function validate(ValidateVoucherRequest $request)
    {
        $validated = $request->validated();

        $userId = auth()->id();

        $result = $this->voucherService->validateVoucher(
            $validated['code'],
            $validated['order_total'],
            $userId
        );

        if ($result->isError()) {
            return ApiResource::error(
                $result->message,
                $result->errorCode,
                null,
                422
            );
        }

        return ApiResource::success(
            [
                'voucher' => [
                    'code' => $result->data['voucher']->code,
                    'name' => $result->data['voucher']->name,
                    'discount_amount' => $result->data['discount_amount'],
                ],
            ],
            $result->message
        );
    }

    /**
     * Get available vouchers for current user.
     */
    public function available(Request $request)
    {
        $orderTotal = $request->get('order_total');
        $userId = auth()->id();

        $vouchers = $this->voucherService->getAvailableVouchers($userId, $orderTotal);

        return ApiResource::success(
            [
                'vouchers' => $vouchers->map(function ($voucher) use ($orderTotal) {
                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'name' => $voucher->name,
                        'description' => $voucher->description,
                        'value' => $voucher->value,
                        'minimum_amount' => $voucher->minimum_amount,
                        'maximum_discount' => $voucher->maximum_discount,
                        'valid_from' => $voucher->valid_from,
                        'valid_to' => $voucher->valid_to,
                        'discount_amount' => $orderTotal ? $voucher->calculateDiscount($orderTotal) : null,
                    ];
                }),
            ],
            'Available vouchers retrieved successfully'
        );
    }
}
