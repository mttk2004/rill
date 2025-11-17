<?php

namespace Database\Seeders;

use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShippingAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * All addresses are verified with GHN API to ensure:
     * - province_id matches province
     * - district_id matches district
     * - ward_id matches ward
     */
    public function run(): void
    {
        // Admin addresses
        $adminAddresses = [
            [
                'email' => 'admin@rill.local',
                'addresses' => [
                    [
                        'full_name' => 'Rill Admin',
                        'phone' => '0987654321',
                        'address_line_1' => '123 Nguyễn Huệ',
                        'address_line_2' => 'Tòa nhà Times Square, Tầng 10',
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 1',
                        'district_id' => 1442,
                        'ward' => 'Phường Bến Nghé',
                        'ward_id' => '20101',
                        'is_default' => true,
                    ],
                ],
            ],
            [
                'email' => 'manager@rill.local',
                'addresses' => [
                    [
                        'full_name' => 'Quản Trị Viên',
                        'phone' => '0912345678',
                        'address_line_1' => '234 Nguyễn Văn Linh',
                        'address_line_2' => 'Căn hộ Sunrise City, Block V3, Căn 2107',
                        'province' => 'Hồ Chí Minh',
                        'province_id' => 202,
                        'district' => 'Quận 7',
                        'district_id' => 1449,
                        'ward' => 'Phường Tân Phú',
                        'ward_id' => '20707',
                        'is_default' => true,
                    ],
                ],
            ],
        ];

        // Customer addresses (one address per customer)
        $customerEmails = [
            'nguyenvananh@gmail.com',
            'tranbich88@gmail.com',
            'lehoangcuong@yahoo.com',
            'phamdung.work@gmail.com',
            'hoangvanem93@outlook.com',
            'vuphuong.hanoilife@gmail.com',
            'dangquan.music@gmail.com',
            'buihang.saigon@yahoo.com',
            'ngohuy.developer@gmail.com',
            'dinhlan.art@gmail.com',
        ];

        $validAddresses = [
            [
                'full_name' => 'Nguyễn Văn Anh',
                'phone' => '0987654321',
                'address_line_1' => '123 Nguyễn Huệ',
                'address_line_2' => 'Tòa nhà Times Square, Tầng 10',
                'province' => 'Hồ Chí Minh',
                'province_id' => 202,
                'district' => 'Quận 1',
                'district_id' => 1442,
                'ward' => 'Phường Bến Nghé',
                'ward_id' => '20101',
                'is_default' => true,
            ],
            [
                'full_name' => 'Trần Thị Bích',
                'phone' => '0912345678',
                'address_line_1' => '234 Nguyễn Văn Linh',
                'address_line_2' => 'Căn hộ Sunrise City, Block V3, Căn 2107',
                'province' => 'Hồ Chí Minh',
                'province_id' => 202,
                'district' => 'Quận 7',
                'district_id' => 1449,
                'ward' => 'Phường Tân Phú',
                'ward_id' => '20707',
                'is_default' => true,
            ],
            [
                'full_name' => 'Lê Hoàng Cường',
                'phone' => '0923456789',
                'address_line_1' => '345 Võ Văn Tần',
                'address_line_2' => 'Chung cư Sky Garden, Tầng 15',
                'province' => 'Hồ Chí Minh',
                'province_id' => 202,
                'district' => 'Quận 3',
                'district_id' => 1444,
                'ward' => 'Phường 6',
                'ward_id' => '20306',
                'is_default' => true,
            ],
            [
                'full_name' => 'Phạm Mai Dung',
                'phone' => '0934567890',
                'address_line_1' => '54 Liễu Giai',
                'address_line_2' => 'Tòa nhà Detech Tower, Tầng 8',
                'province' => 'Hà Nội',
                'province_id' => 201,
                'district' => 'Quận Ba Đình',
                'district_id' => 1484,
                'ward' => 'Phường Ngọc Khánh',
                'ward_id' => '1A0108',
                'is_default' => true,
            ],
            [
                'full_name' => 'Hoàng Văn Em',
                'phone' => '0945678901',
                'address_line_1' => '234 Phạm Ngọc Thạch',
                'address_line_2' => 'Chung cư CT1, Căn 1502',
                'province' => 'Hà Nội',
                'province_id' => 201,
                'district' => 'Quận Đống Đa',
                'district_id' => 1486,
                'ward' => 'Phường Kim Liên',
                'ward_id' => '1A0405',
                'is_default' => true,
            ],
            [
                'full_name' => 'Vũ Thị Phương',
                'phone' => '0956789012',
                'address_line_1' => '128 Nguyễn Trãi',
                'address_line_2' => 'Chung cư Eurowindow, Tầng 15, Căn 1508',
                'province' => 'Hà Nội',
                'province_id' => 201,
                'district' => 'Quận Thanh Xuân',
                'district_id' => 1493,
                'ward' => 'Phường Thanh Xuân Trung',
                'ward_id' => '1A0710',
                'is_default' => true,
            ],
            [
                'full_name' => 'Đặng Minh Quân',
                'phone' => '0967890123',
                'address_line_1' => '456 Trần Phú',
                'address_line_2' => 'Chung cú Mường Thanh, Tầng 20',
                'province' => 'Đà Nẵng',
                'province_id' => 203,
                'district' => 'Quận Hải Châu',
                'district_id' => 1526,
                'ward' => 'Phường Hải Châu',
                'ward_id' => '91579',
                'is_default' => true,
            ],
            [
                'full_name' => 'Bùi Thanh Hằng',
                'phone' => '0978901234',
                'address_line_1' => '789 Điện Biên Phủ',
                'address_line_2' => 'Nhà riêng 3 tầng',
                'province' => 'Hải Phòng',
                'province_id' => 224,
                'district' => 'Quận Hồng Bàng',
                'district_id' => 1589,
                'ward' => 'Phường Phan Bội Châu',
                'ward_id' => '30106',
                'is_default' => true,
            ],
            [
                'full_name' => 'Ngô Đức Huy',
                'phone' => '0989012345',
                'address_line_1' => '567 Mậu Thân',
                'address_line_2' => 'Chung cư Tân Gia, Căn 805',
                'province' => 'Cần Thơ',
                'province_id' => 220,
                'district' => 'Quận Ninh Kiều',
                'district_id' => 1572,
                'ward' => 'Phường Cái Khế',
                'ward_id' => '550109',
                'is_default' => true,
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

        // Create customer addresses (cycle through valid addresses)
        foreach ($customerEmails as $index => $email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $addressData = $validAddresses[$index % count($validAddresses)];
                ShippingAddress::create(array_merge(
                    $addressData,
                    ['user_id' => $user->id]
                ));
            }
        }
    }
}
