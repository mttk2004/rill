import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useShop } from '../context/ShopContext';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';
import { Trash2, ArrowLeft } from 'lucide-react';
import FreeShippingProgress from '../components/FreeShippingProgress';
import type { SharedData } from '@/types';

function CartContent() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const { settings } = usePage<SharedData>().props;
  const freeShippingThreshold = settings?.shipping?.free_threshold || 1000000;

  if (cart.length === 0) {
    return (
      <>
        <Head title="Giỏ hàng - Rill" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-8">Có vẻ như bạn chưa thêm đĩa nhạc nào.</p>
          <Link href="/products">
            <Button>Bắt đầu mua sắm</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Giỏ hàng - Rill" />
      <div className="bg-white min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-10">Giỏ Hàng</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="border-t border-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex py-6 border-b border-gray-100">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product?.name || 'Product'}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/products/${item.product?.slug || '#'}`}>{item.product?.name || 'Unnamed Product'}</Link>
                          </h3>
                          <p className="ml-4">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price) * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            className="px-2 py-1 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >-</button>
                          <span className="px-2 font-medium">{item.quantity}</span>
                          <button
                            className="px-2 py-1 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link href="/products" className="text-sm font-medium text-black hover:text-gray-700 flex items-center gap-2">
                  <ArrowLeft size={16} /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="rounded-xl bg-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Tổng quan đơn hàng</h2>
                <div className="space-y-4">
                  {/* Free Shipping Progress */}
                  <FreeShippingProgress
                    currentAmount={cartTotal}
                    freeShippingThreshold={freeShippingThreshold}
                    className="-mx-2"
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Tạm tính</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Phí vận chuyển</p>
                    <p className="text-sm font-medium text-gray-900">
                      {cartTotal >= freeShippingThreshold ? (
                        <span className="text-green-600 font-semibold">Miễn phí</span>
                      ) : (
                        'Tính tại bước thanh toán'
                      )}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <p className="text-base font-bold text-gray-900">Tổng cộng</p>
                    <p className="text-base font-bold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/checkout">
                    <Button fullWidth>Tiến hành thanh toán</Button>
                  </Link>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Thanh toán an toàn qua VNPAY / COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Cart() {
  return (
    <AppLayout>
      <CartContent />
    </AppLayout>
  );
}
