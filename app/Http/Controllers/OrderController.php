<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\ThankYouPageServiceRefactored;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private ThankYouPageServiceRefactored $thankYouPageService
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
            ->paginate(config('pagination.orders'))
            ->withQueryString();

        // Debug log only - không thay đổi logic
        \Log::info('OrderController::index - Orders data being sent:', [
            'total' => $orders->total(),
            'first_order' => $orders->first() ? [
                'id' => $orders->first()->id,
                'order_number' => $orders->first()->order_number,
                'total_amount' => $orders->first()->total_amount,
                'placed_at' => $orders->first()->placed_at,
                'items_count' => $orders->first()->items->count(),
                'first_item' => $orders->first()->items->first() ? [
                    'product_name' => $orders->first()->items->first()->product_name,
                    'quantity' => $orders->first()->items->first()->quantity,
                ] : null,
            ] : null,
        ]);

        return Inertia::render('Orders', [
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

        // Debug log only - không thay đổi logic
        \Log::info('OrderController::show - Order data being sent:', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => $order->total_amount,
            'placed_at' => $order->placed_at,
            'status' => $order->status,
            'shipping_address' => $order->shipping_address,
            'items_count' => $order->items->count(),
            'first_item' => $order->items->first() ? [
                'product_name' => $order->items->first()->product_name,
                'product_image' => $order->items->first()->product_image,
                'quantity' => $order->items->first()->quantity,
                'unit_price' => $order->items->first()->unit_price,
            ] : null,
            'payment' => $order->payment ? [
                'method' => $order->payment->payment_method,
                'status' => $order->payment->payment_status,
            ] : null,
            'status_histories_count' => $order->statusHistories->count(),
            'status_histories' => $order->statusHistories->map(fn($h) => [
                'status' => $h->status,
                'created_at' => $h->created_at,
                'notes' => $h->notes,
                'created_by' => $h->createdBy?->name,
            ])->toArray(),
        ]);

        return Inertia::render('OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display the thank you page for a specific order.
     */
    public function thankYou(Request $request, ?Order $order = null)
    {
        // Resolve order from route parameter or VNPAY return URL
        $orderResult = $this->thankYouPageService->resolveOrder($request, $order, Auth::id());

        if (!$orderResult->success) {
            abort(404, $orderResult->message);
        }

        $order = $orderResult->data;

        // Check authorization for authenticated users
        if (Auth::check()) {
            Gate::authorize('view', $order);
        } else {
            // Log unauthenticated access (from VNPAY redirect with lost session)
            $this->thankYouPageService->logUnauthenticatedAccess($order, $request, false);
        }

        // Load payment information
        $order->load('payment');

        // Get VNPAY response data if available
        $vnpayResponseResult = $this->thankYouPageService->getVnpayResponse($request);
        $vnpayResponse = $vnpayResponseResult->success ? $vnpayResponseResult->data : null;

        // Auto-trigger IPN in local environment if payment is pending
        if ($vnpayResponse && $vnpayResponse['has_vnpay_response']) {
            $this->thankYouPageService->autoTriggerLocalIpn($request, $order);

            // Reload payment after IPN trigger
            $order->load('payment');
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

        // Load order items with products
        $order->load('items.product');

        // Use transaction to ensure atomicity
        \DB::transaction(function () use ($order) {
            // Restore stock for each item
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->incrementStock($item->quantity);

                    \Log::info('Stock restored after order cancellation', [
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'quantity_restored' => $item->quantity,
                        'new_stock' => $item->product->fresh()->stock_quantity,
                    ]);
                }
            }

            // Update order status
            $order->update(['status' => OrderStatus::CANCELLED]);
        });

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
            $vnpayService = app(\App\Services\VnpayServiceRefactored::class);
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
