<?php

namespace App\Services;

use App\Actions\Order\CancelOrderAction;
use App\Actions\Order\CreateOrderAction;
use App\Actions\Order\GenerateStatusChangeNotesAction;
use App\Actions\Order\UpdateOrderStatusAction;
use App\DataObjects\Order\CreateOrderData;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Order Lifecycle Service
 *
 * Handles order creation, status updates, and cancellation
 * Separated from payment and query operations
 */
class OrderLifecycleService
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected CreateOrderAction $createOrderAction,
        protected UpdateOrderStatusAction $updateOrderStatusAction,
        protected CancelOrderAction $cancelOrderAction,
        protected GenerateStatusChangeNotesAction $generateStatusChangeNotesAction,
        protected ShippingService $shippingService,
        protected VoucherService $voucherService,
    ) {}

    /**
     * Create order from user's shopping cart.
     *
     * @param User $user
     * @param array $data
     * @return ServiceResult
     */
    public function createOrderFromCart(User $user, array $data): ServiceResult
    {
        // Get cart items
        $cartItems = ShoppingCartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return ServiceResult::error('Shopping cart is empty');
        }

        // Get shipping address
        $shippingAddress = ShippingAddress::where('id', $data['shipping_address_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$shippingAddress) {
            return ServiceResult::error('Shipping address not found');
        }

        // Calculate amounts
        $subtotal = $cartItems->sum(fn($item) => $item->quantity * $item->unit_price);

        $itemsCount = $cartItems->sum('quantity');
        $estimatedWeight = $this->shippingService->estimateWeight($itemsCount);
        $shippingFeeResult = $this->shippingService->calculateFee(
            $shippingAddress,
            (int) $subtotal,
            $estimatedWeight
        );

        if (!$shippingFeeResult->isSuccess()) {
            return ServiceResult::error($shippingFeeResult->message);
        }

        $shippingFee = $shippingFeeResult->data['fee'];

        // Process voucher if provided
        $discountAmount = 0;
        $voucherId = null;
        if (!empty($data['voucher_code'])) {
            $voucherResult = $this->voucherService->validateVoucher(
                $data['voucher_code'],
                (float) $subtotal,
                $user->id
            );

            if ($voucherResult->success) {
                $discountAmount = $voucherResult->data['discount_amount'];
                $voucherId = $voucherResult->data['voucher']->id;
            }
        }

        $totalAmount = $subtotal + $shippingFee - $discountAmount;

        // Prepare order items
        $items = $cartItems->map(function ($cartItem) {
            return [
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->unit_price,
            ];
        })->toArray();

        // Create order using Action
        $orderData = new CreateOrderData(
            userId: $user->id,
            items: $items,
            shippingAddress: $shippingAddress->toArray(),
            subtotal: $subtotal,
            shippingFee: $shippingFee,
            discountAmount: $discountAmount,
            totalAmount: $totalAmount,
            voucherId: $voucherId,
            notes: $data['notes'] ?? null,
            paymentMethod: $data['payment_method'] ?? PaymentMethod::COD->value,
        );

        $result = $this->createOrderAction->execute($orderData);

        if ($result->isSuccess()) {
            // Clear cart on success
            ShoppingCartItem::where('user_id', $user->id)->delete();
        }

        return $result;
    }

    /**
     * Update order status.
     *
     * @param int $orderId
     * @param OrderStatus $status
     * @param string|null $notes
     * @return ServiceResult
     */
    public function updateOrderStatus(int $orderId, OrderStatus $status, ?string $notes = null): ServiceResult
    {
        return $this->updateOrderStatusAction->execute($orderId, $status, $notes);
    }

    /**
     * Cancel order (user-initiated).
     *
     * @param int $orderId
     * @param string|null $reason
     * @return ServiceResult
     */
    public function cancelOrder(int $orderId, ?string $reason = null): ServiceResult
    {
        return $this->cancelOrderAction->execute($orderId, $reason);
    }

    /**
     * Generate automatic notes for order status changes.
     *
     * @param string|null $oldStatus
     * @param string $newStatus
     * @return string
     */
    public function generateStatusChangeNotes(?string $oldStatus, string $newStatus): string
    {
        return $this->generateStatusChangeNotesAction->execute($oldStatus, $newStatus);
    }

    /**
     * Check if user can cancel order.
     *
     * @param Order $order
     * @return bool
     */
    public function canCancelOrder(Order $order): bool
    {
        return in_array($order->status, [OrderStatus::PENDING, OrderStatus::CONFIRMED]);
    }

    /**
     * Cancel order with stock restoration.
     *
     * @param Order $order
     * @return ServiceResult
     */
    public function cancelOrderWithStockRestore(Order $order): ServiceResult
    {
        try {
            \DB::transaction(function () use ($order) {
                // Restore stock
                foreach ($order->items as $item) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }

                // Restore voucher usage if applicable
                if ($order->voucher_id) {
                    \App\Models\Voucher::where('id', $order->voucher_id)
                        ->increment('usage_count', -1);
                }

                // Update status
                $order->update(['status' => OrderStatus::CANCELLED]);
            });

            return ServiceResult::success('Đơn hàng đã được hủy thành công.');
        } catch (\Exception $e) {
            return ServiceResult::error('Không thể hủy đơn hàng: ' . $e->getMessage());
        }
    }

    /**
     * Validate status update business rules.
     *
     * @param OrderStatus $oldStatus
     * @param OrderStatus $newStatus
     * @return string|null Error message if validation fails
     */
    public function validateStatusUpdate(OrderStatus $oldStatus, OrderStatus $newStatus): ?string
    {
        if ($oldStatus === OrderStatus::DELIVERED && $newStatus !== OrderStatus::CANCELLED) {
            return 'Không thể thay đổi trạng thái của đơn hàng đã giao';
        }

        return null;
    }
}
