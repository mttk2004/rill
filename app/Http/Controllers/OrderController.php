<?php

namespace App\Http\Controllers;

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
            'status' => 'nullable|in:pending,confirmed,shipped,delivered,cancelled',
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
    public function thankYou(Request $request, Order $order)
    {
        Gate::authorize('view', $order);

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

        // Invoices are only available for delivered orders.
        if ($order->status !== 'delivered') {
            abort(403, 'Invoice is not available for this order status.');
        }

        $order->load(['items.product', 'payment']);

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
        if ($order->status !== 'pending') {
            return back()->with('error', 'Chỉ có thể hủy đơn hàng đang chờ xác nhận.');
        }

        $order->update(['status' => 'cancelled']);

        return back()->with('success', 'Đơn hàng đã được hủy thành công.');
    }
}
