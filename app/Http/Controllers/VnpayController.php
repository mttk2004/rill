<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\VnpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VnpayController extends Controller
{
    /**
     * Xử lý IPN (Instant Payment Notification) từ VNPAY.
     * Đây là endpoint mà VNPAY gọi để thông báo kết quả thanh toán.
     */
    public function handleIpn(Request $request, VnpayService $vnpayService, OrderService $orderService)
    {
        $data = $request->all();
        Log::info('VNPAY IPN Received:', $data);

        // 1. Xác thực chữ ký
        if (!$vnpayService->isValidSignature($data)) {
            Log::warning('VNPAY IPN: Invalid Signature.', $data);
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid Signature']);
        }

        // 2. Tìm đơn hàng
        $order = Order::find($data['vnp_TxnRef']);
        if (!$order) {
            Log::error('VNPAY IPN: Order not found.', $data);
            return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
        }

        // 3. Kiểm tra số tiền
        $vnpAmount = $data['vnp_Amount'] / 100; // VNPAY gửi về amount * 100
        if ($vnpAmount != $order->total_amount) {
            Log::error('VNPAY IPN: Amount mismatch.', [
                'vnp_amount' => $vnpAmount,
                'order_amount' => $order->total_amount
            ]);
            return response()->json(['RspCode' => '04', 'Message' => 'Invalid Amount']);
        }

        // 4. Kiểm tra trạng thái đơn hàng (để tránh xử lý 2 lần)
        $payment = $order->payment;
        if (!$payment) {
            Log::error('VNPAY IPN: Payment record not found.', $data);
            return response()->json(['RspCode' => '01', 'Message' => 'Payment not found']);
        }

        if ($payment->payment_status !== PaymentStatus::PENDING) {
            Log::info('VNPAY IPN: Payment already processed.', $data);
            return response()->json(['RspCode' => '02', 'Message' => 'Order already confirmed']);
        }

        // 5. Xử lý kết quả thanh toán
        try {
            if ($data['vnp_ResponseCode'] === '00') {
                // Thanh toán thành công
                $orderService->processPaymentSuccess($order, $data);
                Log::info('VNPAY IPN: Payment successful.', ['order_id' => $order->id]);
            } else {
                // Thanh toán thất bại
                $orderService->processPaymentFailure($order, $data);
                Log::warning('VNPAY IPN: Payment failed.', [
                    'order_id' => $order->id,
                    'response_code' => $data['vnp_ResponseCode']
                ]);
            }
        } catch (\Exception $e) {
            Log::error('VNPAY IPN: Transaction failed.', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['RspCode' => '99', 'Message' => 'Unknown error']);
        }

        // 6. Phản hồi cho VNPAY (bắt buộc)
        return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
    }
}
