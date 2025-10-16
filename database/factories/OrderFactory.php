<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
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
        return [
            'order_number' => 'RL-' . strtoupper(Str::random(8)),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => 0, // Will be calculated
            'discount_amount' => 0,
            'total_amount' => 0, // Will be calculated
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

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Order $order) {
            // Get some random products
            $products = Product::inRandomOrder()->limit($this->faker->numberBetween(1, 5))->get();

            $subtotal = 0;

            foreach ($products as $product) {
                $quantity = $this->faker->numberBetween(1, 2);
                $unitPrice = $product->price;
                $totalPrice = $quantity * $unitPrice;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                $subtotal += $totalPrice;
            }

            // Update the order totals
            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal, // Assuming no discount for now
            ]);
        });
    }
}
