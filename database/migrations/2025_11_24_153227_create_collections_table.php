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
            $table->boolean('is_active')->default(true)->comment('Trạng thái hoạt động');
            $table->timestamp('started_at')->nullable()->comment('Thời gian bắt đầu');
            $table->timestamp('ended_at')->nullable()->comment('Thời gian kết thúc');
            $table->integer('display_order')->default(0)->comment('Thứ tự hiển thị');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('type');
            $table->index('is_active');
            $table->index('display_order');
            $table->index(['started_at', 'ended_at']);
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
