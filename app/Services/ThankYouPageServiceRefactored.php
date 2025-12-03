<?php

namespace App\Services;

use App\Actions\Order\ResolveOrderFromRequestAction;
use App\Actions\Payment\GetVnpayResponseAction;
use App\Http\Controllers\VnpayController;
use App\Models\Order;
use App\Support\ServiceResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Refactored Thank You Page service with Clean Architecture
 */
class ThankYouPageServiceRefactored
{
    private ResolveOrderFromRequestAction $resolveOrderAction;
    private GetVnpayResponseAction $getVnpayResponseAction;

    public function __construct(
        private VnpayServiceRefactored $vnpayService,
    ) {
        $this->resolveOrderAction = new ResolveOrderFromRequestAction();
        $this->getVnpayResponseAction = new GetVnpayResponseAction($this->vnpayService);
    }

    /**
     * Resolve order from request parameters
     */
    public function resolveOrder(Request $request, ?Order $order, ?int $userId = null): ServiceResult
    {
        return $this->resolveOrderAction->execute($request, $order, $userId);
    }

    /**
     * Get VNPAY response data from request
     */
    public function getVnpayResponse(Request $request): ServiceResult
    {
        return $this->getVnpayResponseAction->execute($request);
    }

    /**
     * Auto-trigger IPN in local environment if payment is still pending
     * VNPAY cannot reach localhost IPN URL, so we manually trigger it
     */
    public function autoTriggerLocalIpn(Request $request, Order $order): ServiceResult
    {
        if (!app()->environment('local')) {
            return ServiceResult::success([
                'triggered' => false,
                'reason' => 'Not in local environment',
            ]);
        }

        if ($order->payment->payment_status !== \App\Enums\PaymentStatus::PENDING) {
            return ServiceResult::success([
                'triggered' => false,
                'reason' => 'Payment not pending',
            ]);
        }

        Log::info('Auto-triggering IPN in local environment', ['order_id' => $order->id]);

        try {
            $vnpayController = app(VnpayController::class);
            $vnpayController->handleIpn($request);

            // Reload payment to get updated status
            $order->load('payment');

            Log::info('IPN auto-triggered successfully', ['order_id' => $order->id]);

            return ServiceResult::success([
                'triggered' => true,
                'order_id' => $order->id,
                'payment_status' => $order->payment->payment_status->value,
            ], 'IPN triggered successfully');

        } catch (\Exception $e) {
            Log::error('Failed to auto-trigger IPN', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ServiceResult::error(
                'Failed to trigger IPN: ' . $e->getMessage(),
                ['order_id' => $order->id],
            );
        }
    }

    /**
     * Log unauthenticated access for monitoring
     */
    public function logUnauthenticatedAccess(Order $order, Request $request, bool $isAuthenticated): void
    {
        if ($isAuthenticated) {
            return;
        }

        Log::info('Unauthenticated user viewing thank you page', [
            'order_id' => $order->id,
            'has_vnpay_params' => $request->has('vnp_ResponseCode'),
        ]);
    }
}
