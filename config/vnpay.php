<?php
return [
    'tmn_code' => env('VNPAY_TMNCODE'),
    'hash_secret' => env('VNPAY_HASHSECRET'),
    'url' => env('VNPAY_URL'),
    'return_url' => env('VNPAY_RETURN_URL'),
    'ipn_url' => env('VNPAY_IPN_URL'),
];
