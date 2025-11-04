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
  CheckCircle,
  XCircle,
  TrendingUp
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('vi-VN');
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
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Thêm khách hàng
              </Button>
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

          {/* Customers List */}
          <div className="space-y-4">
            {customers.map((customer, index) => (
              <Card
                key={customer.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Customer Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {customer.email_verified_at && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{customer.name}</h3>
                          {getStatusBadge(customer.is_active)}
                          {!customer.email_verified_at && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs border-0">
                              Chưa xác thực
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {getGenderIcon(customer.gender)} {customer.date_of_birth ? `${calculateAge(customer.date_of_birth)} tuổi` : '—'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Vai trò</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">
                          Khách hàng
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Tham gia: {formatDate(customer.created_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Xác thực email</p>
                        <div className="flex items-center gap-1">
                          {customer.email_verified_at ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-lg text-green-600">Đã xác thực</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="font-bold text-lg text-red-600">Chưa xác thực</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {customer.email_verified_at
                            ? `Xác thực: ${formatDate(customer.email_verified_at)}`
                            : 'Chưa xác thực email'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Đơn hàng</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-amber-600" />
                          <span className="font-bold text-amber-600 text-lg">
                            {customer.orders_count || 0}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {customer.orders_count ? `Đã đặt ${customer.orders_count} đơn` : 'Chưa có đơn hàng'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/customers/${customer.id}/edit`}>
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => toast.info('Send email placeholder - functionality not implemented yet')}
                        >
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
