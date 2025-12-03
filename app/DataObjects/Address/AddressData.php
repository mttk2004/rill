<?php

namespace App\DataObjects\Address;

use App\DataObjects\BaseData;
use InvalidArgumentException;

/**
 * Address Data DTO
 *
 * Represents shipping address data for create/update operations.
 */
class AddressData extends BaseData
{
    public function __construct(
        public readonly string $recipientName,
        public readonly string $phoneNumber,
        public readonly string $address,
        public readonly string $ward,
        public readonly string $district,
        public readonly string $province,
        public readonly bool $isDefault = false
    ) {
        $this->validate();
    }

    /**
     * Validate address data.
     *
     * @throws InvalidArgumentException
     */
    protected function validate(): void
    {
        if (empty(trim($this->recipientName))) {
            throw new InvalidArgumentException('Recipient name cannot be empty');
        }

        if (empty(trim($this->phoneNumber))) {
            throw new InvalidArgumentException('Phone number cannot be empty');
        }

        if (empty(trim($this->address))) {
            throw new InvalidArgumentException('Address cannot be empty');
        }

        if (empty(trim($this->ward))) {
            throw new InvalidArgumentException('Ward cannot be empty');
        }

        if (empty(trim($this->district))) {
            throw new InvalidArgumentException('District cannot be empty');
        }

        if (empty(trim($this->province))) {
            throw new InvalidArgumentException('Province cannot be empty');
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
            'recipient_name' => $this->recipientName,
            'phone_number' => $this->phoneNumber,
            'address' => $this->address,
            'ward' => $this->ward,
            'district' => $this->district,
            'province' => $this->province,
            'is_default' => $this->isDefault,
        ];
    }

    /**
     * Create AddressData from request data.
     *
     * @param array $data
     * @return self
     */
    public static function fromRequest(array $data): self
    {
        return new self(
            recipientName: trim($data['recipient_name']),
            phoneNumber: trim($data['phone_number']),
            address: trim($data['address']),
            ward: trim($data['ward']),
            district: trim($data['district']),
            province: trim($data['province']),
            isDefault: $data['is_default'] ?? false
        );
    }
}
