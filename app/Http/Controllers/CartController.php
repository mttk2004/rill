<?php

namespace App\Http\Controllers;

use App\Services\CartServiceRefactored;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class CartController extends Controller
{
    protected CartServiceRefactored $cartService;

    public function __construct(CartServiceRefactored $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the cart page
     */
    public function index(): Response
    {
        // Get context (user_id or session_id)
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $cartItems = $this->cartService->getCartItems($userId, $sessionId);
        $cartSummary = $this->cartService->getCartSummary($userId, $sessionId);

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

        // Get product to retrieve unit price
        $product = \App\Models\Product::find($request->input('product_id'));
        if (!$product) {
            return back()->with('error', 'Sản phẩm không tồn tại');
        }

        // Get context (user_id or session_id)
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $result = $this->cartService->addToCart(
            $request->input('product_id'),
            $request->input('quantity', 1),
            (float) $product->price,
            $userId,
            $sessionId
        );

        if (!$result->isSuccess()) {
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

        // Get context
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $result = $this->cartService->updateQuantity(
            $cartItemId,
            $request->input('quantity'),
            $userId,
            $sessionId
        );

        if (!$result->isSuccess()) {
            return back()->withErrors(['message' => $result->message]);
        }

        return back()->with('message', $result->message);
    }

    /**
     * Remove item from cart
     */
    public function remove(int $cartItemId)
    {
        // Get context
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $result = $this->cartService->removeFromCart($cartItemId, $userId, $sessionId);

        if (!$result->isSuccess()) {
            return back()->withErrors(['message' => $result->message]);
        }

        return back()->with('message', $result->message);
    }

    /**
     * Clear all items from cart
     */
    public function clear(): JsonResponse
    {
        // Get context
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $result = $this->cartService->clearCart($userId, $sessionId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->message,
            'data' => $result->data,
        ]);
    }

    /**
     * Get cart summary for header/flyout menu
     */
    public function summary(): JsonResponse
    {
        // Get context
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        $summary = $this->cartService->getCartSummary($userId, $sessionId);

        return response()->json($summary);
    }

}
