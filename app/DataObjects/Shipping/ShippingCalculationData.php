<?php

namespace App\DataObjects\Shipping;

use App\DataObjects\BaseData;
use App\Models\ShippingAddress;

/**
 * DTO for shipping fee calculation data
 */
readonly class ShippingCalculationData extends BaseData
{
    public function __construct(
        public int $toDistrictId,
        public string $toWardCode,
        public int $cartTotalInVND,
        public int $totalWeight = 1000,
        public int $length = 35,
        public int $width = 35,
        public int $height = 3,
    ) {}

    /**
     * Validate the shipping calculation data
     */
    public function validate(): array
    {
        $errors = [];

        if ($this->toDistrictId <= 0) {
            $errors['toDistrictId'] = 'District ID must be positive';
        }

        if (empty($this->toWardCode)) {
            $errors['toWardCode'] = 'Ward code is required';
        }

        if ($this->cartTotalInVND < 0) {
            $errors['cartTotalInVND'] = 'Cart total cannot be negative';
        }

        if ($this->totalWeight <= 0) {
            $errors['totalWeight'] = 'Weight must be positive';
        }

        if ($this->length <= 0 || $this->width <= 0 || $this->height <= 0) {
            $errors['dimensions'] = 'Dimensions must be positive';
        }

        return $errors;
    }

    /**
     * Create from ShippingAddress and cart data
     */
    public static function fromAddress(
        ShippingAddress $address,
        int $cartTotalInVND,
        int $totalWeight = 1000,
    ): self {
        return new self(
            toDistrictId: (int) $address->district_id,
            toWardCode: $address->ward_id,
            cartTotalInVND: $cartTotalInVND,
            totalWeight: $totalWeight,
            // Standard vinyl record dimensions: 35x35x3 cm
            length: 35,
            width: 35,
            height: 3,
        );
    }

    /**
     * Convert to GHN API request format
     */
    public function toGhnRequest(int $fromDistrictId, string $fromWardCode, int $serviceId): array
    {
        return [
            'from_district_id' => $fromDistrictId,
            'from_ward_code' => $fromWardCode,
            'to_district_id' => $this->toDistrictId,
            'to_ward_code' => $this->toWardCode,
            'service_id' => $serviceId,
            'insurance_value' => $this->cartTotalInVND,
            'weight' => $this->totalWeight,
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }
}
