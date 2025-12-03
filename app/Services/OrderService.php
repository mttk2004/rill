<?php

namespace App\Services;

use App\Actions\Order\CancelOrderAction;
use App\Actions\Order\CreateOrderAction;
use App\Actions\Order\GenerateStatusChangeNotesAction;
use App\Actions\Order\UpdateOrderStatusAction;
use App\Actions\Payment\ProcessPaymentAction;
use App\DataObjects\Order\CreateOrderData;
use App\DataObjects\Payment\PaymentData;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Support\ServiceResult;

/**
 * Refactored Order Service
 *
 * Uses Clean Architecture: Actions, Repositories, DTOs
 * Orchestrates business workflows without containing business logic
 */
class OrderService
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected CreateOrderAction $createOrderAction,
        protected UpdateOrderStatusAction $updateOrderStatusAction,
        protected CancelOrderAction $cancelOrderAction,
        protected ProcessPaymentAction $processPaymentAction,
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
     * Process successful payment from VNPay.
     *
     * @param Order $order
     * @param array $vnpayData
     * @return ServiceResult
     */
    public function processPaymentSuccess(Order $order, array $vnpayData): ServiceResult
    {
        $paymentData = PaymentData::forVNPay(
            orderId: $order->id,
            amount: (float) $order->total_amount,
            transactionId: $vnpayData['vnp_TransactionNo'] ?? '',
            vnpayData: $vnpayData
        );

        // Update payment to completed
        $paymentData = new PaymentData(
            orderId: $paymentData->orderId,
            paymentMethod: $paymentData->paymentMethod,
            amount: $paymentData->amount,
            paymentStatus: PaymentStatus::COMPLETED,
            transactionId: $paymentData->transactionId,
            vnpayData: $paymentData->vnpayData,
        );

        $result = $this->processPaymentAction->execute($paymentData);

        if ($result->isSuccess()) {
            // Update order status to confirmed
            $this->updateOrderStatusAction->execute(
                $order->id,
                OrderStatus::CONFIRMED,
                'Payment completed via VNPay'
            );
        }

        return $result;
    }

    /**
     * Process failed payment from VNPay.
     *
     * @param Order $order
     * @param array $vnpayData
     * @return ServiceResult
     */
    public function processPaymentFailure(Order $order, array $vnpayData): ServiceResult
    {
        return $this->processPaymentAction->processFailed(
            $order->id,
            'Payment failed via VNPay: ' . ($vnpayData['vnp_ResponseCode'] ?? 'Unknown error')
        );
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
     * Cancel order.
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
     * Get user orders with filters.
     *
     * @param int $userId
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getUserOrders(int $userId, array $filters = [])
    {
        $query = $this->orderRepository->newQuery()
            ->forUser($userId)
            ->withRelations(['items.product', 'payment']);

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        return $query->newest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get order by ID with relationships.
     *
     * @param int $orderId
     * @return Order|null
     */
    public function getOrderById(int $orderId): ?Order
    {
        return $this->orderRepository->newQuery()
            ->withRelations(['items.product', 'payment', 'user', 'statusHistories'])
            ->getQuery()
            ->find($orderId);
    }

    /**
     * Generate automatic notes for order status changes.
     * Helper method from OrderStatusService integration.
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
     * Check if order can be cancelled.
     *
     * @param Order $order
     * @return bool
     */
    public function canCancelOrder(Order $order): bool
    {
        return $order->status === OrderStatus::PENDING;
    }

    /**
     * Cancel order and restore stock.
     *
     * @param Order $order
     * @return ServiceResult
     */
    public function cancelOrderWithStockRestore(Order $order): ServiceResult
    {
        if (!$this->canCancelOrder($order)) {
            return ServiceResult::error('Chỉ có thể hủy đơn hàng đang chờ xác nhận.');
        }

        // Load order items with products
        $order->load('items.product');

        try {
            // Use transaction to ensure atomicity
            \DB::transaction(function () use ($order) {
                // Restore stock for each item
                foreach ($order->items as $item) {
                    if ($item->product) {
                        $item->product->incrementStock($item->quantity);
                    }
                }

                // Update order status
                $order->update(['status' => OrderStatus::CANCELLED]);
            });

            return ServiceResult::success('Đơn hàng đã được hủy thành công.');
        } catch (\Exception $e) {
            return ServiceResult::error('Không thể hủy đơn hàng: ' . $e->getMessage());
        }
    }

    /**
     * Check if order payment can be retried.
     *
     * @param Order $order
     * @return bool
     */
    public function canRetryPayment(Order $order): bool
    {
        $order->load('payment');

        return $order->payment
            && $order->payment->payment_method === PaymentMethod::VNPAY
            && $order->payment->payment_status === PaymentStatus::PENDING
            && $order->status === OrderStatus::PENDING;
    }

    /**
     * Get retry payment validation error message.
     *
     * @param Order $order
     * @return string|null
     */
    public function getRetryPaymentError(Order $order): ?string
    {
        $order->load('payment');

        if (!$order->payment) {
            return 'Không tìm thấy thông tin thanh toán.';
        }

        if ($order->payment->payment_method !== PaymentMethod::VNPAY) {
            return 'Chỉ có thể thanh toán lại cho đơn hàng VNPAY.';
        }

        if ($order->payment->payment_status !== PaymentStatus::PENDING) {
            return 'Đơn hàng này đã được thanh toán hoặc đã bị hủy.';
        }

        if ($order->status !== OrderStatus::PENDING) {
            return 'Chỉ có thể thanh toán lại cho đơn hàng đang chờ xử lý.';
        }

        return null;
    }

    /**
     * Retry payment for VNPAY order.
     *
     * @param Order $order
     * @param \Illuminate\Http\Request $request
     * @return ServiceResult
     */
    public function retryVnpayPayment(Order $order, $request): ServiceResult
    {
        $error = $this->getRetryPaymentError($order);
        if ($error) {
            return ServiceResult::error($error);
        }

        try {
            // Generate new VNPAY payment URL (reuse existing payment record)
            $vnpayService = app(\App\Services\VnpayService::class);
            $paymentUrl = $vnpayService->createPaymentUrl($order, $request);

            return ServiceResult::success([
                'payment_url' => $paymentUrl,
                'order_id' => $order->id,
            ], 'Payment URL created');
        } catch (\Exception $e) {
            return ServiceResult::error('Không thể tạo link thanh toán. Vui lòng thử lại!');
        }
    }

    /**
     * Get filtered orders for admin with pagination.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAdminOrders(array $filters)
    {
        $perPage = $filters['per_page'] ?? 20;
        $search = trim($filters['search'] ?? '');
        $status = $filters['status'] ?? null;
        $paymentStatus = $filters['payment_status'] ?? null;
        $sort = $filters['sort'] ?? 'newest';

        $query = \App\Models\Order::query()->withTrashed();

        // Search (order number, customer name, email, phone)
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // Order status filter
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Payment status filter
        if ($paymentStatus && $paymentStatus !== 'all') {
            if ($paymentStatus === \App\Enums\PaymentStatus::PENDING->value) {
                // For pending: include orders with pending payment OR without payment record
                $query->where(function ($q) use ($paymentStatus) {
                    $q->whereHas('payment', function ($subQ) use ($paymentStatus) {
                        $subQ->where('payment_status', $paymentStatus);
                    })->orWhereDoesntHave('payment');
                });
            } else {
                // For other statuses: only include orders with that specific payment status
                $query->whereHas('payment', function ($q) use ($paymentStatus) {
                    $q->where('payment_status', $paymentStatus);
                });
            }
        }

        // Sorting
        switch ($sort) {
            case 'order_number_asc':
                $query->orderBy('order_number', 'asc');
                break;
            case 'order_number_desc':
                $query->orderBy('order_number', 'desc');
                break;
            case 'total_asc':
                $query->orderBy('total_amount', 'asc');
                break;
            case 'total_desc':
                $query->orderBy('total_amount', 'desc');
                break;
            case 'oldest':
                $query->orderBy('placed_at', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('placed_at', 'desc');
                break;
        }

        // Eager load relationships
        return $query->with(['user', 'payment'])
            ->withCount('items')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get order statistics for admin dashboard.
     *
     * @return array
     */
    public function getOrderStats(): array
    {
        return \App\Models\Order::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as shipped,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled
            ', [
                \App\Enums\OrderStatus::PENDING->value,
                \App\Enums\OrderStatus::CONFIRMED->value,
                \App\Enums\OrderStatus::SHIPPED->value,
                \App\Enums\OrderStatus::DELIVERED->value,
                \App\Enums\OrderStatus::CANCELLED->value,
            ])
            ->first()
            ->toArray();
    }

    /**
     * Validate status update business rules.
     *
     * @param \App\Enums\OrderStatus $oldStatus
     * @param \App\Enums\OrderStatus $newStatus
     * @return string|null Error message if validation fails
     */
    public function validateStatusUpdate(\App\Enums\OrderStatus $oldStatus, \App\Enums\OrderStatus $newStatus): ?string
    {
        if ($oldStatus === \App\Enums\OrderStatus::DELIVERED && $newStatus !== \App\Enums\OrderStatus::CANCELLED) {
            return 'Không thể thay đổi trạng thái của đơn hàng đã giao';
        }

        return null;
    }
}
