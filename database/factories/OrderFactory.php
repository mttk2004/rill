<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 50, 500);
        return [
            'order_number' => 'RL-' . strtoupper(Str::random(8)),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => $subtotal,
            'discount_amount' => 0,
            'total_amount' => $subtotal,
            'currency' => 'VND',
            'shipping_address' => [
                'full_name' => $this->faker->name,
                'phone' => $this->faker->phoneNumber,
                'address_line_1' => $this->faker->streetAddress,
                'city' => $this->faker->city,
                'district' => $this->faker->city,
                'ward' => $this->faker->city,
            ],
            'notes' => $this->faker->sentence,
            'placed_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
