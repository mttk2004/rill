import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  product_slug: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface ShippingAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  ward: string;
  district: string;
  province: string;
}

interface Payment {
  payment_method: string | { [key: string]: string };
  payment_status: string | { [key: string]: string };
}

interface StatusHistory {
  status: string;
  created_at: string;
  notes: string | null;
  created_by: {
    id: string;
    name: string;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string | { [key: string]: string };
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  total_amount: string;
  placed_at: string;
  tracking_number?: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment?: Payment;
  status_histories?: StatusHistory[];
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  // Debug log
  console.log('OrderDetail - order prop:', order);
  console.log('OrderDetail - order.items:', order.items);
  console.log('OrderDetail - order.status_histories:', order.status_histories);

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
      activeColor: 'bg-purple-600 text-white shadow-purple-200',
      textColor: 'text-purple-700'
    },
    {
      id: 'shipping',
      label: 'Đang giao',
      icon: Truck,
      activeColor: 'bg-orange-500 text-white shadow-orange-200',
      textColor: 'text-orange-700'
    },
    {
      id: 'delivered',
      label: 'Hoàn tất',
      icon: CheckCircle,
      activeColor: 'bg-emerald-600 text-white shadow-emerald-200',
      textColor: 'text-emerald-700'
    },
  ];

  // Map status_histories to steps with real data
  const statusMap: { [key: string]: string } = {
    pending: 'pending',
    confirmed: 'processing',
    shipped: 'shipping',
    delivered: 'delivered',
  };

  // Find current step based on order status
  const currentStatus = typeof order.status === 'string' ? order.status : Object.values(order.status)[0];
  const currentStepIndex = steps.findIndex(s => s.id === statusMap[currentStatus]);

  // Helper to get real timestamp from status_histories
  const getStepTime = (stepId: string) => {
    if (!order.status_histories) return null;

    // Map step id back to status
    const reverseMap: { [key: string]: string } = {
      pending: 'pending',
      processing: 'confirmed',
      shipping: 'shipped',
      delivered: 'delivered',
    };

    const statusToFind = reverseMap[stepId];
    const history = order.status_histories.find(h => h.status === statusToFind);

    if (history) {
      return new Date(history.created_at).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    }

    return null;
  };

  // Helper to get notes from status_histories
  const getStepNotes = (stepId: string) => {
    if (!order.status_histories) return null;

    const reverseMap: { [key: string]: string } = {
      pending: 'pending',
      processing: 'confirmed',
      shipping: 'shipped',
      delivered: 'delivered',
    };

    const statusToFind = reverseMap[stepId];
    const history = order.status_histories.find(h => h.status === statusToFind);

    return history?.notes || null;
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
              <p className="text-gray-500 mt-1">Mã đơn: <span className="font-mono font-medium text-gray-900">#{order.order_number}</span> - {new Date(order.placed_at).toLocaleDateString('vi-VN')}</p>
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
                  const time = getStepTime(step.id);

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

                      {/* Notes */}
                      {isCompleted && getStepNotes(step.id) && (
                        <p className="mt-2 text-xs text-gray-600 text-center max-w-[120px] line-clamp-2">{getStepNotes(step.id)}</p>
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
                  <span className="text-sm font-normal text-gray-500">{order.items?.length || 0} món</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item: OrderItem, idx: number) => {
                    return (
                      <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                          {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                              {item.product_slug && <Link href={`/products/${item.product_slug}`} className="text-xs text-primary hover:underline font-medium">Xem sản phẩm</Link>}
                            </div>
                            <p className="font-bold text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(item.total_price))}
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
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.subtotal))}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.shipping_fee))}</span>
                </div>
                {parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between mb-3 text-sm text-green-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.discount_amount))}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-gray-100 text-lg font-bold text-gray-900">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.total_amount))}</span>
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
                  <p className="font-bold text-gray-900 text-base">{order.shipping_address.full_name}</p>
                  <p className="text-gray-500">{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                  <p>{order.shipping_address.ward}, {order.shipping_address.district}</p>
                  <p className="font-medium text-gray-800">{order.shipping_address.province}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard size={18} className="text-accent" /> Thanh toán
                </h3>
                <div className="text-sm text-gray-600">
                  {order.payment ? (
                    <>
                      <p className="mb-2">Phương thức: <span className="font-medium text-gray-900">{typeof order.payment.payment_method === 'string' ? order.payment.payment_method : Object.values(order.payment.payment_method)[0].toUpperCase()}</span></p>
                      <p className={`text-xs font-bold inline-block px-2.5 py-1 rounded border ${(typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {(typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'pending' ? 'CHƯA THANH TOÁN' : 'ĐÃ THANH TOÁN'}
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
