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
        Schema::create('artist_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade')->comment('Sản phẩm');
            $table->foreignId('artist_id')->constrained()->onDelete('cascade')->comment('Nghệ sĩ');
            $table->enum('role', ['main', 'featured', 'composer', 'producer'])->default('main')->comment('Vai trò');
            $table->integer('sort_order')->default(0)->comment('Thứ tự hiển thị');
            $table->timestamps();
            
            // Unique constraint to avoid duplicates
            $table->unique(['product_id', 'artist_id']);
            
            // Indexes
            $table->index('product_id');
            $table->index('artist_id');
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_product');
    }
};
