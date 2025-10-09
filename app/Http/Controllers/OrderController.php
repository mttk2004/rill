<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cartItems = $this->cartService->getCartItems();
        $cartSummary = $this->cartService->getCartSummary();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->withErrors(['message' => 'Your cart is empty.']);
        }

        // For now, let's assume the user has a default shipping address.
        // In a real app, you'd get this from the request.
        $shippingAddress = Auth::user()->shippingAddresses()->first();

        $order = Order::create([
            'user_id' => Auth::id(),
            'shipping_address_id' => $shippingAddress->id,
            'total_amount' => $cartSummary['total'],
            'subtotal_amount' => $cartSummary['subtotal'],
            'discount_amount' => $cartSummary['discount'],
            'payment_method' => $request->input('payment_method', 'cod'), // Default to COD for now
        ]);

        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_sku' => $item->product->sku,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->unit_price * $item->quantity,
            ]);
        }

        $this->cartService->clearCart();

        return redirect()->route('orders.show', $order);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        // In a real app, you would authorize that the user can view this order
        // $this->authorize('view', $order);

        $order->load(['items.product.artists', 'shippingAddress']);

        return Inertia::render('order-detail', [
            'order' => $order,
        ]);
    }
}
