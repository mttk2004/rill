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
        Schema::create('collection_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained()->cascadeOnDelete()->comment('Collection ID');
            $table->string('product_id', 19)->comment('Product ID (Snowflake)');
            $table->integer('position')->default(0)->comment('Vị trí trong collection');
            $table->timestamps();

            // Foreign key
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();

            // Indexes
            $table->unique(['collection_id', 'product_id']);
            $table->index('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_product');
    }
};
