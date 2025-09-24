import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, X, Download, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import vinylProduct from "@/assets/vinyl-product.jpg";

// Mock data - trong thực tế sẽ fetch từ API
const orderData = {
  "RL-001234": {
    id: "RL-001234",
    date: "2024-01-20",
    status: "delivered",
    total: 1670000,
    deliveredDate: "2024-01-24",
    paymentMethod: "COD",
    items: [
      {
        id: 1,
        title: "Rumours",
        artist: "Fleetwood Mac",
        price: 490000,
        image: vinylProduct,
        quantity: 1,
        sku: "FL-RUM-001"
      },
      {
        id: 2,
        title: "Hotel California",
        artist: "Eagles",
        price: 420000,
        image: vinylProduct,
        quantity: 1,
        sku: "EG-HOT-001"
      },
      {
        id: 3,
        title: "The Wall",
        artist: "Pink Floyd",
        price: 680000,
        image: vinylProduct,
        quantity: 1,
        sku: "PF-WAL-001"
      }
    ],
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Nguyễn Văn A, Quận 1, TP.HCM",
      notes: "Gọi trước khi giao hàng"
    },
    timeline: [
      { status: "pending", date: "2024-01-20 10:30", description: "Đơn hàng được đặt" },
      { status: "confirmed", date: "2024-01-20 14:00", description: "Đơn hàng được xác nhận" },
      { status: "shipped", date: "2024-01-22 09:00", description: "Đơn hàng được giao cho đơn vị vận chuyển" },
      { status: "delivered", date: "2024-01-24 16:30", description: "Đơn hàng đã được giao thành công" }
    ]
  }
};

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

const OrderDetail = () => {
  const { slug } = useParams();
  const order = orderData[slug as keyof typeof orderData];

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
            <Link to="/orders">
              <Button>Quay lại danh sách đơn hàng</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Đơn hàng #{order.id}
              </h1>
              <p className="text-muted-foreground">
                Đặt ngày {new Date(order.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Trạng thái đơn hàng
                    <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          index === order.timeline.length - 1 ? 'text-accent' : 'text-muted-foreground'
                        }`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm ({order.items ? order.items.length : 0} sản phẩm)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link to={`/products/${item.sku}`}>
                            <h4 className="font-semibold hover:text-accent transition-colors">
                              {item.title}
                            </h4>
                          </Link>
                          <p className="text-muted-foreground">{item.artist}</p>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                          <p className="text-sm">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {item.price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4" />
                        <p>Không có sản phẩm nào trong đơn hàng này</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{order.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-accent">{order.total.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Phương thức thanh toán: <span className="font-medium">{order.paymentMethod}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="font-medium">{order.shippingAddress.phone}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                    {order.shippingAddress.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        Ghi chú: {order.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.status === "delivered" && (
                    <>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Tải hóa đơn
                      </Button>
                      <Button className="w-full">
                        Đánh giá sản phẩm
                      </Button>
                    </>
                  )}
                  {order.status === "pending" && (
                    <Button variant="destructive" className="w-full">
                      Hủy đơn hàng
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
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
