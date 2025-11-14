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
     * Resolve the order from request parameters.
     *
     * This method handles two scenarios:
     * 1. Order passed directly from route parameter (normal flow)
     * 2. Order ID from VNPAY return URL (vnp_TxnRef parameter)
     *
     * @param Request $request The HTTP request containing potential order identifiers
     * @param Order|null $order Optional order from route parameter
     * @return Order The resolved order instance
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If order not found
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
     * Get VNPAY response data from request.
     *
     * Extracts and formats VNPAY payment gateway response parameters
     * from the return URL after payment processing.
     *
     * @param Request $request The HTTP request with VNPAY response parameters
     * @return array|null Array with response_code, message, transaction_no, is_success or null if no VNPAY params
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
     * Auto-trigger IPN in local environment if payment is still pending.
     *
     * VNPAY cannot reach localhost IPN URL, so we manually trigger the IPN handler
     * in development environment to complete payment processing and update order status.
     *
     * @param Request $request The HTTP request with VNPAY parameters
     * @param Order $order The order to process IPN for
     * @return void
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
     * Log unauthenticated access for monitoring.
     *
     * Users may lose session after VNPAY redirect. This logs such access
     * for security monitoring and debugging purposes.
     *
     * @param Order $order The order being accessed
     * @param Request $request The HTTP request
     * @return void
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
