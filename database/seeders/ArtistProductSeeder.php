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

        // Định nghĩa các mối quan hệ nghệ sĩ-album thật, không còn random
        $artistAlbumMappings = [
            // Nhạc Vàng Việt Nam
            'Khánh Ly' => ['Diễm Xưa'],
            'Trịnh Công Sơn' => ['Diễm Xưa'],
            'Lam Trường' => ['Tôi Sẽ Quay Về'],
            'Đàm Vĩnh Hưng' => ['Đàm Vĩnh Hưng & Những Tình Khúc Bất Hủ'],
            'Phạm Duy' => ['Tình Ca Phạm Duy'],

            // The Beatles
            'The Beatles' => [
                'Abbey Road',
                'Sgt. Pepper\'s Lonely Hearts Club Band',
                'Revolver',
                'The Beatles (White Album)',
            ],

            // Pink Floyd
            'Pink Floyd' => [
                'The Dark Side of the Moon',
                'The Wall',
                'Wish You Were Here',
            ],

            // Led Zeppelin
            'Led Zeppelin' => [
                'Led Zeppelin IV',
                'Physical Graffiti',
                'Led Zeppelin II',
            ],

            // Queen
            'Queen' => [
                'A Night at the Opera',
                'News of the World',
                'The Game',
            ],

            // Miles Davis
            'Miles Davis' => [
                'Kind of Blue',
                'Sketches of Spain',
                'Bitches Brew',
            ],

            // John Coltrane
            'John Coltrane' => [
                'A Love Supreme',
                'Blue Train',
                'Kind of Blue', // Collaboration with Miles Davis
            ],

            // Ella Fitzgerald
            'Ella Fitzgerald' => [
                'Ella Fitzgerald Sings the Cole Porter Song Book',
                'Ella and Louis',
            ],

            // Louis Armstrong
            'Louis Armstrong' => [
                'Hello, Dolly!',
                'Ella and Louis',
            ],

            // Nirvana
            'Nirvana' => [
                'Nevermind',
                'In Utero',
            ],

            // Radiohead
            'Radiohead' => [
                'OK Computer',
                'Kid A',
                'In Rainbows',
            ],

            // Kraftwerk
            'Kraftwerk' => [
                'Trans-Europe Express',
                'The Man-Machine',
                'Autobahn',
            ],

            // Daft Punk
            'Daft Punk' => [
                'Discovery',
                'Random Access Memories',
                'Homework',
            ],

            // The Chemical Brothers
            'The Chemical Brothers' => [
                'Dig Your Own Hole',
                'Surrender',
            ],

            // Marvin Gaye
            'Marvin Gaye' => [
                'What\'s Going On',
                'Let\'s Get It On',
            ],

            // Stevie Wonder
            'Stevie Wonder' => [
                'Songs in the Key of Life',
                'Innervisions',
                'Talking Book',
            ],
        ];

        $assignedCount = 0;

        // Tạo các mối quan hệ thật giữa nghệ sĩ và album
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
                    $this->command->info("✓ Assigned {$artist->name} to {$product->name}");
                }
            }
        }

        // Kiểm tra các sản phẩm còn thiếu nghệ sĩ (nếu có)
        $productsWithoutArtists = Product::whereDoesntHave('artists')->get();

        if ($productsWithoutArtists->count() > 0) {
            $this->command->warn("Found {$productsWithoutArtists->count()} products without artists:");
            foreach ($productsWithoutArtists as $product) {
                $this->command->warn("  - {$product->name}");
            }
        }

        // Final verification
        $productsStillWithoutArtists = Product::whereDoesntHave('artists')->count();
        $totalArtistProductRelations = \DB::table('artist_product')->count();

        $this->command->info("\n========== Seeding Summary ==========");
        $this->command->info("Total artist-product relationships created: {$assignedCount}");
        $this->command->info("Total relationships in database: {$totalArtistProductRelations}");
        $this->command->info("Products without artists: {$productsStillWithoutArtists}");

        if ($productsStillWithoutArtists > 0) {
            $this->command->error("⚠ WARNING: {$productsStillWithoutArtists} products still have no artists!");
        } else {
            $this->command->info("✓ SUCCESS: All products have at least one artist!");
        }
    }
}
