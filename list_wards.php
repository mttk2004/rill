<?php

/**
 * Script to list all wards for manual matching
 */

require __DIR__ . '/vendor/autoload.php';

$token = env('GHN_API_TOKEN');
if (!$token) {
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

$apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api';

// Districts we need
$districts = [
    1442 => 'Quận 1 (TPHCM)',
    1447 => 'Quận 7 (TPHCM)',
    1451 => 'Ba Đình (HN)',
    1458 => 'Thanh Xuân (HN)',
];

foreach ($districts as $districtId => $districtName) {
    echo "\n=== $districtName (ID: $districtId) ===\n";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => "{$apiUrl}/master-data/ward?district_id={$districtId}",
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
            foreach ($data['data'] as $ward) {
                echo "'{$ward['WardName']}' => '{$ward['WardCode']}',\n";
            }
        }
    }

    usleep(200000);
}
