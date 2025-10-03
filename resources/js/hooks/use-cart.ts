import { useState, useEffect } from 'react';
import axios from 'axios';

interface CartSummary {
  total_items: number;
  total_amount: number;
  items_count: number;
  formatted_total: string;
}

interface CartItem {
  id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image_url: string | null;
    stock_quantity: number;
    is_featured: boolean;
    status: string;
    artists: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export function useCart() {
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    total_items: 0,
    total_amount: 0,
    items_count: 0,
    formatted_total: '0đ'
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/cart/summary');
      setCartSummary(response.data);
    } catch (err) {
      setError('Failed to fetch cart summary');
      console.error('Cart summary fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/cart');
      // Since we're using Inertia, we need to extract the cart items from the response
      if (response.data.props && response.data.props.cartItems) {
        setCartItems(response.data.props.cartItems);
      }
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error('Cart items fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/cart/add', {
        product_id: productId,
        quantity: quantity
      });

      if (response.data.success) {
        await fetchCartSummary();
        return { success: true, message: response.data.message };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Failed to add item to cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartSummary();
  }, []);

  return {
    cartSummary,
    cartItems,
    loading,
    error,
    fetchCartSummary,
    fetchCartItems,
    addToCart,
    refresh: fetchCartSummary
  };
}
