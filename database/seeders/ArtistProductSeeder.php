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
        $this->command->info('Starting Artist-Product relationship seeding...');

        // Get all artists and products
        $allArtists = Artist::active()->get();
        $allProducts = Product::all();

        $this->command->info("Found {$allArtists->count()} artists and {$allProducts->count()} products");

        if ($allArtists->isEmpty()) {
            $this->command->error('No artists found! Please run ArtistSeeder first.');
            return;
        }

        if ($allProducts->isEmpty()) {
            $this->command->error('No products found! Please run ProductSeeder first.');
            return;
        }

        // Define specific artist-album relationships for famous albums
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

        $assignedCount = 0;

        // Create the specific mappings first
        foreach ($artistAlbumMappings as $artistName => $albumNames) {
            $artist = $allArtists->where('slug', Str::slug($artistName))->first();
            if (!$artist) {
                $this->command->warn("Artist '{$artistName}' not found, skipping...");
                continue;
            }

            foreach ($albumNames as $albumName) {
                $product = $allProducts->where('slug', Str::slug($albumName))->first();
                if (!$product) {
                    $this->command->warn("Product '{$albumName}' not found, skipping...");
                    continue;
                }

                // Check if relationship already exists
                if (!$product->artists()->where('artist_id', $artist->id)->exists()) {
                    $artist->products()->attach($product->id, [
                        'role' => 'main',
                        'sort_order' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $assignedCount++;
                    $this->command->info("Assigned {$artist->name} to {$product->name}");
                }
            }
        }

        // For ALL remaining products, ensure they have at least one main artist
        $productsWithoutArtists = Product::whereDoesntHave('artists')->get();
        $this->command->info("Found {$productsWithoutArtists->count()} products without artists");

        foreach ($productsWithoutArtists as $product) {
            // Each product MUST have at least one main artist
            $mainArtist = $allArtists->random();
            $product->artists()->attach($mainArtist->id, [
                'role' => 'main',
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $assignedCount++;
            $this->command->info("Assigned {$mainArtist->name} as main artist to {$product->name}");

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
                $assignedCount++;
                $this->command->info("Assigned {$featuredArtist->name} as featured artist to {$product->name}");
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
                    $assignedCount++;
                    $this->command->info("Assigned {$composer->name} as composer to {$product->name}");
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
                    $assignedCount++;
                    $this->command->info("Assigned {$producer->name} as producer to {$product->name}");
                }
            }
        }

        // Final verification
        $productsStillWithoutArtists = Product::whereDoesntHave('artists')->count();
        $totalArtistProductRelations = \DB::table('artist_product')->count();

        $this->command->info("Seeding completed!");
        $this->command->info("Total artist-product relationships created: {$assignedCount}");
        $this->command->info("Total artist-product relationships in database: {$totalArtistProductRelations}");
        $this->command->info("Products still without artists: {$productsStillWithoutArtists}");

        if ($productsStillWithoutArtists > 0) {
            $this->command->error("WARNING: {$productsStillWithoutArtists} products still have no artists!");
        } else {
            $this->command->info("SUCCESS: All products now have at least one artist!");
        }
    }
}
