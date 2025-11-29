import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Filter, ArrowUpDown } from 'lucide-react';
import Button from '../components/Button';
import type { Order } from '@/types';

interface OrdersProps {
  orders: Order[];
}

export default function Orders({ orders = [] }: OrdersProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipping': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Giao hàng thành công';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang vận chuyển';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chờ xác nhận';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={14} />;
      case 'processing': return <Clock size={14} />;
      case 'shipping': return <Truck size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Filter
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_high':
          return b.total_amount - a.total_amount;
        case 'price_low':
          return a.total_amount - b.total_amount;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [filterStatus, sortOption]);

  return (
    <>
      <Head title="Đơn hàng của tôi - Rill" />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Lịch Sử Đơn Hàng</h1>

          {/* Filters and Sort Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang vận chuyển</option>
                <option value="delivered">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <ArrowUpDown size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price_high">Giá giảm dần</option>
                <option value="price_low">Giá tăng dần</option>
              </select>
            </div>
          </div>

          {filteredAndSortedOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Không tìm thấy đơn hàng nào phù hợp.</p>
              {filterStatus !== 'all' ? (
                <button onClick={() => setFilterStatus('all')} className="text-primary font-medium hover:underline">Xóa bộ lọc</button>
              ) : (
                <Link to="/products">
                  <Button>Mua sắm ngay</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Header */}
                  <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 transition-colors group-hover:bg-gray-100/50">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">#{order.id}</span>
                      <span className="text-sm text-gray-500 border-l border-gray-300 pl-4">{order.created_at}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Item Preview */}
                      <div className="flex-1 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                              {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                              <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total & Action */}
                      <div className="flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                        <p className="text-sm text-gray-500 mb-1">Tổng thành tiền</p>
                        <p className="text-lg font-bold text-primary mb-4">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                        </p>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" className="text-sm w-full md:w-auto">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
