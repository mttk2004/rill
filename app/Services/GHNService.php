<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GHNService
{
    private string $apiUrl;
    private string $token;
    private int $cacheTime = 86400; // 24 hours

    public function __construct()
    {
        $this->apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api/master-data';
        $this->token = config('services.ghn.token');
    }

    /**
     * Get all provinces from GHN API with caching
     */
    public function getProvinces(): array
    {
        return Cache::remember('ghn_provinces', $this->cacheTime, function () {
            try {
                $response = Http::withHeaders([
                    'Token' => $this->token,
                    'Content-Type' => 'application/json',
                ])
                ->withOptions([
                    'verify' => config('app.env') === 'production',
                ])
                ->get("{$this->apiUrl}/province");

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['code']) && $data['code'] == 200 && isset($data['data'])) {
                        return $data['data'];
                    }
                }

                Log::error('GHN API getProvinces failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('GHN API getProvinces exception', [
                    'message' => $e->getMessage(),
                ]);
                return [];
            }
        });
    }

    /**
     * Get districts by province_id from GHN API with caching
     */
    public function getDistricts(int $provinceId): array
    {
        return Cache::remember("ghn_districts_{$provinceId}", $this->cacheTime, function () use ($provinceId) {
            try {
                $response = Http::withHeaders([
                    'Token' => $this->token,
                    'Content-Type' => 'application/json',
                ])
                ->withOptions([
                    'verify' => config('app.env') === 'production',
                ])
                ->post("{$this->apiUrl}/district", [
                    'province_id' => $provinceId,
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['code']) && $data['code'] == 200 && isset($data['data'])) {
                        return $data['data'];
                    }
                }

                Log::error('GHN API getDistricts failed', [
                    'province_id' => $provinceId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('GHN API getDistricts exception', [
                    'province_id' => $provinceId,
                    'message' => $e->getMessage(),
                ]);
                return [];
            }
        });
    }

    /**
     * Get wards by district_id from GHN API with caching
     */
    public function getWards(int $districtId): array
    {
        return Cache::remember("ghn_wards_{$districtId}", $this->cacheTime, function () use ($districtId) {
            try {
                $response = Http::withHeaders([
                    'Token' => $this->token,
                    'Content-Type' => 'application/json',
                ])
                ->withOptions([
                    'verify' => config('app.env') === 'production',
                ])
                ->post("{$this->apiUrl}/ward", [
                    'district_id' => $districtId,
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['code']) && $data['code'] == 200 && isset($data['data'])) {
                        return $data['data'];
                    }
                }

                Log::error('GHN API getWards failed', [
                    'district_id' => $districtId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('GHN API getWards exception', [
                    'district_id' => $districtId,
                    'message' => $e->getMessage(),
                ]);
                return [];
            }
        });
    }
}
