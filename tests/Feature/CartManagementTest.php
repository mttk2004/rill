<?php

use App\Models\User;
use App\Models\Product;
use App\Models\ShoppingCartItem;
use App\Services\CartService;

describe('Add to Cart', function () {

    test('authenticated user can add product to cart', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'status' => 'active',
            'price' => 100000,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 2, $product->price, $user->id);        expect($result->isSuccess())->toBeTrue();

        $cartItem = ShoppingCartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($cartItem)->not->toBeNull();
        expect($cartItem->quantity)->toBe(2);
    });

    test('increases quantity if product already in cart', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 3, $product->price, $user->id);        expect($result->isSuccess())->toBeTrue();

        $cartItem = ShoppingCartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($cartItem->quantity)->toBe(5);
    });

    test('prevents adding more than available stock', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'price' => 100000,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 10, $product->price, $user->id);

        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toMatch('/stock|kho|còn/');
    });

    test('prevents adding out of stock product', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 0,
            'status' => 'out_of_stock',
            'price' => 100000,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 1, $product->price, $user->id);        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('out of stock');
    });

    test('prevents adding inactive product', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'status' => 'inactive',
            'price' => 100000,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 1, $product->price, $user->id);        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('not available');
    });
});

describe('Update and Remove Cart Items', function () {

    test('can update cart item quantity', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        $cartItem = ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);
        $result = $service->updateQuantity($cartItem->id, 5, $user->id);        expect($result->isSuccess())->toBeTrue();
        expect($cartItem->fresh()->quantity)->toBe(5);
    });

    test('prevents updating quantity beyond stock', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'price' => 100000,
        ]);

        $cartItem = ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);
        $result = $service->updateQuantity($cartItem->id, 10, $user->id);        expect($result->isSuccess())->toBeFalse();
        expect($result->message)->toContain('stock');
    });

    test('can remove item from cart', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        $cartItem = ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);
        $result = $service->removeFromCart($cartItem->id, $user->id);        expect($result->isSuccess())->toBeTrue();
        expect(ShoppingCartItem::find($cartItem->id))->toBeNull();
    });

    test('can clear entire cart', function () {
        $user = User::factory()->create();

        $product1 = Product::factory()->create(['price' => 100000]);
        $product2 = Product::factory()->create(['price' => 50000]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'unit_price' => $product1->price,
        ]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product2->id,
            'quantity' => 1,
            'unit_price' => $product2->price,
        ]);

        $service = app(CartService::class);
        $result = $service->clearCart($user->id);        expect($result->isSuccess())->toBeTrue();

        $remainingItems = ShoppingCartItem::where('user_id', $user->id)->count();
        expect($remainingItems)->toBe(0);
    });
});

describe('Cart Validation and Summary', function () {

    test('validates cart before checkout', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'status' => 'active',
            'price' => 100000,
        ]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);

        // This method throws exception if validation fails, no exception means success
        $service->validateCartStockBeforeCheckout($user->id);

        expect(true)->toBeTrue();
    });

    test('detects out of stock items during validation', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 0,
            'status' => 'out_of_stock',
            'price' => 100000,
        ]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);

        // Should throw exception for out of stock
        try {
            $service->validateCartStockBeforeCheckout($user->id);
            expect(false)->toBeTrue(); // Should not reach here
        } catch (\Exception $e) {
            expect($e->getMessage())->toContain('stock');
        }
    });

    test('calculates cart total correctly', function () {
        $user = User::factory()->create();

        $product1 = Product::factory()->create(['price' => 100000]);
        $product2 = Product::factory()->create(['price' => 50000]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'unit_price' => $product1->price,
        ]);

        ShoppingCartItem::create([
            'user_id' => $user->id,
            'product_id' => $product2->id,
            'quantity' => 3,
            'unit_price' => $product2->price,
        ]);

        $service = app(CartService::class);
        $summary = $service->getCartSummary($user->id);        $expectedTotal = (100000 * 2) + (50000 * 3);
        expect($summary['total'])->toBe($expectedTotal);
        expect($summary['item_count'])->toBe(2);
    });
});

describe('Guest Cart', function () {

    test('guest can have cart with session identifier', function () {
        $sessionId = 'guest_session_123';
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        $service = app(CartService::class);
        $result = $service->addToCart($product->id, 2, $product->price, null, $sessionId);        expect($result->isSuccess())->toBeTrue();

        $cartItem = ShoppingCartItem::where('session_id', $sessionId)
            ->where('product_id', $product->id)
            ->first();

        expect($cartItem)->not->toBeNull();
        expect($cartItem->quantity)->toBe(2);
        expect($cartItem->user_id)->toBeNull();
    });

    test('guest cart merges with user cart on login', function () {
        $sessionId = 'guest_session_456';
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        // Guest cart
        ShoppingCartItem::create([
            'session_id' => $sessionId,
            'product_id' => $product->id,
            'quantity' => 3,
            'unit_price' => $product->price,
        ]);

        $service = app(CartService::class);
        $result = $service->mergeGuestCartToUser($user->id, $sessionId);

        expect($result->isSuccess())->toBeTrue();

        $userCartItem = ShoppingCartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        expect($userCartItem)->not->toBeNull();
        expect($userCartItem->quantity)->toBe(3);

        // Guest cart should be cleared
        $guestItems = ShoppingCartItem::where('session_id', $sessionId)->count();
        expect($guestItems)->toBe(0);
    });
});
