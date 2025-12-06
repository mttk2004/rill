
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  ArrowLeft, Truck, CheckCircle, XCircle, Clock,
  MapPin, CreditCard, Printer, AlertTriangle
} from 'lucide-react';
import Button from '../../../components/Button';
import { useToast } from '../../../context/ToastContext';
import { formatDateTime } from '../../../utils/format';

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
  amount: string | number;
  transaction_id?: string | null;
  processed_at?: string | null;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image?: string | null;
  product_deleted?: boolean;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  product?: {
    id: string;
    name: string;
    slug?: string;
    sku?: string;
    image_url?: string;
    artists?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: string | number;
  shipping_fee: string | number;
  discount_amount: string | number;
  total_amount: string | number;
  shipping_address: UserAddress | null;
  notes: string | null;
  placed_at: string;
  created_at: string;
  deleted_at?: string | null;
  order_items?: OrderItem[];
  items_count?: number;
  status_histories?: OrderStatusHistory[];
  payment?: Payment;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

interface AdminOrderDetailProps {
  order: Order;
}

const AdminOrderDetail = ({ order }: AdminOrderDetailProps) => {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper to format currency (handles both string and number from backend)
  const formatPrice = (amount: string | number | undefined | null): string => {
    if (amount === undefined || amount === null) return '0 ₫';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleExportInvoice = () => {
    // Check if order is paid
    if (!order.payment || order.payment.payment_status !== 'completed') {
      showToast('Chỉ có thể xuất hóa đơn cho đơn hàng đã thanh toán', 'error');
      return;
    }

    // Download PDF
    window.location.href = `/admin/orders/${order.id}/export`;
  };

  const handleStatusUpdate = (newStatus: OrderStatus, notes?: string) => {
    setIsUpdating(true);

    router.patch(
      `/admin/orders/${order.id}/status`,
      { status: newStatus, notes },
      {
        preserveScroll: true,
        onSuccess: () => {
          showToast(`Đã cập nhật trạng thái: ${getStatusLabel(newStatus)}`, 'success');
          setIsUpdating(false);
        },
        onError: (errors) => {
          const firstError = Object.values(errors)[0] as string;
          showToast(firstError || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error');
          setIsUpdating(false);
        },
      }
    );
  };

  // Check if order can be confirmed
  const canConfirmOrder = () => {
    if (order.status !== 'pending') return false;

    // For VNPAY orders, payment must be completed
    if (order.payment?.payment_method === 'vnpay') {
      return order.payment.payment_status === 'completed';
    }

    // For COD orders, can confirm anytime
    return true;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đang chuẩn bị hàng';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTimelineDotColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-400 bg-yellow-100';
      case 'confirmed': return 'border-blue-500 bg-blue-100';
      case 'shipped': return 'border-purple-500 bg-purple-100';
      case 'delivered': return 'border-green-500 bg-green-100';
      case 'cancelled': return 'border-red-500 bg-red-100';
      default: return 'border-gray-300 bg-gray-100';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.visit('/admin/orders')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Đơn hàng {order.order_number}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Đặt ngày: {formatDateTime(order.placed_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {order.payment?.payment_status === 'completed' && (
              <Button
                variant="secondary"
                onClick={handleExportInvoice}
                className="h-10 px-4 py-2 flex items-center gap-2 text-sm"
              >
                <Printer size={16} /> In hóa đơn
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-900">
                Danh sách sản phẩm ({order.order_items?.length || 0})
              </div>
              <div className="divide-y divide-gray-100">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 relative">
                      {(item.product_image || item.product?.image_url) && (
                        <img src={item.product_image || item.product?.image_url} alt="" className="h-full w-full object-cover" />
                      )}
                      {item.product_deleted && (
                        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded">Ngừng KD</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                          {item.product_deleted && (
                            <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Ngừng kinh doanh</span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">{formatPrice(item.total_price)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">SKU: {item.product_sku}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.unit_price)} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" /> Thông tin thanh toán
              </h3>
              {order.payment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phương thức</label>
                    <p className="font-medium text-gray-900 uppercase">{order.payment.payment_method}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Trạng thái</label>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${order.payment.payment_status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : order.payment.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {order.payment.payment_status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mã giao dịch</label>
                    <p className="font-mono text-sm text-gray-700">{order.payment.transaction_id || '---'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Ngày xử lý</label>
                    <p className="text-sm text-gray-700">
                      {order.payment.processed_at ? formatDateTime(order.payment.processed_at) : '---'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Chưa có thông tin thanh toán</p>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-primary" /> Lịch sử đơn hàng
              </h3>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                {order.status_histories?.map((history) => (
                  <div key={history.id} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${getTimelineDotColor(history.status)}`}></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">{getStatusLabel(history.status)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(history.created_at)}
                        {history.createdBy && <span className="ml-2 text-gray-400">bởi {history.createdBy.name}</span>}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Status Management Workflow */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Xử lý đơn hàng</h3>
              <div className="space-y-3">
                {order.status === 'pending' && (
                  <>
                    <Button
                      fullWidth
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={isUpdating || !canConfirmOrder()}
                      className="bg-blue-600 hover:bg-blue-700 border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={16} className="mr-2" /> {isUpdating ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
                    </Button>
                    {order.payment?.payment_method === 'vnpay' && order.payment.payment_status !== 'completed' && (
                      <p className="text-xs text-red-600 text-center">
                        Đơn hàng VNPAY chỉ có thể xác nhận sau khi thanh toán thành công
                      </p>
                    )}
                    <Button fullWidth variant="outline" onClick={() => handleStatusUpdate('cancelled')} disabled={isUpdating} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <XCircle size={16} className="mr-2" /> Hủy đơn hàng
                    </Button>
                  </>
                )}

                {order.status === 'confirmed' && (
                  <Button fullWidth onClick={() => handleStatusUpdate('shipped')} disabled={isUpdating} className="bg-amber-500 hover:bg-amber-600 border-transparent">
                    <Truck size={16} className="mr-2" /> {isUpdating ? 'Đang xử lý...' : 'Tiến hành giao hàng'}
                  </Button>
                )}

                {order.status === 'shipped' && (
                  <Button fullWidth onClick={() => handleStatusUpdate('delivered')} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 border-transparent">
                    <CheckCircle size={16} className="mr-2" /> {isUpdating ? 'Đang xử lý...' : 'Giao hàng thành công'}
                  </Button>
                )}                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500">Đơn hàng đã kết thúc.</p>
                    <p className={`font-bold mt-1 ${order.status === 'delivered' ? 'text-green-600' : 'text-red-600'}`}>
                      {getStatusLabel(order.status).toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            {order.shipping_address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" /> Địa chỉ nhận hàng
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{order.shipping_address.full_name}</p>
                    <p className="text-gray-500">{order.shipping_address.phone}</p>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="text-gray-600 space-y-1">
                    <p>{order.shipping_address.address_line_1}</p>
                    {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                    <p>{order.shipping_address.ward}, {order.shipping_address.district}</p>
                    <p className="font-medium text-gray-800">{order.shipping_address.province}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            {order.notes && (
              <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /> Ghi chú khách hàng
                </h3>
                <p className="text-sm text-amber-700 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
