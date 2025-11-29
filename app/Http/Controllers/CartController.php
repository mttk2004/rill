<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the cart page
     */
    public function index(): Response
    {
        $cartItems = $this->cartService->getCartItems();
        $cartSummary = $this->cartService->getCartSummary();

        return Inertia::render('Cart', [
            'cartItems' => $cartItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->quantity * $item->unit_price,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'description' => $item->product->description,
                        'price' => $item->product->price,
                        'image_url' => $item->product->image_url,
                        'stock_quantity' => $item->product->stock_quantity,
                        'status' => $item->product->status,
                        'artists' => $item->product->artists->map(fn($artist) => [
                            'id' => $artist->id,
                            'name' => $artist->name,
                            'slug' => $artist->slug,
                        ]),
                    ],
                ];
            }),
            'cartSummary' => $cartSummary,
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $result = $this->cartService->addToCart(
            $request->input('product_id'),
            $request->input('quantity', 1)
        );

        if ($result->isError()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, int $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $result = $this->cartService->updateQuantity(
            $cartItemId,
            $request->input('quantity')
        );

        if ($result->isError()) {
            return back()->withErrors(['message' => $result->message]);
        }

        return back()->with('message', $result->message);
    }

    /**
     * Remove item from cart
     */
    public function remove(int $cartItemId)
    {
        $result = $this->cartService->removeFromCart($cartItemId);

        if ($result->isError()) {
            return back()->withErrors(['message' => $result->message]);
        }

        return back()->with('message', $result->message);
    }

    /**
     * Clear all items from cart
     */
    public function clear(): JsonResponse
    {
        $result = $this->cartService->clearCart();

        return response()->json($result->toArray());
    }

    /**
     * Get cart summary for header/flyout menu
     */
    public function summary(): JsonResponse
    {
        $summary = $this->cartService->getCartSummary();

        return response()->json($summary);
    }

}
