<?php

namespace App\Actions\Shipping;

use App\DataObjects\Shipping\ShippingCalculationData;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Action to calculate shipping fee via GHN API
 */
class CalculateShippingFeeAction
{
    private const DEFAULT_FEE = 50000; // Default fallback fee in VND

    public function __construct(
        private string $token,
        private int $shopId,
        private int $fromDistrictId,
        private string $fromWardCode,
        private string $apiUrl,
    ) {}

    /**
     * Calculate shipping fee using GHN API
     */
    public function execute(ShippingCalculationData $data, int $serviceId): ServiceResult
    {
        // Validate data
        $validationErrors = $data->validate();
        if (!empty($validationErrors)) {
            return ServiceResult::error(
                'Dữ liệu tính phí không hợp lệ',
                ['validation_errors' => $validationErrors],
            );
        }

        try {
            $requestData = $data->toGhnRequest(
                $this->fromDistrictId,
                $this->fromWardCode,
                $serviceId,
            );

            $response = Http::withoutVerifying()->withHeaders([
                'Token' => $this->token,
                'ShopId' => $this->shopId,
            ])->post("{$this->apiUrl}/v2/shipping-order/fee", $requestData);

            if ($response->successful() && isset($response->json('data')['total'])) {
                $fee = (int) $response->json('data')['total'];

                Log::info('GHN fee calculated successfully', [
                    'fee' => $fee,
                    'service_id' => $serviceId,
                    'to_district' => $data->toDistrictId,
                ]);

                return ServiceResult::success([
                    'fee' => $fee,
                    'service_id' => $serviceId,
                ]);
            }

            Log::error('GHN fee calculation failed', [
                'request' => $requestData,
                'response' => $response->json(),
                'status' => $response->status(),
            ]);

            // Return default fee on API failure
            return ServiceResult::success([
                'fee' => self::DEFAULT_FEE,
                'service_id' => $serviceId,
                'is_fallback' => true,
            ], 'Sử dụng phí vận chuyển mặc định do lỗi API');

        } catch (\Exception $e) {
            Log::error('Exception calculating shipping fee', [
                'message' => $e->getMessage(),
                'data' => $data,
            ]);

            // Return default fee on exception
            return ServiceResult::success([
                'fee' => self::DEFAULT_FEE,
                'service_id' => $serviceId,
                'is_fallback' => true,
            ], 'Sử dụng phí vận chuyển mặc định do lỗi hệ thống');
        }
    }
}
