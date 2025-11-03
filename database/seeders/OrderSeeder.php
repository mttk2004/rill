<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $users = User::where('role', 'customer')->get();
            if ($users->isEmpty()) {
                $users = User::factory(10)->create(['role' => 'customer']);
            }

            $products = Product::all();
            if ($products->isEmpty()) {
                $this->command->warn('No products found. Please seed products first.');
                return;
            }

            $purchasedItems = [];

            Order::factory(50)->make()->each(function ($order) use ($users, $products, &$purchasedItems) {
                $order->user_id = $users->random()->id;
                $order->save();

                $orderItems = collect();
                $subtotal = 0;

                $productCount = rand(1, 5);
                $selectedProducts = $products->random($productCount);

                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 3);
                    $unitPrice = $product->price;
                    $totalPrice = $quantity * $unitPrice;
                    $subtotal += $totalPrice;

                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'total_price' => $totalPrice,
                    ]);
                    $orderItems->push($orderItem);

                    if (!isset($purchasedItems[$order->user_id])) {
                        $purchasedItems[$order->user_id] = [];
                    }
                    $purchasedItems[$order->user_id][$product->id] = $orderItem->id;
                }

                $order->subtotal = $subtotal;
                $order->total_amount = $subtotal - $order->discount_amount;
                $order->save();

                Payment::factory()->create([
                    'order_id' => $order->id,
                    'amount' => $order->total_amount,
                ]);
            });

            // Create reviews based on purchased items
            foreach ($purchasedItems as $userId => $products) {
                foreach ($products as $productId => $orderItemId) {
                    // Create a review for ~30% of purchased items
                    if (rand(1, 10) <= 3) {
                        ProductReview::factory()->create([
                            'user_id' => $userId,
                            'product_id' => $productId,
                            'order_item_id' => $orderItemId,
                        ]);
                    }
                }
            }
        });
    }
}
