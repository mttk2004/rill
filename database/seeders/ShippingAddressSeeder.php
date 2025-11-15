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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Ba Đình',
                        'district_id' => 1451,
                        'ward' => 'Phường Ngọc Khánh',
                        'ward_id' => 10117,
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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Đống Đa',
                        'district_id' => 1452,
                        'ward' => 'Phường Kim Liên',
                        'ward_id' => 10203,
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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Thanh Xuân',
                        'district_id' => 1458,
                        'ward' => 'Phường Thanh Xuân Trung',
                        'ward_id' => 10801,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Nguyễn Văn Anh',
                        'phone' => '0987654321',
                        'address_line_1' => '456 Lê Duẩn',
                        'address_line_2' => 'Nhà riêng',
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Hai Bà Trưng',
                        'district_id' => 1453,
                        'ward' => 'Phường Bạch Đằng',
                        'ward_id' => 10311,
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Nguyễn Văn Anh (Văn phòng)',
                        'phone' => '0987654321',
                        'address_line_1' => '89 Láng Hạ',
                        'address_line_2' => 'Tòa nhà HH2, Tầng 6',
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Đống Đa',
                        'district_id' => 1452,
                        'ward' => 'Phường Thành Công',
                        'ward_id' => 10213,
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
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 7',
                        'district_id' => 1447,
                        'ward' => 'Phường Tân Phú',
                        'ward_id' => 21011,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Trần Thị Bích',
                        'phone' => '0912345678',
                        'address_line_1' => '567 Võ Văn Kiệt',
                        'address_line_2' => 'Nhà mặt tiền',
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 5',
                        'district_id' => 1445,
                        'ward' => 'Phường 14',
                        'ward_id' => 20714,
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
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 9',
                        'district_id' => 1449,
                        'ward' => 'Phường Tăng Nhơn Phú A',
                        'ward_id' => 21309,
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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Long Biên',
                        'district_id' => 1454,
                        'ward' => 'Phường Việt Hưng',
                        'ward_id' => 10411,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Phạm Mai Dung (Công ty)',
                        'phone' => '0934567890',
                        'address_line_1' => '123 Phạm Hùng',
                        'address_line_2' => 'Keangnam Landmark 72, Tầng 35',
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Nam Từ Liêm',
                        'district_id' => 1455,
                        'ward' => 'Phường Mễ Trì',
                        'ward_id' => 10512,
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Phạm Mai Dung',
                        'phone' => '0934567890',
                        'address_line_1' => '678 Nguyễn Chí Thanh',
                        'address_line_2' => null,
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Đống Đa',
                        'district_id' => 1452,
                        'ward' => 'Phường Láng Thượng',
                        'ward_id' => 10209,
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
                        'province' => 'Hải Phòng',
                        'province_id' => 203,
                        'district' => 'Ngô Quyền',
                        'district_id' => 1721,
                        'ward' => 'Phường Máy Chai',
                        'ward_id' => 11001,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Hoàng Văn Em',
                        'phone' => '0945678901',
                        'address_line_1' => '789 Điện Biên Phủ',
                        'address_line_2' => 'Nhà riêng',
                        'province' => 'Hải Phòng',
                        'province_id' => 203,
                        'district' => 'Hồng Bàng',
                        'district_id' => 1717,
                        'ward' => 'Phường Phan Bội Châu',
                        'ward_id' => 11108,
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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Hoàn Kiếm',
                        'district_id' => 1450,
                        'ward' => 'Phường Tràng Tiền',
                        'ward_id' => 10118,
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
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 1',
                        'district_id' => 1442,
                        'ward' => 'Phường Bến Nghé',
                        'ward_id' => 20101,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Đặng Minh Quân (Studio)',
                        'phone' => '0967890123',
                        'address_line_1' => '234 Pasteur',
                        'address_line_2' => 'Tầng 1',
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 3',
                        'district_id' => 1443,
                        'ward' => 'Phường 6',
                        'ward_id' => 20306,
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
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 2',
                        'district_id' => 1463,
                        'ward' => 'Phường Thảo Điền',
                        'ward_id' => 21507,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Bùi Thanh Hằng',
                        'phone' => '0978901234',
                        'address_line_1' => '123 Hai Bà Trưng',
                        'address_line_2' => 'Tầng trệt',
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 3',
                        'district_id' => 1443,
                        'ward' => 'Phường Võ Thị Sáu',
                        'ward_id' => 20310,
                        'is_default' => false,
                    ],
                    [
                        'full_name' => 'Bùi Thanh Hằng (Nhà bố mẹ)',
                        'phone' => '0978901234',
                        'address_line_1' => '456 Lý Thái Tổ',
                        'address_line_2' => null,
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 10',
                        'district_id' => 1450,
                        'ward' => 'Phường 9',
                        'ward_id' => 21009,
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
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Thanh Xuân',
                        'district_id' => 1458,
                        'ward' => 'Phường Khương Mai',
                        'ward_id' => 10806,
                        'is_default' => true,
                    ],
                    [
                        'full_name' => 'Ngô Đức Huy (Coworking)',
                        'phone' => '0989012345',
                        'address_line_1' => '678 Tôn Đức Thắng',
                        'address_line_2' => 'TOONG Coworking Space, Tầng 5',
                        'province' => 'Hà Nội',
                        'province_id' => 201,
                        'district' => 'Đống Đa',
                        'district_id' => 1452,
                        'ward' => 'Phường Hàng Bột',
                        'ward_id' => 10202,
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
                        'province' => 'Đà Nẵng',
                        'province_id' => 204,
                        'district' => 'Hải Châu',
                        'district_id' => 1568,
                        'ward' => 'Phường Hải Châu 1',
                        'ward_id' => 11801,
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
