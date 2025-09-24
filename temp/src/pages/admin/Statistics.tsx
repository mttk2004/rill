import { AdminNavigation } from "@/components/AdminNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3
} from "lucide-react";

const AdminStatistics = () => {
  const stats = [
    {
      title: "Doanh thu tháng này",
      value: "156.780.000đ",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Đơn hàng mới",
      value: "384",
      change: "+8.2%", 
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Khách hàng mới",
      value: "127",
      change: "-3.1%",
      trend: "down", 
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Sản phẩm bán chạy",
      value: "89",
      change: "+15.7%",
      trend: "up",
      icon: Package,
      color: "text-orange-600"
    }
  ];

  const recentOrders = [
    {
      id: "#RL-2024-001", 
      customer: "Nguyễn Văn A",
      product: "Abbey Road - The Beatles",
      amount: "1.250.000đ",
      status: "confirmed",
      date: "2024-01-15"
    },
    {
      id: "#RL-2024-002",
      customer: "Trần Thị B", 
      product: "Dark Side of the Moon",
      amount: "980.000đ",
      status: "shipped",
      date: "2024-01-14"
    },
    {
      id: "#RL-2024-003",
      customer: "Lê Hoàng C",
      product: "Thriller - Michael Jackson", 
      amount: "1.100.000đ",
      status: "delivered",
      date: "2024-01-13"
    },
    {
      id: "#RL-2024-004",
      customer: "Phạm Thị D",
      product: "Hotel California - Eagles",
      amount: "1.350.000đ", 
      status: "pending",
      date: "2024-01-12"
    }
  ];

  const topProducts = [
    {
      name: "Abbey Road - The Beatles",
      sales: 45,
      revenue: "56.250.000đ",
      trend: "+5"
    },
    {
      name: "Dark Side of the Moon",
      sales: 38,
      revenue: "37.240.000đ", 
      trend: "+12"
    },
    {
      name: "Thriller - Michael Jackson",
      sales: 32,
      revenue: "35.200.000đ",
      trend: "-2"
    },
    {
      name: "Hotel California - Eagles", 
      sales: 28,
      revenue: "37.800.000đ",
      trend: "+8"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Chờ xác nhận" },
      confirmed: { variant: "default" as const, label: "Đã xác nhận" }, 
      shipped: { variant: "secondary" as const, label: "Đang giao" },
      delivered: { variant: "default" as const, label: "Đã giao" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Thống kê</h1>
            <p className="text-muted-foreground mt-2">
              Tổng quan hoạt động kinh doanh tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn khoảng thời gian
            </Button>
            <Button variant="accent">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="shadow-vinyl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs flex items-center mt-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change} từ tháng trước
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="shadow-vinyl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Đơn hàng gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm font-medium">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Xem tất cả đơn hàng
              </Button>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="shadow-vinyl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sản phẩm bán chạy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} bản</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{product.revenue}</p>
                      <p className={`text-xs flex items-center ${
                        product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.trend.startsWith('+') ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {product.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Xem chi tiết báo cáo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;