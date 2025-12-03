<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\GetDistrictsRequest;
use App\Http\Requests\Api\GetWardsRequest;
use App\Services\GHNService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AddressDataController extends Controller
{
    private GHNService $ghnService;

    public function __construct(GHNService $ghnService)
    {
        $this->ghnService = $ghnService;
    }

    /**
     * Get all provinces
     */
    public function getProvinces(): JsonResponse
    {
        $provinces = $this->ghnService->getProvinces();

        return response()->json([
            'success' => true,
            'data' => $provinces,
        ]);
    }

    /**
     * Get districts by province_id
     */
    public function getDistricts(GetDistrictsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $districts = $this->ghnService->getDistricts($validated['province_id']);

        return response()->json([
            'success' => true,
            'data' => $districts,
        ]);
    }

    /**
     * Get wards by district_id
     */
    public function getWards(GetWardsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $wards = $this->ghnService->getWards($validated['district_id']);

        return response()->json([
            'success' => true,
            'data' => $wards,
        ]);
    }
}
