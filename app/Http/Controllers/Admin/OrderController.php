<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
            if ($payment_status === 'pending') {
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

        // Transform orders data for frontend
        $orders->getCollection()->transform(function ($order) {
            $orderData = $order->toArray();
            $orderData['customer'] = $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone ?? null,
            ] : null;
            $orderData['payment_status'] = $order->payment ? $order->payment->payment_status : 'pending';
            $orderData['order_items_count'] = $order->items_count;

            return $orderData;
        });

        // Calculate stats
        $stats = [
            'total' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/orders', [
            'orders' => $orders,
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
        ])->findOrFail($id);

        // Transform order data for frontend
        $orderData = $order->toArray();
        $orderData['customer'] = $order->user ? [
            'id' => $order->user->id,
            'name' => $order->user->name,
            'email' => $order->user->email,
            'phone' => $order->user->phone ?? null,
        ] : null;

        // shipping_address already cast to array by model
        $shippingAddress = $order->shipping_address ?? [];
        $orderData['shipping_address'] = !empty($shippingAddress) ? [
            'id' => $shippingAddress['id'] ?? 0,
            'full_name' => $shippingAddress['full_name'] ?? '',
            'phone' => $shippingAddress['phone'] ?? '',
            'address_line_1' => $shippingAddress['address_line_1'] ?? '',
            'address_line_2' => $shippingAddress['address_line_2'] ?? null,
            'ward' => $shippingAddress['ward'] ?? '',
            'district' => $shippingAddress['district'] ?? '',
            'city' => $shippingAddress['city'] ?? '',
            'postal_code' => $shippingAddress['postal_code'] ?? null,
        ] : null;

        // Transform payment data
        $orderData['payment'] = $order->payment ? [
            'id' => $order->payment->id,
            'payment_method' => $order->payment->payment_method,
            'payment_status' => $order->payment->payment_status,
            'amount' => $order->payment->amount,
            'processed_at' => $order->payment->processed_at,
        ] : null;

        $orderData['order_items'] = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->total_price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'sku' => $item->product->sku,
                    'artists' => $item->product->artists->map(function ($artist) {
                        return [
                            'id' => $artist->id,
                            'name' => $artist->name,
                        ];
                    })->toArray(),
                ],
            ];
        });

        // Render detail page
        return Inertia::render('admin/order-detail', [
            'order' => $orderData,
        ]);
    }

    /**
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
        if (!$order->payment || $order->payment->payment_status !== 'completed') {
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
        $order->update(['status' => 'cancelled']);
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
        $order->update(['status' => 'pending']);

        return redirect()->back()->with('success', 'Đơn hàng đã được khôi phục');
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Trạng thái đơn hàng đã được cập nhật');
    }
}
