import { ORDERS, PRODUCTS, ARTISTS } from '../data';
import { Product, Artist, Order } from '../types';

// In a real Inertia app, this logic resides in the Laravel Controller
// and returns JSON to the view.

export const getDashboardStats = () => {
  // 1. Calculate Revenue
  const totalRevenue = ORDERS.filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  // 2. Calculate New Orders (Mock logic)
  const newOrdersCount = ORDERS.length;

  // 3. Low Stock
  const lowStockCount = PRODUCTS.filter(p => p.stock_quantity <= (p.min_stock_level || 5)).length;

  return {
    revenue: totalRevenue,
    newOrders: newOrdersCount,
    customers: 3890, // Mock
    lowStock: lowStockCount
  };
};

export const getTopSellingProducts = (limit = 5) => {
  const salesMap: Record<string, number> = {};
  ORDERS.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        salesMap[item.product_id] = (salesMap[item.product_id] || 0) + item.quantity;
      });
    }
  });

  return Object.entries(salesMap)
    .map(([id, qty]) => {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return null;
      return { ...product, sold: qty };
    })
    .filter((p): p is Product & { sold: number } => p !== null)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
};

export const getRevenueByGenre = () => {
  const genreMap: Record<string, number> = {};
  ORDERS.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.product_id);
        if (product) {
          genreMap[product.genre] = (genreMap[product.genre] || 0) + item.total_price;
        }
      });
    }
  });
  return Object.entries(genreMap).map(([name, value]) => ({ name, value }));
};

export const getTrendingArtists = (limit = 4) => {
  const artistSales: Record<string, number> = {};
  ORDERS.forEach(order => {
      if(order.status !== 'cancelled') {
          order.items.forEach(item => {
              const product = PRODUCTS.find(p => p.id === item.product_id);
              if(product && product.artist_id) {
                  artistSales[product.artist_id] = (artistSales[product.artist_id] || 0) + item.quantity;
              }
          });
      }
  });
  
  return Object.entries(artistSales)
      .map(([id, qty]) => {
          const artist = ARTISTS.find(a => a.id === id);
          if (!artist) return null;
          return { ...artist, sales: qty };
      })
      .filter((a): a is Artist & { sales: number } => a !== null)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
};

export const getLowStockProducts = (limit = 4) => {
  return PRODUCTS.filter(p => p.stock_quantity <= (p.min_stock_level || 5)).slice(0, limit);
};

export const getPendingOrders = (limit = 4) => {
  return ORDERS.filter(o => o.status === 'pending').slice(0, limit);
};

export const getRecentOrders = (limit = 5) => {
  return [...ORDERS].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, limit);
};
