<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Mail\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
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
            // Lock cart items to prevent modification during checkout
            $cartItems = ShoppingCartItem::with('product')
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cannot create order from an empty cart.');
            }

            // CRITICAL: Validate and decrement stock FIRST before creating order
            // This ensures we don't create orders for out-of-stock products
            foreach ($cartItems as $cartItem) {
                try {
                    $cartItem->product->decrementStock($cartItem->quantity);
                } catch (\Exception $e) {
                    // Rollback entire transaction if any product is out of stock
                    throw new \Exception(
                        "Không thể tạo đơn hàng: " . $e->getMessage()
                    );
                }
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
        Mail::to($order->user)->send(new OrderStatusUpdated($order));
    }

    /**
     * Cancel order and restore stock quantities.
     * Only allows cancellation if order hasn't been shipped yet.
     *
     * @param Order $order
     * @throws \Exception if order cannot be cancelled
     * @return void
     */
    public function cancelOrder(Order $order): void
    {
        // Validate order can be cancelled
        if (in_array($order->status, [OrderStatus::SHIPPED, OrderStatus::DELIVERED, OrderStatus::CANCELLED])) {
            throw new \Exception(
                'Không thể hủy đơn hàng đã được giao hoặc đã hủy trước đó.'
            );
        }

        DB::transaction(function () use ($order) {
            // Restore stock for all order items
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);

                if ($product) {
                    $product->incrementStock($item->quantity);

                    \Log::info("Stock restored for product: {$product->name}", [
                        'product_id' => $product->id,
                        'quantity' => $item->quantity,
                        'new_stock' => $product->fresh()->stock_quantity,
                        'order_id' => $order->id,
                    ]);
                }
            }

            // Update order status
            $order->update([
                'status' => OrderStatus::CANCELLED,
            ]);

            // Update payment status if exists
            if ($order->payment) {
                $order->payment->update([
                    'payment_status' => PaymentStatus::FAILED,
                ]);
            }
        });

        // Send cancellation email
        Mail::to($order->user)->send(new OrderStatusUpdated($order));
    }
}
