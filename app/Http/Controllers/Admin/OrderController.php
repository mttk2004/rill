<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderAdminResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for admin.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);
        $search = trim((string) $request->get('search', ''));
        $status = $request->get('status');
        $payment_status = $request->get('payment_status');
        $sort = $request->get('sort', 'newest');

        $query = Order::query()->withTrashed();

        // Search (order number, customer name, email, phone)
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // Order status filter
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Payment status filter
        if ($payment_status && $payment_status !== 'all') {
            if ($payment_status === PaymentStatus::PENDING->value) {
                // For pending: include orders with pending payment OR without payment record
                $query->where(function ($q) use ($payment_status) {
                    $q->whereHas('payment', function ($subQ) use ($payment_status) {
                        $subQ->where('payment_status', $payment_status);
                    })->orWhereDoesntHave('payment');
                });
            } else {
                // For other statuses: only include orders with that specific payment status
                $query->whereHas('payment', function ($q) use ($payment_status) {
                    $q->where('payment_status', $payment_status);
                });
            }
        }

        // Sorting
        switch ($sort) {
            case 'order_number_asc':
                $query->orderBy('order_number', 'asc');
                break;
            case 'order_number_desc':
                $query->orderBy('order_number', 'desc');
                break;
            case 'total_asc':
                $query->orderBy('total_amount', 'asc');
                break;
            case 'total_desc':
                $query->orderBy('total_amount', 'desc');
                break;
            case 'oldest':
                $query->orderBy('placed_at', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('placed_at', 'desc');
                break;
        }

        // Eager load relationships
        $orders = $query->with(['user', 'payment'])
            ->withCount('items')
            ->paginate($perPage)
            ->withQueryString();

        // Calculate stats with single query
        $stats = Order::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as shipped,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled
            ', [
                OrderStatus::PENDING->value,
                OrderStatus::CONFIRMED->value,
                OrderStatus::SHIPPED->value,
                OrderStatus::DELIVERED->value,
                OrderStatus::CANCELLED->value,
            ])
            ->first()
            ->toArray();

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
        $order = Order::findOrFail($id);

        // Update status to cancelled
        $order->update(['status' => OrderStatus::CANCELLED]);
        $order->delete();

        return redirect()->back()->with('success', 'Đơn hàng đã được hủy');
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
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', array_map(fn($case) => $case->value, OrderStatus::cases())),
            'notes' => 'nullable|string|max:1000',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        // Business rules validation
        if ($oldStatus === OrderStatus::DELIVERED && $newStatus !== OrderStatus::CANCELLED->value) {
            return back()->withErrors([
                'status' => 'Không thể thay đổi trạng thái của đơn hàng đã giao',
            ]);
        }

        // Update status (set notes as temporary attribute for history)
        if ($request->filled('notes')) {
            $order->status_change_notes = $request->notes;
        }
        $order->update(['status' => $newStatus]);

        return back();
    }
}
