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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  FileText,
  Download,
  Save,
  Clock,
  XCircle,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface OrderDetailProps {
  order: AdminOrder;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (value: string) => {
    setStatus(value as typeof order.status);
  };

  const handleUpdateStatus = async () => {
    if (status === order.status) {
      toast.info('Trạng thái không thay đổi');
      return;
    }

    setIsUpdating(true);
    try {
      await axios.patch(route('admin.orders.update-status', order.id), {
        status,
      });
      toast.success('Cập nhật trạng thái thành công');
      router.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
      setStatus(order.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    window.location.href = route('admin.orders.export', order.id);
  };

  const canExport = order.payment && order.payment.payment_status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={`Đơn hàng #${order.order_number}`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={route('admin.orders')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Đơn hàng #{order.order_number}</h1>
                <p className="text-muted-foreground mt-1">
                  Đặt lúc {formatDateTime(order.placed_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getOrderStatusBadge(order.status, order.deleted_at)}
                {getPaymentStatusBadge(order.payment_status)}
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Sản phẩm ({order.order_items_count})</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.order_items && order.order_items.length > 0 ? (
                    <>
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product?.name || 'N/A'}</h3>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.product?.sku || 'N/A'}
                            </p>
                            {item.product?.artists && item.product.artists.length > 0 && (
                              <p className="text-sm text-muted-foreground">
                                Nghệ sĩ: {item.product.artists.map(a => a.name).join(', ')}
                              </p>
                            )}
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(item.unit_price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(item.total_price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      {/* Order Summary */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tổng sản phẩm:</span>
                          <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Giảm giá:</span>
                            <span className="font-medium text-red-600">
                              -{formatCurrency(order.discount_amount)}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-base font-bold">
                          <span>Tổng cộng:</span>
                          <span className="text-green-600 text-xl">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Không có sản phẩm nào
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Thông tin khách hàng</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {order.customer ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Tên khách hàng</Label>
                        <p className="font-medium mt-1">{order.customer.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium mt-1">{order.customer.email}</p>
                      </div>
                      {order.customer.phone && (
                        <div>
                          <Label className="text-muted-foreground">Số điện thoại</Label>
                          <p className="font-medium mt-1">{order.customer.phone}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Không có thông tin khách hàng</p>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_address && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>Địa chỉ giao hàng</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-lg">{order.shipping_address.full_name}</p>
                      <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                      <div className="pt-2">
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
                        {order.shipping_address.postal_code && (
                          <p className="text-muted-foreground">
                            Mã bưu điện: {order.shipping_address.postal_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Info */}
              {order.payment && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>Thông tin thanh toán</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Phương thức</Label>
                        <p className="font-medium mt-1">{order.payment.payment_method}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trạng thái</Label>
                        <div className="mt-1">
                          {getPaymentStatusBadge(order.payment.payment_status)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Số tiền</Label>
                        <p className="font-medium mt-1 text-green-600">
                          {formatCurrency(order.payment.amount)}
                        </p>
                      </div>
                      {order.payment.processed_at && (
                        <div>
                          <Label className="text-muted-foreground">Ngày xử lý</Label>
                          <p className="font-medium mt-1">
                            {formatDateTime(order.payment.processed_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {order.notes && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>Ghi chú</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-muted-foreground">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Actions (1/3 width) */}
            <div className="space-y-6">
              {/* Update Status Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Cập nhật trạng thái</CardTitle>
                  <CardDescription>
                    Thay đổi trạng thái đơn hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái đơn hàng</Label>
                    <Select value={status} onValueChange={handleStatusChange}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            Chờ xác nhận
                          </div>
                        </SelectItem>
                        <SelectItem value="processing">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            Đang xử lý
                          </div>
                        </SelectItem>
                        <SelectItem value="shipped">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-purple-500" />
                            Đang giao
                          </div>
                        </SelectItem>
                        <SelectItem value="delivered">
                          <div className="flex items-center gap-2">
                            <PackageCheck className="h-4 w-4 text-green-500" />
                            Đã giao
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            Đã hủy
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || status === order.status}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                  </Button>
                </CardContent>
              </Card>

              {/* Export Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Xuất đơn hàng</CardTitle>
                  <CardDescription>
                    {canExport
                      ? 'Tải xuống hóa đơn PDF'
                      : 'Chỉ có thể xuất đơn đã thanh toán'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleExport}
                    disabled={!canExport}
                    variant={canExport ? 'default' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất PDF
                  </Button>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Ngày đặt hàng</Label>
                    <p className="font-medium mt-1">{formatDateTime(order.placed_at)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cập nhật lần cuối</Label>
                    <p className="font-medium mt-1">{formatDateTime(order.updated_at)}</p>
                  </div>
                  {order.deleted_at && (
                    <div>
                      <Label className="text-muted-foreground">Ngày hủy</Label>
                      <p className="font-medium mt-1 text-red-600">
                        {formatDateTime(order.deleted_at)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
