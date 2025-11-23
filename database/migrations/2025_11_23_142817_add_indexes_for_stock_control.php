<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add indexes to optimize stock control queries and locking performance.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Optimize queries that check stock availability and status
            $table->index(['stock_quantity', 'status'], 'idx_products_stock_status');

            // Optimize queries that filter by status
            $table->index('status', 'idx_products_status');
        });

        Schema::table('shopping_cart_items', function (Blueprint $table) {
            // Optimize cart lookups and locking operations
            $table->index(['user_id', 'product_id'], 'idx_cart_user_product');
        });

        Schema::table('order_items', function (Blueprint $table) {
            // Optimize queries for stock restoration when cancelling orders
            $table->index(['order_id', 'product_id'], 'idx_order_items_order_product');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_stock_status');
            $table->dropIndex('idx_products_status');
        });

        Schema::table('shopping_cart_items', function (Blueprint $table) {
            $table->dropIndex('idx_cart_user_product');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_order_product');
        });
    }
};
