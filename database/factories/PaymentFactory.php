<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'payment_method' => 'cod',
            'payment_status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'amount' => $this->faker->randomFloat(2, 50, 500),
            'currency' => 'VND',
            'processed_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
