<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or find the default featured collection
        $featuredCollection = Collection::firstOrCreate(
            ['slug' => 'san-pham-noi-bat'],
            [
                'name' => 'Sản phẩm nổi bật',
                'type' => 'featured',
                'description' => 'Các sản phẩm nổi bật được chọn lọc',
                'image' => 'collections/DFcszKPkNGbFbKikwu7Ue6TOJO0lftHOKWjXlPjs.webp',
                'is_active' => true,
            ]
        );

        // Add products if the collection is empty
        if ($featuredCollection->products()->count() === 0) {
            $products = Product::active()
                ->inRandomOrder()
                ->limit(8)
                ->get();

            // Attach products with positions
            $position = 0;
            foreach ($products as $product) {
                $featuredCollection->products()->attach($product->id, [
                    'position' => $position++,
                ]);
            }

            $this->command->info("Added {$products->count()} products to featured collection");
        } else {
            $this->command->info("Featured collection already has {$featuredCollection->products()->count()} products");
        }

        // Create additional collections with sample data
        $collections = [
            // [
            //     'name' => 'Giảm giá đặc biệt',
            //     'slug' => 'giam-gia-dac-biet',
            //     'type' => 'promotion',
            //     'description' => 'Các sản phẩm đang được giảm giá',
            //     'image' => null,
            //     'is_active' => false,
            // ],
            // [
            //     'name' => 'Jazz Classics',
            //     'slug' => 'jazz-classics',
            //     'type' => 'curated',
            //     'description' => 'Những album Jazz kinh điển không thể bỏ lỡ',
            //     'image' => null,
            //     'is_active' => true,
            // ],
            [
                'name' => 'Rock Legends',
                'slug' => 'rock-legends',
                'type' => 'curated',
                'description' => 'Huyền thoại nhạc Rock qua các thời kỳ',
                'image' => 'collections/uu5Vvs0ZXzdPugmUowO2qPgW21fewXvh64nq7iby.webp',
                'is_active' => true,
            ],
        ];

        foreach ($collections as $collectionData) {
            Collection::firstOrCreate(
                ['slug' => $collectionData['slug']],
                $collectionData
            );
        }

        $this->command->info('Created sample collections');
    }
}
