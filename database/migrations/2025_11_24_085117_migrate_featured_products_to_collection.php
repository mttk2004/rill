<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if is_featured column still exists (in case migrations run out of order)
        if (!Schema::hasColumn('products', 'is_featured')) {
            return;
        }

        // Get all products that were marked as featured
        $featuredProducts = DB::table('products')
            ->where('is_featured', true)
            ->orderBy('name')
            ->pluck('id');

        if ($featuredProducts->isEmpty()) {
            return;
        }

        // Create a default "Featured Products" collection
        $collectionId = DB::table('collections')->insertGetId([
            'name' => 'Sản phẩm nổi bật',
            'slug' => 'san-pham-noi-bat',
            'type' => 'featured',
            'description' => 'Các sản phẩm nổi bật được chọn lọc',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Attach featured products to the collection with positions
        $position = 0;
        foreach ($featuredProducts as $productId) {
            DB::table('collection_product')->insert([
                'collection_id' => $collectionId,
                'product_id' => $productId,
                'position' => $position++,
            ]);
        }

        $count = $featuredProducts->count();
        echo "✓ Migrated {$count} featured products to 'Sản phẩm nổi bật' collection\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the default featured collection if it exists
        $collection = DB::table('collections')
            ->where('slug', 'san-pham-noi-bat')
            ->first();

        if ($collection) {
            DB::table('collection_product')
                ->where('collection_id', $collection->id)
                ->delete();

            DB::table('collections')
                ->where('id', $collection->id)
                ->delete();

            echo "✓ Removed 'Sản phẩm nổi bật' collection\n";
        }
    }
};
