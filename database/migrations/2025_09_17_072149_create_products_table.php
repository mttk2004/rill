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
        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 19)->primary()->comment('Snowflake ID');
            $table->string('name')->comment('Tên sản phẩm');
            $table->string('slug')->unique()->comment('URL friendly name');
            $table->text('description')->comment('Mô tả ngắn');
            $table->longText('detailed_description')->nullable()->comment('Mô tả chi tiết');
            $table->string('sku', 100)->unique()->comment('Mã sản phẩm');
            $table->decimal('price', 12, 2)->comment('Giá bán');
            $table->decimal('cost_price', 12, 2)->nullable()->comment('Giá gốc');
            $table->decimal('compare_price', 12, 2)->nullable()->comment('Giá so sánh');
            $table->integer('stock_quantity')->default(0)->comment('Số lượng tồn kho');
            $table->integer('min_stock_level')->default(0)->comment('Mức tồn kho tối thiểu');
            $table->string('genre')->comment('Thể loại nhạc');
            $table->string('label')->comment('Hãng phát hành');
            $table->string('image')->nullable()->comment('Ảnh sản phẩm');
            $table->boolean('is_featured')->default(false)->comment('Sản phẩm nổi bật');
            $table->enum('status', ['active', 'inactive', 'out_of_stock'])->default('active')->comment('Trạng thái');
            $table->string('meta_title')->nullable()->comment('SEO title');
            $table->text('meta_description')->nullable()->comment('SEO description');
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('genre');
            $table->index('label');
            $table->index('status');
            $table->index('is_featured');
            // $table->fullText(['name', 'description', 'genre', 'label'], 'ft_products_search'); // Disabled for SQLite compatibility
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
