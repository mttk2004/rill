import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';

interface OrderItem {
  id: number;
  title: string;
  artist_name: string;
  price: number;
  unit_price: number;
  image_url: string | null;
  quantity: number;
  sku: string;
  slug: string | null;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

interface Order {
  id: string;
  order_id: string;
  order_number: string;
  date: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  tracking_number?: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {

  // Definition of steps with specific colors
  const steps = [
    {
      id: 'pending',
      label: 'Đặt hàng',
      icon: Package,
      activeColor: 'bg-blue-600 text-white shadow-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'processing',
      label: 'Đang xử lý',
      icon: CreditCard,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-200',
      textColor: 'text-indigo-700'
    },
    {
      id: 'shipping',
      label: 'Đang giao',
      icon: Truck,
      activeColor: 'bg-amber-500 text-white shadow-amber-200',
      textColor: 'text-amber-700'
    },
    {
      id: 'delivered',
      label: 'Hoàn tất',
      icon: CheckCircle,
      activeColor: 'bg-emerald-600 text-white shadow-emerald-200',
      textColor: 'text-emerald-700'
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  // Helper to mock timestamps based on created_at for demo purposes
  const getStepTime = (stepId: string, index: number) => {
    // Only show time if this step is completed or active
    if (index > currentStepIndex && order.status !== 'cancelled') return null;

    // In a real app, these dates come from the backend.
    // Here we generate fake progression dates.
    const date = new Date(order.date);

    if (stepId === 'pending') {
      return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    }

    if (stepId === 'processing' && index <= currentStepIndex) {
      date.setHours(date.getHours() + 2); // Processing 2 hours later
      return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    }

    if (stepId === 'shipping' && index <= currentStepIndex) {
      date.setDate(date.getDate() + 1); // Shipping next day
      date.setHours(9, 30);
      return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    }

    if (stepId === 'delivered' && index <= currentStepIndex) {
      date.setDate(date.getDate() + 3); // Delivered 3 days later
      date.setHours(14, 15);
      return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    }

    return null;
  };

  const isCancelled = order.status === 'cancelled';

  return (
    <AppLayout>
      <Head title={`Đơn hàng #${order.id} - Rill`} />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Quay lại danh sách
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
                {isCancelled && <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">ĐÃ HỦY</span>}
              </div>
              <p className="text-gray-500 mt-1">Mã đơn: <span className="font-mono font-medium text-gray-900">#{order.order_number}</span> - {new Date(order.date).toLocaleDateString('vi-VN')}</p>
            </div>
            {order.tracking_number && (
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm shadow-sm">
                <span className="text-gray-500">Mã vận đơn:</span> <span className="font-bold text-primary ml-2 tracking-wide">{order.tracking_number}</span>
              </div>
            )}
          </div>

          {/* Progress Stepper */}
          {!isCancelled && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 overflow-x-auto shadow-sm">
              <div className="flex items-start justify-between min-w-[600px]">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const Icon = step.icon;
                  const time = getStepTime(step.id, idx);

                  // Determine styles
                  let circleClass = 'bg-gray-100 text-gray-400';
                  let textClass = 'text-gray-400';

                  if (isCompleted) {
                    circleClass = `${step.activeColor} shadow-lg ring-4 ring-white`;
                    textClass = `font-bold ${step.textColor}`;
                  }

                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4 group">

                      {/* Circle Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-20 ${circleClass}`}>
                        <Icon size={20} />
                      </div>

                      {/* Text Label */}
                      <span className={`mt-4 text-sm transition-colors duration-300 ${textClass}`}>{step.label}</span>

                      {/* Timestamp */}
                      {time && (
                        <span className="mt-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{time}</span>
                      )}

                      {/* Connector Line */}
                      {idx !== steps.length - 1 && (
                        <div className="absolute top-6 left-[50%] w-full h-[3px] -z-10 bg-gray-100">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${idx < currentStepIndex ? 'bg-primary' : 'w-0'}`}
                            style={{ width: idx < currentStepIndex ? '100%' : '0%' }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-900 flex justify-between">
                  <span>Sản phẩm</span>
                  <span className="text-sm font-normal text-gray-500">{order.items.length} món</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item: OrderItem, idx: number) => {
                    return (
                      <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                          {item.image_url && <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              {item.slug && <Link href={`/products/${item.slug}`} className="text-xs text-primary hover:underline font-medium">Xem sản phẩm</Link>}
                            </div>
                            <p className="font-bold text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded text-xs">x{item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Tổng tiền hàng</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shipping_fee)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between mb-3 text-sm text-green-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-gray-100 text-lg font-bold text-gray-900">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MapPin size={18} className="text-accent" /> Địa chỉ nhận hàng
                </h3>
                <div className="text-sm text-gray-600 space-y-1.5">
                  <p className="font-bold text-gray-900 text-base">{order.shipping_address.name}</p>
                  <p className="text-gray-500">{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.address}</p>
                  {order.shipping_address.notes && <p className="italic text-gray-500">Ghi chú: {order.shipping_address.notes}</p>}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard size={18} className="text-accent" /> Thanh toán
                </h3>
                <div className="text-sm text-gray-600">
                  {order.payment_method ? (
                    <>
                      <p className="mb-2">Phương thức: <span className="font-medium text-gray-900">{order.payment_method}</span></p>
                      <p className={`text-xs font-bold inline-block px-2.5 py-1 rounded border ${order.payment_status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {order.payment_status === 'pending' ? 'CHƯA THANH TOÁN' : 'ĐÃ THANH TOÁN'}
                      </p>
                    </>
                  ) : (
                    <p>Chưa có thông tin thanh toán</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth variant="primary">Mua lại đơn hàng</Button>
                <Button fullWidth variant="outline">Yêu cầu hỗ trợ</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
