<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderAdminResource;
use App\Models\Order;
use App\Services\OrderLifecycleService;
use App\Services\OrderQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderQueryService $orderQueryService,
        protected OrderLifecycleService $orderLifecycleService
    ) {}
    /**
     * Display a listing of orders for admin.
     */
    public function index(Request $request)
    {
        $filters = [
            'per_page' => (int) $request->get('per_page', 20),
            'search' => $request->get('search', ''),
            'status' => $request->get('status'),
            'payment_status' => $request->get('payment_status'),
            'sort' => $request->get('sort', 'newest'),
        ];

        $orders = $this->orderQueryService->getAdminOrders($filters);
        $stats = $this->orderQueryService->getOrderStats();

        return Inertia::render('admin/orders/OrderList', [
            'orders' => [
                'data' => OrderAdminResource::collection($orders->items())->resolve(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'payment_status', 'sort']) + [
                'search' => '',
                'status' => 'all',
                'payment_status' => 'all',
                'sort' => 'newest',
            ],
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, string $id)
    {
        $order = Order::with([
            'user',
            'payment',
            'items.product' => function($query) {
                $query->withTrashed();
            },
            'items.product.artists',
            'statusHistories' => function($query) {
                $query->with('createdBy:id,name')->orderBy('created_at', 'asc');
            }
        ])
        ->withCount('items')
        ->findOrFail($id);

        $orderResource = new OrderAdminResource($order);

        // Return JSON for API requests, Inertia page for browser
        if ($request->wantsJson()) {
            return $orderResource;
        }

        // Render detail page
        return Inertia::render('admin/orders/OrderDetail', [
            'order' => $orderResource->resolve(),
        ]);
    }    /**
     * Export order as PDF.
     */
    public function export(string $id)
    {
        $order = Order::with([
            'user',
            'payment',
            'items.product',
        ])->findOrFail($id);

        // Check if order is paid
        if (!$order->payment || $order->payment->payment_status !== PaymentStatus::COMPLETED) {
            return redirect()->back()->with('error', 'Chỉ có thể xuất đơn hàng đã thanh toán');
        }

        $pdf = app('dompdf.wrapper');
        $pdf->loadView('invoices.order', compact('order'));

        return $pdf->download('hoadon_' . $order->order_number . '.pdf');
    }

    /**
     * Cancel an order (soft delete).
     */
    public function destroy(string $id)
    {
        $result = $this->orderLifecycleService->cancelOrder((int) $id, 'Cancelled by admin');

        if ($result->isSuccess()) {
            return redirect()->back()->with('success', 'Đơn hàng đã được hủy');
        }

        return redirect()->back()->withErrors(['error' => $result->message]);
    }

    /**
     * Restore a cancelled order.
     */
    public function restore(string $id)
    {
        $order = Order::withTrashed()->findOrFail($id);
        $order->restore();

        // Restore to pending status
        $order->update(['status' => OrderStatus::PENDING]);

        return redirect()->back()->with('success', 'Đơn hàng đã được khôi phục');
    }

    /**
     * Update order status.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, string $id)
    {
        $order = Order::with('payment')->findOrFail($id);
        $newStatus = OrderStatus::from($request->validated()['status']);

        // Business rules validation
        $validationError = $this->orderLifecycleService->validateStatusUpdate($order->status, $newStatus);
        if ($validationError) {
            return back()->withErrors(['status' => $validationError]);
        }

        // Additional validation: VNPAY orders must be paid before confirmation
        if ($newStatus === OrderStatus::CONFIRMED &&
            $order->payment &&
            $order->payment->payment_method->value === 'vnpay' &&
            $order->payment->payment_status !== PaymentStatus::COMPLETED) {
            return back()->withErrors(['status' => 'Đơn hàng VNPAY chỉ có thể xác nhận sau khi thanh toán thành công']);
        }

        // Use service to update status
        $result = $this->orderLifecycleService->updateOrderStatus(
            (int) $id,
            $newStatus,
            $request->validated()['notes'] ?? null
        );

        if ($result->isSuccess()) {
            return back()->with('success', 'Cập nhật trạng thái thành công');
        }

        return back()->withErrors(['status' => $result->message]);
    }
}


