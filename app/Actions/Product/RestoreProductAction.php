<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Log;

/**
 * Restore Product Action
 *
 * Handles restoration of soft-deleted products.
 */
class RestoreProductAction
{
    /**
     * Execute the action.
     *
     * @param string $productId
     * @return ServiceResult
     */
    public function execute(string $productId): ServiceResult
    {
        try {
            $product = Product::withTrashed()->findOrFail($productId);

            if (!$product->trashed()) {
                return ServiceResult::error('Sản phẩm này chưa bị xóa');
            }

            $product->restore();

            Log::info('Product restored', [
                'product_id' => $productId,
                'product_name' => $product->name,
            ]);

            return ServiceResult::success(
                ['product' => $product],
                'Sản phẩm đã được khôi phục thành công'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Product not found for restoration', [
                'product_id' => $productId,
            ]);

            return ServiceResult::error('Không tìm thấy sản phẩm');
        } catch (\Exception $e) {
            Log::error('Failed to restore product', [
                'product_id' => $productId,
                'error' => $e->getMessage(),
            ]);

            return ServiceResult::error('Không thể khôi phục sản phẩm: ' . $e->getMessage());
        }
    }
}
