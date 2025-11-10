import { AdminNavigation } from "@/components/admin-navigation";
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
  BarChart3,
  CreditCard
} from "lucide-react";
import { Head } from "@inertiajs/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StatData {
  revenue: { value: number; change: number; trend: string };
  orders: { value: number; change: number; trend: string };
  customers: { value: number; change: number; trend: string };
  products: { value: number; change: number; trend: string };
}

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

interface OrderByStatus {
  status: string;
  count: number;
}

interface TopProduct {
  id: number;
  name: string;
  sku: string;
  sales: number;
  revenue: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer: string;
  items_count: number;
  total_amount: number;
  status: string;
  payment_status: string;
  placed_at: string;
}

interface RevenueByPaymentMethod {
  method: string;
  total: number;
  count: number;
}

interface PageProps {
  stats: StatData;
  dailyRevenue: DailyRevenue[];
  ordersByStatus: OrderByStatus[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  dateRange: {
    start: string;
    end: string;
  };
}

const AdminStatistics = ({
  stats,
  dailyRevenue,
  ordersByStatus,
  topProducts,
  recentOrders,
  revenueByPaymentMethod,
  dateRange
}: PageProps) => {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const statsCards = [
    {
      title: "Doanh thu tháng này",
      value: formatCurrency(stats.revenue.value),
      change: `${stats.revenue.change > 0 ? '+' : ''}${stats.revenue.change.toFixed(1)}%`,
      trend: stats.revenue.trend,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Đơn hàng mới",
      value: stats.orders.value.toString(),
      change: `${stats.orders.change > 0 ? '+' : ''}${stats.orders.change.toFixed(1)}%`,
      trend: stats.orders.trend,
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Khách hàng mới",
      value: stats.customers.value.toString(),
      change: `${stats.customers.change > 0 ? '+' : ''}${stats.customers.change.toFixed(1)}%`,
      trend: stats.customers.trend,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Sản phẩm bán chạy",
      value: stats.products.value.toString(),
      change: `${stats.products.change > 0 ? '+' : ''}${stats.products.change.toFixed(1)}%`,
      trend: stats.products.trend,
      icon: Package,
      color: "text-orange-600"
    }
  ];



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Chờ xác nhận" },
      confirmed: { variant: "default" as const, label: "Đã xác nhận" },
      shipped: { variant: "secondary" as const, label: "Đang giao" },
      delivered: { variant: "default" as const, label: "Đã giao" },
      cancelled: { variant: "destructive" as const, label: "Đã hủy" }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Chờ thanh toán" },
      paid: { variant: "default" as const, label: "Đã thanh toán" },
      failed: { variant: "destructive" as const, label: "Thất bại" }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title="Dashboard thống kê - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Thống kê</h1>
            <p className="text-muted-foreground mt-2">
              Tổng quan hoạt động kinh doanh từ {formatDate(dateRange.start)} đến {formatDate(dateRange.end)}
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
          {statsCards.map((stat, index) => (
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
                    <p className={`text-xs flex items-center mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change} từ kỳ trước
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

        {/* Biểu đồ doanh thu theo ngày */}
        <Card className="shadow-vinyl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Doanh thu 30 ngày gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toString();
                }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Doanh thu" dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Số đơn hàng" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ tròn và cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-vinyl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Phân bố trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersByStatus.map(item => ({ name: item.status, value: item.count }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, index) => {
                      const colors: Record<string, string> = {
                        pending: '#f59e0b',
                        confirmed: '#2563eb',
                        shipped: '#8b5cf6',
                        delivered: '#10b981',
                        cancelled: '#ef4444'
                      };
                      return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#6b7280'} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-vinyl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Doanh thu theo phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByPaymentMethod.map(item => ({
                  method: item.method === 'cash_on_delivery' ? 'COD' :
                    item.method === 'bank_transfer' ? 'Chuyển khoản' :
                      item.method === 'credit_card' ? 'Thẻ tín dụng' : item.method,
                  total: item.total,
                  count: item.count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis tickFormatter={(value) => {
                    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toString();
                  }} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'total' ? formatCurrency(value) : value,
                      name === 'total' ? 'Doanh thu' : 'Số đơn'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#2563eb" name="Doanh thu" />
                  <Bar dataKey="count" fill="#10b981" name="Số đơn" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
                        <span className="font-medium">{order.order_number}</span>
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm">Số sản phẩm: {order.items_count}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{formatCurrency(order.total_amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.placed_at)}</p>
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
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} bản • SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{formatCurrency(product.revenue)}</p>
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
