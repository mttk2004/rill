<?php

namespace App\Actions\Cart;

use App\Actions\BaseAction;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Remove Cart Item Action
 *
 * Handles removing items from shopping cart.
 */
class RemoveCartItemAction extends BaseAction
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository
    ) {}

    /**
     * Execute remove cart item action.
     *
     * @param int $cartItemId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function execute(int $cartItemId, ?int $userId = null, ?string $sessionId = null): ServiceResult
    {
        // Find cart item
        $cartItem = $this->cartRepository->findCartItem($cartItemId, $userId, $sessionId);

        if (!$cartItem) {
            return ServiceResult::error(
                'Không tìm thấy sản phẩm trong giỏ hàng',
                ['error_code' => 'CART_ITEM_NOT_FOUND']
            );
        }

        // Remove item
        $this->cartRepository->removeItem($cartItemId);
        $cartSummary = $this->cartRepository->getCartSummary($userId, $sessionId);

        return ServiceResult::success(
            ['cart_summary' => $cartSummary],
            'Đã xóa sản phẩm khỏi giỏ hàng'
        );
    }
}
