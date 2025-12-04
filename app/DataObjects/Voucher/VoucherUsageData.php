<?php

namespace App\DataObjects\Voucher;

use App\DataObjects\BaseData;

/**
 * Voucher Usage Data DTO
 *
 * Represents data for recording voucher usage.
 */
readonly class VoucherUsageData extends BaseData
{
    public function __construct(
        public readonly int $voucherId,
        public readonly int $userId,
        public readonly int $orderId,
        public readonly float $discountAmount
    ) {}

    /**
     * Convert to array for database operations.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'voucher_id' => $this->voucherId,
            'user_id' => $this->userId,
            'order_id' => $this->orderId,
            'discount_amount' => $this->discountAmount,
            'used_at' => now(),
        ];
    }
}
