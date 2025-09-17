<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $albumNames = [
            'Abbey Road', 'The Dark Side of the Moon', 'Led Zeppelin IV', 'Bohemian Rhapsody',
            'Hotel California', 'Rumours', 'Nevermind', 'OK Computer', 'The Joshua Tree',
            'Back in Black', 'Thriller', 'Born to Run', 'Pet Sounds', 'Sgt. Pepper\'s Lonely Hearts Club Band',
            'What\'s Going On', 'Kind of Blue', 'A Love Supreme', 'Blue Train', 'Time Out',
            'The Velvet Underground & Nico', 'Unknown Pleasures', 'Substance', 'Music for the Masses',
            'Trans-Europe Express', 'Discovery', 'Selected Ambient Works 85-92', 'Music Has the Right to Children',
            'Blue Lines', 'Dummy', 'The Eraser', 'In Rainbows'
        ];
        
        $genres = [
            'Rock', 'Pop', 'Jazz', 'Blues', 'Electronic', 'Classical', 'Folk', 'Country',
            'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 'Punk', 'Metal', 'Alternative',
            'Indie', 'Ambient', 'Techno', 'House', 'Experimental', 'Post-Rock'
        ];
        
        $labels = [
            'Abbey Road Studios', 'Parlophone', 'EMI', 'Capitol Records', 'Columbia Records',
            'Atlantic Records', 'Warner Bros. Records', 'Universal Music Group', 'Sony Music',
            'Decca Records', 'Blue Note Records', 'Verve Records', 'ECM Records',
            'Warp Records', 'Ninja Tune', 'XL Recordings', 'Rough Trade', 'Sub Pop',
            'Matador Records', 'Merge Records', 'Touch and Go Records', '4AD'
        ];
        
        $name = $this->faker->randomElement($albumNames);
        $price = $this->faker->randomFloat(2, 15.99, 89.99);
        $costPrice = $price * 0.6; // 60% of selling price
        $comparePrice = $this->faker->optional(0.3)->randomFloat(2, $price + 5, $price + 20);
        
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 9999),
            'description' => $this->faker->sentence(8, true),
            'detailed_description' => $this->faker->optional(0.7)->paragraphs(3, true),
            'sku' => 'VINYL-' . strtoupper($this->faker->bothify('???###')),
            'price' => $price,
            'cost_price' => $costPrice,
            'compare_price' => $comparePrice,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'min_stock_level' => $this->faker->numberBetween(5, 20),
            'genre' => $this->faker->randomElement($genres),
            'label' => $this->faker->randomElement($labels),
            'image' => $this->faker->optional(0.8)->imageUrl(400, 400, 'abstract'),
            'is_featured' => $this->faker->boolean(0.2), // 20% featured
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'inactive', 'out_of_stock']),
            'meta_title' => $this->faker->optional(0.6)->sentence(4, true),
            'meta_description' => $this->faker->optional(0.6)->sentence(12, true),
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'status' => 'out_of_stock',
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Create a high-priced product.
     */
    public function expensive(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => $this->faker->randomFloat(2, 75.99, 199.99),
            'cost_price' => $this->faker->randomFloat(2, 45.99, 120.00),
            'compare_price' => $this->faker->randomFloat(2, 100.00, 249.99),
        ]);
    }
}
