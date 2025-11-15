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
            $table->string('id', 19)->primary()->comment('Snowflake ID');
            $table->string('user_id', 19)->comment('FK users.id');
            $table->string('full_name', 255)->comment('Họ tên người nhận');
            $table->string('phone', 10)->comment('Số điện thoại');
            $table->string('address_line_1', 255)->comment('Địa chỉ dòng 1');
            $table->string('address_line_2', 255)->nullable()->comment('Địa chỉ dòng 2');
            $table->string('province', 100)->comment('Tỉnh/Thành phố');
            $table->integer('province_id')->comment('GHN Province ID');
            $table->string('district', 100)->comment('Quận/Huyện');
            $table->integer('district_id')->comment('GHN District ID');
            $table->string('ward', 100)->comment('Phường/Xã');
            $table->integer('ward_id')->comment('GHN Ward ID');
            $table->boolean('is_default')->default(false)->comment('Địa chỉ mặc định');
            $table->timestamps(); // created_at, updated_at

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Index for performance
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
