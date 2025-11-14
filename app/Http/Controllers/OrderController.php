<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\ThankYouPageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private ThankYouPageService $thankYouPageService
    ) {}
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
            'payment',
            'statusHistories' => function($query) {
                $query->with('createdBy:id,name')->orderBy('created_at', 'asc');
            }
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
        // Resolve order from route parameter or VNPAY return URL
        $order = $this->thankYouPageService->resolveOrder($request, $order);

        // Check authorization for authenticated users
        if (Auth::check()) {
            Gate::authorize('view', $order);
        } else {
            // Log unauthenticated access (from VNPAY redirect with lost session)
            $this->thankYouPageService->logUnauthenticatedAccess($order, $request);
        }

        // Load payment information
        $order->load('payment');

        // Get VNPAY response data if available
        $vnpayResponse = $this->thankYouPageService->getVnpayResponse($request);

        // Auto-trigger IPN in local environment if payment is pending
        if ($vnpayResponse) {
            $this->thankYouPageService->autoTriggerLocalIpn($request, $order);
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
