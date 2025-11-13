<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:' . implode(',', array_map(fn($case) => $case->value, OrderStatus::cases())),
        ]);

        $query = Auth::user()
            ->orders()
            ->withCount('items')
            ->with(['items.product']);

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $orders = $query
            ->orderBy('placed_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('orders', [
            'orders' => $orders,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        Gate::authorize('view', $order);

        $order->load([
            'items.product.artists',
            'items.product.reviews' => function($query) {
                $query->where('user_id', Auth::id());
            },
            'payment'
        ]);

        return Inertia::render('order-detail', [
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * Display the thank you page for a specific order.
     */
    public function thankYou(Request $request, ?Order $order = null)
    {
        \Log::info('Thank You Page Called', [
            'has_order_param' => !is_null($order),
            'has_vnp_txnref' => $request->has('vnp_TxnRef'),
            'vnp_txnref_value' => $request->query('vnp_TxnRef'),
            'all_params' => $request->all(),
            'user_id' => Auth::id(),
            'is_authenticated' => Auth::check(),
        ]);

        // Nếu không có $order (từ VNPAY return), lấy từ vnp_TxnRef
        if (!$order && $request->has('vnp_TxnRef')) {
            $orderId = $request->query('vnp_TxnRef');
            \Log::info('Looking for order', ['order_id' => $orderId]);

            $order = Order::find($orderId);

            if (!$order) {
                \Log::error('Order not found', ['order_id' => $orderId]);
                abort(404, 'Không tìm thấy đơn hàng với ID: ' . $orderId);
            }

            \Log::info('Order found', [
                'order_id' => $order->id,
                'order_user_id' => $order->user_id,
                'current_user_id' => Auth::id(),
            ]);
        }

        if (!$order) {
            \Log::error('No order parameter provided');
            abort(404, 'Không tìm thấy đơn hàng.');
        }

        // Nếu user authenticated, check authorization
        // Nếu không (từ VNPAY return), cho phép xem để hiển thị kết quả thanh toán
        if (Auth::check()) {
            Gate::authorize('view', $order);
        } else {
            // User chưa auth (session mất sau VNPAY redirect)
            // Vẫn cho phép xem trang thank you nhưng sẽ yêu cầu login để xem chi tiết đơn hàng
            \Log::info('Unauthenticated user viewing thank you page', [
                'order_id' => $order->id,
                'has_vnpay_params' => $request->has('vnp_ResponseCode'),
            ]);
        }

        // Load payment information
        $order->load('payment');

        // Lấy thông tin từ VNPAY return URL (nếu có)
        $vnpayResponse = null;
        if ($request->has('vnp_ResponseCode')) {
            $vnpayService = app(\App\Services\VnpayService::class);

            $vnpayResponse = [
                'response_code' => $request->query('vnp_ResponseCode'),
                'message' => $vnpayService->getResponseMessage($request->query('vnp_ResponseCode')),
                'transaction_no' => $request->query('vnp_TransactionNo'),
                'is_success' => $request->query('vnp_ResponseCode') === '00',
            ];

            // Auto-trigger IPN in local environment (since VNPAY can't reach localhost)
            if (app()->environment('local') && $order->payment->payment_status === \App\Enums\PaymentStatus::PENDING) {
                \Log::info('Auto-triggering IPN in local environment', ['order_id' => $order->id]);

                try {
                    // Call IPN handler internally with OrderService injected
                    $vnpayController = app(\App\Http\Controllers\VnpayController::class);
                    $orderService = app(\App\Services\OrderService::class);
                    $vnpayController->handleIpn($request, $vnpayService, $orderService);

                    // Reload payment to get updated status
                    $order->load('payment');

                    \Log::info('IPN auto-triggered successfully', ['order_id' => $order->id]);
                } catch (\Exception $e) {
                    \Log::error('Failed to auto-trigger IPN', [
                        'order_id' => $order->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }
        }

        return Inertia::render('orders/thank-you', [
            'order' => $order,
            'vnpayResponse' => $vnpayResponse,
        ]);
    }

    /**
     * Download the invoice for a specific order.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function downloadInvoice(Order $order)
    {
        Gate::authorize('view', $order);

        // Load relations first
        $order->load(['items.product', 'payment']);

        // Invoices are only available for orders with completed payment.
        if ($order->payment->payment_status !== PaymentStatus::COMPLETED) {
            abort(403, 'Invoice is not available. Payment must be completed first.');
        }

        // Debug log
        \Log::info('Invoice Payment Debug', [
            'payment_method' => $order->payment->payment_method,
            'payment_method_type' => gettype($order->payment->payment_method),
            'payment_method_class' => get_class($order->payment->payment_method),
        ]);

        $pdf = app('dompdf.wrapper');
        $pdf->loadView('invoices.order', compact('order'));

        return $pdf->download('hoadon_' . $order->order_number . '.pdf');
    }

    /**
     * Cancel the specified order.
     */
    public function cancel(Order $order)
    {
        Gate::authorize('view', $order);

        // Only pending orders can be cancelled
        if ($order->status !== OrderStatus::PENDING) {
            return back()->with('error', 'Chỉ có thể hủy đơn hàng đang chờ xác nhận.');
        }

        $order->update(['status' => OrderStatus::CANCELLED]);

        return back()->with('success', 'Đơn hàng đã được hủy thành công.');
    }

    /**
     * Retry payment for an order with pending VNPAY payment.
     */
    public function retryPayment(Request $request, Order $order)
    {
        Gate::authorize('view', $order);

        // Load payment relation
        $order->load('payment');

        // Validate conditions for retry
        if (!$order->payment) {
            return response()->json(['error' => 'Không tìm thấy thông tin thanh toán.'], 400);
        }

        if ($order->payment->payment_method !== PaymentMethod::VNPAY) {
            return response()->json(['error' => 'Chỉ có thể thanh toán lại cho đơn hàng VNPAY.'], 400);
        }

        if ($order->payment->payment_status !== PaymentStatus::PENDING) {
            return response()->json(['error' => 'Đơn hàng này đã được thanh toán hoặc đã bị hủy.'], 400);
        }

        if ($order->status !== OrderStatus::PENDING) {
            return response()->json(['error' => 'Chỉ có thể thanh toán lại cho đơn hàng đang chờ xử lý.'], 400);
        }

        try {
            // Generate new VNPAY payment URL (reuse existing payment record)
            $vnpayService = app(\App\Services\VnpayService::class);
            $paymentUrl = $vnpayService->createPaymentUrl($order, $request);

            \Log::info('Retry payment initiated', [
                'order_id' => $order->id,
                'payment_id' => $order->payment->id,
            ]);

            // Return JSON for frontend to handle redirect
            return response()->json([
                'payment_url' => $paymentUrl,
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to retry payment', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Không thể tạo link thanh toán. Vui lòng thử lại!'], 500);
        }
    }
}
