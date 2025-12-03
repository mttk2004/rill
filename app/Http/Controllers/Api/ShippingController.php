<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingAddress;
use App\Services\CartServiceRefactored;
use App\Services\SettingServiceRefactored;
use App\Services\ShippingServiceRefactored;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    /**
     * Calculate shipping fee based on selected address
     *
     * @param Request $request
     * @param CartServiceRefactored $cartService
     * @param ShippingServiceRefactored $shippingService
     * @param SettingServiceRefactored $settingService
     * @return \Illuminate\Http\JsonResponse
     */
    public function calculate(
        Request $request,
        CartServiceRefactored $cartService,
        ShippingServiceRefactored $shippingService,
        SettingServiceRefactored $settingService,
    ) {
        $request->validate([
            'address_id' => 'required|exists:shipping_addresses,id'
        ]);

        // Get the selected address (no user verification since it's public API)
        $address = ShippingAddress::findOrFail($request->address_id);

        // Get cart summary (CartService will use authenticated user if available)
        $cartSummary = $cartService->getCartSummary();
        $cartTotal = $cartSummary['total_amount'];
        $itemsCount = $cartSummary['total_items'];

        // DEBUG: Log cart info
        \Log::info('Shipping calculation request', [
            'address_id' => $request->address_id,
            'auth_user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'cart_total' => $cartTotal,
            'items_count' => $itemsCount,
            'is_free_shipping_threshold' => $cartTotal >= 1000000,
            'total_cart_items_in_db' => \App\Models\ShoppingCartItem::count(),
        ]);

        // Check if cart is empty
        if ($itemsCount === 0) {
            return response()->json([
                'shipping_fee' => 0,
                'is_free_shipping' => false,
                'cart_total' => 0,
                'total_amount' => 0,
            ]);
        }

        // Estimate weight based on items count
        $estimatedWeight = $shippingService->estimateWeight($itemsCount);

        // Calculate shipping fee
        $feeResult = $shippingService->calculateFee(
            $address,
            $cartTotal,
            $estimatedWeight,
        );

        // Handle calculation error (use default fee)
        $shippingFee = $feeResult->success ? $feeResult->data['fee'] : 50000;
        $isFreeShipping = $feeResult->data['is_free_shipping'] ?? false;

        // Get dynamic free shipping threshold
        $freeShippingThreshold = $shippingService->getFreeShippingThreshold();

        return response()->json([
            'shipping_fee' => $shippingFee,
            'is_free_shipping' => $isFreeShipping,
            'cart_total' => $cartTotal,
            'total_amount' => $cartTotal + $shippingFee,
        ]);
    }
}
