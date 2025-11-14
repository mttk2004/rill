<?php

namespace App\Services;

use App\Http\Controllers\VnpayController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ThankYouPageService
{
    public function __construct(
        private VnpayService $vnpayService,
        private OrderService $orderService
    ) {}

    /**
     * Resolve the order from request parameters
     */
    public function resolveOrder(Request $request, ?Order $order): Order
    {
        Log::info('Thank You Page Called', [
            'has_order_param' => !is_null($order),
            'has_vnp_txnref' => $request->has('vnp_TxnRef'),
            'vnp_txnref_value' => $request->query('vnp_TxnRef'),
            'user_id' => Auth::id(),
            'is_authenticated' => Auth::check(),
        ]);

        // If no order provided, try to get from vnp_TxnRef
        if (!$order && $request->has('vnp_TxnRef')) {
            $orderId = $request->query('vnp_TxnRef');
            Log::info('Looking for order', ['order_id' => $orderId]);

            $order = Order::find($orderId);

            if (!$order) {
                Log::error('Order not found', ['order_id' => $orderId]);
                abort(404, 'Không tìm thấy đơn hàng với ID: ' . $orderId);
            }

            Log::info('Order found', [
                'order_id' => $order->id,
                'order_user_id' => $order->user_id,
                'current_user_id' => Auth::id(),
            ]);
        }

        if (!$order) {
            Log::error('No order parameter provided');
            abort(404, 'Không tìm thấy đơn hàng.');
        }

        return $order;
    }

    /**
     * Get VNPAY response data from request
     */
    public function getVnpayResponse(Request $request): ?array
    {
        if (!$request->has('vnp_ResponseCode')) {
            return null;
        }

        return [
            'response_code' => $request->query('vnp_ResponseCode'),
            'message' => $this->vnpayService->getResponseMessage($request->query('vnp_ResponseCode')),
            'transaction_no' => $request->query('vnp_TransactionNo'),
            'is_success' => $request->query('vnp_ResponseCode') === '00',
        ];
    }

    /**
     * Auto-trigger IPN in local environment if payment is still pending
     */
    public function autoTriggerLocalIpn(Request $request, Order $order): void
    {
        if (!app()->environment('local')) {
            return;
        }

        if ($order->payment->payment_status !== \App\Enums\PaymentStatus::PENDING) {
            return;
        }

        Log::info('Auto-triggering IPN in local environment', ['order_id' => $order->id]);

        try {
            $vnpayController = app(VnpayController::class);
            $vnpayController->handleIpn($request, $this->vnpayService, $this->orderService);

            // Reload payment to get updated status
            $order->load('payment');

            Log::info('IPN auto-triggered successfully', ['order_id' => $order->id]);
        } catch (\Exception $e) {
            Log::error('Failed to auto-trigger IPN', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Log unauthenticated access for monitoring
     */
    public function logUnauthenticatedAccess(Order $order, Request $request): void
    {
        if (Auth::check()) {
            return;
        }

        Log::info('Unauthenticated user viewing thank you page', [
            'order_id' => $order->id,
            'has_vnpay_params' => $request->has('vnp_ResponseCode'),
        ]);
    }
}
