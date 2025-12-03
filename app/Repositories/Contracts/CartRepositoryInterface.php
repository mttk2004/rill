<?php

namespace App\Repositories\Contracts;

use App\Models\ShoppingCartItem;
use Illuminate\Database\Eloquent\Collection;

/**
 * Cart Repository Interface
 *
 * Handles shopping cart data access with support for both
 * authenticated users (user_id) and guest users (session_id).
 */
interface CartRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get cart items for a user or session.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return Collection
     */
    public function getCartItems(?int $userId = null, ?string $sessionId = null): Collection;

    /**
     * Find cart item by product ID.
     *
     * @param string $productId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ShoppingCartItem|null
     */
    public function findByProduct(string $productId, ?int $userId = null, ?string $sessionId = null): ?ShoppingCartItem;

    /**
     * Find cart item by ID with user/session context.
     *
     * @param int $cartItemId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ShoppingCartItem|null
     */
    public function findCartItem(int $cartItemId, ?int $userId = null, ?string $sessionId = null): ?ShoppingCartItem;

    /**
     * Add item to cart.
     *
     * @param array $data
     * @return ShoppingCartItem
     */
    public function addItem(array $data): ShoppingCartItem;

    /**
     * Update cart item quantity.
     *
     * @param int $cartItemId
     * @param int $quantity
     * @return bool
     */
    public function updateQuantity(int $cartItemId, int $quantity): bool;

    /**
     * Remove item from cart.
     *
     * @param int $cartItemId
     * @return bool
     */
    public function removeItem(int $cartItemId): bool;

    /**
     * Clear all cart items for user or session.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return int Number of items deleted
     */
    public function clearCart(?int $userId = null, ?string $sessionId = null): int;

    /**
     * Get cart items by session ID.
     *
     * @param string $sessionId
     * @return Collection
     */
    public function getGuestCartItems(string $sessionId): Collection;

    /**
     * Merge guest cart items into user cart.
     *
     * @param int $userId
     * @param string $sessionId
     * @return int Number of items merged
     */
    public function mergeGuestCart(int $userId, string $sessionId): int;

    /**
     * Get cart summary (totals).
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return array
     */
    public function getCartSummary(?int $userId = null, ?string $sessionId = null): array;
}
