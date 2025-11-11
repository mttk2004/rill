import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, X, Download, MessageCircle, Disc3, Music2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { route } from 'ziggy-js';

interface Product {
  id: number;
  title: string;
  artist_name: string;
  price: number;
  image_url?: string;
  quantity: number;
  sku: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

interface Order {
  id: string;
  order_id: string; // Database primary key
  date: string;
  status: string;
  total: number;
  delivered_date?: string;
  payment_method: string;
  items: Product[];
  shipping_address: ShippingAddress;
  timeline: TimelineEvent[];
}

interface OrderDetailProps {
  order?: Order | { data: Order };
}

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "confirmed":
      return <Package className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "cancelled":
      return <X className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "shipped":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Chưa xác định";
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "pending":
      return "secondary";
    case "confirmed":
      return "default";
    case "shipped":
      return "outline";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderDetail = ({ order: orderProp }: OrderDetailProps) => {
  // Normalize the order data - handle both direct Order and wrapped { data: Order }
  const order = orderProp && typeof orderProp === 'object' && 'data' in orderProp ? orderProp.data : orderProp as Order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section with Vinyl Animation */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

          {/* Floating Vinyl Records */}
          <div className="absolute top-20 left-10 animate-spin-slow">
            <Disc3 className="h-32 w-32 text-amber-500/10" />
          </div>
          <div className="absolute top-40 right-20 animate-spin-reverse">
            <Disc3 className="h-24 w-24 text-amber-500/5" />
          </div>

          <div className="relative container mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-6 shadow-2xl">
              <Music2 className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-xl text-slate-200 mb-8 drop-shadow">
              Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa
            </p>

            <Link href="/orders" className="inline-block">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại danh sách đơn hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        {/* Floating Vinyl Records */}
        <div className="absolute top-10 left-10 animate-spin-slow">
          <Disc3 className="h-20 w-20 text-amber-500/10" />
        </div>
        <div className="absolute top-20 right-10 animate-spin-reverse">
          <Disc3 className="h-16 w-16 text-amber-500/5" />
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Đơn hàng #{(order.id || 'N/A')}
              </h1>
              <p className="text-slate-200 drop-shadow">
                Đặt ngày {new Date(order.date || Date.now()).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                      {getStatusIcon(order.status || 'pending')}
                    </div>
                    <div>
                      <span className="text-slate-900 dark:text-white">Trạng thái đơn hàng</span>
                      <Badge
                        variant={getStatusVariant(order.status || 'pending')}
                        className={`ml-3 ${(order.status || 'pending') === 'delivered'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0'
                          : (order.status || 'pending') === 'shipped'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0'
                            : (order.status || 'pending') === 'confirmed'
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0'
                              : ''
                          }`}
                      >
                        {getStatusIcon(order.status || 'pending')}
                        <span className="ml-1">{getStatusLabel(order.status || 'pending')}</span>
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(order.timeline || []).filter(Boolean).map((event, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className={`mt-1 p-2 rounded-full transition-all duration-300 ${index === order.timeline.length - 1
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                          }`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <p className="font-semibold text-slate-900 dark:text-white mb-1">
                            {event.description}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(event.date).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      Sản phẩm ({(order.items || []).length} sản phẩm)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(order.items || []).length > 0 ? (order.items || []).map((item) => (
                      <div key={item.id} className="group relative bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-6">
                          {/* Product Image with Vinyl Effect */}
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <Disc3 className="h-12 w-12 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                              )}
                            </div>
                            {/* Vinyl Label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 bg-amber-500 rounded-full shadow-md"></div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <Link href={`/products/${item.sku}`}>
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white hover:text-amber-600 transition-colors duration-300">
                                {item.title}
                              </h4>
                            </Link>
                            <p className="text-slate-600 dark:text-slate-300 font-medium">
                              {item.artist_name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              SKU: {item.sku}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              Số lượng: <span className="font-semibold">{item.quantity}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-xl text-amber-600">
                              {item.price.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                          <Package className="h-10 w-10" />
                        </div>
                        <p className="text-lg">Không có sản phẩm nào trong đơn hàng này</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Order Summary */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-300">Tạm tính:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {(order.total || 0).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-300">Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-xl font-bold text-amber-600">
                        {(order.total || 0).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Phương thức thanh toán:
                      <span className="font-semibold text-slate-900 dark:text-white ml-1">
                        {order.payment_method || 'N/A'}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-900 dark:text-white">Địa chỉ giao hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {(order.shipping_address || {}).name || 'N/A'}
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {(order.shipping_address || {}).phone || 'N/A'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {(order.shipping_address || {}).address || 'N/A'}
                    </p>
                    {(order.shipping_address || {}).notes && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                          Ghi chú: {(order.shipping_address || {}).notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                  <CardTitle className="text-slate-900 dark:text-white">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {order.status === "delivered" && (
                    <>
                      <a href={route('orders.invoice', { order: order.order_id })}>
                        <Button
                          variant="outline"
                          className="w-full border-amber-200 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải hóa đơn
                        </Button>
                      </a>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        Đánh giá sản phẩm
                      </Button>
                    </>
                  )}
                  {order.status === "pending" && (
                    <Button
                      variant="destructive"
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      Hủy đơn hàng
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-slate-50 transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
