<?php

namespace App\Repositories\Eloquent;

use App\Models\ShoppingCartItem;
use App\Repositories\Contracts\CartRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Cart Repository Implementation
 *
 * Handles shopping cart data operations with support for
 * both authenticated users and guest sessions.
 */
class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    /**
     * CartRepository constructor.
     */
    public function __construct()
    {
        parent::__construct(new ShoppingCartItem());
    }

    /**
     * Get cart items for a user or session.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return Collection
     */
    public function getCartItems(?int $userId = null, ?string $sessionId = null): Collection
    {
        $query = $this->model->with(['product', 'product.artists']);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->get();
    }

    /**
     * Find cart item by product ID.
     *
     * @param string $productId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ShoppingCartItem|null
     */
    public function findByProduct(string $productId, ?int $userId = null, ?string $sessionId = null): ?ShoppingCartItem
    {
        $query = $this->model->where('product_id', $productId);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->first();
    }

    /**
     * Find cart item by ID with user/session context.
     *
     * @param int $cartItemId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ShoppingCartItem|null
     */
    public function findCartItem(int $cartItemId, ?int $userId = null, ?string $sessionId = null): ?ShoppingCartItem
    {
        $query = $this->model->where('id', $cartItemId);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->first();
    }

    /**
     * Add item to cart.
     *
     * @param array $data
     * @return ShoppingCartItem
     */
    public function addItem(array $data): ShoppingCartItem
    {
        return $this->model->create($data);
    }

    /**
     * Update cart item quantity.
     *
     * @param int $cartItemId
     * @param int $quantity
     * @return bool
     */
    public function updateQuantity(int $cartItemId, int $quantity): bool
    {
        return $this->model->where('id', $cartItemId)
            ->update(['quantity' => $quantity]);
    }

    /**
     * Remove item from cart.
     *
     * @param int $cartItemId
     * @return bool
     */
    public function removeItem(int $cartItemId): bool
    {
        $item = $this->model->find($cartItemId);

        if (!$item) {
            return false;
        }

        return $item->delete();
    }

    /**
     * Clear all cart items for user or session.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return int Number of items deleted
     */
    public function clearCart(?int $userId = null, ?string $sessionId = null): int
    {
        $query = $this->model->newQuery();

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->delete();
    }

    /**
     * Get cart items by session ID.
     *
     * @param string $sessionId
     * @return Collection
     */
    public function getGuestCartItems(string $sessionId): Collection
    {
        return $this->model
            ->with(['product'])
            ->where('session_id', $sessionId)
            ->get();
    }

    /**
     * Merge guest cart items into user cart.
     *
     * @param int $userId
     * @param string $sessionId
     * @return int Number of items merged
     */
    public function mergeGuestCart(int $userId, string $sessionId): int
    {
        $guestItems = $this->getGuestCartItems($sessionId);
        $mergedCount = 0;

        foreach ($guestItems as $guestItem) {
            $existingUserItem = $this->findByProduct($guestItem->product_id, $userId);

            if ($existingUserItem) {
                // Merge quantities
                $existingUserItem->update([
                    'quantity' => $existingUserItem->quantity + $guestItem->quantity
                ]);
                $guestItem->delete();
                $mergedCount++;
            } else {
                // Convert guest item to user item
                $guestItem->update([
                    'user_id' => $userId,
                    'session_id' => null
                ]);
                $mergedCount++;
            }
        }

        return $mergedCount;
    }

    /**
     * Get cart summary (totals).
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return array
     */
    public function getCartSummary(?int $userId = null, ?string $sessionId = null): array
    {
        $items = $this->getCartItems($userId, $sessionId);

        $totalItems = $items->sum('quantity');
        $totalAmount = $items->sum(fn($item) => $item->quantity * $item->unit_price);

        return [
            'total_items' => $totalItems,
            'total_amount' => $totalAmount,
            'items_count' => $items->count(),
            'formatted_total' => number_format($totalAmount, 0, ',', '.') . 'đ'
        ];
    }
}
