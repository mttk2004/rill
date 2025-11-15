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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 19)->primary();
            $table->string('order_number', 50)->unique();
            $table->string('user_id', 19)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 12, 2)->comment('Tổng giá sản phẩm');
            $table->decimal('shipping_fee', 12, 2)->default(0)->comment('Phí vận chuyển');
            $table->decimal('discount_amount', 12, 2)->default(0)->comment('Số tiền giảm giá');
            $table->decimal('total_amount', 12, 2)->comment('Tổng thanh toán = subtotal + shipping_fee - discount_amount');
            $table->json('shipping_address')->comment('Địa chỉ giao hàng');
            $table->text('notes')->nullable()->comment('Ghi chú đơn hàng');
            $table->timestamp('placed_at');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
