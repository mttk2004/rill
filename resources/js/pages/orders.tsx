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
    id: "RL-001234",
    date: "2024-01-20",
    status: "delivered",
    total: 1670000,
    items: [
      {
        id: 1,
        title: "Rumours",
        artist: "Fleetwood Mac",
        price: 490000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      },
      {
        id: 2,
        title: "Hotel California",
        artist: "Eagles",
        price: 420000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      },
      {
        id: 3,
        title: "The Wall",
        artist: "Pink Floyd",
        price: 680000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      }
    ],
    shippingAddress: "123 Nguyễn Văn A, Quận 1, TP.HCM",
    estimatedDelivery: "2024-01-25"
  },
  {
    id: "RL-001233",
    date: "2024-01-18",
    status: "shipped",
    total: 920000,
    items: [
      {
        id: 4,
        title: "Back in Black",
        artist: "AC/DC",
        price: 400000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      },
      {
        id: 5,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        price: 520000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      }
    ],
    shippingAddress: "456 Trần Hưng Đạo, Quận 5, TP.HCM",
    estimatedDelivery: "2024-01-22"
  },
  {
    id: "RL-001232",
    date: "2024-01-15",
    status: "pending",
    total: 460000,
    items: [
      {
        id: 6,
        title: "Thriller",
        artist: "Michael Jackson",
        price: 460000,
        image: "/placeholder-vinyl.jpg",
        quantity: 1
      }
    ],
    shippingAddress: "789 Lê Văn Việt, Quận 7, TP.HCM",
    estimatedDelivery: "2024-01-20"
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

  return (
    <>
      <Head title="Đơn hàng của tôi - Rill" />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Package className="h-8 w-8 text-accent" />
                  Đơn hàng của tôi
                </h1>
                <p className="text-muted-foreground">
                  Theo dõi và quản lý các đơn hàng của bạn
                </p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all" className="text-sm">
                  Tất cả ({getOrderCount("all")})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-sm">
                  Chờ xác nhận ({getOrderCount("pending")})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="text-sm">
                  Đã xác nhận ({getOrderCount("confirmed")})
                </TabsTrigger>
                <TabsTrigger value="shipped" className="text-sm">
                  Đang giao ({getOrderCount("shipped")})
                </TabsTrigger>
                <TabsTrigger value="delivered" className="text-sm">
                  Đã giao ({getOrderCount("delivered")})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-sm">
                  Đã hủy ({getOrderCount("cancelled")})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredOrders.length === 0 ? (
              <Card className="text-center py-12 border-0 shadow-vinyl">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {activeTab === "all" ? "Chưa có đơn hàng nào" : `Không có đơn hàng ${getStatusLabel(activeTab).toLowerCase()}`}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === "all" ? "Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!" : `Hiện tại bạn không có đơn hàng nào ${getStatusLabel(activeTab).toLowerCase()}.`}
                  </p>
                  <Link href="/products">
                    <Button>
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden border-0 shadow-vinyl">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Đơn hàng #{order.id}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Đặt ngày: {new Date(order.date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(order.status) as "secondary" | "default" | "outline" | "destructive"} className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                              <Disc3 className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.artist}</p>
                              <p className="text-sm">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2" />
                            <p>Không có sản phẩm nào trong đơn hàng này</p>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Địa chỉ giao hàng:</span>
                          <span className="text-sm">{order.shippingAddress || "Chưa cập nhật"}</span>
                        </div>
                        {order.status !== "delivered" && order.status !== "cancelled" && order.estimatedDelivery && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Dự kiến giao:</span>
                            <span className="text-sm">{new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Tổng cộng:</span>
                          <span className="text-primary">{order.total.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Hóa đơn
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button size="sm">
                            Đánh giá
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button variant="destructive" size="sm">
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
