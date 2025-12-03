<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShoppingCartItem>
 */
class ShoppingCartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();

        return [
            'user_id' => User::factory(),
            'session_id' => null,
            'product_id' => $product->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => $product->price,
        ];
    }

    /**
     * Indicate the cart item belongs to a guest session.
     */
    public function forGuest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'session_id' => $this->faker->uuid,
        ]);
    }

    /**
     * Indicate the cart item belongs to a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
            'session_id' => null,
        ]);
    }

    /**
     * Indicate the cart item is for a specific product.
     */
    public function forProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
            'unit_price' => $product->price,
        ]);
    }
}
