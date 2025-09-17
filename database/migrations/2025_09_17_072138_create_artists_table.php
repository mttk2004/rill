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
        Schema::create('artists', function (Blueprint $table) {
            $table->string('id', 19)->primary()->comment('Snowflake ID');
            $table->string('name')->comment('Tên nghệ sĩ');
            $table->string('slug')->unique()->comment('URL friendly name');
            $table->text('description')->nullable()->comment('Tiểu sử nghệ sĩ');
            $table->string('image')->nullable()->comment('Ảnh nghệ sĩ');
            $table->string('country', 100)->nullable()->comment('Quốc gia');
            $table->boolean('is_active')->default(true)->comment('Trạng thái');
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('slug');
            $table->index('is_active');
            // $table->fullText(['name', 'description'], 'ft_artists_search'); // Disabled for SQLite compatibility
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artists');
    }
};
