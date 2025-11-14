<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Pagination Sizes
    |--------------------------------------------------------------------------
    |
    | Define default pagination sizes for different contexts throughout
    | the application to maintain consistency and avoid magic numbers.
    |
    */

    'default' => 15,

    // Frontend pagination
    'products' => 20,           // 5 columns × 4 rows
    'orders' => 10,             // User order history
    'featured_products' => 5,   // Homepage featured section

    // Admin pagination
    'admin' => [
        'default' => 15,
        'recent_items' => 10,    // Recent orders, activities, etc.
        'categories' => 20,      // Category listings
    ],

    // API pagination
    'api' => [
        'default' => 20,
        'max' => 100,
    ],
];
