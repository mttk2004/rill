import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Package, Truck, CheckCircle, Clock, Eye, Download, X, Disc3 } from "lucide-react";
import { Link, Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { type SharedData } from '@/types';

const orders = [
  {
    id: 1,
    order_number: "RL-001234",
    user_id: 1,
    status: "delivered",
    subtotal: 1590000,
    discount_amount: 50000,
    total_amount: 1540000,
    currency: "VND",
    shipping_address: {
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      address_line_1: "123 Nguyễn Văn A",
      district: "Quận 1",
      city: "TP.HCM",
      ward: "Phường Bến Nghé"
    },
    billing_address: null,
    notes: "Gọi trước khi giao hàng",
    placed_at: "2024-01-20T10:30:00Z",
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-01-24T16:30:00Z",
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: "Rumours",
        product_sku: "FL-RUM-001",
        artist_name: "Fleetwood Mac",
        quantity: 1,
        unit_price: 490000,
        total_price: 490000,
        image: "/placeholder-vinyl.jpg"
      },
      {
        id: 2,
        product_id: 2,
        product_name: "Hotel California",
        product_sku: "EG-HOT-001",
        artist_name: "Eagles",
        quantity: 1,
        unit_price: 420000,
        total_price: 420000,
        image: "/placeholder-vinyl.jpg"
      },
      {
        id: 3,
        product_id: 3,
        product_name: "The Wall",
        product_sku: "PF-WAL-001",
        artist_name: "Pink Floyd",
        quantity: 1,
        unit_price: 680000,
        total_price: 680000,
        image: "/placeholder-vinyl.jpg"
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "completed",
      amount: 1540000,
      processed_at: "2024-01-24T16:30:00Z"
    },
    status_history: [
      { status: "pending", created_at: "2024-01-20T10:30:00Z", notes: "Đơn hàng được đặt" },
      { status: "confirmed", created_at: "2024-01-20T14:00:00Z", notes: "Đơn hàng được xác nhận" },
      { status: "shipped", created_at: "2024-01-22T09:00:00Z", notes: "Đơn hàng được giao cho đơn vị vận chuyển" },
      { status: "delivered", created_at: "2024-01-24T16:30:00Z", notes: "Đơn hàng đã được giao thành công" }
    ]
  },
  {
    id: 2,
    order_number: "RL-001233",
    user_id: 1,
    status: "shipped",
    subtotal: 920000,
    discount_amount: 0,
    total_amount: 920000,
    currency: "VND",
    shipping_address: {
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      address_line_1: "456 Trần Hưng Đạo",
      district: "Quận 5",
      city: "TP.HCM",
      ward: "Phường 14"
    },
    billing_address: null,
    notes: null,
    placed_at: "2024-01-18T09:15:00Z",
    created_at: "2024-01-18T09:15:00Z",
    updated_at: "2024-01-22T09:00:00Z",
    items: [
      {
        id: 4,
        product_id: 4,
        product_name: "Back in Black",
        product_sku: "AC-BIB-001",
        artist_name: "AC/DC",
        quantity: 1,
        unit_price: 400000,
        total_price: 400000,
        image: "/placeholder-vinyl.jpg"
      },
      {
        id: 5,
        product_id: 5,
        product_name: "Bohemian Rhapsody",
        product_sku: "QU-BRH-001",
        artist_name: "Queen",
        quantity: 1,
        unit_price: 520000,
        total_price: 520000,
        image: "/placeholder-vinyl.jpg"
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "pending",
      amount: 920000,
      processed_at: null
    },
    status_history: [
      { status: "pending", created_at: "2024-01-18T09:15:00Z", notes: "Đơn hàng được đặt" },
      { status: "confirmed", created_at: "2024-01-18T15:30:00Z", notes: "Đơn hàng được xác nhận" },
      { status: "shipped", created_at: "2024-01-22T09:00:00Z", notes: "Đơn hàng đang trên đường giao" }
    ]
  },
  {
    id: 3,
    order_number: "RL-001232",
    user_id: 1,
    status: "pending",
    subtotal: 460000,
    discount_amount: 0,
    total_amount: 460000,
    currency: "VND",
    shipping_address: {
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      address_line_1: "789 Lê Văn Việt",
      district: "Quận 7",
      city: "TP.HCM",
      ward: "Phường Tân Phú"
    },
    billing_address: null,
    notes: "Giao hàng giờ hành chính",
    placed_at: "2024-01-15T14:20:00Z",
    created_at: "2024-01-15T14:20:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    items: [
      {
        id: 6,
        product_id: 6,
        product_name: "Thriller",
        product_sku: "MJ-THR-001",
        artist_name: "Michael Jackson",
        quantity: 1,
        unit_price: 460000,
        total_price: 460000,
        image: "/placeholder-vinyl.jpg"
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "pending",
      amount: 460000,
      processed_at: null
    },
    status_history: [
      { status: "pending", created_at: "2024-01-15T14:20:00Z", notes: "Đơn hàng chờ xác nhận" }
    ]
  }
];

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "confirmed":
      return "default";
    case "shipped":
      return "outline";
    case "delivered":
      return "success";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export default function Orders() {
  const { auth } = usePage<SharedData>().props;
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const getOrderCount = (status: string) => {
    if (status === "all") return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const formatAddress = (address: { address_line_1: string; ward: string; district: string; city: string }) => {
    return `${address.address_line_1}, ${address.ward}, ${address.district}, ${address.city}`;
  };

  const getEstimatedDelivery = (order: { placed_at: string }) => {
    const placedDate = new Date(order.placed_at);
    const estimatedDate = new Date(placedDate);
    estimatedDate.setDate(placedDate.getDate() + 5); // Add 5 days for delivery
    return estimatedDate.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <Head title="Đơn hàng của tôi - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navigation user={auth.user} />

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <Package className="h-8 w-8" />
                  </div>
                  Đơn hàng của tôi
                </h1>
                <p className="text-slate-200 drop-shadow">
                  Theo dõi và quản lý các đơn hàng của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <TabsTrigger
                  value="all"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white"
                >
                  Tất cả ({getOrderCount("all")})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white"
                >
                  Chờ xác nhận ({getOrderCount("pending")})
                </TabsTrigger>
                <TabsTrigger
                  value="confirmed"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  Đã xác nhận ({getOrderCount("confirmed")})
                </TabsTrigger>
                <TabsTrigger
                  value="shipped"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Đang giao ({getOrderCount("shipped")})
                </TabsTrigger>
                <TabsTrigger
                  value="delivered"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
                >
                  Đã giao ({getOrderCount("delivered")})
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
                >
                  Đã hủy ({getOrderCount("cancelled")})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredOrders.length === 0 ? (
              <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                    {activeTab === "all" ? "Chưa có đơn hàng nào" : `Không có đơn hàng ${getStatusLabel(activeTab).toLowerCase()}`}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                    {activeTab === "all" ? "Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!" : `Hiện tại bạn không có đơn hàng nào ${getStatusLabel(activeTab).toLowerCase()}.`}
                  </p>
                  <Link href="/products">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            Đơn hàng #{order.order_number}
                          </CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Đặt ngày: {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                          </p>
                          {order.discount_amount > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              Đã tiết kiệm: {order.discount_amount.toLocaleString('vi-VN')}₫
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getStatusVariant(order.status) as "secondary" | "default" | "outline" | "destructive"}
                            className={`flex items-center gap-1 ${
                              order.status === 'delivered'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0'
                                : order.status === 'shipped'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0'
                                : order.status === 'pending'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0'
                                : order.status === 'confirmed'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0'
                                : order.status === 'cancelled'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'
                                : ''
                            }`}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-6">
                      {/* Order Items */}
                      <div className="space-y-4">
                        {order.items && order.items.length > 0 ? order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl hover:shadow-md transition-all duration-300">
                            {/* Vinyl Record Image */}
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                                <Disc3 className="h-10 w-10 text-amber-500 group-hover:rotate-6 transition-transform duration-300" />
                              </div>
                              {/* Vinyl Label */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                              </div>
                            </div>

                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 dark:text-white">{item.product_name}</h4>
                              <p className="text-slate-600 dark:text-slate-300 font-medium">{item.artist_name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                SKU: <span className="font-mono">{item.product_sku}</span> |
                                Số lượng: <span className="font-semibold">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-amber-600">
                                {item.total_price.toLocaleString('vi-VN')}₫
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.unit_price.toLocaleString('vi-VN')}₫/cái
                              </p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                              <Package className="h-8 w-8" />
                            </div>
                            <p>Không có sản phẩm nào trong đơn hàng này</p>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Người nhận:</span>
                              <span className="text-sm text-slate-900 dark:text-white font-medium">{order.shipping_address.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Số điện thoại:</span>
                              <span className="text-sm text-slate-900 dark:text-white font-medium">{order.shipping_address.phone}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Địa chỉ giao hàng:</span>
                              <span className="text-sm text-slate-900 dark:text-white font-medium text-right max-w-[200px]">
                                {formatAddress(order.shipping_address)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.status !== "delivered" && order.status !== "cancelled" && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Dự kiến giao:</span>
                                <span className="text-sm text-slate-900 dark:text-white font-medium">{getEstimatedDelivery(order)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Phương thức thanh toán:</span>
                              <span className="text-sm text-slate-900 dark:text-white font-medium uppercase">{order.payment.payment_method}</span>
                            </div>
                            {order.notes && (
                              <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Ghi chú:</span>
                                <span className="text-sm text-slate-900 dark:text-white font-medium text-right max-w-[200px]">{order.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Tạm tính:</span>
                            <span className="text-slate-900 dark:text-white">{order.subtotal.toLocaleString('vi-VN')}₫</span>
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 dark:text-slate-400">Giảm giá:</span>
                              <span className="text-green-600">-{order.discount_amount.toLocaleString('vi-VN')}₫</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center font-bold text-xl border-t pt-2">
                            <span className="text-slate-900 dark:text-white">Tổng cộng:</span>
                            <span className="text-amber-600">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-600 flex-wrap">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                        {order.status === "delivered" && (
                          <>
                            <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                              <Download className="h-4 w-4 mr-2" />
                              Hóa đơn
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                              Đánh giá
                            </Button>
                          </>
                        )}
                        {order.status === "pending" && (
                          <Button variant="destructive" size="sm" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
