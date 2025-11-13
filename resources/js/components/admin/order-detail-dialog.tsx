import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Edit
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { formatCurrency, formatDateTime } from "@/lib/order-helpers";

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    artists: Array<{ id: number; name: string }>;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  placed_at: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  shipping_address?: {
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    ward: string;
    district: string;
    city: string;
    postal_code?: string;
  };
  payment?: {
    payment_method: string;
    payment_status: string;
    amount: number;
    processed_at?: string;
  };
  order_items: OrderItem[];
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

interface OrderDetailDialogProps {
  order: OrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  const configs = {
    pending: { label: "Chờ xử lý", className: "bg-amber-100 text-amber-700", icon: Clock },
    confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-700", icon: Package },
    shipped: { label: "Đang giao", className: "bg-purple-100 text-purple-700", icon: Truck },
    delivered: { label: "Đã giao", className: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700", icon: XCircle },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const getPaymentStatusBadge = (status: string) => {
  const configs = {
    pending: { label: "Chờ thanh toán", className: "bg-amber-100 text-amber-700" },
    completed: { label: "Đã thanh toán", className: "bg-green-100 text-green-700" },
    failed: { label: "Thất bại", className: "bg-red-100 text-red-700" },
    refunded: { label: "Hoàn tiền", className: "bg-gray-100 text-gray-700" },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;

  return <Badge className={config.className}>{config.label}</Badge>;
};

export const OrderDetailDialog = ({ order, isOpen, onClose }: OrderDetailDialogProps) => {
  if (!order) return null;

  const fullAddress = order.shipping_address
    ? `${order.shipping_address.address_line_1}${order.shipping_address.address_line_2 ? ', ' + order.shipping_address.address_line_2 : ''}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.city}`
    : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span>Chi tiết đơn hàng #{order.order_number}</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              <Link href={route('admin.orders.show', order.id)}>
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </Link>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ngày đặt</span>
              </div>
              <p className="font-medium">{formatDateTime(order.placed_at)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Thanh toán</span>
              </div>
              <div className="flex items-center gap-2">
                {order.payment ? (
                  <>
                    <span className="font-medium">{order.payment.payment_method}</span>
                    {getPaymentStatusBadge(order.payment.payment_status)}
                  </>
                ) : (
                  <span className="text-muted-foreground">Chưa có thông tin</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          {order.customer && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Thông tin khách hàng</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Tên:</span> <span className="font-medium">{order.customer.name}</span></p>
                  <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{order.customer.email}</span></p>
                  {order.customer.phone && (
                    <p><span className="text-muted-foreground">SĐT:</span> <span className="font-medium">{order.customer.phone}</span></p>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Shipping Address */}
          {order.shipping_address && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Địa chỉ giao hàng</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Người nhận:</span> <span className="font-medium">{order.shipping_address.full_name}</span></p>
                  <p><span className="text-muted-foreground">SĐT:</span> <span className="font-medium">{order.shipping_address.phone}</span></p>
                  <p><span className="text-muted-foreground">Địa chỉ:</span> <span className="font-medium">{fullAddress}</span></p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Status History */}
          {order.status_histories && order.status_histories.length > 0 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Lịch sử trạng thái</h3>
                </div>
                <div className="space-y-3">
                  {order.status_histories.map((history, index) => (
                    <div key={history.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                        {index < order.status_histories!.length - 1 && (
                          <div className="w-px h-full bg-border my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(history.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(history.created_at)}
                          </span>
                        </div>
                        {history.notes && (
                          <div className="mt-1.5 text-xs text-muted-foreground bg-muted/50 p-2 rounded border">
                            <span className="font-medium">Ghi chú:</span> {history.notes}
                          </div>
                        )}
                        {history.created_by && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Bởi: {history.created_by.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Sản phẩm ({order.order_items.length})</h3>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.product.artists.map(a => a.name).join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.unit_price)}</p>
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-primary">{formatCurrency(item.total_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary">{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
