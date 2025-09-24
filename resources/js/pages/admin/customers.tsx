import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Users,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign
} from "lucide-react";
import { Head } from "@inertiajs/react";

const AdminCustomers = () => {

  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn Anh",
      email: "nguyen.van.anh@email.com",
      phone: "0901234567",
      avatar: "/placeholder-vinyl.jpg",
      totalOrders: 12,
      totalSpent: "15.650.000",
      lastOrder: "2024-01-20",
      status: "active",
      address: "Hà Nội",
      joinDate: "2023-05-15",
      verified: true
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tran.thi.binh@email.com",
      phone: "0987654321",
      avatar: "/placeholder-vinyl.jpg",
      totalOrders: 8,
      totalSpent: "9.200.000",
      lastOrder: "2024-01-18",
      status: "active",
      address: "TP. Hồ Chí Minh",
      joinDate: "2023-08-22",
      verified: true
    },
    {
      id: 3,
      name: "Lê Hoàng Cường",
      email: "le.hoang.cuong@email.com",
      phone: "0912345678",
      avatar: "/placeholder-vinyl.jpg",
      totalOrders: 25,
      totalSpent: "32.400.000",
      lastOrder: "2024-01-19",
      status: "vip",
      address: "Đà Nẵng",
      joinDate: "2022-12-10",
      verified: true
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "pham.thi.dung@email.com",
      phone: "0898765432",
      avatar: "/placeholder-vinyl.jpg",
      totalOrders: 3,
      totalSpent: "2.100.000",
      lastOrder: "2024-01-15",
      status: "active",
      address: "Cần Thơ",
      joinDate: "2024-01-01",
      verified: false
    },
    {
      id: 5,
      name: "Võ Minh Hiếu",
      email: "vo.minh.hieu@email.com",
      phone: "0976543210",
      avatar: "/placeholder-vinyl.jpg",
      totalOrders: 0,
      totalSpent: "0",
      lastOrder: null,
      status: "inactive",
      address: "Hải Phòng",
      joinDate: "2023-11-20",
      verified: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Hoạt động", color: "bg-green-100 text-green-800" },
      vip: { variant: "secondary" as const, label: "VIP", color: "bg-purple-100 text-purple-800" },
      inactive: { variant: "destructive" as const, label: "Không hoạt động", color: "bg-red-100 text-red-800" },
      suspended: { variant: "destructive" as const, label: "Tạm khóa", color: "bg-red-100 text-red-800" }
    };

    const config = variants[status as keyof typeof variants] || variants.active;
    return (
      <Badge
        variant={config.variant}
        className={config.color}
      >
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return amount === "0" ? "0đ" : `${amount}đ`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa có đơn hàng";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCustomerLevel = (totalSpent: string) => {
    const amount = parseFloat(totalSpent.replace(/\./g, ''));
    if (amount >= 20000000) return { level: "VIP", color: "text-purple-600" };
    if (amount >= 5000000) return { level: "Premium", color: "text-blue-600" };
    if (amount >= 1000000) return { level: "Silver", color: "text-gray-600" };
    return { level: "Bronze", color: "text-orange-600" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý khách hàng - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Quản lý Khách hàng
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin khách hàng và lịch sử mua hàng
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng khách hàng</p>
                  <p className="text-2xl font-bold">2,547</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">1,892</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VIP</p>
                  <p className="text-2xl font-bold text-purple-600">156</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mới tháng này</p>
                  <p className="text-2xl font-bold text-blue-600">127</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-vinyl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  className="pl-10"
                />
              </div>

              <Select defaultValue="all-status">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-verified">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Xác thực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-verified">Tất cả</SelectItem>
                  <SelectItem value="verified">Đã xác thực</SelectItem>
                  <SelectItem value="unverified">Chưa xác thực</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Hiển thị <span className="font-medium">1-5</span> trong <span className="font-medium">2,547</span> khách hàng
          </p>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới gia nhập</SelectItem>
              <SelectItem value="name-asc">Tên A-Z</SelectItem>
              <SelectItem value="name-desc">Tên Z-A</SelectItem>
              <SelectItem value="orders-desc">Nhiều đơn hàng nhất</SelectItem>
              <SelectItem value="spent-desc">Chi tiêu cao nhất</SelectItem>
              <SelectItem value="recent-order">Mua hàng gần đây</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customers List */}
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <Card
              key={customer.id}
              className="shadow-vinyl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Customer Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                    {customer.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        {getStatusBadge(customer.status)}
                        {!customer.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Chưa xác thực
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.address}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Hạng</p>
                      <p className={`font-bold text-lg ${getCustomerLevel(customer.totalSpent).color}`}>
                        {getCustomerLevel(customer.totalSpent).level}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Từ {formatDate(customer.joinDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Đơn hàng</p>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-lg">{customer.totalOrders}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Gần nhất: {formatDate(customer.lastOrder)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-accent" />
                        <span className="font-bold text-accent text-lg">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Trung bình: {customer.totalOrders > 0
                          ? `${Math.round(parseFloat(customer.totalSpent.replace(/\./g, '')) / customer.totalOrders / 1000)}k`
                          : '0đ'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="outline" size="sm">255</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
