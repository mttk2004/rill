import { AdminNavigation } from "@/components/admin-navigation";
import { AdminStatsCards, StatCardData } from "@/components/admin/common/admin-stats-cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  Users,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  Calendar,
  DollarSign
} from "lucide-react";
import { Head, Link, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import type { Paginator, User, PaginationLink } from '@/types';
import { useState } from 'react';
import { formatVND } from "@/lib/utils";
import { useQueryFilters } from '@/hooks/use-query-filters';
import { OrderStatusBadge } from '@/lib/order-helpers';

const AdminCustomers = () => {

  type AdminCustomer = User & {
    phone?: string;
    gender?: string | null;
    date_of_birth?: string | null;
    is_active?: boolean;
    orders_count?: number;
    total_spent?: number;
    orders?: Array<{
      id: string;
      order_number: string;
      status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
      total_amount: number;
      placed_at: string;
      items_count: number;
    }>;
    // note: avatar and email_verified_at already exist on User type
  };

  interface PageProps {
    users: Paginator<AdminCustomer>;
    stats: {
      total: number;
      active: number;
      verified: number;
      new_this_month: number;
    };
    filters?: Record<string, unknown>;
    [key: string]: unknown;
  }

  const page = usePage<PageProps>().props;
  const usersPaginator = (page.users as Paginator<AdminCustomer>) || { data: [], links: [], current_page: 1, last_page: 1, per_page: 20, total: 0, from: null, to: null } as Paginator<AdminCustomer>;
  const stats = (page.stats as PageProps['stats']) || { total: 0, active: 0, verified: 0, new_this_month: 0 };
  const filters = (page.filters as Record<string, unknown>) || {};

  const customers = usersPaginator.data;

  // Use query filters hook
  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    initialFilters: filters as Record<string, string | undefined>,
    routeOrPath: '/admin/customers',
    searchDebounce: 500,
  });

  // Dialog state
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // Fetch full customer details with orders
  const fetchCustomerDetails = async (customerId: string) => {
    setIsLoadingCustomer(true);
    try {
      const response = await fetch(`/admin/customers/${customerId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        setSelectedCustomer(data.props.customer);
        setIsDialogOpen(true);
      } else {
        toast.error('Server trả về dữ liệu không hợp lệ');
        return;
      }
    } catch (error) {
      toast.error('Không thể tải thông tin khách hàng');
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange('status', value === 'all-status' ? undefined : value);
  };

  const handleVerifiedChange = (value: string) => {
    handleFilterChange('verified', value === 'all-verified' ? undefined : value);
  };

  const handleSortChange = (value: string) => {
    handleFilterChange('sort', value === 'newest' ? undefined : value);
  };

  const getStatusBadge = (is_active?: boolean) => {
    if (is_active) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoạt động
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <XCircle className="h-3 w-3 mr-1" />
          Không hoạt động
        </Badge>
      );
    }
  };

  const getGenderIcon = (gender?: string | null) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Stats cards configuration
  const statsCards: StatCardData[] = [
    {
      title: 'Tổng khách hàng',
      value: stats.total.toLocaleString(),
      subtitle: 'Tất cả khách hàng',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Đang hoạt động',
      value: stats.active.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Đã xác thực email',
      value: stats.verified.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.verified / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Mail,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Mới tháng này',
      value: stats.new_this_month.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.new_this_month / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý khách hàng" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Quản lý Khách hàng</h1>
              <p className="text-muted-foreground mt-2">
                Quản lý thông tin khách hàng và lịch sử mua hàng
              </p>
            </div>

            {/* Stats Cards */}
            <AdminStatsCards stats={statsCards} cols={{ default: 1, md: 2, xl: 4 }} />

            {/* Filters */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tìm kiếm
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                        defaultValue={typeof currentFilters.search === 'string' ? currentFilters.search : ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Trạng thái
                    </Label>
                    <Select
                      defaultValue={(currentFilters.status as string) || "all-status"}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Xác thực email
                    </Label>
                    <Select
                      defaultValue={(currentFilters.verified as string) || "all-verified"}
                      onValueChange={handleVerifiedChange}
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue placeholder="Chọn xác thực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-verified">Tất cả</SelectItem>
                        <SelectItem value="verified">Đã xác thực</SelectItem>
                        <SelectItem value="unverified">Chưa xác thực</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Sắp xếp
                    </Label>
                    <Select
                      defaultValue={(currentFilters.sort as string) || "newest"}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue placeholder="Chọn sắp xếp" />
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
                </div>
              </CardContent>
            </Card>

            {/* Results Info */}
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                Hiển thị <span className="font-medium text-slate-900 dark:text-white">{customers.length}</span> trong <span className="font-medium text-slate-900 dark:text-white">{usersPaginator.total.toLocaleString()}</span> khách hàng
              </p>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {customers.map((customer, index) => (
                <Card
                  key={customer.id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    {/* Avatar & Name */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 relative ring-4 ring-slate-100 dark:ring-slate-700 group-hover:ring-amber-200 dark:group-hover:ring-amber-900 transition-all">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {customer.email_verified_at && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                        {customer.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
                        {getStatusBadge(customer.is_active)}
                        {!customer.email_verified_at && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs border-0">
                            Chưa xác thực
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{customer.phone || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          {getGenderIcon(customer.gender)} {customer.date_of_birth ? `${calculateAge(customer.date_of_birth)} tuổi` : 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Package className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-lg font-bold text-amber-600">
                            {customer.orders_count || 0}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Đơn hàng</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(customer.created_at).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tham gia</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                        onClick={() => fetchCustomerDetails(customer.id)}
                        disabled={isLoadingCustomer}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        {isLoadingCustomer ? 'Đang tải...' : 'Xem chi tiết'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => toast.info('Tính năng gửi email đang được phát triển')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  {usersPaginator.links && usersPaginator.links.map((link: PaginationLink, idx: number) => {
                    if (!link.url) {
                      return <span key={idx} className="px-3 py-1 text-slate-500" dangerouslySetInnerHTML={{ __html: link.label }} />;
                    }
                    return (
                      <Link
                        key={idx}
                        href={link.url}
                        className={`px-3 py-1 rounded-md ${link.active ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Chi tiết Khách hàng
              </DialogTitle>
            </DialogHeader>

            {selectedCustomer && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
                </TabsList>

                {/* Tab Thông tin */}
                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative ring-4 ring-slate-100 dark:ring-slate-700">
                      {selectedCustomer.avatar ? (
                        <img
                          src={selectedCustomer.avatar}
                          alt={selectedCustomer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-slate-300">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {selectedCustomer.email_verified_at && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {selectedCustomer.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {getStatusBadge(selectedCustomer.is_active)}
                        {selectedCustomer.email_verified_at ? (
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã xác thực
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-0">
                            Chưa xác thực
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedCustomer.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Số điện thoại</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedCustomer.phone || '—'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Giới tính</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {getGenderIcon(selectedCustomer.gender)} {selectedCustomer.gender === 'male' ? 'Nam' : selectedCustomer.gender === 'female' ? 'Nữ' : selectedCustomer.gender === 'other' ? 'Khác' : 'Không xác định'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tuổi</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedCustomer.date_of_birth ? `${calculateAge(selectedCustomer.date_of_birth)} tuổi` : 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-amber-600" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tổng đơn hàng</p>
                            <p className="text-lg font-bold text-amber-600">
                              {selectedCustomer.orders_count || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tổng chi tiêu</p>
                            <p className="text-lg font-bold text-green-600">
                              {selectedCustomer.total_spent ? formatVND(selectedCustomer.total_spent) : '0₫'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Ngày tham gia</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {new Date(selectedCustomer.created_at).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab Lịch sử đơn hàng */}
                <TabsContent value="orders">
                  {!selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Khách hàng chưa có đơn hàng nào
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCustomer.orders?.map((order) => (
                        <Card key={order.id} className="bg-slate-50 dark:bg-slate-800/50 border-0 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-amber-600">#{order.order_number}</span>
                                <OrderStatusBadge status={order.status} />
                              </div>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Xem
                                </Button>
                              </Link>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-slate-600 dark:text-slate-400">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                                <span className="mx-2">•</span>
                                <Package className="h-3 w-3 inline mr-1" />
                                {order.items_count} sản phẩm
                              </div>
                              <div className="font-bold text-lg text-slate-900 dark:text-white">
                                {formatVND(order.total_amount)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCustomers;
