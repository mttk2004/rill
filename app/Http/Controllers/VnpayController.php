<?php

namespace App\Http\Controllers;

use App\Services\VnpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VnpayController extends Controller
{
    public function __construct(
        protected VnpayService $vnpayService
    ) {}

    /**
     * Xử lý IPN (Instant Payment Notification) từ VNPAY.
     * Đây là endpoint mà VNPAY gọi để thông báo kết quả thanh toán.
     */
    public function handleIpn(Request $request)
    {
        $data = $request->all();
        Log::info('VNPAY IPN Received:', $data);

        // Process IPN using refactored service
        $result = $this->vnpayService->processIPN($data);

        if (!$result->success) {
            Log::error('VNPAY IPN: Processing failed', [
                'error' => $result->message,
                'data' => $data,
            ]);

            // Map error codes to VNPAY response codes
            $errorCode = $result->errors['code'] ?? 'UNKNOWN';
            $rspCode = match ($errorCode) {
                'INVALID_SIGNATURE' => '97',
                'PAYMENT_NOT_FOUND' => '01',
                'INVALID_AMOUNT' => '04',
                default => '99',
            };

            return response()->json([
                'RspCode' => $rspCode,
                'Message' => $result->message,
            ]);
        }

        Log::info('VNPAY IPN: Processing successful', [
            'order_id' => $result->data['order_id'],
            'status' => $result->data['status'],
        ]);

        // Return success response to VNPAY
        return response()->json([
            'RspCode' => '00',
            'Message' => 'Confirm Success',
        ]);
    }
}
