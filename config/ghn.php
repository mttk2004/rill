<?php

return [
    /*
    |--------------------------------------------------------------------------
    | GHN (Giao Hàng Nhanh) API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for GHN shipping integration
    |
    */

    'api_token' => env('GHN_API_TOKEN'),
    'shop_id' => env('GHN_SHOP_ID'),
    'shop_district_id' => env('GHN_SHOP_DISTRICT_ID'),
    'shop_ward_code' => env('GHN_SHOP_WARD_CODE'),

    // GHN API Base URL
    'api_url' => 'https://online-gateway.ghn.vn/shiip/public-api',

    // Cache duration for GHN API responses (in seconds)
    'cache_ttl' => 86400, // 24 hours
];
