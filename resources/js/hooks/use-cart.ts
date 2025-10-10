import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Interface for the cart summary data
interface CartSummary {
  total_items: number;
  total_amount: number;
  items_count: number;
  formatted_total: string;
}

// Interface for the cart items specifically for the flyout
interface FlyoutCartItem {
  id: number;
  quantity: number;
  unit_price: number;
  product: {
    name: string;
    slug: string;
    image_url: string | null;
  };
}

export function useCart() {
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    total_items: 0,
    total_amount: 0,
    items_count: 0,
    formatted_total: '0đ'
  });
  const [cartItems, setCartItems] = useState<FlyoutCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches both cart summary and cart items data concurrently.
   */
  const fetchCartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, itemsRes] = await Promise.all([
        axios.get<CartSummary>('/cart/summary'),
        axios.get<FlyoutCartItem[]>('/cart/items')
      ]);
      setCartSummary(summaryRes.data);
      setCartItems(itemsRes.data);
    } catch (err) {
      // Don't show error for guests who don't have a cart session yet
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
          setError('Failed to fetch cart data');
          console.error('Cart data fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds an item to the cart and then refreshes the cart data.
   * Throws an error on failure, suitable for use with toast.promise.
   */
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await axios.post('/cart/add', {
        product_id: productId,
        quantity: quantity,
      });

      if (response.data.success) {
        // Refetch all cart data for the flyout
        await fetchCartData();
        // Also reload Inertia props to update UI elements like the disabled state on the products page
        router.reload({ only: ['cartItemProductIds'] });
        return { success: true, message: response.data.message };
      } else {
        // This case handles non-exception failures from the backend
        throw new Error(response.data.message || 'An unknown error occurred.');
      }
    } catch (err) {
      // Handles network errors or exceptions from the backend
      const message = axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error ? err.message : 'Failed to add item to cart';

      // Rethrow the error so the UI layer (e.g., toast.promise) can catch it
      throw new Error(message);
    }
  };

  // Fetch initial cart data when the hook is first used
  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  return {
    cartSummary,
    cartItems,
    loading,
    error,
    addToCart,
    refresh: fetchCartData, // Expose a manual refresh function
  };
}
