<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create famous albums manually for better data consistency
        $famousAlbums = [
            [
                'name' => 'Abbey Road',
                'description' => 'The Beatles\'s eleventh studio album, widely regarded as one of their best.',
                'genre' => 'Rock',
                'label' => 'Apple Records',
                'price' => 45.99,
                'is_featured' => true,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'The Dark Side of the Moon',
                'description' => 'Pink Floyd\'s eighth studio album, one of the best-selling albums worldwide.',
                'genre' => 'Progressive Rock',
                'label' => 'Harvest Records',
                'price' => 52.99,
                'is_featured' => true,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Led Zeppelin IV',
                'description' => 'The fourth studio album by Led Zeppelin, featuring "Stairway to Heaven".',
                'genre' => 'Rock',
                'label' => 'Atlantic Records',
                'price' => 48.99,
                'is_featured' => true,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Kind of Blue',
                'description' => 'Miles Davis\'s masterpiece, considered one of the greatest jazz albums ever made.',
                'genre' => 'Jazz',
                'label' => 'Columbia Records',
                'price' => 39.99,
                'is_featured' => true,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'OK Computer',
                'description' => 'Radiohead\'s third studio album, a landmark of alternative rock.',
                'genre' => 'Alternative Rock',
                'label' => 'Parlophone',
                'price' => 42.99,
                'is_featured' => true,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'Trans-Europe Express',
                'description' => 'Kraftwerk\'s sixth studio album, a pioneering work of electronic music.',
                'genre' => 'Electronic',
                'label' => 'Kling Klang',
                'price' => 38.99,
                'stock_quantity' => 12,
            ],
            [
                'name' => 'Discovery',
                'description' => 'Daft Punk\'s second studio album, blending house music with disco and rock.',
                'genre' => 'Electronic',
                'label' => 'Virgin Records',
                'price' => 44.99,
                'stock_quantity' => 16,
            ],
            [
                'name' => 'Nevermind',
                'description' => 'Nirvana\'s second studio album that brought grunge to mainstream.',
                'genre' => 'Grunge',
                'label' => 'DGC Records',
                'price' => 41.99,
                'is_featured' => true,
                'stock_quantity' => 28,
            ],
        ];

        foreach ($famousAlbums as $albumData) {
            $albumData['slug'] = \Illuminate\Support\Str::slug($albumData['name']);
            Product::factory()->create($albumData);
        }

        // Create featured products
        Product::factory()->featured()->count(10)->create();

        // Create regular products
        Product::factory()->count(40)->create();

        // Create some expensive limited edition products
        Product::factory()->expensive()->featured()->count(5)->create();

        // Create some out of stock products
        Product::factory()->outOfStock()->count(8)->create();

        // Create some inactive products
        Product::factory()->inactive()->count(5)->create();
    }
}
