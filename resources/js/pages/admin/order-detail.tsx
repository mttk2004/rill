import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminNavigation } from '@/components/admin-navigation';
import {
  type AdminOrder,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  formatCurrency,
  formatDateTime,
} from '@/lib/order-helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  FileText,
  Download,
  XCircle,
  Truck,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import type { LucideIcon } from 'lucide-react';

interface OrderDetailProps {
  order: AdminOrder;
}

// Status transition map
const statusTransitions: Record<string, Array<{ status: string; label: string; icon: LucideIcon; variant: 'default' | 'destructive' | 'outline' }>> = {
  pending: [
    { status: 'processing', label: 'Xác nhận đơn', icon: Package, variant: 'default' },
    { status: 'cancelled', label: 'Hủy đơn', icon: XCircle, variant: 'destructive' },
  ],
  processing: [
    { status: 'shipped', label: 'Giao hàng', icon: Truck, variant: 'default' },
    { status: 'cancelled', label: 'Hủy đơn', icon: XCircle, variant: 'destructive' },
  ],
  shipped: [
    { status: 'delivered', label: 'Đã giao', icon: PackageCheck, variant: 'default' },
  ],
  delivered: [],
  cancelled: [],
};

export default function OrderDetail({ order }: OrderDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await axios.patch(route('admin.orders.update-status', order.id), {
        status: newStatus,
      });
      toast.success('Cập nhật trạng thái thành công');
      router.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    window.location.href = route('admin.orders.export', order.id);
  };

  const canExport = order.payment?.payment_status === 'completed';

  return (
    <>
      <Head title={`Đơn hàng #${order.order_number}`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <Link
            href={route('admin.orders')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Đơn hàng #{order.order_number}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Đặt lúc {formatDateTime(order.placed_at)}</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  {getOrderStatusBadge(order.status, order.deleted_at)}
                  {getPaymentStatusBadge(order.payment?.payment_status || 'pending')}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                disabled={!canExport}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Single Column with Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Sản phẩm ({order.order_items_count})</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="divide-y">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.product?.name || 'N/A'}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span>SKU: {item.product?.sku || 'N/A'}</span>
                              {item.product?.artists && item.product.artists.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{item.product.artists.map(a => a.name).join(', ')}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">
                              {formatCurrency(item.unit_price)} × {item.quantity}
                            </div>
                            <div className="text-lg font-semibold">
                              {formatCurrency(item.total_price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Summary */}
                    <div className="p-4 bg-muted/30 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tổng sản phẩm</span>
                        <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Giảm giá</span>
                          <span className="font-medium text-red-600">
                            -{formatCurrency(order.discount_amount)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold">Tổng cộng</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Không có sản phẩm nào
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer & Shipping Info - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Khách hàng</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {order.customer ? (
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-base">{order.customer.name}</div>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>Email:</span>
                          <span className="text-foreground">{order.customer.email}</span>
                        </div>
                        {order.customer.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>SĐT:</span>
                            <span className="text-foreground">{order.customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Không có thông tin</p>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_address && (
                <Card>
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>Địa chỉ giao hàng</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-base">{order.shipping_address.full_name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{order.shipping_address.phone}</div>
                      </div>
                      <Separator />
                      <div className="text-sm space-y-1">
                        <p>{order.shipping_address.address_line_1}</p>
                        {order.shipping_address.address_line_2 && (
                          <p>{order.shipping_address.address_line_2}</p>
                        )}
                        <p className="text-muted-foreground">
                          {[
                            order.shipping_address.ward,
                            order.shipping_address.district,
                            order.shipping_address.city,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Info */}
            {order.payment && (
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Thanh toán</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Phương thức</div>
                      <div className="font-medium">{order.payment.payment_method}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Trạng thái</div>
                      <div>{getPaymentStatusBadge(order.payment.payment_status)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Số tiền</div>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(order.payment.amount)}
                      </div>
                    </div>
                    {order.payment.processed_at && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Ngày xử lý</div>
                        <div className="font-medium text-sm">
                          {formatDateTime(order.payment.processed_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Ghi chú</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            {/* Status Actions Card - Sticky */}
            <Card className="sticky top-4 border-2">
              <CardHeader className="border-b bg-muted/50 pb-4">
                <CardTitle className="text-lg">Trạng thái đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Hiện tại:</span>
                  {getOrderStatusBadge(order.status, order.deleted_at)}
                </div>

                {statusTransitions[order.status]?.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        Hành động có thể thực hiện:
                      </div>
                      {statusTransitions[order.status].map((transition) => {
                        const Icon = transition.icon;
                        return (
                          <Button
                            key={transition.status}
                            variant={transition.variant}
                            className="w-full justify-start h-auto py-3"
                            onClick={() => handleUpdateStatus(transition.status)}
                            disabled={isUpdating}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            <span className="flex-1 text-left">{transition.label}</span>
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}

                {statusTransitions[order.status]?.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">
                      {order.status === 'delivered' ? '✓' : '✗'}
                    </div>
                    <p className="text-sm font-medium">
                      {order.status === 'delivered'
                        ? 'Đơn hàng đã hoàn thành'
                        : 'Đơn hàng đã bị hủy'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Ngày đặt hàng</div>
                    <div className="font-medium text-sm mt-0.5">{formatDateTime(order.placed_at)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Cập nhật lần cuối</div>
                    <div className="font-medium text-sm mt-0.5">{formatDateTime(order.updated_at)}</div>
                  </div>
                </div>
                {order.deleted_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Ngày hủy</div>
                      <div className="font-medium text-sm text-red-600 mt-0.5">
                        {formatDateTime(order.deleted_at)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
