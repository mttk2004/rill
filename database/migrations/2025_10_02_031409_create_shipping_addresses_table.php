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
        Schema::create('shipping_addresses', function (Blueprint $table) {
            $table->id(); // bigint primary key
            $table->unsignedBigInteger('user_id'); // FK users.id
            $table->string('full_name', 255); // Họ tên người nhận
            $table->string('phone', 10); // Số điện thoại
            $table->string('address_line_1', 255); // Địa chỉ dòng 1
            $table->string('address_line_2', 255)->nullable(); // Địa chỉ dòng 2
            $table->string('city', 100); // Thành phố
            $table->string('district', 100); // Quận/Huyện
            $table->string('ward', 100); // Phường/Xã
            $table->string('postal_code', 20)->nullable(); // Mã bưu điện
            $table->boolean('is_default')->default(false); // Địa chỉ mặc định
            $table->timestamps(); // created_at, updated_at
            
            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Index for performance
            $table->index('user_id');
            $table->index(['user_id', 'is_default']); // For finding default address
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_addresses');
    }
};
