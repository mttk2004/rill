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
            $table->string('product_id', 19)->comment('Sản phẩm');
            $table->string('artist_id', 19)->comment('Nghệ sĩ');
            $table->enum('role', ['main', 'featured', 'composer', 'producer'])->default('main')->comment('Vai trò');
            $table->integer('sort_order')->default(0)->comment('Thứ tự hiển thị');
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('artist_id')->references('id')->on('artists')->onDelete('cascade');
            
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
