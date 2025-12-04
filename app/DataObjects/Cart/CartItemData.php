<?php

namespace App\DataObjects\Cart;

use App\DataObjects\BaseData;

/**
 * Cart Item Data Transfer Object
 *
 * Represents data for adding or updating a cart item.
 */
readonly class CartItemData extends BaseData
{
    public function __construct(
        public readonly string $productId,
        public readonly int $quantity,
        public readonly float $unitPrice,
        public readonly ?int $userId = null,
        public readonly ?string $sessionId = null,
    ) {
        $this->validate();
    }

    /**
     * Validate cart item data.
     *
     * @return void
     * @throws \InvalidArgumentException
     */
    protected function validate(): void
    {
        if ($this->quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than 0');
        }

        if ($this->unitPrice < 0) {
            throw new \InvalidArgumentException('Unit price cannot be negative');
        }

        if (is_null($this->userId) && is_null($this->sessionId)) {
            throw new \InvalidArgumentException('Either userId or sessionId must be provided');
        }
    }

    /**
     * Convert to array for database insertion.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'unit_price' => $this->unitPrice,
            'user_id' => $this->userId,
            'session_id' => $this->sessionId,
        ];
    }

    /**
     * Create from authenticated user context.
     *
     * @param string $productId
     * @param int $quantity
     * @param float $unitPrice
     * @param int $userId
     * @return static
     */
    public static function forUser(string $productId, int $quantity, float $unitPrice, int $userId): static
    {
        return new static(
            productId: $productId,
            quantity: $quantity,
            unitPrice: $unitPrice,
            userId: $userId,
            sessionId: null
        );
    }

    /**
     * Create from guest session context.
     *
     * @param string $productId
     * @param int $quantity
     * @param float $unitPrice
     * @param string $sessionId
     * @return static
     */
    public static function forGuest(string $productId, int $quantity, float $unitPrice, string $sessionId): static
    {
        return new static(
            productId: $productId,
            quantity: $quantity,
            unitPrice: $unitPrice,
            userId: null,
            sessionId: $sessionId
        );
    }
}
