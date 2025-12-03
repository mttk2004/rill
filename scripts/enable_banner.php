<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$setting = \App\Models\Setting::where('key', 'banner_enabled')->first();
$setting->value = '1';
$setting->save();

echo "Banner enabled: {$setting->value}\n";
echo "Cache cleared by observer\n";
