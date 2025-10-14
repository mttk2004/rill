<?php

namespace App\Http\Controllers;

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
        $request->validate([
            'status' => 'nullable|string|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $orders = Auth::user()
            ->orders()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->with(['items' => function ($query) {
                $query->limit(3); // Eager load up to 3 items for the tooltip
            }])
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
            'order' => $order,
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
}
