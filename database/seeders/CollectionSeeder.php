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
                'is_active' => true,
                'display_order' => 0,
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

        // Create a promotional collection example
        $promoCollection = Collection::create([
            'name' => 'Giảm giá đặc biệt',
            'slug' => 'giam-gia-dac-biet',
            'type' => 'promotion',
            'description' => 'Các sản phẩm đang được giảm giá',
            'is_active' => false, // Inactive by default
            'display_order' => 1,
        ]);

        $this->command->info('Created promotional collection (inactive)');
    }
}
