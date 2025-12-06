import React from 'react';
import { router } from '@inertiajs/react';
import { formatCurrency } from '../../../utils/format';
import { formatDate } from '../../../utils/date';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: {
    full_name: string;
  };
}

interface RecentOrdersProps {
  orders: Order[];
}

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

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
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
            {orders.map((order) => {
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
  );
};

export default RecentOrders;
