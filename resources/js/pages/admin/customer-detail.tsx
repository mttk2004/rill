import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
  Edit,
  ShieldCheck
} from 'lucide-react';
import { AdminNavigation } from '@/components/admin-navigation';
import type { User as UserType } from '@/types';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  placed_at: string;
  items_count: number;
}

interface CustomerDetail extends UserType {
  phone?: string;
  gender?: string | null;
  date_of_birth?: string | null;
  is_active?: boolean;
  orders_count?: number;
  orders?: Order[];
}

interface Props {
  customer: CustomerDetail;
}

export default function CustomerDetailPage({ customer }: Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderLabel = (gender?: string | null) => {
    switch (gender) {
      case 'male': return '👨 Nam';
      case 'female': return '👩 Nữ';
      case 'other': return '🧑 Khác';
      default: return '👤 Không xác định';
    }
  };

  const calculateAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'confirmed': return 'bg-blue-500 text-white';
      case 'shipped': return 'bg-purple-500 text-white';
      case 'delivered': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const age = calculateAge(customer.date_of_birth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={`Chi tiết khách hàng: ${customer.name}`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/customers">
                <Button variant="outline" size="sm" className="border-slate-200">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  Chi tiết Khách hàng
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 ml-12">
                  Thông tin chi tiết về khách hàng và lịch sử mua hàng
                </p>
              </div>
            </div>
            <Link href={`/admin/customers/${customer.id}/edit`}>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar & Basic Info */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-4xl text-slate-600 dark:text-slate-300">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {customer.email_verified_at && (
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {customer.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                      {customer.is_active ? (
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                          <XCircle className="h-3 w-3 mr-1" />
                          Không hoạt động
                        </Badge>
                      )}

                      {customer.email_verified_at ? (
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Đã xác thực
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">
                          Chưa xác thực
                        </Badge>
                      )}
                    </div>

                    <div className="w-full space-y-3 text-left">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                            {customer.email}
                          </p>
                        </div>
                      </div>

                      {customer.phone && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Số điện thoại</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <User className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Giới tính</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {getGenderLabel(customer.gender)}
                          </p>
                        </div>
                      </div>

                      {customer.date_of_birth && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Ngày sinh</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {formatDate(customer.date_of_birth)}
                              {age && <span className="text-slate-500"> ({age} tuổi)</span>}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Thống kê</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-amber-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tổng đơn hàng</span>
                    </div>
                    <span className="text-lg font-bold text-amber-600">
                      {customer.orders_count || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tham gia</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(customer.created_at)}
                    </span>
                  </div>

                  {customer.email_verified_at && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Xác thực</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(customer.email_verified_at)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Orders History */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Lịch sử đơn hàng
                    </CardTitle>
                    {customer.orders && customer.orders.length > 0 && (
                      <Badge className="bg-amber-500 text-white">
                        {customer.orders.length} đơn gần nhất
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!customer.orders || customer.orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Khách hàng chưa có đơn hàng nào
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customer.orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-amber-600">
                                #{order.order_number}
                              </span>
                              <Badge className={`${getOrderStatusColor(order.status)} border-0`}>
                                {getOrderStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                Xem chi tiết
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-600 dark:text-slate-400">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDate(order.placed_at)}
                              <span className="mx-2">•</span>
                              <Package className="h-3 w-3 inline mr-1" />
                              {order.items_count} sản phẩm
                            </div>
                            <div className="font-bold text-lg text-slate-900 dark:text-white">
                              {order.total_amount.toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                        </div>
                      ))}

                      {customer.orders_count && customer.orders_count > customer.orders.length && (
                        <div className="text-center pt-4">
                          <Link href={`/admin/orders?customer_id=${customer.id}`}>
                            <Button variant="outline" className="border-slate-200">
                              Xem tất cả {customer.orders_count} đơn hàng
                            </Button>
                          </Link>
                        </div>
                      )}
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
