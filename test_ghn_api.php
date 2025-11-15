<?php

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$token = $_ENV['GHN_API_TOKEN'];
$shopId = $_ENV['GHN_SHOP_ID'];
$fromDistrictId = $_ENV['GHN_SHOP_DISTRICT_ID'];
$fromWardCode = $_ENV['GHN_SHOP_WARD_CODE'];

echo "=== Testing GHN API ===\n";
echo "Token: " . substr($token, 0, 10) . "...\n";
echo "Shop ID: {$shopId}\n";
echo "From District: {$fromDistrictId}\n";
echo "From Ward: {$fromWardCode}\n\n";

// Test 1: Get available services
echo "Test 1: Get available services (to District 1442 - Q1 TPHCM)\n";
$ch = curl_init('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Skip SSL verification
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Token: ' . $token,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'shop_id' => (int) $shopId,
    'from_district' => (int) $fromDistrictId,
    'to_district' => 1442,
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: {$httpCode}\n";
if ($error) {
    echo "cURL Error: {$error}\n";
}
$data = json_decode($response, true);
print_r($data);

if (isset($data['data']) && !empty($data['data'])) {
    $serviceId = $data['data'][0]['service_id'];
    echo "\nTest 2: Calculate shipping fee with service_id: {$serviceId}\n";

    // Test 2: Calculate fee
    $ch = curl_init('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Skip SSL verification
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Token: ' . $token,
        'ShopId: ' . $shopId,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'from_district_id' => (int) $fromDistrictId,
        'from_ward_code' => $fromWardCode,
        'to_district_id' => 1442,
        'to_ward_code' => '20308', // Phường Bến Nghé, Q1
        'service_id' => $serviceId,
        'insurance_value' => 500000,
        'weight' => 500,
        'length' => 35,
        'width' => 35,
        'height' => 3,
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    echo "HTTP Code: {$httpCode}\n";
    if ($error) {
        echo "cURL Error: {$error}\n";
    }
    $data = json_decode($response, true);
    print_r($data);
} else {
    echo "\nNo services available, cannot test fee calculation\n";
}
