<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Log;

/**
 * Delete Product Action
 *
 * Handles soft deletion of products.
 */
class DeleteProductAction
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
            $product = Product::findOrFail($productId);

            $product->delete();

            Log::info('Product soft deleted', [
                'product_id' => $productId,
                'product_name' => $product->name,
            ]);

            return ServiceResult::success(
                ['product' => $product],
                'Sản phẩm đã được xóa thành công'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Product not found for deletion', [
                'product_id' => $productId,
            ]);

            return ServiceResult::error('Không tìm thấy sản phẩm');
        } catch (\Exception $e) {
            Log::error('Failed to delete product', [
                'product_id' => $productId,
                'error' => $e->getMessage(),
            ]);

            return ServiceResult::error('Không thể xóa sản phẩm: ' . $e->getMessage());
        }
    }
}
