import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Eye,
  Users,
  Filter,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  Calendar
} from "lucide-react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { toast } from 'react-toastify';
import type { Paginator, User, PaginationLink } from '@/types';
import { useRef, useCallback } from 'react';

const AdminCustomers = () => {

  type AdminCustomer = User & {
    phone?: string;
    gender?: string | null;
    date_of_birth?: string | null;
    is_active?: boolean;
    orders_count?: number;
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

  // Debounce timer ref
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: string | undefined) => {
    const currentParams = new URLSearchParams(window.location.search);

    if (value && value !== 'all' && !value.startsWith('all-')) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }

    // Reset to page 1 when filters change
    currentParams.delete('page');

    const queryString = currentParams.toString();
    router.get(`/admin/customers${queryString ? '?' + queryString : ''}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    // Clear previous timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set new timer
    searchTimerRef.current = setTimeout(() => {
      handleFilterChange('search', searchTerm || undefined);
    }, 500);
  }, [handleFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    handleFilterChange('status', value === 'all-status' ? undefined : value);
  }, [handleFilterChange]);

  const handleVerifiedChange = useCallback((value: string) => {
    handleFilterChange('verified', value === 'all-verified' ? undefined : value);
  }, [handleFilterChange]);

  const handleSortChange = useCallback((value: string) => {
    handleFilterChange('sort', value === 'newest' ? undefined : value);
  }, [handleFilterChange]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý khách hàng" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Quản lý Khách hàng
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
                Quản lý thông tin khách hàng và lịch sử mua hàng
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Tổng khách hàng
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Hoạt động
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.active.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Đã xác thực email
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.verified.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Mới tháng này
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {stats.new_this_month}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    defaultValue={typeof filters.search === 'string' ? filters.search : ''}
                    onChange={handleSearchChange}
                    className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

                <Select
                  defaultValue={(filters.status as string) || "all-status"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  defaultValue={(filters.verified as string) || "all-verified"}
                  onValueChange={handleVerifiedChange}
                >
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Xác thực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-verified">Tất cả</SelectItem>
                    <SelectItem value="verified">Đã xác thực</SelectItem>
                    <SelectItem value="unverified">Chưa xác thực</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              Hiển thị <span className="font-medium text-slate-900 dark:text-white">{customers.length}</span> trong <span className="font-medium text-slate-900 dark:text-white">{usersPaginator.total.toLocaleString()}</span> khách hàng
            </p>
            <Select
              defaultValue={(filters.sort as string) || "newest"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-48 border-slate-200">
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
                    <Link href={`/admin/customers/${customer.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700">
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Xem chi tiết
                      </Button>
                    </Link>

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
    </div>
  );
};

export default AdminCustomers;
