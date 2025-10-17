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

        $order->load(['items.product.artists', 'payment']);

        return Inertia::render('order-detail', [
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * Display the thank you page for a specific order.
     */
    public function thankYou(Order $order)
    {
        Gate::authorize('view', $order);

        return Inertia::render('orders/thank-you', [
            'order' => $order,
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
}
