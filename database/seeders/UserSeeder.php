<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->admin()->create([
            'name' => 'Rill Admin',
            'email' => 'admin@rill.local',
            'phone' => '0901234567',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
        ]);

        // Create 10 realistic customers with detailed information
        $customers = [
            [
                'name' => 'Nguyễn Văn Anh',
                'email' => 'nguyenvananh@gmail.com',
                'phone' => '0987654321',
                'gender' => 'male',
                'avatar' => 'avatars/ymS8QLywYTAXDaU0AGjgRqNJedS4MXlrRw2EqxH8.jpg',
                'date_of_birth' => '1992-03-15',
            ],
            [
                'name' => 'Trần Thị Bích',
                'email' => 'tranbich88@gmail.com',
                'phone' => '0912345678',
                'gender' => 'female',
                'date_of_birth' => '1988-07-22',
            ],
            [
                'name' => 'Lê Hoàng Cường',
                'email' => 'lehoangcuong@yahoo.com',
                'phone' => '0923456789',
                'gender' => 'male',
                'date_of_birth' => '1995-11-08',
            ],
            [
                'name' => 'Phạm Mai Dung',
                'email' => 'phamdung.work@gmail.com',
                'phone' => '0934567890',
                'gender' => 'female',
                'date_of_birth' => '1990-05-30',
            ],
            [
                'name' => 'Hoàng Văn Em',
                'email' => 'hoangvanem93@outlook.com',
                'phone' => '0945678901',
                'gender' => 'male',
                'date_of_birth' => '1993-09-12',
            ],
            [
                'name' => 'Vũ Thị Phương',
                'email' => 'vuphuong.hanoilife@gmail.com',
                'phone' => '0956789012',
                'gender' => 'female',
                'date_of_birth' => '1987-12-25',
            ],
            [
                'name' => 'Đặng Minh Quân',
                'email' => 'dangquan.music@gmail.com',
                'phone' => '0967890123',
                'gender' => 'male',
                'date_of_birth' => '1996-02-18',
            ],
            [
                'name' => 'Bùi Thanh Hằng',
                'email' => 'buihang.saigon@yahoo.com',
                'phone' => '0978901234',
                'gender' => 'female',
                'date_of_birth' => '1991-08-05',
            ],
            [
                'name' => 'Ngô Đức Huy',
                'email' => 'ngohuy.developer@gmail.com',
                'phone' => '0989012345',
                'gender' => 'male',
                'date_of_birth' => '1994-04-27',
            ],
            [
                'name' => 'Đinh Thị Lan',
                'email' => 'dinhlan.art@gmail.com',
                'phone' => '0990123456',
                'gender' => 'female',
                'date_of_birth' => '1989-10-14',
            ],
        ];

        foreach ($customers as $customerData) {
            User::factory()->customer()->create($customerData);
        }
    }
}
