import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

// Re-export the new component
export { OrderStatusBadge };

// Type definitions
export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  notes: string | null;
  placed_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  payment: {
    id: number;
    payment_method: string;
    payment_status: string;
    amount: number;
    processed_at: string | null;
  };
  shipping_address: {
    id: number;
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string | null;
    ward: string;
    district: string;
    province: string;
  };
  order_items_count: number;
  order_items?: Array<{
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: number;
      name: string;
      sku: string;
      artists: Array<{
        id: number;
        name: string;
      }>;
    };
  }>;
  status_histories?: Array<{
    id: string;
    status: string;
    notes: string | null;
    created_at: string;
    created_by: {
      id: string;
      name: string;
    } | null;
  }>;
}

// Order status badge with icon (wrapper for backward compatibility)
export const getOrderStatusBadge = (
  status: AdminOrder['status'],
  deleted_at: string | null
) => {
  return <OrderStatusBadge status={status} deletedAt={deleted_at} />;
};

// Payment status badge
export const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      label: 'Chờ thanh toán',
      className: 'gap-1.5 bg-amber-100 text-amber-700 border-amber-300',
      icon: Clock,
    },
    completed: {
      label: 'Đã thanh toán',
      className: 'gap-1.5 bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle2,
    },
    failed: {
      label: 'Thanh toán thất bại',
      className: 'gap-1.5 bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
    },
    refunded: {
      label: 'Đã hoàn tiền',
      className: 'gap-1.5 bg-gray-100 text-gray-700 border-gray-300',
      icon: CheckCircle2,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};

// formatCurrency has been removed. Use formatVND from @/lib/utils instead

// Format date and time
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format date only
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Get payment method label
export const getPaymentMethodLabel = (method: string): string => {
  const methods: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng',
    bank_transfer: 'Chuyển khoản ngân hàng',
    momo: 'Ví MoMo',
    vnpay: 'VNPay',
    credit_card: 'Thẻ tín dụng',
  };

  return methods[method] || method;
};

// Format full address
export const formatAddress = (
  address: AdminOrder['shipping_address']
): string => {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);

  return parts.join(', ');
};
