<?php

namespace App\DataObjects\Order;

use App\DataObjects\BaseData;
use App\Enums\OrderStatus;

/**
 * Update Order Data Transfer Object
 *
 * Encapsulates data for updating an existing order.
 */
readonly class UpdateOrderData extends BaseData
{
    public function __construct(
        public ?OrderStatus $status = null,
        public ?array $shippingAddress = null,
        public ?string $notes = null,
        public ?string $trackingNumber = null,
        public ?string $adminNotes = null,
    ) {}

    /**
     * Check if any field has value to update.
     *
     * @return bool
     */
    public function hasChanges(): bool
    {
        return $this->status !== null
            || $this->shippingAddress !== null
            || $this->notes !== null
            || $this->trackingNumber !== null
            || $this->adminNotes !== null;
    }

    /**
     * Get only non-null fields for update.
     *
     * @return array
     */
    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
