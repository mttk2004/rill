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

        return Inertia::render('checkout', [
            'cartItems' => $cartItems,
            'cartSummary' => $cartSummary,
            'shippingAddresses' => $shippingAddresses,
            'defaultShippingAddress' => $shippingAddresses->firstWhere('is_default', true) ?? $shippingAddresses->first(),
        ]);
    }

    public function store(StoreOrderRequest $request, OrderService $orderService, VnpayService $vnpayService)
    {
        $user = Auth::user();

        try {
            // CRITICAL: Final stock validation before creating order
            // This prevents race conditions between cart view and checkout
            $this->validateCartStockBeforeCheckout($user);

            $order = $orderService->createOrderFromCart($user, $request->validated());

            // Kiểm tra payment method
            $paymentMethod = $request->input('payment_method', PaymentMethod::COD->value);

            if ($paymentMethod === PaymentMethod::VNPAY->value) {
                // Tạo URL thanh toán VNPAY
                $paymentUrl = $vnpayService->createPaymentUrl($order, $request);

                // Trả về JSON chứa payment URL cho frontend
                return response()->json([
                    'payment_url' => $paymentUrl,
                    'order_id' => $order->id,
                ]);
            }

            // COD: Redirect đến trang thank you như cũ
            return redirect()->route('orders.thank-you', $order)->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
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

    /**
     * Validate stock availability for all cart items before checkout.
     * This provides early detection of stock issues before transaction starts.
     *
     * @param \App\Models\User $user
     * @throws \Exception if any product is out of stock
     * @return void
     */
    private function validateCartStockBeforeCheckout($user): void
    {
        $cartItems = ShoppingCartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            throw new \Exception('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        }

        foreach ($cartItems as $item) {
            // Check if product still exists
            if (!$item->product) {
                throw new \Exception('Một số sản phẩm trong giỏ hàng không còn tồn tại.');
            }

            // Check stock availability
            if ($item->quantity > $item->product->stock_quantity) {
                throw new \Exception(
                    "Sản phẩm '{$item->product->name}' chỉ còn {$item->product->stock_quantity} " .
                    "sản phẩm trong kho. Vui lòng cập nhật số lượng trong giỏ hàng."
                );
            }

            // Check if product is still active
            if ($item->product->status === 'out_of_stock' || !$item->product->isInStock()) {
                throw new \Exception(
                    "Sản phẩm '{$item->product->name}' hiện không còn hàng."
                );
            }
        }
    }
}
