<?php

/**
 * Script to verify best seller data consistency across:
 * 1. Admin Dashboard (/admin/dashboard) - ProductAnalyticsService::getTopProducts()
 * 2. Home Page (/) - HomeController with BestSellerService
 * 3. Product List (/products) - ProductService with BestSellerService (default sort)
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\Dashboard\ProductAnalyticsService;
use App\Services\BestSellerService;
use App\Services\ProductService;
use App\Models\Product;

echo "=== CHECKING BEST SELLER DATA CONSISTENCY ===\n\n";

// 1. Admin Dashboard - ProductAnalyticsService::getTopProducts()
echo "1️⃣  ADMIN DASHBOARD (/admin/dashboard)\n";
echo "   Using: ProductAnalyticsService::getTopProducts()\n";
echo "   " . str_repeat("-", 70) . "\n";

$analyticsService = new ProductAnalyticsService();
$dashboardProducts = $analyticsService->getTopProducts(5);

foreach ($dashboardProducts as $index => $product) {
    $productData = is_array($product) ? (object)$product : $product;
    echo sprintf(
        "   #%d: %-40s | Sold: %4d | Revenue: %10s\n",
        $index + 1,
        substr($productData->name, 0, 40),
        $productData->sales ?? $productData->total_sold ?? 0,
        number_format($productData->revenue ?? $productData->total_revenue ?? 0, 0) . ' ₫'
    );
}
echo "\n";

// 2. Home Page - HomeController with BestSellerService
echo "2️⃣  HOME PAGE (/)\n";
echo "   Using: BestSellerService::applyBestSellerScope()\n";
echo "   " . str_repeat("-", 70) . "\n";

$homeQuery = Product::query()->active()->with('artists');
BestSellerService::applyBestSellerScope($homeQuery);
$homeProducts = $homeQuery->take(5)->get();

foreach ($homeProducts as $index => $product) {
    echo sprintf(
        "   #%d: %-40s | Sold: %4d\n",
        $index + 1,
        substr($product->name, 0, 40),
        $product->total_sold ?? 0
    );
}
echo "\n";

// 3. Product List - ProductService with default sort
echo "3️⃣  PRODUCT LIST (/products?sort=default)\n";
echo "   Using: ProductService with sort='default'\n";
echo "   " . str_repeat("-", 70) . "\n";

$productService = new ProductService();
$filters = ['sort' => 'default', 'per_page' => 5];
$productListResult = $productService->getProducts($filters);
$productListProducts = collect($productListResult['products']);

foreach ($productListProducts as $index => $product) {
    $productData = is_array($product) ? (object)$product : $product;
    echo sprintf(
        "   #%d: %-40s | Sold: %4d\n",
        $index + 1,
        substr($productData->name, 0, 40),
        $productData->total_sold ?? 0
    );
}
echo "\n";

// Verification
echo "=== VERIFICATION ===\n\n";

$dashboard_ids = collect($dashboardProducts)->pluck('id')->toArray();
$home_ids = $homeProducts->pluck('id')->toArray();
$product_ids = $productListProducts->pluck('id')->toArray();

$dashboard_top3 = array_slice($dashboard_ids, 0, 3);
$home_top3 = array_slice($home_ids, 0, 3);
$product_top3 = array_slice($product_ids, 0, 3);

echo "Top 3 Product IDs:\n";
echo "  Dashboard: " . implode(', ', $dashboard_top3) . "\n";
echo "  Home:      " . implode(', ', $home_top3) . "\n";
echo "  Products:  " . implode(', ', $product_top3) . "\n\n";

if ($dashboard_top3 === $home_top3 && $home_top3 === $product_top3) {
    echo "✅ SUCCESS: Top 3 products are CONSISTENT across all pages!\n";
} else {
    echo "❌ FAILED: Top 3 products are INCONSISTENT!\n\n";

    if ($dashboard_top3 !== $home_top3) {
        echo "   ⚠️  Dashboard vs Home: DIFFERENT\n";
    }
    if ($home_top3 !== $product_top3) {
        echo "   ⚠️  Home vs Products: DIFFERENT\n";
    }
    if ($dashboard_top3 !== $product_top3) {
        echo "   ⚠️  Dashboard vs Products: DIFFERENT\n";
    }
}

echo "\n";

// Show cancelled orders count for verification
echo "=== CANCELLED ORDERS INFO ===\n";
$cancelledCount = \DB::table('orders')
    ->where('status', \App\Enums\OrderStatus::CANCELLED->value)
    ->count();

$cancelledItemsCount = \DB::table('order_items')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.status', \App\Enums\OrderStatus::CANCELLED->value)
    ->count();

$cancelledItemsQty = \DB::table('order_items')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.status', \App\Enums\OrderStatus::CANCELLED->value)
    ->sum('order_items.quantity');

echo "  Cancelled Orders: {$cancelledCount}\n";
echo "  Cancelled Order Items: {$cancelledItemsCount}\n";
echo "  Cancelled Items Quantity: {$cancelledItemsQty}\n";
echo "  These should be EXCLUDED from best seller calculations.\n";

echo "\n=== END ===\n";
