<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Checking Order Status Histories ===\n\n";

$orderId = '815148803339612160';

echo "Order ID: {$orderId}\n\n";

// Get all status histories for this order
$histories = DB::table('order_status_histories')
    ->where('order_id', $orderId)
    ->orderBy('created_at', 'asc')
    ->get(['id', 'order_id', 'status', 'notes', 'created_by', 'created_at']);

echo "Total status history records: " . $histories->count() . "\n\n";

// Group by status and created_at to find duplicates
$grouped = $histories->groupBy(function($item) {
    return $item->status . '|' . $item->created_at;
});

echo "--- All Status Histories ---\n";
foreach ($histories as $index => $history) {
    echo sprintf(
        "%d. [%s] Status: %s | Created: %s | By: %s\n   Notes: %s\n\n",
        $index + 1,
        $history->id,
        $history->status,
        $history->created_at,
        $history->created_by ?? 'NULL',
        $history->notes ?? 'NULL'
    );
}

// Find duplicates
echo "--- Checking for Duplicates ---\n";
$hasDuplicates = false;
foreach ($grouped as $key => $group) {
    if ($group->count() > 1) {
        $hasDuplicates = true;
        [$status, $timestamp] = explode('|', $key);
        echo "⚠️  Found {$group->count()} duplicate entries:\n";
        echo "   Status: {$status}\n";
        echo "   Timestamp: {$timestamp}\n";
        echo "   IDs: " . $group->pluck('id')->implode(', ') . "\n\n";

        // Show details
        foreach ($group as $item) {
            echo "   - ID: {$item->id}, Created by: " . ($item->created_by ?? 'NULL') . "\n";
        }
        echo "\n";
    }
}

if (!$hasDuplicates) {
    echo "✓ No duplicates found!\n";
}

// Check Order model events
echo "\n--- Analyzing the Issue ---\n";
echo "Looking at Order model boot() method...\n\n";

$orderModelPath = __DIR__ . '/app/Models/Order.php';
if (file_exists($orderModelPath)) {
    $content = file_get_contents($orderModelPath);

    // Count how many times we create status history
    $createHistoryCount = substr_count($content, 'OrderStatusHistory::create');
    $statusHistoriesCreate = substr_count($content, '$order->statusHistories()->create');

    echo "Found {$createHistoryCount} direct OrderStatusHistory::create() calls\n";
    echo "Found {$statusHistoriesCreate} relation create() calls\n\n";

    if ($createHistoryCount > 1 || $statusHistoriesCreate > 0) {
        echo "⚠️  WARNING: Multiple places creating status history detected!\n";
        echo "   This could cause duplicates.\n\n";
    }
}

// Check UpdateOrderStatusAction
echo "Checking UpdateOrderStatusAction...\n";
$actionPath = __DIR__ . '/app/Actions/Order/UpdateOrderStatusAction.php';
if (file_exists($actionPath)) {
    $content = file_get_contents($actionPath);

    if (strpos($content, 'statusHistories()->create') !== false) {
        echo "⚠️  UpdateOrderStatusAction also creates status history!\n";
        echo "   This creates duplicate with Order model event.\n\n";
    }
}

echo "\n=== Recommendations ===\n";
echo "1. Remove status history creation from UpdateOrderStatusAction\n";
echo "2. Keep only the Order model event to create history\n";
echo "3. Or remove the event and keep only the Action creation\n\n";
