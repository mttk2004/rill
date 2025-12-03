<?php

namespace App\Actions\Cart;

use App\Actions\BaseAction;
use App\DataObjects\Cart\CartItemData;
use App\Models\Product;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Add To Cart Action
 *
 * Handles adding items to shopping cart with stock validation.
 */
class AddToCartAction extends BaseAction
{
    public function __construct(
        protected CartRepositoryInterface $cartRepository,
        protected ProductRepositoryInterface $productRepository
    ) {}

    /**
     * Execute add to cart action.
     *
     * @param CartItemData $data
     * @return ServiceResult
     */
    public function execute(CartItemData $data): ServiceResult
    {
        return DB::transaction(function () use ($data) {
            // Get product
            $product = $this->productRepository->find($data->productId);

            if (!$product) {
                return ServiceResult::error('Product not found');
            }

            // Check if product is in stock
            if (!$product->isInStock()) {
                return ServiceResult::error(
                    'Sản phẩm không còn hàng hoặc tạm ngưng bán',
                    ['error_code' => 'PRODUCT_OUT_OF_STOCK']
                );
            }

            // Check stock quantity
            if ($data->quantity > $product->stock_quantity) {
                return ServiceResult::error(
                    "Chỉ còn {$product->stock_quantity} sản phẩm trong kho",
                    ['error_code' => 'INSUFFICIENT_STOCK', 'available' => $product->stock_quantity]
                );
            }

            // Check if item already exists in cart
            $existingItem = $this->cartRepository->findByProduct(
                $data->productId,
                $data->userId,
                $data->sessionId
            );

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $data->quantity;

                if ($newQuantity > $product->stock_quantity) {
                    return ServiceResult::error(
                        "Tổng số lượng vượt quá tồn kho ({$product->stock_quantity} sản phẩm)",
                        ['error_code' => 'QUANTITY_EXCEEDS_STOCK', 'available' => $product->stock_quantity]
                    );
                }

                $this->cartRepository->updateQuantity($existingItem->id, $newQuantity);
                $cartSummary = $this->cartRepository->getCartSummary($data->userId, $data->sessionId);

                return ServiceResult::success(
                    ['cart_summary' => $cartSummary],
                    'Đã cập nhật số lượng sản phẩm trong giỏ hàng'
                );
            }

            // Add new item
            $this->cartRepository->addItem($data->toArray());
            $cartSummary = $this->cartRepository->getCartSummary($data->userId, $data->sessionId);

            return ServiceResult::success(
                ['cart_summary' => $cartSummary],
                'Đã thêm sản phẩm vào giỏ hàng'
            );
        });
    }
}
