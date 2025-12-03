<?php

namespace App\Console\Commands;

use App\Models\Voucher;
use App\Services\VoucherServiceRefactored;
use Illuminate\Console\Command;

class CheckVoucher extends Command
{
    protected $signature = 'voucher:check {code}';
    protected $description = 'Check voucher details and availability';

    public function handle(VoucherServiceRefactored $voucherService)
    {
        $code = $this->argument('code');

        $voucher = Voucher::where('code', $code)->first();

        if (!$voucher) {
            $this->error("Voucher '$code' not found!");
            return 1;
        }

        $this->info("=== Voucher Details ===");
        $this->line("Code: {$voucher->code}");
        $this->line("Name: {$voucher->name}");
        $this->line("Active: " . ($voucher->is_active ? 'Yes' : 'No'));
        $this->line("Valid From: {$voucher->valid_from}");
        $this->line("Valid To: {$voucher->valid_to}");
        $this->line("Minimum Amount: " . ($voucher->minimum_amount ?? 'None'));
        $this->line("Usage Limit: " . ($voucher->usage_limit ?? 'Unlimited'));
        $this->line("Used Count: {$voucher->used_count}");
        $this->line("Usage Limit Per User: " . ($voucher->usage_limit_per_user ?? 'Unlimited'));

        $this->newLine();
        $this->info("=== Validation Checks ===");
        $now = now();
        $this->line("Current Time: {$now->toDateTimeString()}");
        $this->line("Is Active: " . ($voucher->is_active ? '✓' : '✗'));
        $this->line("Valid From Check: " . ($voucher->valid_from <= $now ? '✓' : '✗ (not started yet)'));
        $this->line("Valid To Check: " . ($voucher->valid_to >= $now ? '✓' : '✗ (expired)'));
        $this->line("Usage Limit Check: " . (($voucher->usage_limit === null || $voucher->used_count < $voucher->usage_limit) ? '✓' : '✗'));
        $this->line("Is Valid: " . ($voucher->isValid() ? '✓ YES' : '✗ NO'));

        $this->newLine();
        $this->info("=== Available Vouchers Test ===");
        $available = $voucherService->getAvailableVouchers();
        $this->line("Total available vouchers (no filter): {$available->count()}");

        $foundInList = $available->contains('code', $code);
        $this->line("'{$code}' in available list: " . ($foundInList ? '✓ YES' : '✗ NO'));

        if ($available->isEmpty()) {
            $this->warn("No vouchers are currently available!");
            $this->line("Possible reasons:");
            $this->line("- All vouchers are inactive");
            $this->line("- All vouchers are expired or not yet valid");
            $this->line("- All vouchers have reached usage limit");
        }

        return 0;
    }
}
