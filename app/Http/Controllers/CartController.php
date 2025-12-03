<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Get cart context (userId and sessionId).
     *
     * @return array{userId: int|null, sessionId: string|null}
     */
    protected function getCartContext(): array
    {
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $userId ? null : session()->getId();

        return compact('userId', 'sessionId');
    }

    /**
     * Display the cart page.
     */
    public function index(): Response
    {
        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

        $cartItems = $this->cartService->getCartItems($userId, $sessionId);
        $cartSummary = $this->cartService->getCartSummary($userId, $sessionId);

        return Inertia::render('Cart', [
            'cartItems' => $this->cartService->formatCartItemsForView($cartItems),
            'cartSummary' => $cartSummary,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function add(AddToCartRequest $request): RedirectResponse
    {
        $product = \App\Models\Product::find($request->input('product_id'));
        if (!$product) {
            return back()->with('error', 'Sản phẩm không tồn tại');
        }

        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

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
     * Update cart item quantity.
     */
    public function update(UpdateCartRequest $request, int $cartItemId): RedirectResponse
    {
        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

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
     * Remove item from cart.
     */
    public function remove(int $cartItemId): RedirectResponse
    {
        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

        $result = $this->cartService->removeFromCart($cartItemId, $userId, $sessionId);

        if (!$result->isSuccess()) {
            return back()->withErrors(['message' => $result->message]);
        }

        return back()->with('message', $result->message);
    }

    /**
     * Clear all items from cart.
     */
    public function clear(): JsonResponse
    {
        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

        $result = $this->cartService->clearCart($userId, $sessionId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->message,
            'data' => $result->data,
        ]);
    }

    /**
     * Get cart summary for header/flyout menu.
     */
    public function summary(): JsonResponse
    {
        ['userId' => $userId, 'sessionId' => $sessionId] = $this->getCartContext();

        $summary = $this->cartService->getCartSummary($userId, $sessionId);

        return response()->json($summary);
    }

}
