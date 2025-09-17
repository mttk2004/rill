<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtistProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define specific artist-album relationships
        $artistAlbumMappings = [
            'The Beatles' => ['Abbey Road'],
            'Pink Floyd' => ['The Dark Side of the Moon'],
            'Led Zeppelin' => ['Led Zeppelin IV'],
            'Miles Davis' => ['Kind of Blue'],
            'Radiohead' => ['OK Computer'],
            'Kraftwerk' => ['Trans-Europe Express'],
            'Daft Punk' => ['Discovery'],
            'Nirvana' => ['Nevermind'],
        ];

        // Create the specific mappings
        foreach ($artistAlbumMappings as $artistName => $albumNames) {
            $artist = Artist::where('slug', Str::slug($artistName))->first();
            if (!$artist) continue;

            foreach ($albumNames as $albumName) {
                $product = Product::where('slug', Str::slug($albumName))->first();
                if (!$product) continue;

                // Attach artist to product with 'main' role
                $artist->products()->attach($product->id, [
                    'role' => 'main',
                    'sort_order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // For remaining products without artists, assign random artists
        $productsWithoutArtists = Product::whereDoesntHave('artists')->get();
        $allArtists = Artist::active()->get();

        foreach ($productsWithoutArtists as $product) {
            if ($allArtists->isEmpty()) {
                continue; // Skip if no artists available
            }

            // Each product should have at least one main artist
            $mainArtist = $allArtists->random();
            $product->artists()->attach($mainArtist->id, [
                'role' => 'main',
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 30% chance of having a featured artist
            $availableForFeatured = $allArtists->where('id', '!=', $mainArtist->id);
            if (fake()->boolean(30) && $availableForFeatured->isNotEmpty()) {
                $featuredArtist = $availableForFeatured->random();
                $product->artists()->attach($featuredArtist->id, [
                    'role' => 'featured',
                    'sort_order' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 20% chance of having a composer (for jazz/classical)
            if (fake()->boolean(20) && in_array($product->genre, ['Jazz', 'Classical'])) {
                $availableForComposer = $allArtists->whereNotIn('id', $product->artists->pluck('id'));
                if ($availableForComposer->isNotEmpty()) {
                    $composer = $availableForComposer->random();
                    $product->artists()->attach($composer->id, [
                        'role' => 'composer',
                        'sort_order' => 3,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 15% chance of having a producer
            if (fake()->boolean(15)) {
                $availableForProducer = $allArtists->whereNotIn('id', $product->artists->pluck('id'));
                if ($availableForProducer->isNotEmpty()) {
                    $producer = $availableForProducer->random();
                    $product->artists()->attach($producer->id, [
                        'role' => 'producer',
                        'sort_order' => 4,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
