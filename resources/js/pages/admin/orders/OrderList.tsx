
import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { ORDERS } from '../../../data';
import { Order, OrderStatus } from '../../../types';
import {
  Search, Filter, Eye, ArrowUpDown, Package, Clock, CheckCircle, Truck, XCircle, CreditCard
} from 'lucide-react';
import Button from '../../../components/Button';

const OrderList = () => {
  // State
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all'); // New Payment Filter State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>(null);

  // Derived Data
  const filteredOrders = useMemo(() => {
    let items = [...orders];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(o =>
        o.order_number.toLowerCase().includes(lowerQuery) ||
        o.shipping_address.full_name.toLowerCase().includes(lowerQuery) ||
        o.shipping_address.phone.includes(lowerQuery)
      );
    }

    // Filter Status
    if (filterStatus !== 'all') {
      items = items.filter(o => o.status === filterStatus);
    }

    // Filter Payment Method
    if (filterPayment !== 'all') {
      items = items.filter(o => o.payment?.payment_method === filterPayment);
    }

    // Sort
    if (sortConfig) {
      items.sort((a, b) => {
        // @ts-ignore
        const aValue = a[sortConfig.key];
        // @ts-ignore
        const bValue = b[sortConfig.key];

        // Custom sort for Total Amount (Number)
        if (sortConfig.key === 'total_amount') {
          return sortConfig.direction === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
        }

        // Custom sort for Placed At (Date)
        if (sortConfig.key === 'placed_at') {
          const dateA = new Date(aValue as string).getTime();
          const dateB = new Date(bValue as string).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // Default String sort
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by created_at desc (Newest first)
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return items;
  }, [orders, searchQuery, filterStatus, filterPayment, sortConfig]);

  const handleSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      pending: <Clock size={12} className="mr-1" />,
      confirmed: <Package size={12} className="mr-1" />,
      shipped: <Truck size={12} className="mr-1" />,
      delivered: <CheckCircle size={12} className="mr-1" />,
      cancelled: <XCircle size={12} className="mr-1" />
    };
    const labels = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đang chuẩn bị hàng',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
        {icons[status]} {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng từ khách hàng</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shadow-sm">
        <div className="relative w-full xl:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Tìm mã đơn, khách hàng, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đang chuẩn bị hàng</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-gray-500" />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="cod">COD (Tiền mặt)</option>
              <option value="vnpay">VNPAY (Chuyển khoản)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 group"
                  onClick={() => handleSort('placed_at')}
                >
                  <div className="flex items-center gap-1">
                    Ngày đặt
                    <ArrowUpDown size={14} className={`transition-opacity ${sortConfig?.key === 'placed_at' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 group"
                  onClick={() => handleSort('total_amount')}
                >
                  <div className="flex items-center gap-1">
                    Tổng tiền
                    <ArrowUpDown size={14} className={`transition-opacity ${sortConfig?.key === 'total_amount' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-primary hover:underline cursor-pointer" onClick={() => router.visit(`/admin/orders/${order.id}`)}>
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.placed_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.shipping_address.full_name}</div>
                    <div className="text-xs text-gray-500">{order.shipping_address.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase border ${order.payment?.payment_status === 'completed'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                      {order.payment?.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.visit(`/admin/orders/${order.id}`)}
                      className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-100"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p>Không tìm thấy đơn hàng nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination mockup */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
          <span>Hiển thị {filteredOrders.length} kết quả</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 border rounded bg-primary text-white">1</button>
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
