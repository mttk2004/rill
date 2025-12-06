import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Clock, Users } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  shipping_address: {
    full_name: string;
  };
}

interface PriorityOrdersProps {
  orders: Order[];
}

const PriorityOrders: React.FC<PriorityOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock size={20} className="text-amber-500" /> Cần xử lý gấp
        </h3>
        <Link href="/admin/orders" className="text-xs text-primary hover:underline font-medium">Tất cả</Link>
      </div>
      <div className="space-y-3">
        {orders.length > 0 ? orders.map(order => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-100/80 transition-colors cursor-pointer"
            onClick={() => router.visit(`/admin/orders/${order.id}`)}
          >
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
        )) : (
          <div className="text-center py-8 text-gray-400 text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            Không có đơn hàng chờ xử lý.
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityOrders;
