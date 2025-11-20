<?php

namespace App\Services;

use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingService
{
    protected $token;
    protected $shopId;
    protected $fromDistrictId;
    protected $fromWardCode;
    protected $apiUrl;
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
        $this->token = config('ghn.api_token');
        $this->shopId = config('ghn.shop_id');
        $this->fromDistrictId = (int) config('ghn.shop_district_id');
        $this->fromWardCode = config('ghn.shop_ward_code');
        $this->apiUrl = config('ghn.api_url');
    }

    /**
     * Calculate shipping fee based on address and cart total.
     * Free shipping for orders >= dynamic threshold from settings
     *
     * @param ShippingAddress $toAddress
     * @param int $cartTotalInVND
     * @param int $totalWeight Weight in grams (default: 1000g per item)
     * @return int Shipping fee in VND
     */
    public function calculateFee(
        ShippingAddress $toAddress,
        int $cartTotalInVND,
        int $totalWeight = 1000
    ): int {
        // Get dynamic free shipping threshold from settings
        $freeShippingThreshold = $this->settingService->get('shipping_free_threshold', 1000000);

        if ($cartTotalInVND >= $freeShippingThreshold) {
            return 0;
        }

        try {
            // Check if ward_id exists
            if (empty($toAddress->ward_id)) {
                Log::warning('Ward ID is missing for address', [
                    'address_id' => $toAddress->id,
                    'district_id' => $toAddress->district_id,
                    'ward' => $toAddress->ward
                ]);
                return 50000; // Default fallback fee
            }

            // Get available service ID for this route
            $serviceId = $this->getAvailableServiceId((int) $toAddress->district_id);

            if (!$serviceId) {
                Log::warning('No GHN service available for district', [
                    'district_id' => $toAddress->district_id
                ]);
                return 50000; // Default fallback fee
            }

            // Standard vinyl record dimensions: 35x35x3 cm
            $requestData = [
                'from_district_id' => $this->fromDistrictId,
                'from_ward_code' => $this->fromWardCode,
                'to_district_id' => (int) $toAddress->district_id,
                'to_ward_code' => $toAddress->ward_id,
                'service_id' => $serviceId,
                'insurance_value' => $cartTotalInVND,
                'weight' => $totalWeight,
                'length' => 35,
                'width' => 35,
                'height' => 3,
            ];

            $response = Http::withoutVerifying()->withHeaders([
                'Token' => $this->token,
                'ShopId' => $this->shopId,
            ])->post("{$this->apiUrl}/v2/shipping-order/fee", $requestData);

            if ($response->successful() && isset($response->json('data')['total'])) {
                $fee = (int) $response->json('data')['total'];
                Log::info('GHN fee calculated successfully', [
                    'fee' => $fee,
                    'service_id' => $serviceId,
                    'to_district' => $toAddress->district_id
                ]);
                return $fee;
            }

            Log::error('GHN fee calculation failed', [
                'request' => $requestData,
                'response' => $response->json(),
                'status' => $response->status()
            ]);

            return 50000; // Default fallback fee

        } catch (\Exception $e) {
            Log::error('Exception calculating shipping fee', [
                'message' => $e->getMessage(),
                'address_id' => $toAddress->id
            ]);
            return 50000; // Default fallback fee
        }
    }

    /**
     * Get available service ID for the route.
     * Prioritizes standard shipping (service_type_id = 2)
     *
     * @param int $toDistrictId
     * @return int|null Service ID
     */
    protected function getAvailableServiceId(int $toDistrictId): ?int
    {
        $cacheKey = "ghn_service_{$this->fromDistrictId}_{$toDistrictId}";

        return Cache::remember($cacheKey, config('ghn.cache_ttl'), function () use ($toDistrictId) {
            try {
                $response = Http::withoutVerifying()->withHeaders([
                    'Token' => $this->token,
                ])->post("{$this->apiUrl}/v2/shipping-order/available-services", [
                    'shop_id' => (int) $this->shopId,
                    'from_district' => $this->fromDistrictId,
                    'to_district' => $toDistrictId,
                ]);

                if ($response->successful() && !empty($response->json('data'))) {
                    $services = $response->json('data');

                    // Prioritize standard shipping (service_type_id = 2)
                    foreach ($services as $service) {
                        if (isset($service['service_type_id']) && $service['service_type_id'] == 2) {
                            return $service['service_id'];
                        }
                    }

                    // If no standard service, return first available
                    return $services[0]['service_id'] ?? null;
                }

                Log::error('Failed to get available services', [
                    'response' => $response->json(),
                    'to_district_id' => $toDistrictId
                ]);

                return null;

            } catch (\Exception $e) {
                Log::error('Exception getting available services', [
                    'message' => $e->getMessage(),
                    'to_district_id' => $toDistrictId
                ]);
                return null;
            }
        });
    }

    /**
     * Estimate package weight based on cart items count
     * Fixed: 1000g (1kg) for all orders (for testing purposes)
     *
     * @param int $itemsCount
     * @return int Weight in grams
     */
    public function estimateWeight(int $itemsCount): int
    {
        return 1000; // Fixed 1kg for all orders
    }
}
