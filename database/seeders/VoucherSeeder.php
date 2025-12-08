<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create welcome voucher for new customers
        Voucher::create([
            'code' => 'RILLNEW',
            'name' => 'Chào mừng khách hàng mới',
            'description' => 'Giảm giá 100K cho khách hàng mới đăng ký tài khoản',
            'type' => 'fixed',
            'value' => 100000,
            'minimum_amount' => 0,
            'maximum_discount' => null,
            'usage_limit' => null, // Unlimited total uses
            'used_count' => 0,
            'usage_limit_per_user' => 1, // Each user can only use once
            'valid_from' => now(),
            'valid_to' => now()->addYear(), // Valid for 1 year
            'is_active' => true,
        ]);

        // Create Chrismas voucher for all users
        Voucher::create([
            'code' => 'RILLXMAS',
            'name' => 'Giảm giá Giáng Sinh',
            'description' => 'Giảm giá 200K cho đơn hàng từ 500K trở lên',
            'type' => 'fixed',
            'value' => 200000,
            'minimum_amount' => 500000,
            'maximum_discount' => null, // No maximum discount
            'usage_limit' => null, // Unlimited total uses
            'used_count' => 0,
            'usage_limit_per_user' => null, // No limit per user
            'valid_from' => now()->startOfMonth(),
            'valid_to' => now()->endOfMonth(), // Valid for the entire month
            'is_active' => true,
        ]);

        // Create a "Sinh Nhật Rill" voucher for all users
        Voucher::create([
            'code' => 'RILLBIRTHDAY',
            'name' => 'Sinh Nhật Rill',
            'description' => 'Giảm giá 300K cho đơn hàng từ 1 triệu trở lên',
            'type' => 'fixed',
            'value' => 300000,
            'minimum_amount' => 1000000,
            'maximum_discount' => null, // No maximum discount
            'usage_limit' => null, // Unlimited total uses
            'used_count' => 0,
            'usage_limit_per_user' => null, // No limit per user
            'valid_from' => now()->startOfMonth(),
            'valid_to' => now()->endOfMonth(), // Valid for the entire month
            'is_active' => true,
        ]);
    }
}
