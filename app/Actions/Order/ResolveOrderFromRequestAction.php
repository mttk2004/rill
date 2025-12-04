<?php

namespace App\Actions\Order;

use App\Models\Order;
use App\Support\ServiceResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Action to resolve order from request parameters
 */
class ResolveOrderFromRequestAction
{
    /**
     * Resolve order from route parameter or VNPAY return URL
     */
    public function execute(Request $request, ?Order $order, ?int $userId = null): ServiceResult
    {
        Log::info('Resolving order from request', [
            'has_order_param' => !is_null($order),
            'has_vnp_txnref' => $request->has('vnp_TxnRef'),
            'vnp_txnref_value' => $request->query('vnp_TxnRef'),
            'user_id' => $userId,
        ]);

        // If no order provided, try to get from vnp_TxnRef
        if (!$order && $request->has('vnp_TxnRef')) {
            $orderId = $request->query('vnp_TxnRef');
            Log::info('Looking for order', ['order_id' => $orderId]);

            $order = Order::find($orderId);

            if (!$order) {
                Log::error('Order not found', ['order_id' => $orderId]);
                return ServiceResult::error(
                    'Không tìm thấy đơn hàng với ID: ' . $orderId,
                    ['order_id' => $orderId],
                );
            }

            Log::info('Order found', [
                'order_id' => $order->id,
                'order_user_id' => $order->user_id,
                'current_user_id' => $userId,
            ]);
        }

        if (!$order) {
            Log::error('No order parameter provided');
            return ServiceResult::error('Không tìm thấy đơn hàng');
        }

        // Return order directly, not wrapped in array
        return ServiceResult::success($order);
    }
}
