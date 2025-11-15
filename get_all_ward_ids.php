<?php

/**
 * Script to fetch ward_id for all addresses in ShippingAddressSeeder
 * This helps ensure all addresses have valid ward_id for GHN API
 */

require __DIR__ . '/vendor/autoload.php';

$token = env('GHN_API_TOKEN');
if (!$token) {
    // Fallback: read from .env manually
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, 'GHN_API_TOKEN=') === 0) {
                $token = trim(str_replace('GHN_API_TOKEN=', '', $line));
                break;
            }
        }
    }
}

if (!$token) {
    die("GHN_API_TOKEN not found in .env file\n");
}

$apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api';

// All districts from seeder
$addresses = [
    // Hà Nội addresses
    ['district_id' => 1451, 'district' => 'Ba Đình', 'ward' => 'Phường Ngọc Khánh'],
    ['district_id' => 1452, 'district' => 'Đống Đa', 'ward' => 'Phường Kim Liên'],
    ['district_id' => 1458, 'district' => 'Thanh Xuân', 'ward' => 'Phường Thanh Xuân Trung'],
    ['district_id' => 1453, 'district' => 'Hai Bà Trưng', 'ward' => 'Phường Bạch Đằng'],
    ['district_id' => 1452, 'district' => 'Đống Đa', 'ward' => 'Phường Thành Công'],
    ['district_id' => 1454, 'district' => 'Long Biên', 'ward' => 'Phường Việt Hưng'],
    ['district_id' => 1455, 'district' => 'Nam Từ Liêm', 'ward' => 'Phường Mễ Trì'],
    ['district_id' => 1452, 'district' => 'Đống Đa', 'ward' => 'Phường Láng Thượng'],
    ['district_id' => 1450, 'district' => 'Hoàn Kiếm', 'ward' => 'Phường Tràng Tiền'],
    ['district_id' => 1458, 'district' => 'Thanh Xuân', 'ward' => 'Phường Khương Mai'],
    ['district_id' => 1452, 'district' => 'Đống Đa', 'ward' => 'Phường Hàng Bột'],

    // TP.HCM addresses
    ['district_id' => 1447, 'district' => 'Quận 7', 'ward' => 'Phường Tân Phú'],
    ['district_id' => 1445, 'district' => 'Quận 5', 'ward' => 'Phường 14'],
    ['district_id' => 1449, 'district' => 'Quận 9', 'ward' => 'Phường Tăng Nhơn Phú A'],
    ['district_id' => 1442, 'district' => 'Quận 1', 'ward' => 'Phường Bến Nghé'],
    ['district_id' => 1443, 'district' => 'Quận 3', 'ward' => 'Phường 6'],
    ['district_id' => 1463, 'district' => 'Quận 2', 'ward' => 'Phường Thảo Điền'],
    ['district_id' => 1443, 'district' => 'Quận 3', 'ward' => 'Phường Võ Thị Sáu'],
    ['district_id' => 1450, 'district' => 'Quận 10', 'ward' => 'Phường 9'],

    // Hải Phòng addresses
    ['district_id' => 1721, 'district' => 'Ngô Quyền', 'ward' => 'Phường Máy Chai'],
    ['district_id' => 1717, 'district' => 'Hồng Bàng', 'ward' => 'Phường Phan Bội Châu'],

    // Đà Nẵng addresses
    ['district_id' => 1568, 'district' => 'Hải Châu', 'ward' => 'Phường Hải Châu 1'],
];

echo "Fetching ward IDs from GHN API...\n\n";

$results = [];
$uniqueDistricts = [];

foreach ($addresses as $address) {
    $key = $address['district_id'] . '_' . $address['ward'];

    // Skip if already processed
    if (isset($results[$key])) {
        continue;
    }

    // Fetch wards for this district (cache by district_id)
    if (!isset($uniqueDistricts[$address['district_id']])) {
        echo "Fetching wards for {$address['district']} (ID: {$address['district_id']})...\n";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => "{$apiUrl}/master-data/ward?district_id={$address['district_id']}",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => [
                'Token: ' . $token,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if (isset($data['data'])) {
                $uniqueDistricts[$address['district_id']] = $data['data'];
                echo "  ✓ Found " . count($data['data']) . " wards\n";
            }
        } else {
            echo "  ✗ Error: HTTP $httpCode\n";
            continue;
        }

        usleep(200000); // 200ms delay to avoid rate limiting
    }

    // Find matching ward
    $wards = $uniqueDistricts[$address['district_id']] ?? [];
    $wardId = null;

    foreach ($wards as $ward) {
        if (stripos($ward['WardName'], str_replace('Phường ', '', $address['ward'])) !== false) {
            $wardId = $ward['WardCode'];
            break;
        }
    }

    if ($wardId) {
        echo "  ✓ {$address['ward']}: {$wardId}\n";
    } else {
        echo "  ✗ {$address['ward']}: NOT FOUND\n";
    }

    $results[$key] = [
        'district_id' => $address['district_id'],
        'district' => $address['district'],
        'ward' => $address['ward'],
        'ward_id' => $wardId ?? 'NOT_FOUND',
    ];
}

echo "\n\n=== SUMMARY ===\n";
echo "Total unique addresses: " . count($results) . "\n";
echo "Found ward_id: " . count(array_filter($results, fn($r) => $r['ward_id'] !== 'NOT_FOUND')) . "\n";
echo "Not found: " . count(array_filter($results, fn($r) => $r['ward_id'] === 'NOT_FOUND')) . "\n";

echo "\n=== PHP ARRAY FOR SEEDER ===\n";
echo "[\n";
foreach ($results as $result) {
    if ($result['ward_id'] !== 'NOT_FOUND') {
        echo "    '{$result['ward']}' => '{$result['ward_id']}',\n";
    }
}
echo "]\n";
