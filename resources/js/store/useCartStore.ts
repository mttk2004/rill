import { create } from 'zustand';
import { CartSummary, FlyoutCartItem } from '~/types';

interface CartState {
  summary: CartSummary;
  items: FlyoutCartItem[];
}

import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface CartActions {
  setCart: (cart: { summary: CartSummary; items: FlyoutCartItem[] }) => void;
  addToCart: (productId: string, quantity: number) => void;
}

const initialState: CartState = {
  summary: {
    total_items: 0,
    total_amount: 0,
    items_count: 0,
    formatted_total: '0 ₫',
  },
  items: [],
};

export const useCartStore = create<CartState & CartActions>()((set) => ({
  ...initialState,

  setCart: (cart) => set({ summary: cart.summary, items: cart.items }),

  addToCart: (productId, quantity) => {
    router.post('/cart', {
      product_id: productId,
      quantity: quantity,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể thêm sản phẩm';
        toast.error(errorMessage);
      }
    });
  },
}));
