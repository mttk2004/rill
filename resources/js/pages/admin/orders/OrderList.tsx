import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Search, Filter, Eye, Package, Clock, CheckCircle, Truck, XCircle, CreditCard
} from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentMethod = 'cod' | 'vnpay';
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface UserAddress {
  id?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  province: string;
  district: string;
  ward: string;
}

interface Payment {
  id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  amount: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: UserAddress;
  placed_at: string;
  created_at: string;
  deleted_at?: string | null;
  user?: {
    name: string;
    phone?: string;
  };
  payment?: Payment;
  items_count?: number;
}

interface OrderListProps {
  orders: {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
    payment_status?: string;
    sort?: string;
  };
}

const OrderList = ({ orders: ordersPagination, filters }: OrderListProps) => {
  // State for filters - initialize from backend
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
  const [filterPayment, setFilterPayment] = useState(filters.payment_status || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'newest');

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.append('search', value);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
      if (sortBy) params.append('sort', sortBy);

      router.get(`/admin/orders?${params.toString()}`, {}, {
        preserveState: true,
        preserveScroll: true,
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons: Record<OrderStatus, React.ReactNode> = {
      pending: <Clock size={12} className="mr-1" />,
      confirmed: <Package size={12} className="mr-1" />,
      shipped: <Truck size={12} className="mr-1" />,
      delivered: <CheckCircle size={12} className="mr-1" />,
      cancelled: <XCircle size={12} className="mr-1" />
    };
    const labels: Record<OrderStatus, string> = {
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
    <AdminLayout>
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
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (e.target.value && e.target.value !== 'all') params.append('status', e.target.value);
                  if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
                  if (sortBy) params.append('sort', sortBy);
                  router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
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
                onChange={(e) => {
                  setFilterPayment(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (e.target.value && e.target.value !== 'all') params.append('payment_status', e.target.value);
                  if (sortBy) params.append('sort', sortBy);
                  router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả thanh toán</option>
                <option value="pending">Chưa thanh toán</option>
                <option value="completed">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
                  params.append('sort', e.target.value);
                  router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="order_number_asc">Mã đơn A-Z</option>
                <option value="order_number_desc">Mã đơn Z-A</option>
                <option value="total_asc">Tổng tiền thấp → cao</option>
                <option value="total_desc">Tổng tiền cao → thấp</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordersPagination.data.length > 0 ? ordersPagination.data.map((order) => (
                  <tr key={order.id} className={`hover:bg-gray-50 transition-colors group ${order.deleted_at ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary hover:underline cursor-pointer" onClick={() => router.visit(`/admin/orders/${order.id}`)}>
                          {order.order_number}
                        </span>
                        {order.deleted_at && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Đã hủy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.placed_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user?.name || order.shipping_address?.full_name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.user?.phone || order.shipping_address?.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase border ${order.payment?.payment_method === 'cod'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                          {order.payment?.payment_method || 'COD'}
                        </span>
                        {order.payment && (
                          <span className={`text-xs px-2 py-0.5 rounded ${order.payment.payment_status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : order.payment.payment_status === 'failed'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                            }`}>
                            {order.payment.payment_status === 'completed' ? 'Đã thanh toán' : order.payment.payment_status === 'failed' ? 'Thất bại' : 'Chưa thanh toán'}
                          </span>
                        )}
                      </div>
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
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{ordersPagination.data.length}</span> trong tổng số{' '}
            <span className="font-medium">{ordersPagination.total}</span> đơn hàng
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            {ordersPagination.current_page > 1 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
                  if (sortBy) params.append('sort', sortBy);
                  params.append('page', String(ordersPagination.current_page - 1));
                  router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Trước
              </button>
            )}

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: ordersPagination.last_page }, (_, i) => i + 1).map((page) => {
                const isCurrentPage = page === ordersPagination.current_page;
                const isNearCurrent = Math.abs(page - ordersPagination.current_page) <= 2;
                const isFirstOrLast = page === 1 || page === ordersPagination.last_page;

                if (!isNearCurrent && !isFirstOrLast) {
                  if (page === 2 || page === ordersPagination.last_page - 1) {
                    return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => {
                      if (page === ordersPagination.current_page) return;
                      const params = new URLSearchParams();
                      if (searchQuery) params.append('search', searchQuery);
                      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                      if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
                      if (sortBy) params.append('sort', sortBy);
                      params.append('page', String(page));
                      router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                    }}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${isCurrentPage
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {ordersPagination.current_page < ordersPagination.last_page && (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterPayment && filterPayment !== 'all') params.append('payment_status', filterPayment);
                  if (sortBy) params.append('sort', sortBy);
                  params.append('page', String(ordersPagination.current_page + 1));
                  router.get(`/admin/orders?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Sau
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
