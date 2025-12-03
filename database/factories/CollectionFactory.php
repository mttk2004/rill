<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collection>
 */
class CollectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'type' => $this->faker->randomElement(['featured', 'banner', 'promotion', 'curated']),
            'description' => $this->faker->optional()->sentence(),
            'image' => $this->faker->optional()->imageUrl(),
            'is_active' => true,
        ];
    }
}
