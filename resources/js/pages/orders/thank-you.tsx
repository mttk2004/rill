import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import Button from '../../components/Button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

interface VnpayResponse {
  response_code: string;
  message: string;
  transaction_no?: string;
  is_success: boolean;
}

interface ThankYouProps {
  order: Order;
  vnpayResponse?: VnpayResponse;
}

export default function ThankYou({ order, vnpayResponse }: ThankYouProps) {
  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(order.total_amount);

  const isVnpaySuccess = vnpayResponse?.is_success === true;
  const isVnpayFailed = vnpayResponse && !vnpayResponse.is_success;

  return (
    <AppLayout>
      <Head title="Đặt hàng thành công - Rill" />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Success/Failed Icon */}
          <div className="mb-8 text-center animate-in zoom-in duration-500">
            {!isVnpayFailed ? (
              <>
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle size={64} className="text-green-600" />
                </div>
                <h1 className="mb-3 font-serif text-4xl font-bold text-gray-900">
                  Đặt hàng thành công!
                </h1>
                <p className="text-lg text-gray-600">
                  Cảm ơn bạn đã mua hàng tại Rill
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                  <span className="text-5xl">❌</span>
                </div>
                <h1 className="mb-3 font-serif text-4xl font-bold text-gray-900">
                  Thanh toán thất bại
                </h1>
                <p className="text-lg text-gray-600">
                  Đơn hàng của bạn chưa được thanh toán thành công
                </p>
              </>
            )}
          </div>

          {/* Order Info Card */}
          <div className="mb-8 rounded-xl bg-white p-8 shadow-sm animate-in slide-in-from-bottom duration-700">
            <div className="mb-6 border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    #{order.order_number}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Package size={32} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền</span>
                <span className="font-bold text-gray-900">{formattedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán</span>
                <span className="font-medium text-gray-900">
                  {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'VNPAY'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {order.payment_method === 'cod' && !isVnpayFailed && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium">💳 Thanh toán khi nhận hàng</p>
                <p className="mt-1 text-blue-700">
                  Bạn sẽ thanh toán bằng tiền mặt khi nhận được đơn hàng.
                </p>
              </div>
            )}

            {isVnpaySuccess && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                <p className="font-medium">✅ Thanh toán VNPAY thành công</p>
                <p className="mt-1 text-green-700">
                  Đơn hàng của bạn đã được thanh toán và đang được xử lý.
                </p>
              </div>
            )}

            {isVnpayFailed && vnpayResponse && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">❌ Thanh toán VNPAY thất bại</p>
                <p className="mt-1 text-red-700">
                  {vnpayResponse.message}
                </p>
                {vnpayResponse.response_code && (
                  <p className="mt-1 text-xs text-red-600">
                    Mã lỗi: {vnpayResponse.response_code}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          {!isVnpayFailed && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Các bước tiếp theo
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </div>
                  <p>Chúng tôi sẽ xác nhận đơn hàng của bạn trong vòng 24 giờ</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </div>
                  <p>Đơn hàng sẽ được đóng gói và giao cho đơn vị vận chuyển</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </div>
                  <p>Bạn sẽ nhận được thông báo khi đơn hàng đang trên đường giao</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/products" className="flex-1">
              <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                Tiếp tục mua sắm
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href={`/orders/${order.id}`} className="flex-1">
              <Button fullWidth>
                Xem chi tiết đơn hàng
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
