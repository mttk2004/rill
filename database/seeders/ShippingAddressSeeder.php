<?php

namespace Database\Seeders;

use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing users
        $users = User::all();

        foreach ($users as $user) {
            // Create 1-3 shipping addresses for each user
            $addressCount = rand(1, 3);

            for ($i = 0; $i < $addressCount; $i++) {
                $isDefault = $i === 0; // First address is always default

                if ($user->email === 'admin@rill.local') {
                    // Admin user gets a Hanoi address
                    ShippingAddress::factory()
                        ->hanoi()
                        ->create([
                            'user_id' => $user->id,
                            'full_name' => $user->name,
                            'is_default' => $isDefault,
                        ]);
                } elseif ($user->email === 'customer@rill.local') {
                    // Customer gets a Ho Chi Minh address
                    ShippingAddress::factory()
                        ->hoChiMinh()
                        ->create([
                            'user_id' => $user->id,
                            'full_name' => $user->name,
                            'is_default' => $isDefault,
                        ]);
                } else {
                    // Random users get random addresses
                    ShippingAddress::factory()->create([
                        'user_id' => $user->id,
                        'full_name' => $user->name,
                        'is_default' => $isDefault,
                    ]);
                }
            }
        }

        // Create some additional sample addresses for testing
        $sampleAddresses = [
            [
                'user_id' => User::where('email', 'customer2@rill.local')->first()?->id,
                'full_name' => 'Trần Thị B',
                'phone' => '0987654322',
                'address_line_1' => '123 Nguyễn Huệ',
                'address_line_2' => 'Tầng 5',
                'city' => 'Hồ Chí Minh',
                'district' => 'Quận 1',
                'ward' => 'Phường Bến Nghé',
                'postal_code' => '700000',
                'is_default' => true,
            ],
            [
                'user_id' => User::where('email', 'manager@rill.local')->first()?->id,
                'full_name' => 'Admin Manager',
                'phone' => '0901234568',
                'address_line_1' => '456 Hai Bà Trưng',
                'address_line_2' => null,
                'city' => 'Hà Nội',
                'district' => 'Hai Bà Trưng',
                'ward' => 'Phường Lý Thái Tổ',
                'postal_code' => '100000',
                'is_default' => true,
            ],
        ];

        foreach ($sampleAddresses as $addressData) {
            if ($addressData['user_id']) {
                ShippingAddress::create($addressData);
            }
        }
    }
}
