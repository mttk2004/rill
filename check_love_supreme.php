<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$product = App\Models\Product::where('slug', 'a-love-supreme')->first();

if (!$product) {
    echo 'Product not found' . PHP_EOL;
    exit;
}

echo "Product: {$product->name} (ID: {$product->id})" . PHP_EOL;
echo "SKU: {$product->sku}" . PHP_EOL;
echo str_repeat('=', 60) . PHP_EOL;

// Get all order items for this product
$allOrderItems = App\Models\OrderItem::where('product_id', $product->id)
    ->with('order')
    ->get();

echo PHP_EOL . "TOTAL ORDER ITEMS: {$allOrderItems->count()}" . PHP_EOL;

if ($allOrderItems->count() > 0) {
    echo PHP_EOL . "All Orders:" . PHP_EOL;
    $totalAllQty = 0;
    foreach ($allOrderItems as $item) {
        $status = $item->order->status instanceof \App\Enums\OrderStatus
            ? $item->order->status->value
            : $item->order->status;
        echo "  - Order {$item->order->order_number} | Status: {$status} | Qty: {$item->quantity}" . PHP_EOL;
        $totalAllQty += $item->quantity;
    }
    echo "  Total Quantity (all statuses): {$totalAllQty}" . PHP_EOL;

    echo PHP_EOL . "Confirmed Orders Only (confirmed/processing/shipped/delivered):" . PHP_EOL;
    $confirmedItems = $allOrderItems->filter(function($item) {
        $status = $item->order->status instanceof \App\Enums\OrderStatus
            ? $item->order->status->value
            : $item->order->status;
        return in_array($status, ['confirmed', 'processing', 'shipped', 'delivered']);
    });

    echo "  Count: {$confirmedItems->count()}" . PHP_EOL;
    $totalConfirmedQty = $confirmedItems->sum('quantity');
    echo "  Total Quantity: {$totalConfirmedQty}" . PHP_EOL;

    if ($confirmedItems->count() > 0) {
        foreach ($confirmedItems as $item) {
            $status = $item->order->status instanceof \App\Enums\OrderStatus
                ? $item->order->status->value
                : $item->order->status;
            echo "    - Order {$item->order->order_number} | Status: {$status} | Qty: {$item->quantity}" . PHP_EOL;
        }
    }
}

echo PHP_EOL . str_repeat('=', 60) . PHP_EOL;
echo "Product Accessor (total_sold): {$product->total_sold}" . PHP_EOL;

// Test with loadSum
$product->loadSum([
    'orderItems as order_items_sum_quantity' => function ($query) {
        $query->whereHas('order', function ($q) {
            $q->whereIn('status', ['confirmed', 'processing', 'shipped', 'delivered']);
        });
    }
], 'quantity');

echo "After loadSum (order_items_sum_quantity): " . ($product->order_items_sum_quantity ?? 'NULL') . PHP_EOL;
echo "Accessor after loadSum: {$product->total_sold}" . PHP_EOL;
