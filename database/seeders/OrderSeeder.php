<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
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
     * Run the database seeds.
     *
     * Logic ràng buộc:
     * 1. Payment status phải phù hợp với order status
     * 2. Review chỉ từ đơn hàng delivered
     * 3. Timeline hợp lý: placed_at < paid_at < shipped_at < delivered_at
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->command->info('Starting Order seeding with strict business rules...');

            // Lấy customers
            $customers = User::where('role', 'customer')->get();
            if ($customers->isEmpty()) {
                $this->command->error('No customers found! Please run UserSeeder first.');
                return;
            }

            // Lấy products
            $products = Product::where('status', 'active')->get();
            if ($products->isEmpty()) {
                $this->command->error('No products found! Please run ProductSeeder first.');
                return;
            }

            $this->command->info("Found {$customers->count()} customers and {$products->count()} products");

            // Track delivered orders cho reviews
            $deliveredOrders = [];

            // Tạo orders với các trạng thái khác nhau
            // Chú ý: chỉ dùng status có trong migration enum
            $orderStatuses = [
                'delivered' => 25,    // 25 đơn đã giao - có thể review
                'shipped' => 10,      // 10 đơn đang giao
                'confirmed' => 8,     // 8 đơn đã xác nhận
                'pending' => 5,       // 5 đơn chờ xác nhận
                'cancelled' => 2,     // 2 đơn đã hủy
            ];

            $orderCount = 0;

            foreach ($orderStatuses as $status => $count) {
                for ($i = 0; $i < $count; $i++) {
                    $customer = $customers->random();

                    // Lấy địa chỉ giao hàng của customer
                    $shippingAddress = ShippingAddress::where('user_id', $customer->id)
                        ->inRandomOrder()
                        ->first();

                    if (!$shippingAddress) {
                        // Fallback nếu không có địa chỉ
                        $shippingAddressData = [
                            'full_name' => $customer->name,
                            'phone' => '0987654321',
                            'address_line_1' => 'Địa chỉ mặc định',
                            'city' => 'Hà Nội',
                            'district' => 'Hoàn Kiếm',
                            'ward' => 'Hàng Bài',
                        ];
                    } else {
                        $shippingAddressData = [
                            'full_name' => $shippingAddress->full_name,
                            'phone' => $shippingAddress->phone,
                            'address_line_1' => $shippingAddress->address_line_1,
                            'address_line_2' => $shippingAddress->address_line_2,
                            'city' => $shippingAddress->city,
                            'district' => $shippingAddress->district,
                            'ward' => $shippingAddress->ward,
                        ];
                    }

                    // Thời gian đặt hàng (1-90 ngày trước)
                    $placedAt = now()->subDays(rand(1, 90))->subHours(rand(0, 23));

                    // Tạo order items
                    $productCount = rand(1, 4);
                    $selectedProducts = $products->random(min($productCount, $products->count()));

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

                    // Discount (0-10% cho một số đơn)
                    $discountAmount = (rand(0, 10) > 7) ? round($subtotal * 0.05) : 0;
                    $totalAmount = $subtotal - $discountAmount;

                    // Tạo order với trạng thái phù hợp
                    $order = Order::create([
                        'user_id' => $customer->id,
                        'status' => $status,
                        'subtotal' => $subtotal,
                        'discount_amount' => $discountAmount,
                        'total_amount' => $totalAmount,
                        'currency' => 'VND',
                        'shipping_address' => $shippingAddressData,
                        'billing_address' => $shippingAddressData,
                        'notes' => $this->getOrderNotes($status),
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

                    // Tạo payment với trạng thái phù hợp với order status
                    $this->createPaymentForOrder($order, $status, $placedAt);

                    // Track delivered orders để tạo reviews sau
                    if ($status === 'delivered') {
                        $deliveredOrders[] = [
                            'order' => $order,
                            'customer' => $customer,
                            'items' => $orderItemsData,
                        ];
                    }

                    $orderCount++;
                    $this->command->info("✓ Created order #{$orderCount}: {$order->order_number} - {$status}");
                }
            }

            // Tạo reviews cho delivered orders
            $this->createReviewsForDeliveredOrders($deliveredOrders);

            $this->command->info("\n========== Seeding Summary ==========");
            $this->command->info("Total orders created: {$orderCount}");
            $this->command->info("Orders by status:");
            foreach ($orderStatuses as $status => $count) {
                $this->command->info("  - {$status}: {$count}");
            }
        });
    }

    /**
     * Tạo payment với trạng thái hợp lý theo order status
     * Tất cả đơn hàng đều dùng COD (thanh toán khi nhận hàng)
     */
    private function createPaymentForOrder(Order $order, string $orderStatus, $placedAt): void
    {
        // Tất cả đơn đều dùng COD
        $paymentMethod = 'cod';

        // Logic trạng thái payment dựa trên order status
        // COD: Thanh toán khi nhận hàng, nên chỉ completed khi delivered
        switch ($orderStatus) {
            case 'pending':
            case 'confirmed':
            case 'shipped':
                // Đơn chưa giao: payment pending
                $paymentStatus = 'pending';
                $processedAt = null;
                $transactionId = null;
                $gatewayResponse = null;
                break;

            case 'delivered':
                // Đơn đã giao: payment completed (đã thu tiền)
                $paymentStatus = 'completed';
                // Thanh toán khi giao hàng (cùng lúc với delivered)
                $processedAt = (clone $placedAt)->addDays(rand(3, 14));
                $transactionId = 'COD-' . strtoupper(\Str::random(10));
                $gatewayResponse = ['status' => 'success', 'message' => 'Đã thu tiền COD'];
                break;

            case 'cancelled':
                // Đơn hủy: payment failed
                $paymentStatus = 'failed';
                $processedAt = (clone $placedAt)->addHours(rand(2, 48));
                $transactionId = null;
                $gatewayResponse = ['status' => 'cancelled', 'message' => 'Đơn hàng đã bị hủy'];
                break;

            default:
                $paymentStatus = 'pending';
                $processedAt = null;
                $transactionId = null;
                $gatewayResponse = null;
        }

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => $paymentMethod,
            'payment_status' => $paymentStatus,
            'amount' => $order->total_amount,
            'currency' => 'VND',
            'transaction_id' => $transactionId,
            'gateway_response' => $gatewayResponse,
            'processed_at' => $processedAt,
        ]);
    }

    /**
     * Tạo reviews cho delivered orders
     */
    private function createReviewsForDeliveredOrders(array $deliveredOrders): void
    {
        $reviewCount = 0;

        foreach ($deliveredOrders as $orderData) {
            $order = $orderData['order'];
            $customer = $orderData['customer'];
            $items = $orderData['items'];

            // Chỉ 40% delivered orders có review (realistic)
            if (rand(1, 100) > 40) {
                continue;
            }

            // Mỗi đơn có thể review 1-2 sản phẩm
            $itemsToReview = rand(1, min(2, count($items)));
            $selectedItems = array_rand($items, min($itemsToReview, count($items)));

            if (!is_array($selectedItems)) {
                $selectedItems = [$selectedItems];
            }

            foreach ($selectedItems as $itemIndex) {
                $itemData = $items[$itemIndex];
                $product = $itemData['product'];

                // Lấy order item
                $orderItem = OrderItem::where('order_id', $order->id)
                    ->where('product_id', $product->id)
                    ->first();

                if (!$orderItem) {
                    continue;
                }

                // Rating distribution (realistic): 70% positive, 20% neutral, 10% negative
                $ratingDistribution = rand(1, 100);
                if ($ratingDistribution <= 70) {
                    $rating = rand(4, 5); // Positive
                } elseif ($ratingDistribution <= 90) {
                    $rating = 3; // Neutral
                } else {
                    $rating = rand(1, 2); // Negative
                }

                // Tạo comment có nghĩa dựa trên rating
                $comment = $this->generateReviewComment($rating, $product->name);

                // Review được tạo sau khi delivered 1-30 ngày
                $reviewedAt = (clone $order->placed_at)->addDays(rand(10, 40));

                ProductReview::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'order_item_id' => $orderItem->id,
                    'rating' => $rating,
                    'comment' => $comment,
                    'created_at' => $reviewedAt,
                    'updated_at' => $reviewedAt,
                ]);

                $reviewCount++;
            }
        }

        $this->command->info("Total reviews created: {$reviewCount}");
    }

    /**
     * Tạo order notes hợp lý
     */
    private function getOrderNotes(string $status): ?string
    {
        $notes = [
            'pending' => [
                null,
                'Khách hàng yêu cầu gọi trước khi giao',
                'Giao giờ hành chính',
            ],
            'confirmed' => [
                'Đã xác nhận đơn hàng',
                'Đang chuẩn bị hàng',
                'Đã đóng gói xong',
            ],
            'shipped' => [
                'Đã giao cho đơn vị vận chuyển',
                'Hàng đang trên đường giao',
                'Đang giao hàng',
            ],
            'delivered' => [
                'Đã giao hàng thành công',
                'Khách hàng đã nhận hàng',
                'Hoàn thành',
            ],
            'cancelled' => [
                'Khách hàng hủy đơn',
                'Hết hàng',
                'Không liên hệ được khách hàng',
            ],
        ];

        $statusNotes = $notes[$status] ?? [null];
        return $statusNotes[array_rand($statusNotes)];
    }

    /**
     * Tạo review comment có nghĩa dựa trên rating
     */
    private function generateReviewComment(int $rating, string $productName): string
    {
        $comments = [
            5 => [
                "Đĩa nhạc chất lượng tuyệt vời! Âm thanh trong trẻo, đóng gói cẩn thận.",
                "Rất hài lòng với album này. Âm thanh analog ấm áp, đáng đồng tiền bát gạo.",
                "Sản phẩm chính hãng, chất lượng cao. Shop đóng gói rất kỹ, giao hàng nhanh.",
                "Album tuyệt vời! Chất âm vinyl thật sự khác biệt. Sẽ ủng hộ shop tiếp.",
                "Mãn nhãn và mãn nhĩ! Đĩa vinyl đẹp, không tì vết. Highly recommended!",
                "Chất lượng xuất sắc! Đóng gói cẩn thận, giao hàng đúng hẹn. 5 sao xứng đáng!",
            ],
            4 => [
                "Sản phẩm tốt, âm thanh ổn. Giá hơi cao nhưng chấp nhận được.",
                "Đĩa vinyl chất lượng, đóng gói tốt. Trừ 1 sao vì giao hàng hơi lâu.",
                "Album hay, âm thanh tốt. Bìa hơi bị móp một chút nhưng không ảnh hưởng.",
                "Chất lượng tốt, giao hàng nhanh. Giá cả hợp lý cho một đĩa vinyl chính hãng.",
                "Âm thanh analog đúng như mong đợi. Sẽ tiếp tục ủng hộ shop.",
            ],
            3 => [
                "Sản phẩm bình thường, giá hơi cao so với chất lượng.",
                "Đĩa vinyl ổn nhưng âm thanh không ấn tượng lắm. Cần cải thiện đóng gói.",
                "Nhìn chung ok, nhưng bìa album bị trầy xước. Cần cải thiện packaging.",
                "Chất lượng tạm được, giao hàng chậm. Mong shop cải thiện dịch vụ.",
                "Album ổn nhưng không xuất sắc như kỳ vọng. Giá hơi đắt.",
            ],
            2 => [
                "Thất vọng về chất lượng đóng gói. Đĩa bị trầy nhẹ khi nhận hàng.",
                "Sản phẩm không như mô tả. Bìa album bị móp góc.",
                "Chất lượng dưới trung bình, không đáng giá tiền. Cần cải thiện nhiều.",
                "Giao hàng chậm, đóng gói kém. Âm thanh cũng không ấn tượng.",
            ],
            1 => [
                "Rất thất vọng! Đĩa bị trầy nhiều, ảnh hưởng đến âm thanh.",
                "Chất lượng tệ, không giống mô tả. Yêu cầu trả hàng hoàn tiền.",
                "Sản phẩm lỗi, nhiều tiếng xào xạo khi phát. Không đáng tiền.",
                "Đóng gói quá tệ, đĩa bị vỡ khi nhận hàng. Rất không hài lòng!",
            ],
        ];

        return $comments[$rating][array_rand($comments[$rating])];
    }
}
