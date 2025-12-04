<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$product = App\Models\Product::with('orderItems.order')->first();

if (!$product) {
    echo 'No products found' . PHP_EOL;
    exit;
}

echo 'Product: ' . $product->name . PHP_EOL;
echo 'Total OrderItems: ' . $product->orderItems->count() . PHP_EOL;

if ($product->orderItems->count() > 0) {
    echo PHP_EOL . 'Order Items:' . PHP_EOL;
    foreach ($product->orderItems as $item) {
        echo '- Order: ' . $item->order_id . ' | Status: ' . $item->order->status->value . ' | Qty: ' . $item->quantity . PHP_EOL;
    }

    echo PHP_EOL . 'Confirmed orders only:' . PHP_EOL;
    $confirmedItems = $product->orderItems->filter(function($item) {
        return in_array($item->order->status->value, ['confirmed', 'processing', 'shipped', 'delivered']);
    });
    echo 'Count: ' . $confirmedItems->count() . PHP_EOL;
    echo 'Total Qty: ' . $confirmedItems->sum('quantity') . PHP_EOL;
}echo PHP_EOL . 'Total Sold (accessor): ' . $product->total_sold . PHP_EOL;
echo 'Total Sold (direct query): ' . $product->orderItems()
    ->whereHas('order', function ($query) {
        $query->whereIn('status', ['confirmed', 'processing', 'shipped', 'delivered']);
    })
    ->sum('quantity') . PHP_EOL;
