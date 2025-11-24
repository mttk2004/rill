<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_featured']); // Drop the index first
            $table->dropColumn(['compare_price', 'is_featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('compare_price', 12, 2)->nullable()->comment('Giá so sánh')->after('cost_price');
            $table->boolean('is_featured')->default(false)->comment('Sản phẩm nổi bật')->after('image');
            $table->index('is_featured');
        });
    }
};
