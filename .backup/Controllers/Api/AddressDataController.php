<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    public function getDistricts(Request $request): JsonResponse
    {
        $request->validate([
            'province_id' => 'required|integer',
        ]);

        $districts = $this->ghnService->getDistricts($request->input('province_id'));

        return response()->json([
            'success' => true,
            'data' => $districts,
        ]);
    }

    /**
     * Get wards by district_id
     */
    public function getWards(Request $request): JsonResponse
    {
        $request->validate([
            'district_id' => 'required|integer',
        ]);

        $wards = $this->ghnService->getWards($request->input('district_id'));

        return response()->json([
            'success' => true,
            'data' => $wards,
        ]);
    }
}
