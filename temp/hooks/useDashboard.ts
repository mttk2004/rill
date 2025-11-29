import { useState, useEffect } from 'react';
import * as dashboardService from '../services/dashboardService';

// In Inertia, you wouldn't need this hook to fetch data. 
// You would receive these as props directly in the Page component.
// This hook simulates that "Backend to Frontend" data handoff.

export const useDashboard = (timeRange: string) => {
  const [data, setData] = useState({
    stats: { revenue: 0, newOrders: 0, customers: 0, lowStock: 0 },
    topProducts: [] as any[],
    genreData: [] as any[],
    trendingArtists: [] as any[],
    lowStockProducts: [] as any[],
    pendingOrders: [] as any[],
    recentOrders: [] as any[]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API latency
    setLoading(true);
    
    // In a real app, 'timeRange' would be sent to the backend here
    const stats = dashboardService.getDashboardStats();
    const topProducts = dashboardService.getTopSellingProducts();
    const genreData = dashboardService.getRevenueByGenre();
    const trendingArtists = dashboardService.getTrendingArtists();
    const lowStockProducts = dashboardService.getLowStockProducts();
    const pendingOrders = dashboardService.getPendingOrders();
    const recentOrders = dashboardService.getRecentOrders();

    setData({
      stats,
      topProducts,
      genreData,
      trendingArtists,
      lowStockProducts,
      pendingOrders,
      recentOrders
    });
    
    setLoading(false);
  }, [timeRange]);

  return { ...data, loading };
};
