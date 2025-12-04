<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$orderId = '814335568196599808';

echo "Checking Order ID: $orderId\n\n";

$order = App\Models\Order::find($orderId);
echo "Order exists: " . ($order ? 'YES' : 'NO') . "\n";
if ($order) {
    echo "  - Order number: {$order->order_number}\n";
    echo "  - Status: {$order->status->value}\n";
    echo "  - Total: {$order->total_amount}\n";
}

echo "\n";

$payment = App\Models\Payment::where('order_id', $orderId)->first();
echo "Payment exists: " . ($payment ? 'YES' : 'NO') . "\n";
if ($payment) {
    echo "  - Payment ID: {$payment->id}\n";
    echo "  - Status: {$payment->payment_status->value}\n";
    echo "  - Method: {$payment->payment_method->value}\n";
    echo "  - Amount: {$payment->amount}\n";
}

echo "\n";
echo "Total Payments in DB: " . App\Models\Payment::count() . "\n";
echo "Total Orders in DB: " . App\Models\Order::count() . "\n";
