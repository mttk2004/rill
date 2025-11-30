import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  placed_at: string;
  items: OrderItem[];
}

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface OrdersProps {
  orders: PaginatedOrders;
  filters?: {
    status?: string;
  };
}

export default function Orders({ orders }: OrdersProps) {
  const ordersList = orders.data || [];

  // Debug logs
  console.log('Orders prop:', orders);
  console.log('Orders data:', ordersList);
  if (ordersList.length > 0) {
    console.log('First order:', ordersList[0]);
    console.log('First order items:', ordersList[0].items);
  }

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

  return (
    <AppLayout>
      <Head title="Đơn hàng của tôi - Rill" />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Lịch Sử Đơn Hàng</h1>

          {ordersList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào.</p>
              <Link href="/products">
                <Button>Mua sắm ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {ordersList.map((order: Order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Header */}
                  <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 transition-colors group-hover:bg-gray-100/50">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">#{order.order_number}</span>
                      <span className="text-sm text-gray-500 border-l border-gray-300 pl-4">{new Date(order.placed_at).toLocaleDateString('vi-VN')}</span>
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
                        {order.items.map((item: OrderItem, idx: number) => (
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
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.total_amount))}
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
    </AppLayout>
  );
}
