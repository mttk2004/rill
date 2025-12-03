<?php

namespace App\Actions\Cart;

use App\Actions\BaseAction;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Merge Guest Cart Action
 *
 * Merges guest session cart into authenticated user cart.
 * Called after user login to preserve cart contents.
 */
class MergeGuestCartAction extends BaseAction
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository
    ) {}

    /**
     * Execute merge guest cart action.
     *
     * @param int $userId
     * @param string $sessionId
     * @return ServiceResult
     */
    public function execute(int $userId, string $sessionId): ServiceResult
    {
        $mergedCount = $this->cartRepository->mergeGuestCart($userId, $sessionId);

        if ($mergedCount === 0) {
            return ServiceResult::success(
                ['merged_count' => 0],
                'No items to merge'
            );
        }

        $cartSummary = $this->cartRepository->getCartSummary($userId);

        return ServiceResult::success(
            ['cart_summary' => $cartSummary, 'merged_count' => $mergedCount],
            "Đã hợp nhất {$mergedCount} sản phẩm vào giỏ hàng"
        );
    }
}
