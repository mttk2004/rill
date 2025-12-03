<?php

namespace App\Actions\Payment;

use App\Services\VnpayService;
use App\Support\ServiceResult;
use Illuminate\Http\Request;

/**
 * Action to extract and format VNPAY response from request
 */
class GetVnpayResponseAction
{
    public function __construct(
        private VnpayService $vnpayService,
    ) {}

    /**
     * Get VNPAY response data from request
     */
    public function execute(Request $request): ServiceResult
    {
        if (!$request->has('vnp_ResponseCode')) {
            return ServiceResult::success([
                'has_vnpay_response' => false,
                'response' => null,
            ]);
        }

        $responseCode = $request->query('vnp_ResponseCode');

        $response = [
            'response_code' => $responseCode,
            'message' => $this->vnpayService->getResponseMessage($responseCode),
            'transaction_no' => $request->query('vnp_TransactionNo'),
            'is_success' => $responseCode === '00',
        ];

        return ServiceResult::success([
            'has_vnpay_response' => true,
            'response' => $response,
        ]);
    }
}
