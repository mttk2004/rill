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
readonly class AddressData extends BaseData
{
    public function __construct(
        public readonly string $fullName,
        public readonly string $phone,
        public readonly string $addressLine1,
        public readonly ?string $addressLine2,
        public readonly string $province,
        public readonly int $provinceId,
        public readonly string $district,
        public readonly int $districtId,
        public readonly string $ward,
        public readonly string $wardId,
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
        if (empty(trim($this->fullName))) {
            throw new InvalidArgumentException('Full name cannot be empty');
        }

        if (empty(trim($this->phone))) {
            throw new InvalidArgumentException('Phone number cannot be empty');
        }

        if (empty(trim($this->addressLine1))) {
            throw new InvalidArgumentException('Address line 1 cannot be empty');
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
            'full_name' => $this->fullName,
            'phone' => $this->phone,
            'address_line_1' => $this->addressLine1,
            'address_line_2' => $this->addressLine2,
            'province' => $this->province,
            'province_id' => $this->provinceId,
            'district' => $this->district,
            'district_id' => $this->districtId,
            'ward' => $this->ward,
            'ward_id' => $this->wardId,
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
            fullName: trim($request->input('full_name', '')),
            phone: trim($request->input('phone', '')),
            addressLine1: trim($request->input('address_line_1', '')),
            addressLine2: $request->input('address_line_2'),
            province: trim($request->input('province', '')),
            provinceId: (int) $request->input('province_id', 0),
            district: trim($request->input('district', '')),
            districtId: (int) $request->input('district_id', 0),
            ward: trim($request->input('ward', '')),
            wardId: trim($request->input('ward_id', '')),
            isDefault: $request->boolean('is_default', false)
        );
    }
}
