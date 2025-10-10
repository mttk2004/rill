import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { type SharedData } from '@/types';

export function useCart() {
  const { cart } = usePage<SharedData>().props;

  /**
   * Adds an item to the cart and then reloads the page props.
   * Throws an error on failure, suitable for use with toast.promise.
   */
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await axios.post('/cart/add', {
        product_id: productId,
        quantity: quantity,
      });

      if (response.data.success) {
        // Reload all Inertia props, which will include the fresh cart data.
        router.reload();
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

  return {
    cartSummary: cart.summary,
    cartItems: cart.items,
    addToCart,
  };
}
