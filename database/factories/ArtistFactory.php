<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Artist>
 */
class ArtistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->randomElement([
            'The Beatles', 'Pink Floyd', 'Led Zeppelin', 'Queen', 'The Rolling Stones',
            'Bob Dylan', 'David Bowie', 'Fleetwood Mac', 'The Eagles', 'Nirvana',
            'Radiohead', 'U2', 'The Who', 'AC/DC', 'Metallica', 'Black Sabbath',
            'Deep Purple', 'The Doors', 'Jimi Hendrix', 'Eric Clapton', 'Miles Davis',
            'John Coltrane', 'Bill Evans', 'Herbie Hancock', 'Thelonious Monk',
            'Ella Fitzgerald', 'Billie Holiday', 'Frank Sinatra', 'Nat King Cole',
            'The Velvet Underground', 'Joy Division', 'New Order', 'Depeche Mode',
            'Kraftwerk', 'Daft Punk', 'Aphex Twin', 'Boards of Canada',
            'Massive Attack', 'Portishead', 'Thom Yorke', 'Jonny Greenwood'
        ]);
        
        $countries = [
            'United Kingdom', 'United States', 'Germany', 'France', 'Canada',
            'Australia', 'Japan', 'Sweden', 'Netherlands', 'Italy', 'Spain'
        ];
        
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 9999),
            'description' => $this->faker->optional(0.8)->paragraphs(2, true),
            'image' => $this->faker->optional(0.6)->imageUrl(400, 400, 'people'),
            'country' => $this->faker->randomElement($countries),
            'is_active' => $this->faker->boolean(0.9), // 90% active
        ];
    }

    /**
     * Indicate that the artist is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the artist is from Vietnam.
     */
    public function vietnamese(): static
    {
        return $this->state(fn (array $attributes) => [
            'country' => 'Vietnam',
            'name' => $this->faker->randomElement([
                'Trịnh Công Sơn', 'Phạm Duy', 'Văn Cao', 'Lê Uyên Phương',
                'Thanh Tùng', 'Anh Bằng', 'Lam Phương', 'Hoàng Thi Thơ',
                'Sơn Tùng M-TP', 'Đen Vâu', 'Hiền Hồ', 'Chi Pu', 'Hương Tràm'
            ])
        ]);
    }
}
