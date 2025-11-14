<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ShoppingCartItem;
use App\Services\Responses\ServiceResponse;
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
    public function addToCart(string $productId, int $quantity = 1): ServiceResponse
    {
        $product = Product::findOrFail($productId);

        if (!$product->isInStock()) {
            return ServiceResponse::error(
                'Sản phẩm không còn hàng hoặc tạm ngưng bán',
                'PRODUCT_OUT_OF_STOCK'
            );
        }

        if ($quantity > $product->stock_quantity) {
            return ServiceResponse::error(
                "Chỉ còn {$product->stock_quantity} sản phẩm trong kho",
                'INSUFFICIENT_STOCK'
            );
        }

        // Check if item already exists in cart
        $existingItem = $this->findCartItem($productId);

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;

            if ($newQuantity > $product->stock_quantity) {
                return ServiceResponse::error(
                    "Tổng số lượng vượt quá tồn kho ({$product->stock_quantity} sản phẩm)",
                    'QUANTITY_EXCEEDS_STOCK'
                );
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

        return ServiceResponse::success(
            'Đã thêm sản phẩm vào giỏ hàng',
            ['cart_summary' => $this->getCartSummary()]
        );
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(int $cartItemId, int $quantity): ServiceResponse
    {
        if ($quantity <= 0) {
            return $this->removeFromCart($cartItemId);
        }

        $cartItem = $this->findCartItemById($cartItemId);

        if (!$cartItem) {
            return ServiceResponse::error(
                'Không tìm thấy sản phẩm trong giỏ hàng',
                'CART_ITEM_NOT_FOUND'
            );
        }

        if ($quantity > $cartItem->product->stock_quantity) {
            return ServiceResponse::error(
                "Chỉ còn {$cartItem->product->stock_quantity} sản phẩm trong kho",
                'INSUFFICIENT_STOCK'
            );
        }

        $cartItem->update(['quantity' => $quantity]);

        return ServiceResponse::success(
            'Đã cập nhật số lượng sản phẩm',
            ['cart_summary' => $this->getCartSummary()]
        );
    }

    /**
     * Remove item from cart
     */
    public function removeFromCart(int $cartItemId): ServiceResponse
    {
        $cartItem = $this->findCartItemById($cartItemId);

        if (!$cartItem) {
            return ServiceResponse::error(
                'Không tìm thấy sản phẩm trong giỏ hàng',
                'CART_ITEM_NOT_FOUND'
            );
        }

        $cartItem->delete();

        return ServiceResponse::success(
            'Đã xóa sản phẩm khỏi giỏ hàng',
            ['cart_summary' => $this->getCartSummary()]
        );
    }

    /**
     * Clear all cart items
     */
    public function clearCart(): ServiceResponse
    {
        $query = ShoppingCartItem::query();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        $query->delete();

        return ServiceResponse::success(
            'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
            ['cart_summary' => $this->getCartSummary()]
        );
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
        return $this->findCartItemBy('product_id', $productId);
    }

    /**
     * Find cart item by ID
     */
    private function findCartItemById(int $cartItemId): ?ShoppingCartItem
    {
        return $this->findCartItemBy('id', $cartItemId);
    }

    /**
     * Base method to find cart item by any column with user/session context
     */
    private function findCartItemBy(string $column, mixed $value): ?ShoppingCartItem
    {
        $query = ShoppingCartItem::where($column, $value);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        return $query->first();
    }
}
