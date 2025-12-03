<?php

namespace App\Actions\Product;

use App\Actions\BaseAction;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Update Product Stock Action
 *
 * Single responsibility: Update product stock quantity with validation.
 */
class UpdateProductStockAction extends BaseAction
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Execute stock update.
     *
     * @param int $productId
     * @param int $quantity
     * @param string $operation 'set', 'increase', or 'decrease'
     * @param string|null $reason
     * @return ServiceResult
     */
    public function execute(
        int $productId,
        int $quantity,
        string $operation = 'set',
        ?string $reason = null
    ): ServiceResult {
        $product = $this->productRepository->find($productId);

        if (!$product) {
            return $this->error('Product not found');
        }

        // Validate quantity
        if ($quantity < 0) {
            return $this->error('Quantity cannot be negative');
        }

        return $this->transaction(function () use ($product, $quantity, $operation, $reason) {
            $oldStock = $product->stock_quantity;
            $newStock = match ($operation) {
                'increase' => $this->productRepository->increaseStock($product->id, $quantity),
                'decrease' => $this->productRepository->decreaseStock($product->id, $quantity),
                'set' => $this->productRepository->updateStock($product->id, $quantity),
                default => throw new \InvalidArgumentException("Invalid operation: {$operation}"),
            };

            // Log stock change if reason provided
            if ($reason) {
                \Log::info('Product stock updated', [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'old_stock' => $oldStock,
                    'new_stock' => $newStock,
                    'operation' => $operation,
                    'quantity' => $quantity,
                    'reason' => $reason,
                    'changed_by' => auth()->id(),
                ]);
            }

            return $this->success(
                [
                    'product' => $product->fresh(),
                    'old_stock' => $oldStock,
                    'new_stock' => $newStock,
                    'operation' => $operation,
                ],
                "Stock updated successfully from {$oldStock} to {$newStock}"
            );
        });
    }

    /**
     * Bulk update stock for multiple products.
     *
     * @param array $updates Array of ['product_id' => quantity]
     * @param string $operation
     * @return ServiceResult
     */
    public function bulkUpdate(array $updates, string $operation = 'set'): ServiceResult
    {
        return $this->transaction(function () use ($updates, $operation) {
            $results = [];
            $errors = [];

            foreach ($updates as $productId => $quantity) {
                $result = $this->execute($productId, $quantity, $operation);

                if ($result->isSuccess()) {
                    $results[] = $result->getData();
                } else {
                    $errors[$productId] = $result->message;
                }
            }

            if (!empty($errors)) {
                return $this->error('Some stock updates failed', $errors);
            }

            return $this->success(
                $results,
                sprintf('Successfully updated %d products', count($results))
            );
        });
    }
}
