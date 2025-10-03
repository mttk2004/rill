<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

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

        return Inertia::render('cart', [
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
                        'is_featured' => $item->product->is_featured,
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
    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $result = $this->cartService->addToCart(
            $request->input('product_id'),
            $request->input('quantity', 1)
        );

        return response()->json($result);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, int $cartItemId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $result = $this->cartService->updateQuantity(
            $cartItemId,
            $request->input('quantity')
        );

        return response()->json($result);
    }

    /**
     * Remove item from cart
     */
    public function remove(int $cartItemId): JsonResponse
    {
        $result = $this->cartService->removeFromCart($cartItemId);

        return response()->json($result);
    }

    /**
     * Clear all items from cart
     */
    public function clear(): JsonResponse
    {
        $result = $this->cartService->clearCart();

        return response()->json($result);
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
