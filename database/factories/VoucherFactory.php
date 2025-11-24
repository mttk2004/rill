<?php

namespace Database\Factories;

use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Voucher::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $validFrom = $this->faker->dateTimeBetween('-1 month', '+1 week');
        $validTo = $this->faker->dateTimeBetween($validFrom, '+3 months');

        return [
            'code' => strtoupper(Str::random(8)),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'type' => 'fixed',
            'value' => $this->faker->randomFloat(2, 10000, 200000),
            'minimum_amount' => $this->faker->optional()->randomFloat(2, 100000, 500000),
            'maximum_discount' => $this->faker->optional()->randomFloat(2, 50000, 300000),
            'usage_limit' => $this->faker->optional()->numberBetween(10, 1000),
            'used_count' => 0,
            'usage_limit_per_user' => $this->faker->optional()->numberBetween(1, 5),
            'valid_from' => $validFrom,
            'valid_to' => $validTo,
            'is_active' => $this->faker->boolean(80),
        ];
    }

    /**
     * Indicate that the voucher is currently active and valid.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'valid_from' => now()->subDays(7),
            'valid_to' => now()->addMonths(2),
        ]);
    }

    /**
     * Indicate that the voucher has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'valid_from' => now()->subMonths(3),
            'valid_to' => now()->subDays(1),
        ]);
    }

    /**
     * Indicate that the voucher is not yet valid.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'valid_from' => now()->addDays(7),
            'valid_to' => now()->addMonths(2),
        ]);
    }

    /**
     * Indicate that the voucher has reached its usage limit.
     */
    public function exhausted(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_limit' => 100,
            'used_count' => 100,
        ]);
    }

    /**
     * Indicate that the voucher is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
