<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Mail\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrderService
{
    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

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

            // Calculate shipping fee using GHN API
            $itemsCount = $cartItems->sum('quantity');
            $estimatedWeight = $this->shippingService->estimateWeight($itemsCount);
            $shippingFee = $this->shippingService->calculateFee(
                $shippingAddress,
                (int) $subtotal,
                $estimatedWeight
            );

            $discountAmount = 0; // TODO: Implement discount logic
            $totalAmount = $subtotal + $shippingFee - $discountAmount;

            // Prepare address data
            $addressData = $shippingAddress->toArray();

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'RL-' . strtoupper(Str::random(8)),
                'status' => OrderStatus::PENDING,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'shipping_address' => $addressData,
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
            $paymentMethod = $data['payment_method'] ?? PaymentMethod::COD->value;
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'payment_status' => PaymentStatus::PENDING,
                'amount' => $totalAmount,
            ]);

            // Clear the user's cart
            ShoppingCartItem::where('user_id', $user->id)->delete();

            return $order;
        });
    }

    /**
     * Xử lý thanh toán thành công từ VNPAY.
     * Cập nhật trạng thái đơn hàng và payment trong transaction.
     */
    public function processPaymentSuccess(Order $order, array $vnpayData): void
    {
        DB::transaction(function () use ($order, $vnpayData) {
            // Cập nhật payment record
            $payment = $order->payment;
            $payment->update([
                'payment_status' => PaymentStatus::COMPLETED,
                'transaction_id' => $vnpayData['vnp_TransactionNo'] ?? null,
                'gateway_response' => $vnpayData,
                'processed_at' => now(),
            ]);

            // Cập nhật trạng thái đơn hàng
            $order->update([
                'status' => OrderStatus::CONFIRMED,
            ]);
        });

        // Send email notification after transaction completes
        $order->load('user', 'items.product');
        Mail::to($order->user)->send(new OrderStatusUpdated($order));
    }

    /**
     * Xử lý thanh toán thất bại từ VNPAY.
     * Cập nhật trạng thái đơn hàng và payment trong transaction.
     */
    public function processPaymentFailure(Order $order, array $vnpayData): void
    {
        DB::transaction(function () use ($order, $vnpayData) {
            // Cập nhật payment record
            $payment = $order->payment;
            $payment->update([
                'payment_status' => PaymentStatus::FAILED,
                'gateway_response' => $vnpayData,
                'processed_at' => now(),
            ]);

            // Cập nhật trạng thái đơn hàng
            $order->update([
                'status' => OrderStatus::CANCELLED,
            ]);
        });

        // Send email notification after transaction completes
        $order->load('user', 'items.product');
        Mail::to($order->user)->send(new OrderStatusUpdated($order));
    }

    /**
     * Update order status and send notification email.
     */
    public function updateOrderStatus(Order $order, OrderStatus $newStatus): void
    {
        DB::transaction(function () use ($order, $newStatus) {
            $order->update([
                'status' => $newStatus,
            ]);
        });

        // Send email notification after transaction completes
        $order->load('user', 'items.product');
        Mail::to($order->user)->send(new OrderStatusUpdated($order));
    }
}
