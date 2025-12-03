<?php

namespace App\Services;

use App\Actions\Shipping\CalculateShippingFeeAction;
use App\Actions\Shipping\GetAvailableServiceAction;
use App\DataObjects\Shipping\ShippingCalculationData;
use App\Models\ShippingAddress;
use App\Support\ServiceResult;

/**
 * Refactored shipping service with Clean Architecture
 */
class ShippingServiceRefactored
{
    private GetAvailableServiceAction $getServiceAction;
    private CalculateShippingFeeAction $calculateFeeAction;
    private int $freeShippingThreshold;

    public function __construct(
        private SettingServiceRefactored $settingService,
    ) {
        // Initialize GHN configuration
        $token = config('ghn.api_token');
        $shopId = (int) config('ghn.shop_id');
        $fromDistrictId = (int) config('ghn.shop_district_id');
        $fromWardCode = config('ghn.shop_ward_code');
        $apiUrl = config('ghn.api_url');

        // Initialize actions
        $this->getServiceAction = new GetAvailableServiceAction(
            token: $token,
            shopId: $shopId,
            fromDistrictId: $fromDistrictId,
            apiUrl: $apiUrl,
        );

        $this->calculateFeeAction = new CalculateShippingFeeAction(
            token: $token,
            shopId: $shopId,
            fromDistrictId: $fromDistrictId,
            fromWardCode: $fromWardCode,
            apiUrl: $apiUrl,
        );

        // Get free shipping threshold from settings
        $threshold = $this->settingService->get('shipping_free_threshold', 1000000);
        $this->freeShippingThreshold = (int) $threshold;
    }

    /**
     * Calculate shipping fee based on address and cart total.
     * Free shipping for orders >= threshold from settings
     */
    public function calculateFee(
        ShippingAddress $toAddress,
        int $cartTotalInVND,
        int $totalWeight = 1000,
    ): ServiceResult {
        // Check for free shipping
        if ($cartTotalInVND >= $this->freeShippingThreshold) {
            return ServiceResult::success([
                'fee' => 0,
                'is_free_shipping' => true,
                'threshold' => $this->freeShippingThreshold,
            ], 'Miễn phí vận chuyển');
        }

        // Validate ward_id exists
        if (empty($toAddress->ward_id)) {
            return ServiceResult::error(
                'Địa chỉ thiếu mã phường/xã',
                ['address_id' => $toAddress->id],
            );
        }

        // Get available service ID for this route
        $serviceResult = $this->getServiceAction->execute((int) $toAddress->district_id);

        if (!$serviceResult->success) {
            // Return default fee if no service available
            return ServiceResult::success([
                'fee' => 50000,
                'is_fallback' => true,
            ], 'Sử dụng phí vận chuyển mặc định');
        }

        $serviceId = $serviceResult->data['service_id'];

        // Create shipping calculation data
        $calculationData = ShippingCalculationData::fromAddress(
            address: $toAddress,
            cartTotalInVND: $cartTotalInVND,
            totalWeight: $totalWeight,
        );

        // Calculate fee using GHN API
        return $this->calculateFeeAction->execute($calculationData, $serviceId);
    }

    /**
     * Estimate package weight based on cart items count
     * Fixed: 1000g (1kg) for all orders (for testing purposes)
     */
    public function estimateWeight(int $itemsCount): int
    {
        return 1000; // Fixed 1kg for all orders
    }

    /**
     * Get free shipping threshold
     */
    public function getFreeShippingThreshold(): int
    {
        return $this->freeShippingThreshold;
    }
}
