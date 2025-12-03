<?php

namespace App\Actions\Cart;

use App\Actions\BaseAction;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Update Cart Item Action
 *
 * Handles updating cart item quantity with stock validation.
 */
class UpdateCartItemAction extends BaseAction
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository,
        protected ProductRepositoryInterface $productRepository
    ) {}

    /**
     * Execute update cart item action.
     *
     * @param int $cartItemId
     * @param int $quantity
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function execute(int $cartItemId, int $quantity, ?int $userId = null, ?string $sessionId = null): ServiceResult
    {
        // If quantity is 0 or negative, remove item
        if ($quantity <= 0) {
            $removeAction = app(RemoveCartItemAction::class);
            return $removeAction->execute($cartItemId, $userId, $sessionId);
        }

        return DB::transaction(function () use ($cartItemId, $quantity, $userId, $sessionId) {
            // Find cart item
            $cartItem = $this->cartRepository->findCartItem($cartItemId, $userId, $sessionId);

            if (!$cartItem) {
                return ServiceResult::error(
                    'Không tìm thấy sản phẩm trong giỏ hàng',
                    ['error_code' => 'CART_ITEM_NOT_FOUND']
                );
            }

            // Check stock quantity
            $product = $cartItem->product;

            if ($quantity > $product->stock_quantity) {
                return ServiceResult::error(
                    "Chỉ còn {$product->stock_quantity} sản phẩm trong kho",
                    ['error_code' => 'INSUFFICIENT_STOCK', 'available' => $product->stock_quantity]
                );
            }

            // Update quantity
            $this->cartRepository->updateQuantity($cartItemId, $quantity);
            $cartSummary = $this->cartRepository->getCartSummary($userId, $sessionId);

            return ServiceResult::success(
                ['cart_summary' => $cartSummary],
                'Đã cập nhật số lượng sản phẩm'
            );
        });
    }
}
