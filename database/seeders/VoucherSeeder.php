<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some active vouchers with specific codes
        Voucher::create([
            'code' => 'WELCOME2025',
            'name' => 'Chào mừng năm mới 2025',
            'description' => 'Giảm giá cho khách hàng mới trong năm 2025',
            'type' => 'fixed',
            'value' => 50000,
            'minimum_amount' => 200000,
            'maximum_discount' => null,
            'usage_limit' => 1000,
            'used_count' => 0,
            'usage_limit_per_user' => 1,
            'valid_from' => now()->startOfYear(),
            'valid_to' => now()->endOfYear(),
            'is_active' => true,
        ]);

        Voucher::create([
            'code' => 'FREESHIP',
            'name' => 'Miễn phí vận chuyển',
            'description' => 'Giảm 30K phí vận chuyển cho đơn hàng từ 300K',
            'type' => 'fixed',
            'value' => 30000,
            'minimum_amount' => 300000,
            'maximum_discount' => 30000,
            'usage_limit' => null,
            'used_count' => 0,
            'usage_limit_per_user' => 3,
            'valid_from' => now()->subDays(30),
            'valid_to' => now()->addMonths(3),
            'is_active' => true,
        ]);

        Voucher::create([
            'code' => 'MEGA100K',
            'name' => 'Giảm giá 100K',
            'description' => 'Giảm 100K cho đơn hàng từ 1 triệu',
            'type' => 'fixed',
            'value' => 100000,
            'minimum_amount' => 1000000,
            'maximum_discount' => null,
            'usage_limit' => 500,
            'used_count' => 0,
            'usage_limit_per_user' => 2,
            'valid_from' => now(),
            'valid_to' => now()->addMonths(2),
            'is_active' => true,
        ]);

        Voucher::create([
            'code' => 'VINYL50K',
            'name' => 'Giảm 50K cho đĩa than',
            'description' => 'Ưu đãi đặc biệt cho sản phẩm đĩa than',
            'type' => 'fixed',
            'value' => 50000,
            'minimum_amount' => 500000,
            'maximum_discount' => null,
            'usage_limit' => 200,
            'used_count' => 0,
            'usage_limit_per_user' => 1,
            'valid_from' => now()->subWeek(),
            'valid_to' => now()->addMonth(),
            'is_active' => true,
        ]);

        // Create an expired voucher
        Voucher::create([
            'code' => 'EXPIRED2024',
            'name' => 'Voucher hết hạn',
            'description' => 'Voucher này đã hết hạn sử dụng',
            'type' => 'fixed',
            'value' => 75000,
            'minimum_amount' => 400000,
            'maximum_discount' => null,
            'usage_limit' => 100,
            'used_count' => 45,
            'usage_limit_per_user' => 1,
            'valid_from' => now()->subMonths(6),
            'valid_to' => now()->subMonth(),
            'is_active' => false,
        ]);

        // Create an upcoming voucher
        Voucher::create([
            'code' => 'BLACKFRIDAY',
            'name' => 'Black Friday Sale',
            'description' => 'Giảm giá đặc biệt ngày Black Friday',
            'type' => 'fixed',
            'value' => 200000,
            'minimum_amount' => 1500000,
            'maximum_discount' => null,
            'usage_limit' => 100,
            'used_count' => 0,
            'usage_limit_per_user' => 1,
            'valid_from' => now()->addWeeks(2),
            'valid_to' => now()->addMonth(),
            'is_active' => true,
        ]);
    }
}
