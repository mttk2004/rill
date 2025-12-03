<?php

namespace App\DataObjects\Address;

use App\DataObjects\BaseData;
use Illuminate\Http\Request;
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
     * @param Request $request
     * @return static
     */
    public static function fromRequest(Request $request): static
    {
        return new static(
            recipientName: trim($request->input('recipient_name', '')),
            phoneNumber: trim($request->input('phone_number', '')),
            address: trim($request->input('address', '')),
            ward: trim($request->input('ward', '')),
            district: trim($request->input('district', '')),
            province: trim($request->input('province', '')),
            isDefault: $request->boolean('is_default', false)
        );
    }
}
