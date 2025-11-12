<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function createOrderFromCart(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cartItems = ShoppingCartItem::with('product')->where('user_id', $user->id)->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cannot create order from an empty cart.');
            }

            $shippingAddress = ShippingAddress::where('id', $data['shipping_address_id'])
                ->where('user_id', $user->id)
                ->firstOrFail();

            $subtotal = $cartItems->sum(fn($item) => $item->quantity * $item->unit_price);
            $totalAmount = $subtotal; // Assuming no discounts for now

            // Prepare address data
            $addressData = $shippingAddress->toArray();

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'RL-' . strtoupper(Str::random(8)),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'shipping_address' => $addressData,
                'billing_address' => $addressData, // Billing same as shipping for simplicity
                'placed_at' => now(),
            ]);

            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_sku' => $cartItem->product->sku,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'total_price' => $cartItem->quantity * $cartItem->unit_price,
                ]);
            }

            // Tạo payment record với payment method từ request
            $paymentMethod = $data['payment_method'] ?? 'cod';
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'payment_status' => 'pending',
                'amount' => $totalAmount,
            ]);

            // Clear the user's cart
            ShoppingCartItem::where('user_id', $user->id)->delete();

            return $order;
        });
    }
}
