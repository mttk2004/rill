import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Package,
  Truck,
  PackageCheck,
  XCircle,
  Trash2,
} from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  deletedAt?: string | null;
  showIcon?: boolean;
}

export const OrderStatusBadge = ({
  status,
  deletedAt = null,
  showIcon = true
}: OrderStatusBadgeProps) => {
  // If order is soft deleted, show deleted badge
  if (deletedAt) {
    return (
      <Badge variant="outline" className="gap-1.5 border-red-200 bg-red-50 text-red-700">
        {showIcon && <Trash2 className="h-3 w-3" />}
        Đã xóa
      </Badge>
    );
  }

  const statusConfig = {
    pending: {
      label: 'Chờ xử lý',
      icon: Clock,
      className: 'gap-1.5 border-amber-200 bg-amber-50 text-amber-700',
    },
    confirmed: {
      label: 'Đã xác nhận',
      icon: Package,
      className: 'gap-1.5 border-blue-200 bg-blue-50 text-blue-700',
    },
    shipped: {
      label: 'Đang giao',
      icon: Truck,
      className: 'gap-1.5 border-purple-200 bg-purple-50 text-purple-700',
    },
    delivered: {
      label: 'Đã giao',
      icon: PackageCheck,
      className: 'gap-1.5 border-green-200 bg-green-50 text-green-700',
    },
    cancelled: {
      label: 'Đã hủy',
      icon: XCircle,
      className: 'gap-1.5 border-red-200 bg-red-50 text-red-700',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
