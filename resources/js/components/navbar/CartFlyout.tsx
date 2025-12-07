
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Button from '../Button';
import FreeShippingProgress from '../FreeShippingProgress';
import type { SharedData } from '@/types';

interface CartFlyoutProps {
  isOpen: boolean;
}

const CartFlyout: React.FC<CartFlyoutProps> = ({ isOpen }) => {
  const { cart, cartCount, cartTotal, removeFromCart } = useShop();
  const { settings } = usePage<SharedData>().props;
  const freeShippingThreshold = settings?.shipping?.free_threshold || 1000000;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full w-96 rounded-xl border border-gray-100 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4">
        <h3 className="font-serif font-bold text-gray-900 mb-4">Giỏ hàng ({cartCount})</h3>

        {cart.length > 0 ? (
          <>
            <div className="max-h-[60vh] overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-100">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product?.name || 'Product'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product?.slug || '#'}`} className="text-sm font-medium text-gray-900 hover:text-accent truncate block">
                      {item.product?.name || 'Unnamed Product'}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price))}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 self-start p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
              {/* Free Shipping Progress */}
              <FreeShippingProgress
                currentAmount={cartTotal}
                freeShippingThreshold={freeShippingThreshold}
              />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tạm tính:</span>
                <span className="font-bold text-primary text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart">
                  <Button fullWidth variant="outline" className="text-xs">Xem giỏ hàng</Button>
                </Link>
                <Link href="/checkout">
                  <Button fullWidth variant="accent" className="text-xs">Thanh toán</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống</p>
            <Link href="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartFlyout;
