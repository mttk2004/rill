import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminNavigation } from "@/components/admin-navigation";
import { Package, Search, Filter, Eye, Edit, Truck, CheckCircle, Clock, TrendingUp, ShoppingBag, DollarSign } from "lucide-react";
import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { type SharedData } from '@/types';

const orders = [
  {
    id: "RL-001234",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    date: "2024-01-20",
    status: "delivered",
    total: 1670000,
    items: 3,
    paymentMethod: "COD",
    shippingAddress: "123 Nguyễn Văn A, Quận 1, TP.HCM"
  },
  {
    id: "RL-001233",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    date: "2024-01-18",
    status: "shipped",
    total: 920000,
    items: 2,
    paymentMethod: "COD",
    shippingAddress: "456 Trần Hưng Đạo, Quận 5, TP.HCM"
  },
  {
    id: "RL-001232",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    date: "2024-01-15",
    status: "confirmed",
    total: 460000,
    items: 1,
    paymentMethod: "COD",
    shippingAddress: "789 Lê Lợi, Quận 3, TP.HCM"
  },
  {
    id: "RL-001231",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    date: "2024-01-12",
    status: "cancelled",
    total: 550000,
    items: 1,
    paymentMethod: "COD",
    shippingAddress: "321 Võ Văn Tần, Quận 10, TP.HCM"
  },
  {
    id: "RL-001230",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    date: "2024-01-10",
    status: "delivered",
    total: 1200000,
    items: 2,
    paymentMethod: "COD",
    shippingAddress: "654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Clock className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
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
      return "secondary";
    case "delivered":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const processingOrders = orders.filter(order => order.status === "confirmed").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý đơn hàng - Admin" />
      <AdminNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                Quản lý đơn hàng
              </h1>
              <p className="text-muted-foreground">
                Theo dõi và xử lý các đơn hàng của khách hàng
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-vinyl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                <ShoppingBag className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-vinyl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}₫</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +8% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-vinyl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
                <Clock className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{processingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Cần xử lý trong ngày
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-vinyl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
                <CheckCircle className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveredOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ giao thành công: 95%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 shadow-vinyl">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipped">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="shadow-vinyl">
            <CardHeader>
              <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Số sản phẩm</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status) as "default" | "secondary" | "destructive" | "outline"} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell className="font-medium">
                          {order.total.toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
