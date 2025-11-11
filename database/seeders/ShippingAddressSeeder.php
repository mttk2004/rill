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
        // Addresses for admin users
        $adminAddresses = [
            [
                'email' => 'admin@rill.local',
                'addresses' => [
                    [
                        'full_name' => 'Rill Admin',
                        'phone' => '0901234567',
                        'address_line_1' => '54 Liễu Giai',
                        'address_line_2' => 'Tòa nhà Detech Tower, Tầng 8',
                        'city' => 'Hà Nội',
                        'district' => 'Ba Đình',
                        'ward' => 'Phường Ngọc Khánh',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'email' => 'manager@rill.local',
                'addresses' => [
                    [
                        'full_name' => 'Quản Trị Viên',
                        'phone' => '0901234568',
                        'address_line_1' => '234 Phạm Ngọc Thạch',
                        'address_line_2' => 'Chung cư CT1, Căn 1502',
                        'city' => 'Hà Nội',
                        'district' => 'Đống Đa',
                        'ward' => 'Phường Kim Liên',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                ],
            ],
        ];

        // Detailed addresses for 10 customers
        $customerAddresses = [
            // Nguyễn Văn Anh - 3 addresses
            [
                'email' => 'nguyenvananh@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Nguyễn Văn Anh',
                        'phone' => '0987654321',
                        'address_line_1' => '128 Nguyễn Trãi',
                        'address_line_2' => 'Chung cư Eurowindow, Tầng 15, Căn 1508',
                        'city' => 'Hà Nội',
                        'district' => 'Thanh Xuân',
                        'ward' => 'Phường Thanh Xuân Trung',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Nguyễn Văn Anh',
                        'phone' => '0987654321',
                        'address_line_1' => '456 Lê Duẩn',
                        'address_line_2' => 'Nhà riêng',
                        'city' => 'Hà Nội',
                        'district' => 'Hai Bà Trưng',
                        'ward' => 'Phường Bạch Đằng',
                        'postal_code' => '100000',
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Nguyễn Văn Anh (Văn phòng)',
                        'phone' => '0987654321',
                        'address_line_1' => '89 Láng Hạ',
                        'address_line_2' => 'Tòa nhà HH2, Tầng 6',
                        'city' => 'Hà Nội',
                        'district' => 'Đống Đa',
                        'ward' => 'Phường Thành Công',
                        'postal_code' => '100000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Trần Thị Bích - 2 addresses
            [
                'email' => 'tranbich88@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Trần Thị Bích',
                        'phone' => '0912345678',
                        'address_line_1' => '234 Nguyễn Văn Linh',
                        'address_line_2' => 'Căn hộ Sunrise City, Block V3, Căn 2107',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 7',
                        'ward' => 'Phường Tân Phú',
                        'postal_code' => '700000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Trần Thị Bích',
                        'phone' => '0912345678',
                        'address_line_1' => '567 Võ Văn Kiệt',
                        'address_line_2' => 'Nhà mặt tiền',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 5',
                        'ward' => 'Phường 14',
                        'postal_code' => '700000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Lê Hoàng Cường - 1 address
            [
                'email' => 'lehoangcuong@yahoo.com',
                'addresses' => [
                    [
                        'full_name' => 'Lê Hoàng Cường',
                        'phone' => '0923456789',
                        'address_line_1' => '789 Lê Văn Việt',
                        'address_line_2' => 'Chung cư 9 View, Tòa D, Căn 1205',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 9',
                        'ward' => 'Phường Tăng Nhơn Phú A',
                        'postal_code' => '700000',
                        'is_default' => true,
                    ],
                ],
            ],
            // Phạm Mai Dung - 3 addresses
            [
                'email' => 'phamdung.work@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Phạm Mai Dung',
                        'phone' => '0934567890',
                        'address_line_1' => '345 Trần Hưng Đạo',
                        'address_line_2' => 'Biệt thự Vinhomes Riverside, Villa S10',
                        'city' => 'Hà Nội',
                        'district' => 'Long Biên',
                        'ward' => 'Phường Việt Hưng',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Phạm Mai Dung (Công ty)',
                        'phone' => '0934567890',
                        'address_line_1' => '123 Phạm Hùng',
                        'address_line_2' => 'Keangnam Landmark 72, Tầng 35',
                        'city' => 'Hà Nội',
                        'district' => 'Nam Từ Liêm',
                        'ward' => 'Phường Mễ Trì',
                        'postal_code' => '100000',
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Phạm Mai Dung',
                        'phone' => '0934567890',
                        'address_line_1' => '678 Nguyễn Chí Thanh',
                        'address_line_2' => null,
                        'city' => 'Hà Nội',
                        'district' => 'Đống Đa',
                        'ward' => 'Phường Láng Thượng',
                        'postal_code' => '100000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Hoàng Văn Em - 2 addresses
            [
                'email' => 'hoangvanem93@outlook.com',
                'addresses' => [
                    [
                        'full_name' => 'Hoàng Văn Em',
                        'phone' => '0945678901',
                        'address_line_1' => '456 Lê Hồng Phong',
                        'address_line_2' => 'Tầng 3',
                        'city' => 'Hải Phòng',
                        'district' => 'Ngô Quyền',
                        'ward' => 'Phường Máy Chai',
                        'postal_code' => '180000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Hoàng Văn Em',
                        'phone' => '0945678901',
                        'address_line_1' => '789 Điện Biên Phủ',
                        'address_line_2' => 'Nhà riêng',
                        'city' => 'Hải Phòng',
                        'district' => 'Hồng Bàng',
                        'ward' => 'Phường Phan Bội Châu',
                        'postal_code' => '180000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Vũ Thị Phương - 1 address
            [
                'email' => 'vuphuong.hanoilife@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Vũ Thị Phương',
                        'phone' => '0956789012',
                        'address_line_1' => '12 Hàng Bài',
                        'address_line_2' => 'Tầng 2, Phòng 201',
                        'city' => 'Hà Nội',
                        'district' => 'Hoàn Kiếm',
                        'ward' => 'Phường Tràng Tiền',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                ],
            ],
            // Đặng Minh Quân - 2 addresses
            [
                'email' => 'dangquan.music@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Đặng Minh Quân',
                        'phone' => '0967890123',
                        'address_line_1' => '890 Nguyễn Huệ',
                        'address_line_2' => 'Chung cư The EverRich, Tầng 20, Căn 2005',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 1',
                        'ward' => 'Phường Bến Nghé',
                        'postal_code' => '700000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Đặng Minh Quân (Studio)',
                        'phone' => '0967890123',
                        'address_line_1' => '234 Pasteur',
                        'address_line_2' => 'Tầng 1',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 3',
                        'ward' => 'Phường 6',
                        'postal_code' => '700000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Bùi Thanh Hằng - 3 addresses
            [
                'email' => 'buihang.saigon@yahoo.com',
                'addresses' => [
                    [
                        'full_name' => 'Bùi Thanh Hằng',
                        'phone' => '0978901234',
                        'address_line_1' => '567 Điện Biên Phủ',
                        'address_line_2' => 'Masteri Thảo Điền, T4, Căn 1812',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 2',
                        'ward' => 'Phường Thảo Điền',
                        'postal_code' => '700000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Bùi Thanh Hằng',
                        'phone' => '0978901234',
                        'address_line_1' => '123 Hai Bà Trưng',
                        'address_line_2' => 'Tầng trệt',
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 3',
                        'ward' => 'Phường Võ Thị Sáu',
                        'postal_code' => '700000',
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Bùi Thanh Hằng (Nhà bố mẹ)',
                        'phone' => '0978901234',
                        'address_line_1' => '456 Lý Thái Tổ',
                        'address_line_2' => null,
                        'city' => 'Hồ Chí Minh',
                        'district' => 'Quận 10',
                        'ward' => 'Phường 9',
                        'postal_code' => '700000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Ngô Đức Huy - 2 addresses
            [
                'email' => 'ngohuy.developer@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Ngô Đức Huy',
                        'phone' => '0989012345',
                        'address_line_1' => '345 Trường Chinh',
                        'address_line_2' => 'Chung cư HH4, Tầng 10, Căn 1003',
                        'city' => 'Hà Nội',
                        'district' => 'Thanh Xuân',
                        'ward' => 'Phường Khương Mai',
                        'postal_code' => '100000',
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Ngô Đức Huy (Coworking)',
                        'phone' => '0989012345',
                        'address_line_1' => '678 Tôn Đức Thắng',
                        'address_line_2' => 'TOONG Coworking Space, Tầng 5',
                        'city' => 'Hà Nội',
                        'district' => 'Đống Đa',
                        'ward' => 'Phường Hàng Bột',
                        'postal_code' => '100000',
                        'is_default' => false,
                    ],
                ],
            ],
            // Đinh Thị Lan - 1 address
            [
                'email' => 'dinhlan.art@gmail.com',
                'addresses' => [
                    [
                        'full_name' => 'Đinh Thị Lan',
                        'phone' => '0990123456',
                        'address_line_1' => '901 Hoàng Hoa Thám',
                        'address_line_2' => 'Tầng 4, Căn số 6',
                        'city' => 'Đà Nẵng',
                        'district' => 'Hải Châu',
                        'ward' => 'Phường Hải Châu 1',
                        'postal_code' => '550000',
                        'is_default' => true,
                    ],
                ],
            ],
        ];

        // Create admin addresses
        foreach ($adminAddresses as $adminData) {
            $user = User::where('email', $adminData['email'])->first();
            if ($user) {
                foreach ($adminData['addresses'] as $addressData) {
                    ShippingAddress::create(array_merge(
                        $addressData,
                        ['user_id' => $user->id]
                    ));
                }
            }
        }

        // Create customer addresses
        foreach ($customerAddresses as $customerData) {
            $user = User::where('email', $customerData['email'])->first();
            if ($user) {
                foreach ($customerData['addresses'] as $addressData) {
                    ShippingAddress::create(array_merge(
                        $addressData,
                        ['user_id' => $user->id]
                    ));
                }
            }
        }
    }
}
