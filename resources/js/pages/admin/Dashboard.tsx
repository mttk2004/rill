import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  DollarSign, ShoppingBag, Users, Package,
  Plus, Calendar, AlertTriangle, Clock, ChevronRight, Tag, CheckCircle, Trophy, Music, TrendingUp, Settings
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { getImageUrl } from '../../utils/image';

const CHART_COLORS = ['#1B4D3E', '#d4af37', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DashboardProps extends Record<string, unknown> {
  dashboardStats: {
    revenue: number;
    newOrders: number;
    customers: number;
    lowStock: number;
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

  const [timeRange, setTimeRange] = useState('week');

  // Transform revenue data for chart
  const chartData = revenueData.map(item => {
    const date = new Date(item.date);
    return {
      name: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }),
      value: item.revenue,
      fullDate: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đang chuẩn bị',
      shipped: 'Đang giao',
      delivered: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  };

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
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer py-1.5 pr-2"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>

        {/* Quick Actions - Glassy Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => router.visit('/admin/products/create')} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Thêm sản phẩm</span>
          </button>

          <button onClick={() => router.visit('/admin/artists/create')} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Music size={20} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Thêm nghệ sĩ</span>
          </button>

          <button onClick={() => router.visit('/admin/vouchers/create')} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Tag size={20} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Tạo khuyến mãi</span>
          </button>

          <button onClick={() => router.visit('/admin/settings')} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="bg-slate-50 text-slate-600 p-2.5 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors">
              <Settings size={20} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Cấu hình</span>
          </button>
        </div>

        {/* Stats Grid - Using reusable component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng Doanh Thu"
            value={formatCurrency(dashboardStats.revenue)}
            trend="12.5%"
            trendUp={true}
            icon={DollarSign}
            color="bg-emerald-600"
          />
          <StatCard
            title="Đơn Hàng Mới"
            value={dashboardStats.newOrders}
            trend="8.2%"
            trendUp={true}
            icon={ShoppingBag}
            color="bg-blue-600"
          />
          <StatCard
            title="Khách Hàng"
            value={dashboardStats.customers}
            trend="2.1%"
            trendUp={false}
            icon={Users}
            color="bg-amber-500"
          />
          <StatCard
            title="Sản Phẩm Tồn Kho"
            value={dashboardStats.lowStock}
            trend="Cảnh báo"
            trendUp={false}
            icon={Package}
            color="bg-slate-600"
          />
        </div>

        {/* Main Content Grid Row 1: Revenue & Trending Artists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart - Glassy */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Biểu đồ doanh thu</h3>
                <p className="text-xs text-gray-500">Dữ liệu được cập nhật thời gian thực</p>
              </div>
              <button className="text-xs font-medium text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                Xem báo cáo chi tiết
              </button>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B4D3E" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1B4D3E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(value) => formatCurrency(value).replace(/₫/, '').trim() + 'đ'}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  />
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <Area type="monotone" dataKey="value" stroke="#1B4D3E" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trending Artists - Glassy */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Nghệ sĩ đang Hot
              </h3>
              <Link href="/admin/artists" className="text-xs text-primary hover:underline font-medium">Tất cả</Link>
            </div>
            <div className="space-y-5">
              {trendingArtists.length > 0 ? trendingArtists.map((artist, idx) => (
                <div key={artist.id || idx} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                      {artist.image ? <img src={artist.image} alt="" className="h-full w-full object-cover" /> : <Users size={20} className="m-auto mt-3 text-gray-400" />}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 text-[10px] font-bold w-5 h-5 flex items-center justify-center text-primary">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{artist.name}</p>
                    <p className="text-xs text-gray-500 truncate">{artist.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{artist.sales}</p>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">bản</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid Row 2: Top Products & Genre Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Top Selling Products */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Trophy size={20} className="text-accent" /> Top sản phẩm bán chạy
              </h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Sản phẩm</th>
                    <th className="px-6 py-3 text-center">Đã bán</th>
                    <th className="px-6 py-3 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {topProducts.length > 0 ? topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                            {product.image && <img src={product.image} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">{product.sales}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">Chưa có dữ liệu bán hàng.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue by Genre */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Music size={20} className="text-blue-500" /> Doanh thu theo thể loại
              </h3>
            </div>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="45%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingLeft: '10px', maxWidth: '35%' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operational Widgets (Lower Priority) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Priority Orders Widget */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={20} className="text-amber-500" /> Cần xử lý gấp
              </h3>
              <Link href="/admin/orders" className="text-xs text-primary hover:underline font-medium">Tất cả</Link>
            </div>
            <div className="space-y-3">
              {pendingOrders.length > 0 ? pendingOrders.map(order => {
                console.log('Pending Order:', order);
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-100/80 transition-colors cursor-pointer" onClick={() => router.visit(`/admin/orders/${order.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-12 bg-amber-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          {formatDate(order.created_at)} • <Users size={10} /> {order.shipping_address?.full_name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-sm uppercase tracking-wide">Pending</span>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-400 text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  Không có đơn hàng chờ xử lý.
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Widget */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Cảnh báo tồn kho
              </h3>
              <Link href="/admin/products" className="text-xs text-primary hover:underline font-medium">Quản lý kho</Link>
            </div>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    {product.image ? (
                      <img src={getImageUrl(product.image) || ''} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">Còn: {product.stock_quantity}</span>
                      <span className="text-[10px] text-gray-400">Min: {product.min_stock_level || 5}</span>
                    </div>
                  </div>
                  <button onClick={() => router.visit(`/admin/products/${product.id}/edit`)} className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-gray-200 shadow-none hover:shadow-sm transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-8 text-green-600 text-sm flex flex-col items-center bg-green-50/30 rounded-xl border border-dashed border-green-200">
                  <CheckCircle size={32} className="mb-2 opacity-50" />
                  Kho hàng ổn định
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Đơn hàng gần đây</h3>
            <button onClick={() => router.visit('/admin/orders')} className="text-sm font-medium text-primary hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3">Ngày đặt</th>
                  <th className="px-6 py-3">Tổng tiền</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {recentOrders.map((order) => {
                  console.log('Dashboard Recent Order:', {
                    id: order.id,
                    order_number: order.order_number,
                    shipping_address: order.shipping_address,
                    full_name: order.shipping_address?.full_name
                  });

                  const fullName = order.shipping_address?.full_name || 'N/A';
                  const firstChar = fullName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 cursor-pointer group hover:shadow-sm"
                      onClick={() => router.visit(`/admin/orders/${order.id}`)}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-primary transition-colors">{order.order_number}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {firstChar}
                          </div>
                          {fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
