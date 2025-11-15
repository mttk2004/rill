<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\ShippingAddress;
use App\Models\User;
use App\Services\CartService;
use App\Services\ShippingService;

// Get a test user
$user = User::where('email', 'customer@rill.local')->first();
if (!$user) {
    echo "User not found!\n";
    exit(1);
}

// Login as this user to get their cart
Auth::login($user);

// Get cart service
$cartService = app(CartService::class);

// Get cart summary
$cartSummary = $cartService->getCartSummary();

echo "=== CART SUMMARY ===\n";
echo "Total items: {$cartSummary['total_items']}\n";
echo "Total amount: " . number_format($cartSummary['total_amount']) . " VND\n";
echo "Is free shipping? " . ($cartSummary['total_amount'] >= 1000000 ? 'YES' : 'NO') . "\n\n";

// Get test addresses
$addresses = ShippingAddress::where('user_id', $user->id)
    ->whereNotNull('ward_id')
    ->where('ward_id', '!=', '')
    ->get();

echo "=== ADDRESSES WITH WARD_ID ===\n";
foreach ($addresses as $address) {
    echo "- {$address->full_name} ({$address->district}, ward_id: {$address->ward_id})\n";
}
echo "\n";

if ($addresses->isEmpty()) {
    echo "No addresses with ward_id found!\n";
    exit(1);
}

// Test shipping fee calculation
$shippingService = app(ShippingService::class);
$testAddress = $addresses->first();

echo "=== TESTING SHIPPING FEE ===\n";
echo "Address: {$testAddress->full_name} - {$testAddress->district}\n";
echo "District ID: {$testAddress->district_id}\n";
echo "Ward ID: {$testAddress->ward_id}\n\n";

$estimatedWeight = $shippingService->estimateWeight($cartSummary['total_items']);
echo "Estimated weight: {$estimatedWeight}g\n";

$shippingFee = $shippingService->calculateFee(
    $testAddress,
    $cartSummary['total_amount'],
    $estimatedWeight
);

echo "Shipping fee: " . number_format($shippingFee) . " VND\n";
echo "Total with shipping: " . number_format($cartSummary['total_amount'] + $shippingFee) . " VND\n";
