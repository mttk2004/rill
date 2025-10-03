<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingAddress>
 */
class ShippingAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Vietnamese cities and their districts/wards
        $vietnameseLocations = [
            'Hà Nội' => [
                'districts' => ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Long Biên', 'Tây Hồ', 'Thanh Xuân', 'Cầu Giấy', 'Nam Từ Liêm'],
                'wards' => ['Phường Hàng Bài', 'Phường Hàng Đào', 'Phường Cửa Nam', 'Phường Lý Thái Tổ', 'Phường Hàng Mã', 'Phường Đồng Xuân', 'Phường Hàng Buồm', 'Phường Cửa Đông']
            ],
            'Hồ Chí Minh' => [
                'districts' => ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Thủ Đức'],
                'wards' => ['Phường Bến Nghé', 'Phường Đa Kao', 'Phường Cô Giang', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Cầu Kho', 'Phường Tân Định']
            ],
            'Đà Nẵng' => [
                'districts' => ['Hải Châu', 'Cẩm Lệ', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà', 'Hòa Vang'],
                'wards' => ['Phường Thạch Thang', 'Phường Hải Châu I', 'Phường Hải Châu II', 'Phường Phước Ninh', 'Phường Hòa Thuận Tây']
            ],
            'Hải Phòng' => [
                'districts' => ['Hồng Bàng', 'Lê Chân', 'Ngô Quyền', 'Kiến An', 'Hải An', 'Đồ Sơn', 'Dương Kinh'],
                'wards' => ['Phường Máy Chai', 'Phường Trại Cau', 'Phường Đông Khê', 'Phường Cát Dài', 'Phường Lam Sơn']
            ],
            'Cần Thơ' => [
                'districts' => ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt', 'Cờ Đỏ', 'Phong Điền'],
                'wards' => ['Phường Cái Khế', 'Phường Thới Bình', 'Phường Hưng Lợi', 'Phường An Hòa', 'Phường Tân An']
            ]
        ];

        $city = $this->faker->randomKey($vietnameseLocations);
        $locationData = $vietnameseLocations[$city];
        $district = $this->faker->randomElement($locationData['districts']);
        $ward = $this->faker->randomElement($locationData['wards']);

        $streetNames = [
            'Nguyễn Trãi', 'Lê Lợi', 'Hai Bà Trưng', 'Trần Hưng Đạo', 'Nguyễn Huệ',
            'Điện Biên Phủ', 'Võ Văn Tần', 'Cách Mạng Tháng Tam', 'Nguyễn Thị Minh Khai',
            'Lý Tự Trọng', 'Nam Kỳ Khởi Nghĩa', 'Pasteur', 'Lê Duẩn', 'Hoàng Văn Thụ'
        ];

        $streetNumber = $this->faker->numberBetween(1, 999);
        $streetName = $this->faker->randomElement($streetNames);

        return [
            'user_id' => User::factory(),
            'full_name' => $this->faker->name(),
            'phone' => $this->faker->numerify('09########'), // Vietnamese mobile format
            'address_line_1' => "$streetNumber $streetName",
            'address_line_2' => $this->faker->optional(0.3)->randomElement(['Tầng 2', 'Tầng 3', 'Căn hộ ' . $this->faker->numberBetween(101, 999)]),
            'city' => $city,
            'district' => $district,
            'ward' => $ward,
            'postal_code' => $this->faker->optional(0.7)->numerify('#####0'), // Vietnamese postal code format
            'is_default' => false, // Will be set to true for one address per user in seeder
        ];
    }

    /**
     * Indicate that the shipping address is the default address.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    /**
     * Create an address in Ho Chi Minh City.
     */
    public function hoChiMinh(): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => 'Hồ Chí Minh',
            'district' => $this->faker->randomElement(['Quận 1', 'Quận 3', 'Quận 7', 'Thủ Đức']),
            'ward' => $this->faker->randomElement(['Phường Bến Nghé', 'Phường Đa Kao', 'Phường Tân Định']),
        ]);
    }

    /**
     * Create an address in Hanoi.
     */
    public function hanoi(): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => 'Hà Nội',
            'district' => $this->faker->randomElement(['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Cầu Giấy']),
            'ward' => $this->faker->randomElement(['Phường Hàng Bài', 'Phường Hàng Đào', 'Phường Cửa Nam']),
        ]);
    }
}
