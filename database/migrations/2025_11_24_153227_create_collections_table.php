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
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Tên collection');
            $table->string('slug')->unique()->comment('URL slug');
            $table->enum('type', ['featured', 'banner', 'promotion', 'curated'])->default('featured')->comment('Loại collection');
            $table->text('description')->nullable()->comment('Mô tả');
            $table->string('image')->nullable()->comment('Ảnh collection (stored in Supabase)');
            $table->boolean('is_active')->default(true)->comment('Trạng thái hoạt động');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
