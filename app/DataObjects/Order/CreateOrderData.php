<?php

namespace App\DataObjects\Order;

use App\DataObjects\BaseData;

/**
 * Create Order Data Transfer Object
 *
 * Encapsulates data required for creating a new order.
 */
readonly class CreateOrderData extends BaseData
{
    public function __construct(
        public int $userId,
        public array $items,
        public array $shippingAddress,
        public float $subtotal,
        public float $shippingFee,
        public float $discountAmount,
        public float $totalAmount,
        public ?int $voucherId = null,
        public ?string $notes = null,
        public ?string $paymentMethod = null,
    ) {}

    /**
     * Validate order items structure.
     *
     * @return bool
     */
    public function hasValidItems(): bool
    {
        if (empty($this->items)) {
            return false;
        }

        foreach ($this->items as $item) {
            if (!isset($item['product_id'], $item['quantity'], $item['unit_price'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate shipping address structure.
     *
     * @return bool
     */
    public function hasValidShippingAddress(): bool
    {
        $required = ['name', 'phone', 'address', 'city', 'district'];

        foreach ($required as $field) {
            if (empty($this->shippingAddress[$field])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get total items quantity.
     *
     * @return int
     */
    public function getTotalQuantity(): int
    {
        return array_sum(array_column($this->items, 'quantity'));
    }

    /**
     * Get total unique products.
     *
     * @return int
     */
    public function getTotalProducts(): int
    {
        return count($this->items);
    }
}
