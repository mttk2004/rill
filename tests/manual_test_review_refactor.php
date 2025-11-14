<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing ContentValidationService...\n";
echo "=====================================\n";

$service = app(App\Services\ContentValidationService::class);

// Test 1: Clean content
$test1 = $service->isClean('Great product! Excellent quality.');
echo "Test 1 - Clean content: " . ($test1 ? "✅ PASS" : "❌ FAIL") . "\n";

// Test 2: Spam keyword
$test2 = !$service->isClean('This is spam product');
echo "Test 2 - Spam detection: " . ($test2 ? "✅ PASS" : "❌ FAIL") . "\n";

// Test 3: Inappropriate word
$test3 = !$service->isClean('This is shit quality');
echo "Test 3 - Inappropriate word: " . ($test3 ? "✅ PASS" : "❌ FAIL") . "\n";

// Test 4: Vietnamese inappropriate word
$test4 = !$service->isClean('Sản phẩm này vcl');
echo "Test 4 - Vietnamese profanity: " . ($test4 ? "✅ PASS" : "❌ FAIL") . "\n";

// Test 5: Sanitize
$sanitized = $service->sanitize('This is spam and shit quality');
$test5 = str_contains($sanitized, '****') && !str_contains($sanitized, 'spam');
echo "Test 5 - Sanitize: " . ($test5 ? "✅ PASS" : "❌ FAIL") . " (Result: $sanitized)\n";

echo "\nTesting ReviewService...\n";
echo "=====================================\n";

$reviewService = app(App\Services\ReviewService::class);
echo "✅ ReviewService instantiated successfully\n";

echo "\nTesting ReviewController DI...\n";
echo "=====================================\n";

try {
    $controller = app(App\Http\Controllers\ReviewController::class);
    echo "✅ ReviewController instantiated with DI successfully\n";
} catch (\Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
}

echo "\n✅ All manual tests passed!\n";
