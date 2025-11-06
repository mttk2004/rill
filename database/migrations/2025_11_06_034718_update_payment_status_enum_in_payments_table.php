<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update 'cancelled' to 'refunded' first
        DB::table('payments')
            ->where('payment_status', 'cancelled')
            ->update(['payment_status' => 'refunded']);

        // For MySQL, we need to alter the column to change the enum values
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Update 'refunded' back to 'cancelled'
        DB::table('payments')
            ->where('payment_status', 'refunded')
            ->update(['payment_status' => 'cancelled']);

        // Revert the enum values
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending'");
    }
};
