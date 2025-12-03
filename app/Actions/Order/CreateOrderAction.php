<?php

namespace App\Actions\Order;

use App\Actions\BaseAction;
use App\DataObjects\Order\CreateOrderData;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Services\ShippingService;
use App\Services\VoucherService;
use App\Support\ServiceResult;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Support\Str;

/**
 * Create Order Action
 *
 * Single responsibility: Create a new order with items, payment, and voucher.
 */
class CreateOrderAction extends BaseAction
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected ProductRepositoryInterface $productRepository,
        protected ShippingService $shippingService,
        protected VoucherService $voucherService,
    ) {}

    /**
     * Execute order creation.
     *
     * @param CreateOrderData $data
     * @return ServiceResult
     */
    public function execute(CreateOrderData $data): ServiceResult
    {
        return $this->transaction(function () use ($data) {
            // Validate order data
            if (!$data->hasValidItems()) {
                return $this->error('Invalid order items structure');
            }

            if (!$data->hasValidShippingAddress()) {
                return $this->error('Invalid shipping address');
            }

            // Validate and lock stock for all products
            $productIds = array_column($data->items, 'product_id');
            $products = $this->productRepository->findBy('id', $productIds);

            foreach ($data->items as $item) {
                $product = $products->firstWhere('id', $item['product_id']);

                if (!$product) {
                    return $this->error("Product not found: {$item['product_id']}");
                }

                if ($product->stock_quantity < $item['quantity']) {
                    return $this->error(
                        "Insufficient stock for product: {$product->name}",
                        ['available' => $product->stock_quantity, 'requested' => $item['quantity']]
                    );
                }
            }

            // Decrease stock for all products
            foreach ($data->items as $item) {
                $this->productRepository->decreaseStock(
                    $item['product_id'],
                    $item['quantity']
                );
            }

            // Create order
            $order = $this->orderRepository->create([
                'user_id' => $data->userId,
                'order_number' => 'RL-' . strtoupper(Str::random(8)),
                'status' => OrderStatus::PENDING,
                'subtotal' => $data->subtotal,
                'shipping_fee' => $data->shippingFee,
                'discount_amount' => $data->discountAmount,
                'total_amount' => $data->totalAmount,
                'shipping_address' => $data->shippingAddress,
                'notes' => $data->notes,
                'placed_at' => now(),
            ]);

            // Create order items
            foreach ($data->items as $item) {
                $product = $products->firstWhere('id', $item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $data->paymentMethod ?? 'cod',
                'payment_status' => PaymentStatus::PENDING,
                'amount' => $data->totalAmount,
            ]);

            // Apply voucher if provided
            if ($data->voucherId) {
                $voucherResult = $this->voucherService->applyVoucherToOrder(
                    $data->voucherId,
                    $order->id,
                    $data->userId
                );

                if (!$voucherResult->success) {
                    return $this->error($voucherResult->message);
                }
            }

            return $this->success(
                $order->fresh(['items', 'payment']),
                'Order created successfully'
            );
        });
    }
}
