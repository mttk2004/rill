<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Http\Requests\FilterOrdersRequest;
use App\Models\Order;
use App\Services\OrderLifecycleService;
use App\Services\OrderPaymentService;
use App\Services\OrderQueryService;
use App\Services\ThankYouPageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private ThankYouPageService $thankYouPageService,
        private OrderQueryService $orderQueryService,
        private OrderLifecycleService $orderLifecycleService,
        private OrderPaymentService $orderPaymentService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(FilterOrdersRequest $request)
    {
        $filters = $request->validated();

        $orders = $this->orderQueryService->getUserOrders(
            Auth::id(),
            array_merge($filters, ['per_page' => config('pagination.orders', 15)])
        )->withQueryString();

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

        return Inertia::render('OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display the thank you page for a specific order.
     */
    public function thankYou(Request $request, ?Order $routeOrder = null)
    {
        \Log::info('OrderController: thankYou method hit.', [
            'url' => $request->fullUrl(),
            'route_order_id' => $routeOrder?->id,
            'user_id' => Auth::id()
        ]);

        // Resolve order from route parameter or VNPAY return URL
        $orderResult = $this->thankYouPageService->resolveOrder($request, $routeOrder, Auth::id());

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

        $result = $this->orderLifecycleService->cancelOrderWithStockRestore($order);

        return back()->with(
            $result->success ? 'success' : 'error',
            $result->message
        );
    }

    /**
     * Retry payment for an order with pending VNPAY payment.
     */
    public function retryPayment(Request $request, Order $order)
    {
        Gate::authorize('view', $order);

        $result = $this->orderPaymentService->retryVnpayPayment($order, $request);

        if (!$result->success) {
            return response()->json(['error' => $result->message], 400);
        }

        return response()->json($result->data);
    }
}
