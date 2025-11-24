<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Tạo 10 đơn hàng chất lượng với status histories chi tiết
     * Tất cả đơn hàng sử dụng COD (thanh toán khi nhận hàng)
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->command->info('🚀 Starting quality-focused order seeding...');

            // Lấy dữ liệu cần thiết
            $customers = User::where('role', 'customer')->get();
            $admins = User::where('role', 'admin')->get();
            $products = Product::where('status', 'active')->get();

            if ($customers->isEmpty() || $products->isEmpty()) {
                $this->command->error('❌ Missing required data! Run UserSeeder and ProductSeeder first.');
                return;
            }

            $this->command->info("📊 Found {$customers->count()} customers, {$admins->count()} admins, {$products->count()} products");

            // Tạo 10 đơn hàng với các kịch bản khác nhau
            $this->createOrderWithStatusHistory('delivered', $customers, $admins, $products, 'Đơn hàng giao thành công - quy trình hoàn hảo');
            $this->createOrderWithStatusHistory('delivered', $customers, $admins, $products, 'Đơn hàng giao thành công - có đánh giá 5 sao', true);
            $this->createOrderWithStatusHistory('delivered', $customers, $admins, $products, 'Đơn hàng giao thành công - giao nhanh trong ngày');

            $this->createOrderWithStatusHistory('shipped', $customers, $admins, $products, 'Đơn hàng đang giao - đã xuất kho');
            $this->createOrderWithStatusHistory('shipped', $customers, $admins, $products, 'Đơn hàng đang giao - giao xa');

            $this->createOrderWithStatusHistory('confirmed', $customers, $admins, $products, 'Đơn hàng đã xác nhận - đang chuẩn bị');
            $this->createOrderWithStatusHistory('confirmed', $customers, $admins, $products, 'Đơn hàng đã xác nhận - chờ đóng gói');

            $this->createOrderWithStatusHistory('pending', $customers, $admins, $products, 'Đơn hàng mới - chờ xử lý');
            $this->createOrderWithStatusHistory('pending', $customers, $admins, $products, 'Đơn hàng mới - khách hàng vừa đặt');

            $this->createOrderWithStatusHistory('cancelled', $customers, $admins, $products, 'Đơn hàng đã hủy - khách hàng đổi ý');

            $this->command->info("\n✅ Successfully created 10 quality orders with detailed status histories!");
        });
    }

    /**
     * Tạo một đơn hàng với đầy đủ status histories
     * Tất cả đơn hàng sử dụng COD
     */
    private function createOrderWithStatusHistory(
        string $finalStatus,
        $customers,
        $admins,
        $products,
        string $description,
        bool $shouldCreateReview = false
    ): void {
        $customer = $customers->random();
        $admin = $admins->isNotEmpty() ? $admins->random() : null;

        // Lấy địa chỉ giao hàng
        $shippingAddress = ShippingAddress::where('user_id', $customer->id)->inRandomOrder()->first();

        if (!$shippingAddress) {
            $shippingAddressData = [
                'full_name' => $customer->name,
                'phone' => '0987654321',
                'address_line_1' => $this->faker->streetAddress(),
                'province' => 'Hà Nội',
                'district' => 'Hoàn Kiếm',
                'ward' => 'Hàng Bài',
            ];
        } else {
            $shippingAddressData = [
                'full_name' => $shippingAddress->full_name,
                'phone' => $shippingAddress->phone,
                'address_line_1' => $shippingAddress->address_line_1,
                'address_line_2' => $shippingAddress->address_line_2,
                'province' => $shippingAddress->province,
                'district' => $shippingAddress->district,
                'ward' => $shippingAddress->ward,
            ];
        }

        // Tạo order items (2-3 sản phẩm)
        $selectedProducts = $products->random(rand(2, 3));
        $subtotal = 0;
        $orderItemsData = [];

        foreach ($selectedProducts as $product) {
            $quantity = rand(1, 2);
            $unitPrice = $product->price;
            $totalPrice = $quantity * $unitPrice;
            $subtotal += $totalPrice;

            $orderItemsData[] = [
                'product' => $product,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ];
        }

        // Discount ngẫu nhiên
        $discountAmount = (rand(0, 10) > 8) ? round($subtotal * 0.05) : 0;
        $shippingFee = rand(15000, 50000);
        $totalAmount = $subtotal + $shippingFee - $discountAmount;

        // Timeline: Bắt đầu từ placed_at
        $placedAt = match($finalStatus) {
            'delivered' => now()->subDays(rand(7, 30)),
            'shipped' => now()->subDays(rand(2, 5)),
            'confirmed' => now()->subDays(rand(1, 3)),
            'pending' => now()->subHours(rand(1, 24)),
            'cancelled' => now()->subDays(rand(1, 7)),
        };

        // Tạo order với status pending ban đầu (sẽ tự động tạo history đầu tiên)
        $order = Order::create([
            'user_id' => $customer->id,
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'shipping_address' => $shippingAddressData,
            'notes' => null,
            'placed_at' => $placedAt,
        ]);

        // Tạo order items
        foreach ($orderItemsData as $itemData) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $itemData['product']->id,
                'product_name' => $itemData['product']->name,
                'product_sku' => $itemData['product']->sku ?? 'N/A',
                'quantity' => $itemData['quantity'],
                'unit_price' => $itemData['unit_price'],
                'total_price' => $itemData['total_price'],
            ]);
        }

        // Tạo payment (COD)
        $this->createPayment($order, $finalStatus, $placedAt);

        // Tạo status histories theo finalStatus
        $this->createStatusHistories($order, $finalStatus, $placedAt, $admin);

        // Tạo review nếu cần
        if ($shouldCreateReview && $finalStatus === 'delivered') {
            $this->createReviewForOrder($order, $customer, $orderItemsData);
        }

        $this->command->info("✓ {$order->order_number} - {$finalStatus} - {$description}");
    }

    /**
     * Tạo payment record với COD
     */
    private function createPayment(Order $order, string $finalStatus, $placedAt): void
    {
        $paymentStatus = match($finalStatus) {
            'pending' => 'pending',
            'cancelled' => 'failed',
            default => 'completed',
        };

        $processedAt = match($finalStatus) {
            'pending' => null,
            'confirmed' => (clone $placedAt)->addHours(rand(1, 6)),
            'shipped' => (clone $placedAt)->addDays(rand(1, 2)),
            'delivered' => (clone $placedAt)->addDays(rand(3, 7)),
            'cancelled' => (clone $placedAt)->addHours(rand(2, 24)),
        };

        $transactionId = ($paymentStatus === 'completed') ? 'COD-' . strtoupper(\Str::random(10)) : null;

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cod',
            'payment_status' => $paymentStatus,
            'amount' => $order->total_amount,
            'transaction_id' => $transactionId,
            'gateway_response' => $paymentStatus === 'completed'
                ? ['status' => 'confirmed', 'message' => 'Thanh toán COD khi nhận hàng']
                : null,
            'processed_at' => $processedAt,
        ]);
    }

    /**
     * Tạo status histories theo timeline thực tế
     */
    private function createStatusHistories(Order $order, string $finalStatus, $placedAt, $admin): void
    {
        // Xóa history tự động tạo bởi Order model
        OrderStatusHistory::where('order_id', $order->id)->delete();

        $currentTime = clone $placedAt;
        $adminId = $admin?->id;

        // Luôn có pending đầu tiên
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'notes' => 'Đơn hàng mới được tạo, chờ xác nhận',
            'created_by' => null, // Khách hàng tạo
            'created_at' => $currentTime,
        ]);

        // Thêm histories theo finalStatus
        match($finalStatus) {
            'pending' => null, // Chỉ có pending

            'confirmed' => $this->addConfirmedHistory($order, $currentTime, $adminId),

            'shipped' => $this->addShippedHistories($order, $currentTime, $adminId),

            'delivered' => $this->addDeliveredHistories($order, $currentTime, $adminId),

            'cancelled' => $this->addCancelledHistory($order, $currentTime, $adminId),
        };

        // Cập nhật status cuối cùng của order (không trigger events để tránh tạo duplicate history)
        DB::table('orders')->where('id', $order->id)->update(['status' => $finalStatus]);
    }

    private function addConfirmedHistory($order, $currentTime, $adminId): void
    {
        $currentTime->addHours(rand(1, 8));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'confirmed',
            'notes' => 'Đã xác nhận đơn hàng, đang chuẩn bị hàng',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);
    }

    private function addShippedHistories($order, $currentTime, $adminId): void
    {
        // Confirmed
        $currentTime->addHours(rand(2, 12));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'confirmed',
            'notes' => 'Đã xác nhận và kiểm tra hàng',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);

        // Shipped
        $currentTime->addDays(rand(1, 2));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'shipped',
            'notes' => 'Đã đóng gói và giao cho đơn vị vận chuyển',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);
    }

    private function addDeliveredHistories($order, $currentTime, $adminId): void
    {
        // Confirmed
        $currentTime->addHours(rand(3, 10));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'confirmed',
            'notes' => 'Xác nhận đơn hàng thành công',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);

        // Shipped
        $currentTime->addDays(rand(1, 2));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'shipped',
            'notes' => 'Hàng đã xuất kho và đang trên đường giao',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);

        // Delivered
        $currentTime->addDays(rand(2, 5));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'delivered',
            'notes' => 'Giao hàng thành công, khách hàng đã nhận và thanh toán',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);
    }

    private function addCancelledHistory($order, $currentTime, $adminId): void
    {
        $currentTime->addHours(rand(2, 24));
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'cancelled',
            'notes' => 'Khách hàng yêu cầu hủy đơn',
            'created_by' => $adminId,
            'created_at' => $currentTime,
        ]);
    }

    /**
     * Tạo review cho đơn delivered
     */
    private function createReviewForOrder(Order $order, User $customer, array $orderItemsData): void
    {
        $itemData = $orderItemsData[array_rand($orderItemsData)];
        $product = $itemData['product'];

        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('product_id', $product->id)
            ->first();

        if ($orderItem) {
            $reviewedAt = (clone $order->placed_at)->addDays(rand(10, 20));

            ProductReview::create([
                'user_id' => $customer->id,
                'product_id' => $product->id,
                'order_item_id' => $orderItem->id,
                'rating' => 5,
                'comment' => 'Đĩa nhạc chất lượng xuất sắc! Âm thanh trong trẻo, đóng gói rất cẩn thận. Shop phục vụ nhiệt tình, giao hàng nhanh. Sẽ tiếp tục ủng hộ!',
                'created_at' => $reviewedAt,
                'updated_at' => $reviewedAt,
            ]);
        }
    }
}
