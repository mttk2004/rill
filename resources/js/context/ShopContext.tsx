
import React, { createContext, useContext, useMemo } from 'react';
import { Product, FlyoutCartItem } from '../types';
import { useToast } from './ToastContext';
import { router, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

interface ShopContextType {
  cart: FlyoutCartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext(undefined as unknown as ShopContextType | undefined);

export const ShopProvider = ({ children }: { children?: React.ReactNode }) => {
  const { showToast } = useToast();
  const { cart: cartData } = usePage<SharedData>().props;

  // Get cart items from shared data
  const cart = useMemo(() => cartData?.items || [], [cartData?.items]);

  const addToCart = (product: Product, quantity: number) => {
    router.post('/cart/add', {
      product_id: product.id,
      quantity: quantity,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
      },
      onError: (errors) => {
        showToast(errors.message || 'Không thể thêm vào giỏ hàng', 'error');
      }
    });
  };

  const removeFromCart = (cartItemId: number) => {
    router.delete(`/cart/${cartItemId}`, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
      },
    });
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    router.put(`/cart/${cartItemId}`, {
      quantity: quantity,
    }, {
      preserveScroll: true,
    });
  };

  const clearCart = () => {
    router.delete('/cart/clear', {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Đã xóa toàn bộ giỏ hàng', 'info');
      },
    });
  };

  const cartTotal = useMemo(() => {
    return cartData?.summary?.total_amount || 0;
  }, [cartData?.summary?.total_amount]);

  const cartCount = useMemo(() => {
    return cartData?.summary?.items_count || 0;
  }, [cartData?.summary?.items_count]);

  return (
    <ShopContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context as ShopContextType;
};
