<?php

namespace App\DataObjects\Voucher;

use App\DataObjects\BaseData;
use InvalidArgumentException;

/**
 * Voucher Data DTO
 *
 * Represents voucher data for create/update operations.
 */
class VoucherData extends BaseData
{
    public function __construct(
        public readonly string $code,
        public readonly string $type,
        public readonly float $value,
        public readonly \DateTime $validFrom,
        public readonly \DateTime $validTo,
        public readonly ?float $minimumAmount = null,
        public readonly ?int $usageLimit = null,
        public readonly ?int $usageLimitPerUser = null,
        public readonly ?string $description = null,
        public readonly bool $isActive = true
    ) {
        $this->validate();
    }

    /**
     * Validate voucher data.
     *
     * @throws InvalidArgumentException
     */
    protected function validate(): void
    {
        if (empty(trim($this->code))) {
            throw new InvalidArgumentException('Voucher code cannot be empty');
        }

        if (!in_array($this->type, ['percentage', 'fixed'])) {
            throw new InvalidArgumentException('Voucher type must be percentage or fixed');
        }

        if ($this->value <= 0) {
            throw new InvalidArgumentException('Voucher value must be greater than 0');
        }

        if ($this->type === 'percentage' && $this->value > 100) {
            throw new InvalidArgumentException('Percentage voucher value cannot exceed 100');
        }

        if ($this->validFrom >= $this->validTo) {
            throw new InvalidArgumentException('Valid from date must be before valid to date');
        }

        if ($this->minimumAmount !== null && $this->minimumAmount < 0) {
            throw new InvalidArgumentException('Minimum amount cannot be negative');
        }

        if ($this->usageLimit !== null && $this->usageLimit <= 0) {
            throw new InvalidArgumentException('Usage limit must be greater than 0');
        }

        if ($this->usageLimitPerUser !== null && $this->usageLimitPerUser <= 0) {
            throw new InvalidArgumentException('Usage limit per user must be greater than 0');
        }
    }

    /**
     * Convert to array for database operations.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'code' => $this->code,
            'type' => $this->type,
            'value' => $this->value,
            'valid_from' => $this->validFrom,
            'valid_to' => $this->validTo,
            'minimum_amount' => $this->minimumAmount,
            'usage_limit' => $this->usageLimit,
            'usage_limit_per_user' => $this->usageLimitPerUser,
            'description' => $this->description,
            'is_active' => $this->isActive,
        ];
    }

    /**
     * Create VoucherData from request data.
     *
     * @param \Illuminate\Http\Request $request
     * @return static
     */
    public static function fromRequest(\Illuminate\Http\Request $request): static
    {
        $data = $request->all();
        return new self(
            code: strtoupper(trim($data['code'])),
            type: $data['type'],
            value: (float) $data['value'],
            validFrom: new \DateTime($data['valid_from']),
            validTo: new \DateTime($data['valid_to']),
            minimumAmount: isset($data['minimum_amount']) ? (float) $data['minimum_amount'] : null,
            usageLimit: isset($data['usage_limit']) ? (int) $data['usage_limit'] : null,
            usageLimitPerUser: isset($data['usage_limit_per_user']) ? (int) $data['usage_limit_per_user'] : null,
            description: $data['description'] ?? null,
            isActive: $data['is_active'] ?? true
        );
    }
}
