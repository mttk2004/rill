<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add CHECK constraint to ensure stock_quantity cannot be negative.
     * This provides database-level protection against overselling.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE products ADD CONSTRAINT chk_stock_quantity CHECK (stock_quantity >= 0)');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE products ADD CONSTRAINT chk_stock_quantity CHECK (stock_quantity >= 0)');
        } elseif ($driver === 'sqlite') {
            // SQLite doesn't support adding constraints to existing tables easily
            // The constraint should be added when creating the table, or we need to recreate the table
            // For dev/testing environment with SQLite, we'll skip this
            \Log::warning('SQLite does not support adding CHECK constraints to existing tables. Skipping constraint.');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'pgsql'])) {
            DB::statement('ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_stock_quantity');
        }
    }
};
