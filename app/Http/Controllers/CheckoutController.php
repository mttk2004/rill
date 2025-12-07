<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethod;
use App\Http\Requests\StoreOrderRequest;
use App\Models\ShoppingCartItem;
use App\Services\OrderService;
use App\Services\VnpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            // This case should ideally be handled by middleware, but as a fallback
            return redirect()->route('login');
        }

        $shippingAddresses = $user->shippingAddresses()->get();

        if ($shippingAddresses->isEmpty()) {
            return redirect()->route('addresses.index')->with('error', 'Vui lòng thêm địa chỉ giao hàng trước khi thanh toán.');
        }

        $cartItems = ShoppingCartItem::with('product.artists')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart')->with('info', 'Your cart is empty.');
        }

        $cartSummary = [
            'total_items' => $cartItems->sum('quantity'),
            'total_amount' => $cartItems->sum(fn($item) => $item->total_price),
        ];

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'cartSummary' => $cartSummary,
            'addresses' => $shippingAddresses,
            'defaultShippingAddress' => $shippingAddresses->firstWhere('is_default', true) ?? $shippingAddresses->first(),
        ]);
    }

    public function store(
        StoreOrderRequest $request,
        OrderService $orderService,
        VnpayService $vnpayService,
        \App\Services\CartService $cartService
    ) {
        $user = Auth::user();

        try {
            // CRITICAL: Final stock validation before creating order
            $cartService->validateCartStockBeforeCheckout($user->id);

            $result = $orderService->createOrderFromCart($user, $request->validated());

            if (!$result->isSuccess()) {
                return back()->withErrors(['order' => $result->message])->with('error', $result->message);
            }

            // Get order from result data (CreateOrderAction returns order directly)
            $order = $result->data;

            if (!$order) {
                \Log::error('Checkout: Order is null after creation', ['result' => $result->toArray()]);
                return back()->withErrors(['order' => 'Failed to create order'])->with('error', 'Không thể tạo đơn hàng. Vui lòng thử lại.');
            }

            \Log::info('Checkout: Order object details', [
                'order_id' => $order->id,
                'order_class' => get_class($order),
                'order_exists' => \App\Models\Order::find($order->id) !== null,
                'order_number' => $order->order_number,
            ]);

            // Clear cart after successful order creation
            ShoppingCartItem::where('user_id', $user->id)->delete();

            // Kiểm tra payment method
            $paymentMethod = $request->input('payment_method', PaymentMethod::COD->value);

            if ($paymentMethod === PaymentMethod::VNPAY->value) {
                // Tạo URL thanh toán VNPAY
                $paymentResult = $vnpayService->createPaymentUrl($order, $request->ip());

                if (!$paymentResult->success) {
                    return response()->json([
                        'error' => 'Không thể tạo link thanh toán: ' . $paymentResult->message,
                    ], 500);
                }

                $paymentUrl = $paymentResult->data['payment_url'];

                // Trả về JSON chứa payment URL cho frontend
                return response()->json([
                    'payment_url' => $paymentUrl,
                    'order_id' => $order->id,
                ]);
            }

            // COD: Redirect đến trang thank you như cũ
            \Log::info('Checkout: Order created successfully. Redirecting to thank-you.', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'url' => route('orders.thank-you', ['orderId' => $order->id])
            ]);
            return redirect()->route('orders.thank-you', ['orderId' => $order->id]);
        } catch (\Exception $e) {
            \Log::error('Checkout: Failed to create order.', ['error' => $e->getMessage()]);
            // Handle stock errors specifically
            if (str_contains($e->getMessage(), 'không đủ số lượng') ||
                str_contains($e->getMessage(), 'Không thể tạo đơn hàng')) {
                return back()->withErrors([
                    'stock' => $e->getMessage()
                ])->with('error', 'Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng cập nhật giỏ hàng.');
            }

            return back()->with('error', $e->getMessage());
        }
    }
}
