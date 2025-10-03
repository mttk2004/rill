<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ShoppingCartItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartService
{
    /**
     * Get cart items for current user or session
     */
    public function getCartItems(): Collection
    {
        $query = ShoppingCartItem::with(['product', 'product.artists']);

        if (Auth::check()) {
            // Registered user
            $query->where('user_id', Auth::id());
        } else {
            // Guest user - use session
            $sessionId = Session::getId();
            $query->where('session_id', $sessionId);
        }

        return $query->get();
    }

    /**
     * Get cart summary (total items, total amount)
     */
    public function getCartSummary(): array
    {
        $items = $this->getCartItems();

        $totalItems = $items->sum('quantity');
        $totalAmount = $items->sum(fn($item) => $item->quantity * $item->unit_price);

        return [
            'total_items' => $totalItems,
            'total_amount' => $totalAmount,
            'items_count' => $items->count(),
            'formatted_total' => number_format($totalAmount, 0, ',', '.') . 'đ'
        ];
    }

    /**
     * Add item to cart
     */
    public function addToCart(string $productId, int $quantity = 1): array
    {
        $product = Product::findOrFail($productId);

        if (!$product->isInStock()) {
            return [
                'success' => false,
                'message' => 'Sản phẩm không còn hàng hoặc tạm ngưng bán'
            ];
        }

        if ($quantity > $product->stock_quantity) {
            return [
                'success' => false,
                'message' => "Chỉ còn {$product->stock_quantity} sản phẩm trong kho"
            ];
        }

        // Check if item already exists in cart
        $existingItem = $this->findCartItem($productId);

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;

            if ($newQuantity > $product->stock_quantity) {
                return [
                    'success' => false,
                    'message' => "Tổng số lượng vượt quá tồn kho ({$product->stock_quantity} sản phẩm)"
                ];
            }

            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            ShoppingCartItem::create([
                'user_id' => Auth::check() ? Auth::id() : null,
                'session_id' => Auth::check() ? null : Session::getId(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'unit_price' => $product->price,
            ]);
        }

        return [
            'success' => true,
            'message' => 'Đã thêm sản phẩm vào giỏ hàng',
            'cart_summary' => $this->getCartSummary()
        ];
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(int $cartItemId, int $quantity): array
    {
        if ($quantity <= 0) {
            return $this->removeFromCart($cartItemId);
        }

        $cartItem = $this->findCartItemById($cartItemId);

        if (!$cartItem) {
            return [
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
            ];
        }

        if ($quantity > $cartItem->product->stock_quantity) {
            return [
                'success' => false,
                'message' => "Chỉ còn {$cartItem->product->stock_quantity} sản phẩm trong kho"
            ];
        }

        $cartItem->update(['quantity' => $quantity]);

        return [
            'success' => true,
            'message' => 'Đã cập nhật số lượng sản phẩm',
            'cart_summary' => $this->getCartSummary()
        ];
    }

    /**
     * Remove item from cart
     */
    public function removeFromCart(int $cartItemId): array
    {
        $cartItem = $this->findCartItemById($cartItemId);

        if (!$cartItem) {
            return [
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
            ];
        }

        $cartItem->delete();

        return [
            'success' => true,
            'message' => 'Đã xóa sản phẩm khỏi giỏ hàng',
            'cart_summary' => $this->getCartSummary()
        ];
    }

    /**
     * Clear all cart items
     */
    public function clearCart(): array
    {
        $query = ShoppingCartItem::query();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        $query->delete();

        return [
            'success' => true,
            'message' => 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
            'cart_summary' => $this->getCartSummary()
        ];
    }

    /**
     * Merge guest cart with user cart after login
     */
    public function mergeGuestCartToUser(int $userId, string $sessionId): void
    {
        $guestItems = ShoppingCartItem::where('session_id', $sessionId)->get();

        foreach ($guestItems as $guestItem) {
            $existingUserItem = ShoppingCartItem::where('user_id', $userId)
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingUserItem) {
                // Merge quantities
                $existingUserItem->update([
                    'quantity' => $existingUserItem->quantity + $guestItem->quantity
                ]);
                $guestItem->delete();
            } else {
                // Convert guest item to user item
                $guestItem->update([
                    'user_id' => $userId,
                    'session_id' => null
                ]);
            }
        }
    }

    /**
     * Find cart item by product ID
     */
    private function findCartItem(string $productId): ?ShoppingCartItem
    {
        $query = ShoppingCartItem::where('product_id', $productId);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        return $query->first();
    }

    /**
     * Find cart item by ID
     */
    private function findCartItemById(int $cartItemId): ?ShoppingCartItem
    {
        $query = ShoppingCartItem::where('id', $cartItemId);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        return $query->first();
    }
}
