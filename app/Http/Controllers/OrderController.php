<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
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
