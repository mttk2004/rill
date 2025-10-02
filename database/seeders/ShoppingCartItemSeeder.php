<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ShoppingCartItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShoppingCartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $products = Product::where('status', 'active')->get();

        if ($products->isEmpty()) {
            $this->command->warn('No active products found. Please run ProductSeeder first.');
            return;
        }

        // Create cart items for registered users
        foreach ($users->take(5) as $user) { // Only first 5 customers
            $itemCount = rand(1, 4); // 1-4 items per cart
            $selectedProducts = $products->random($itemCount);

            foreach ($selectedProducts as $product) {
                ShoppingCartItem::create([
                    'user_id' => $user->id,
                    'session_id' => null, // Registered user
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                    'unit_price' => $product->price,
                ]);
            }
        }

        // Create cart items for guest users (session-based)
        $guestSessions = [
            'guest_session_' . Str::random(32),
            'guest_session_' . Str::random(32),
            'guest_session_' . Str::random(32),
        ];

        foreach ($guestSessions as $sessionId) {
            $itemCount = rand(1, 2); // Guests typically have fewer items
            $selectedProducts = $products->random($itemCount);

            foreach ($selectedProducts as $product) {
                ShoppingCartItem::create([
                    'user_id' => null, // Guest user
                    'session_id' => $sessionId,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 2),
                    'unit_price' => $product->price,
                ]);
            }
        }

        // Create some specific test cart items
        $testCustomer = User::where('email', 'customer@rill.local')->first();
        $testProducts = $products->take(2);

        if ($testCustomer && $testProducts->count() >= 2) {
            foreach ($testProducts as $index => $product) {
                ShoppingCartItem::create([
                    'user_id' => $testCustomer->id,
                    'session_id' => null,
                    'product_id' => $product->id,
                    'quantity' => $index + 1, // 1, 2 quantities
                    'unit_price' => $product->price,
                ]);
            }
        }

        $this->command->info('Created shopping cart items for registered users and guest sessions.');
    }
}
