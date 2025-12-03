<?php

namespace App\Actions\Shipping;

use App\DataObjects\Shipping\ShippingCalculationData;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Action to get available GHN shipping service for a route
 */
class GetAvailableServiceAction
{
    public function __construct(
        private string $token,
        private int $shopId,
        private int $fromDistrictId,
        private string $apiUrl,
    ) {}

    /**
     * Get available service ID for the route.
     * Prioritizes standard shipping (service_type_id = 2)
     */
    public function execute(int $toDistrictId): ServiceResult
    {
        $cacheKey = "ghn_service_{$this->fromDistrictId}_{$toDistrictId}";

        try {
            $serviceId = Cache::remember($cacheKey, config('ghn.cache_ttl'), function () use ($toDistrictId) {
                return $this->fetchAvailableService($toDistrictId);
            });

            if (!$serviceId) {
                Log::warning('No GHN service available for district', [
                    'from_district' => $this->fromDistrictId,
                    'to_district' => $toDistrictId,
                ]);

                return ServiceResult::error(
                    'Không có dịch vụ vận chuyển khả dụng cho tuyến đường này',
                    ['code' => 'NO_SERVICE_AVAILABLE'],
                );
            }

            return ServiceResult::success(['service_id' => $serviceId]);

        } catch (\Exception $e) {
            Log::error('Exception getting available services', [
                'message' => $e->getMessage(),
                'to_district_id' => $toDistrictId,
            ]);

            return ServiceResult::error(
                'Lỗi khi lấy dịch vụ vận chuyển: ' . $e->getMessage(),
                ['code' => 'SERVICE_LOOKUP_FAILED'],
            );
        }
    }

    /**
     * Fetch available service from GHN API
     */
    private function fetchAvailableService(int $toDistrictId): ?int
    {
        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $this->token,
        ])->post("{$this->apiUrl}/v2/shipping-order/available-services", [
            'shop_id' => $this->shopId,
            'from_district' => $this->fromDistrictId,
            'to_district' => $toDistrictId,
        ]);

        if (!$response->successful() || empty($response->json('data'))) {
            Log::error('Failed to get available services', [
                'response' => $response->json(),
                'to_district_id' => $toDistrictId,
            ]);
            return null;
        }

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
}
