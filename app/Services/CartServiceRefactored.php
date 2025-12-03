<?php

namespace App\Services;

use App\Actions\Cart\AddToCartAction;
use App\Actions\Cart\ClearCartAction;
use App\Actions\Cart\MergeGuestCartAction;
use App\Actions\Cart\RemoveCartItemAction;
use App\Actions\Cart\UpdateCartItemAction;
use App\DataObjects\Cart\CartItemData;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Collection;

/**
 * Cart Service (Refactored)
 *
 * Orchestrates cart operations using Clean Architecture patterns.
 */
class CartServiceRefactored
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository,
        protected AddToCartAction $addToCartAction,
        protected UpdateCartItemAction $updateCartItemAction,
        protected RemoveCartItemAction $removeCartItemAction,
        protected ClearCartAction $clearCartAction,
        protected MergeGuestCartAction $mergeGuestCartAction
    ) {}

    /**
     * Get cart items.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return Collection
     */
    public function getCartItems(?int $userId = null, ?string $sessionId = null): Collection
    {
        return $this->cartRepository->getCartItems($userId, $sessionId);
    }

    /**
     * Get cart summary.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return array
     */
    public function getCartSummary(?int $userId = null, ?string $sessionId = null): array
    {
        return $this->cartRepository->getCartSummary($userId, $sessionId);
    }

    /**
     * Add item to cart.
     *
     * @param string $productId
     * @param int $quantity
     * @param float $unitPrice
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function addToCart(
        string $productId,
        int $quantity,
        float $unitPrice,
        ?int $userId = null,
        ?string $sessionId = null
    ): ServiceResult {
        try {
            $data = $userId
                ? CartItemData::forUser($productId, $quantity, $unitPrice, $userId)
                : CartItemData::forGuest($productId, $quantity, $unitPrice, $sessionId);

            return $this->addToCartAction->execute($data);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Update cart item quantity.
     *
     * @param int $cartItemId
     * @param int $quantity
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function updateQuantity(
        int $cartItemId,
        int $quantity,
        ?int $userId = null,
        ?string $sessionId = null
    ): ServiceResult {
        return $this->updateCartItemAction->execute($cartItemId, $quantity, $userId, $sessionId);
    }

    /**
     * Remove item from cart.
     *
     * @param int $cartItemId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function removeFromCart(int $cartItemId, ?int $userId = null, ?string $sessionId = null): ServiceResult
    {
        return $this->removeCartItemAction->execute($cartItemId, $userId, $sessionId);
    }

    /**
     * Clear all items from cart.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function clearCart(?int $userId = null, ?string $sessionId = null): ServiceResult
    {
        return $this->clearCartAction->execute($userId, $sessionId);
    }

    /**
     * Merge guest cart into user cart after login.
     *
     * @param int $userId
     * @param string $sessionId
     * @return ServiceResult
     */
    public function mergeGuestCartToUser(int $userId, string $sessionId): ServiceResult
    {
        return $this->mergeGuestCartAction->execute($userId, $sessionId);
    }

    /**
     * Format cart items for view presentation.
     *
     * @param Collection $cartItems
     * @return Collection
     */
    public function formatCartItemsForView(Collection $cartItems): Collection
    {
        return $cartItems->map(function ($item) {
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
        });
    }

    /**
     * Validate stock availability for all cart items before checkout.
     *
     * @param int $userId
     * @throws \Exception if any product is out of stock
     * @return void
     */
    public function validateCartStockBeforeCheckout(int $userId): void
    {
        $cartItems = \App\Models\ShoppingCartItem::with('product')
            ->where('user_id', $userId)
            ->get();

        if ($cartItems->isEmpty()) {
            throw new \Exception('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        }

        foreach ($cartItems as $item) {
            // Check if product still exists
            if (!$item->product) {
                throw new \Exception('Một số sản phẩm trong giỏ hàng không còn tồn tại.');
            }

            // Check stock availability
            if ($item->quantity > $item->product->stock_quantity) {
                throw new \Exception(
                    "Sản phẩm '{$item->product->name}' chỉ còn {$item->product->stock_quantity} " .
                    "sản phẩm trong kho. Vui lòng cập nhật số lượng trong giỏ hàng."
                );
            }

            // Check if product is still active
            if ($item->product->status === 'out_of_stock' || !$item->product->isInStock()) {
                throw new \Exception(
                    "Sản phẩm '{$item->product->name}' hiện không còn hàng."
                );
            }
        }
    }
}
