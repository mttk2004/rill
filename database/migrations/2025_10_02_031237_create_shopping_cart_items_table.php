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
        Schema::create('shopping_cart_items', function (Blueprint $table) {
            $table->string('id', 19)->primary()->comment('Snowflake ID');
            $table->string('user_id', 19)->nullable()->comment('FK users.id, NULL for guest users');
            $table->string('session_id', 255)->nullable()->comment('Session cho guest users');
            $table->string('product_id', 19)->comment('FK products.id (Snowflake ID)');
            $table->integer('quantity')->comment('Số lượng');
            $table->decimal('unit_price', 10, 2)->comment('Giá đơn vị');
            $table->timestamps(); // created_at, updated_at

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

            // Indexes for performance
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopping_cart_items');
    }
};
