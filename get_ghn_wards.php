<?php

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$token = $_ENV['GHN_API_TOKEN'];

// Districts we need ward codes for
$districts = [
    1451 => 'Ba Đình',
    1452 => 'Đống Đa',
    1458 => 'Thanh Xuân',
    1453 => 'Hai Bà Trưng',
    1454 => 'Long Biên',
    1455 => 'Nam Từ Liêm',
    1450 => 'Hoàn Kiếm',
    1442 => 'Quận 1 TPHCM',
    1443 => 'Quận 3 TPHCM',
    1447 => 'Quận 7 TPHCM',
    1445 => 'Quận 5 TPHCM',
    1449 => 'Quận 9 TPHCM',
    1463 => 'Quận 2 TPHCM',
    1720 => 'Quận 10 TPHCM',
    1721 => 'Ngô Quyền Hải Phòng',
    1717 => 'Hồng Bàng Hải Phòng',
    1568 => 'Hải Châu Đà Nẵng',
];

echo "=== Getting Ward Codes from GHN API ===\n\n";

foreach ($districts as $districtId => $districtName) {
    echo "District: {$districtName} (ID: {$districtId})\n";

    $ch = curl_init('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Token: ' . $token,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'district_id' => (int) $districtId,
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200) {
        $data = json_decode($response, true);
        if (isset($data['data']) && !empty($data['data'])) {
            echo "First 5 wards:\n";
            foreach (array_slice($data['data'], 0, 5) as $ward) {
                echo "  - {$ward['WardName']} (Code: {$ward['WardCode']})\n";
            }
        }
    } else {
        echo "  Error: HTTP {$httpCode}\n";
    }

    echo "\n";
    sleep(1); // Avoid rate limiting
}
