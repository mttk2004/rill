<?php

namespace App\ValueObjects;

use InvalidArgumentException;

/**
 * Address Value Object
 *
 * Immutable value object representing a physical address.
 * Ensures address data integrity and consistency.
 */
readonly class Address
{
    public function __construct(
        public string $name,
        public string $phone,
        public string $address,
        public string $city,
        public string $district,
        public ?string $ward = null,
        public ?string $postalCode = null,
        public string $country = 'Vietnam'
    ) {
        $this->validate();
    }

    /**
     * Create from array data.
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new static(
            name: $data['name'] ?? '',
            phone: $data['phone'] ?? '',
            address: $data['address'] ?? '',
            city: $data['city'] ?? '',
            district: $data['district'] ?? '',
            ward: $data['ward'] ?? null,
            postalCode: $data['postal_code'] ?? null,
            country: $data['country'] ?? 'Vietnam'
        );
    }

    /**
     * Validate address data.
     *
     * @return void
     * @throws InvalidArgumentException
     */
    private function validate(): void
    {
        if (empty(trim($this->name))) {
            throw new InvalidArgumentException('Name is required');
        }

        if (empty(trim($this->phone))) {
            throw new InvalidArgumentException('Phone is required');
        }

        if (empty(trim($this->address))) {
            throw new InvalidArgumentException('Address is required');
        }

        if (empty(trim($this->city))) {
            throw new InvalidArgumentException('City is required');
        }

        if (empty(trim($this->district))) {
            throw new InvalidArgumentException('District is required');
        }

        // Validate phone format (basic Vietnamese phone validation)
        if (!preg_match('/^(\+84|0)[0-9]{9,10}$/', $this->phone)) {
            throw new InvalidArgumentException('Invalid phone number format');
        }
    }

    /**
     * Get full address as single line string.
     *
     * @return string
     */
    public function getFullAddress(): string
    {
        $parts = array_filter([
            $this->address,
            $this->ward,
            $this->district,
            $this->city,
            $this->country !== 'Vietnam' ? $this->country : null,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get formatted address for display.
     *
     * @return string
     */
    public function format(): string
    {
        return sprintf(
            "%s\n%s\nPhone: %s",
            $this->name,
            $this->getFullAddress(),
            $this->phone
        );
    }

    /**
     * Check if same as another address.
     *
     * @param Address $other
     * @return bool
     */
    public function equals(Address $other): bool
    {
        return $this->name === $other->name
            && $this->phone === $other->phone
            && $this->address === $other->address
            && $this->city === $other->city
            && $this->district === $other->district
            && $this->ward === $other->ward
            && $this->postalCode === $other->postalCode
            && $this->country === $other->country;
    }

    /**
     * Convert to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'district' => $this->district,
            'ward' => $this->ward,
            'postal_code' => $this->postalCode,
            'country' => $this->country,
            'full_address' => $this->getFullAddress(),
        ];
    }
}
