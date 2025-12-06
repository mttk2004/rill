import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { QuickActions, StatsGrid, PriorityOrders, LowStockAlert, RecentOrders, GenreChart, TopProducts, RevenueChart, TrendingArtists } from '../../components/admin/dashboard';

interface DashboardProps extends Record<string, unknown> {
  dashboardStats: {
    revenue: number;
    newOrders: number;
    customers: number;
    totalProfit: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sku: string;
    image?: string;
    sales: number;
    revenue: number;
  }>;
  genreData: Array<{
    name: string;
    value: number;
    profit: number;
    profit_margin: number;
  }>;
  trendingArtists: Array<{
    id: string;
    name: string;
    country: string;
    sales: number;
    image?: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    image?: string;
    stock_quantity: number;
    min_stock_level: number;
  }>;
  pendingOrders: Array<{
    id: string;
    order_number: string;
    created_at: string;
    shipping_address: {
      full_name: string;
    };
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: {
      full_name: string;
    };
  }>;
  revenueData: Array<{
    date: string;
    revenue: number;
    orders: number;
    profit?: number;
  }>;
}

const Dashboard = () => {
  const { props } = usePage<DashboardProps>();

  const {
    dashboardStats,
    topProducts,
    genreData,
    trendingArtists = [],
    lowStockProducts,
    pendingOrders,
    recentOrders = [],
    revenueData
  } = props;

  const urlParams = new URLSearchParams(window.location.search);
  const [timeRange, setTimeRange] = useState(urlParams.get('time_range') || 'month');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header & Global Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Tổng quan thị trường</h1>
            <p className="text-gray-500 text-sm mt-1">Chào mừng trở lại, Administrator!</p>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1 rounded-xl border border-white/50 shadow-sm">
            <div className="pl-3 pr-2 text-gray-400">
              <Calendar size={16} />
            </div>
            <select
              value={timeRange}
              onChange={(e) => {
                const newTimeRange = e.target.value;
                setTimeRange(newTimeRange);
                router.get('/admin/dashboard', { time_range: newTimeRange }, {
                  preserveState: true,
                  preserveScroll: true,
                  only: ['revenueData', 'genreData', 'topProducts', 'trendingArtists', 'dashboardStats']
                });
              }}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer py-1.5 pr-2"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <StatsGrid
          revenue={dashboardStats.revenue}
          totalProfit={dashboardStats.totalProfit}
          newOrders={dashboardStats.newOrders}
          customers={dashboardStats.customers}
        />

        {/* Main Content Grid Row 1: Revenue & Trending Artists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <RevenueChart revenueData={revenueData} />
          <TrendingArtists artists={trendingArtists} />
        </div>

        {/* Main Content Grid Row 2: Top Products & Genre Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopProducts products={topProducts} />
          <GenreChart genreData={genreData} />
        </div>

        {/* Operational Widgets (Lower Priority) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriorityOrders orders={pendingOrders} />
          <LowStockAlert products={lowStockProducts} />
        </div>

        {/* Recent Orders Table */}
        <RecentOrders orders={recentOrders} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
