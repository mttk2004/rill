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
        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->string('id', 19)->primary()->comment('Snowflake ID');
            $table->string('order_id', 19)->comment('FK orders.id');
            $table->string('status', 50)->comment('Trạng thái mới');
            $table->text('notes')->nullable()->comment('Ghi chú');
            $table->string('created_by', 19)->nullable()->comment('FK users.id - Người cập nhật');
            $table->timestamp('created_at')->comment('Thời gian');

            // Foreign key constraints
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');

            // Indexes
            $table->index(['order_id', 'created_at']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
    }
};
