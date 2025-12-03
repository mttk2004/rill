<?php

namespace App\Actions\Cart;

use App\Actions\BaseAction;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Clear Cart Action
 *
 * Handles clearing all items from shopping cart.
 */
class ClearCartAction extends BaseAction
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository
    ) {}

    /**
     * Execute clear cart action.
     *
     * @param int|null $userId
     * @param string|null $sessionId
     * @return ServiceResult
     */
    public function execute(?int $userId = null, ?string $sessionId = null): ServiceResult
    {
        $deletedCount = $this->cartRepository->clearCart($userId, $sessionId);

        $cartSummary = $this->cartRepository->getCartSummary($userId, $sessionId);

        return ServiceResult::success(
            ['cart_summary' => $cartSummary, 'deleted_count' => $deletedCount],
            'Đã xóa tất cả sản phẩm khỏi giỏ hàng'
        );
    }
}
